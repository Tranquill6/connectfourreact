import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/button";
import UnroundedButton from "@/components/unroundedbutton";
import PlayButton from "@/components/playbutton";
import { generateNewBoard, changeCurrentBoard } from "@/helper/helperfunctions";

let socket: any;

export default function GameBoard() {
    const [username, setUsername] = useState('');
    const [chosenUsername, setChosenUsername] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [gameState, setGameState] = useState({ boardState: [], status: '' });
    const [gameBoard, setGameBoard] = useState<any>(generateNewBoard(null));
    const [searchingForLobby, setSearchingForLobby] = useState(false);
    const [messages, setMessages] = useState([{name: 'Server', message: 'Successfully connected to chat'}]);
    const [currentMessage, setCurrentMessage] = useState('');
    const messageRef = useRef<any>(null);
    const messagesEndRef = useRef<any>(null);

    //allows the socket stuff to even work
    useEffect(() => {
        socketInitializer();

        return () => {
            socket.disconnect();
          };
    }, [username, isAuthenticated]);

    //handles everything to do with sockets
    const socketInitializer = async () => {
        socket = io();

        socket.on('alertNewUser', (res: any) => {
            setIsAuthenticated(false);
            if(res.username == username) {
                setIsAuthenticated(res.authenticated);
            }
        });

        socket.on('newLobbyMessageAll', (res: any) => {
            setMessages(prev => [...prev, res]);
        });

        socket.on('gameStateRefresh', (res: any) => {
            console.log("game state refresh!!", res);
            setGameState(res.gameState);
            setInGame(true);
            setGameBoard(changeCurrentBoard(res.gameState.boardState, null));
        });

        socket.on('session', (res: any) => {
            // attach the session ID to the next reconnection attempts
            socket.auth = res.sessionID;
            // store it in the localStorage
            localStorage.setItem("sessionID", res.sessionID);
            // save the ID of the user
            socket.userID = res.userID;
        });

        //scroll chat window to bottom
        if(isAuthenticated) {
            messagesEndRef.current.scrollIntoView();
        }

    };

    //sends to server that client chose a username and they're now a user
    const registerUser = async () => {
        socket.emit('newUser', { username });
        const sessionID = localStorage.getItem("sessionID");
        if(sessionID) {
            socket.auth = sessionID;
        }
    };

    //if user is typing a username, update state for it
    const setUsernameFromChange = (e: any) => {
        setUsername('');
        if(e.target.value != '') {
            setUsername(e.target.value);
        }
    };

    //toggles the chosen username state to true when called
    const toggleChosenUsername = () => {
        setChosenUsername(true);
    };

    //changes current message state as user is typing
    const changeCurrentMessage = (e: any) => {
        setCurrentMessage(e.target.value);
    };

    //updates the message state with the message user just sent and sends off message to server to send to other users
    const sendCurrentMessage = () => {
        if(currentMessage != '') {
            setCurrentMessage('');
            setMessages(prev => [...prev, {
                name: username,
                message: currentMessage
             }]);
            socket.emit('newLobbyMessage', { name: username, message: currentMessage });
            messageRef.current.value = '';
        }
    };

    //event listener to see if user hits enter key while typing a message to send it
    const checkForEnterKey = (e: any) => {
        if(e.key == 'Enter') {
            sendCurrentMessage();
        }
    };

    const lookForRoom = () => {
        setSearchingForLobby(true);
        socket.emit('searchForRoom', username);
    };

    //if the user is in a game/room
    if(inGame) {
        return(
            <div>
                <div className="text-center text-sm font-bold mt-10" hidden={gameState.status != 'waiting'}>Waiting for another player to continue...</div>
                <div className='mt-10 flex'>
                    {gameBoard}
                </div>
            </div>
        );
    //user is authenticated (chose a username and connected successfully)
    } else if(isAuthenticated) {
        return(
            <div className='mt-10'>
                <div className='text-center mb-1.5'>
                    <span>Welcome to ConnectFour React, {username}!</span>
                </div>
                <div className='w-[32rem] h-[32rem] border border-white inline-flex flex-wrap'>
                    <div className="h-[89%] w-full flex flex-col overflow-y-auto pl-1.5" id='chatWindow'>
                        {messages.map((message, i) => 
                            <span key={i}>{message.name}: {message.message}</span>    
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <input ref={messageRef} className="shadow appearance-none border w-3/4 max-h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" type="text" placeholder="Enter message..." onChange={(e: any) => { changeCurrentMessage(e); }} onKeyDown={(e) => {checkForEnterKey(e);}}></input>
                    <UnroundedButton label='Send' value='sendmessage' onClickFunction={sendCurrentMessage} disabled={false} />
                </div>
                <div>
                    <PlayButton label='Play' value='playmultiplayer' onClickFunction={lookForRoom} disabled={searchingForLobby} />
                </div>
            </div>
        );
    //user chose a username and set it
    } else if (chosenUsername) {
        return(
            <div className='mt-10'>
                <span>Your username is: {username}</span>
                <Button label='Connect' value='connect' onClickFunction={registerUser} disabled={false} />
            </div>
        );
    //user hasn't done anything yet
    } else {
        return(
            <div className='mt-10'>
                <span>Choose a username: </span>
                <input className="shadow appearance-none border rounded w-50 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" onChange={(e: any) => { setUsernameFromChange(e); }}></input>
                <Button label='Set Username' value='setusername' onClickFunction={toggleChosenUsername} disabled={false} />
            </div>
        );
    }

}