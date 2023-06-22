import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import next, { NextApiHandler } from 'next';
import * as socketio from 'socket.io';
import crypto from 'crypto';
import Room from 'C:/Users/Riley Redfern/Desktop/Stuff/Coding/TypeScript/connectfour/src/app/server/room.tsx';
import InMemorySessionStore from 'C:/Users/Riley Redfern/Desktop/Stuff/Coding/TypeScript/connectfour/src/app/server/sessionStore.tsx';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();
const roomList: Room[] = [];
const sessionStore = new InMemorySessionStore();
const randomId = () => crypto.randomBytes(8).toString("hex");
let lastRoomId: number = 1;

nextApp.prepare().then(async() => {
    const app: Express = express();
    const server: http.Server = http.createServer(app);
    const io: socketio.Server = new socketio.Server();
    io.attach(server);

    //middleware
    io.use((socket, next) => {
        const sessionID = socket.handshake.auth.sessionID;
        if (sessionID) {
            const session = sessionStore.findSession(sessionID);
            if (session) {
                socket.data.sessionID = sessionID;
                socket.data.userID = session.userID;
                return next();
            }
        }
        socket.data.sessionID = randomId();
        socket.data.userID = randomId();
        next();
    });

    io.on('connection', (socket: socketio.Socket) => {
        console.log('Connection established...');

        // persist session
        sessionStore.saveSession(socket.data.sessionID, {
            userID: socket.data.userID,
            username: socket.data.username,
            connected: true,
        });

        // emit session details
        socket.emit("session", {
            sessionID: socket.data.sessionID,
            userID: socket.data.userID,
        });

        socket.on('newUser', (user: any) => {
            socket.emit('alertNewUser', {
                username: user.username,
                authenticated: true,
            });

            //set user data for that socket
            socket.data.username = user.username;

            //broadcast welcome message to all other clients
            socket.broadcast.emit('newLobbyMessageAll', { name: 'Server', message: `${user.username} has connected to the server!` });

            console.log("User Logged In: ", user.username);
        });

        socket.on('newLobbyMessage', (res: any) => {
            socket.broadcast.emit('newLobbyMessageAll', { name: res.name, message: res.message });
        });

        socket.on('searchForRoom', (res: any) => {
            console.log(`${res} is searching for a game...`);
            let addedToRoom = false;
            let savedRoomId: string = '-1';
            let savedGameState: any;
            //check if there are any rooms available with one person, this is preferable
            roomList.forEach((ele, ind, arr) => {
                //check if room has 0 users and is gameover status, then restart it
                if(ele.getUserCount() == 0 && (ele.getGameStatus() == 'gameover' || ele.getGameStatus() == 'gameover-draw')) {
                    console.log("restarted room");
                    ele.restartGame();
                }
                //if room has enough space, add user to this room
                if(ele.getUserCount() == 1 && ele.getGameStatus() != 'gameover' && ele.getGameStatus() != 'gameover-draw') {
                    console.log("added user to existing room with one person");
                    ele.addUserToRoom(socket.data.sessionID, socket.data.user);
                    socket.join(String(ele.getRoomId()));
                    addedToRoom = true;
                    savedRoomId = String(ele.getRoomId());
                    console.log("emitting on room id: ", ele.getRoomId());
                    savedGameState = ele.getGameState();
                    return;
                }
            });
            //check if there are any rooms available with zero people, if no room was found before
            if(!addedToRoom) {
                roomList.forEach((ele, ind, arr) => {
                    //if room has enough space, add user to this room
                    if(ele.getUserCount() < 2 && ele.getGameStatus() != 'gameover' && ele.getGameStatus() != 'gameover-draw') {
                        console.log("added user to existing empty room");
                        ele.addUserToRoom(socket.data.sessionID, socket.data.user);
                        socket.join(String(ele.getRoomId()));
                        addedToRoom = true;
                        savedRoomId = String(ele.getRoomId());
                        console.log("emitting on room id: ", ele.getRoomId());
                        savedGameState = ele.getGameState();
                        return;
                    }
                });
            }
            //there were no rooms available, create one
            if(!addedToRoom) {
                console.log("creating room...");
                roomList.push(new Room(lastRoomId));
                roomList[roomList.length-1].addUserToRoom(socket.data.sessionID, socket.data.user);
                socket.join(String(lastRoomId));
                savedGameState = roomList[roomList.length-1].getGameState();
                console.log("emitting on room id: ", lastRoomId);
                savedRoomId = String(lastRoomId);
                lastRoomId++;
            }
            socket.emit("gameStateRefresh", { gameState: savedGameState } );
            socket.to(savedRoomId).emit("gameStateRefresh", { gameState: savedGameState } );
        });

        socket.on('makeGameMove', (res: any) => {
            //search for user's room
            roomList.forEach((ele, ind, arr) => {
                //look for user, if found then make the move in their room
                if(ele.getUsers().has(socket.data.sessionID)) {
                    ele.makeMoveOnBoard(res.column);
                    //send out updated gamestate to users
                    socket.emit("gameStateRefresh", { gameState: ele.getGameState() } );
                    socket.to(String(ele.getRoomId())).emit("gameStateRefresh", { gameState: ele.getGameState() } );
                }
            });
        });

        socket.on('disconnect', async () => {
            console.log('Client disconnected...');
            const matchingSockets = await io.in(socket.data.userID).fetchSockets();
            const isDisconnected = matchingSockets.length === 0;
            if (isDisconnected) {
                //remove user from all rooms
                roomList.forEach((ele, ind, arr) => {
                    let roomRemoval: boolean = ele.removeUserFromRoom(socket.data.sessionID);
                    //if user got removed from this room, send out updated game state to users in room
                    if(roomRemoval) {
                        socket.to(String(ele.getRoomId())).emit("gameStateRefresh", { gameState: ele.getGameState() } );
                    }
                });
                // update the connection status of the session
                sessionStore.saveSession(socket.data.sessionID, {
                    userID: socket.data.userID,
                    username: socket.data.username,
                    connected: false,
                });
            }
        });
    });

    app.all('*', (req: any, res: any) => nextHandler(req, res));

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});