import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/button";
import UnroundedButton from "@/components/unroundedbutton";

let socket: any;

export default function GameBoard() {
    const [username, setUsername] = useState('');
    const [chosenUsername, setChosenUsername] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [messages, setMessages] = useState([{name: 'Test', message: 'Hi there!'}, {name: 'Test2', message: 'Hi there2!'}]);
    const [currentMessage, setCurrentMessage] = useState('');
    const messageRef = useRef<any>(null);

    useEffect(() => {
        socketInitializer();
    }, [username]);

    const socketInitializer = async () => {
        socket = io();

        socket.on('alertNewUser', (res: any) => {
            setIsAuthenticated(false);
            if(res.username == username) {
                setIsAuthenticated(res.authenticated);
            }
        })
    };

    const registerUser = async () => {
        socket.emit('newUser', { username });
    };

    const setUsernameFromChange = (e: any) => {
        setUsername('');
        if(e.target.value != '') {
            setUsername(e.target.value);
        }
    };

    const toggleChosenUsername = () => {
        setChosenUsername(true);
    };

    const changeCurrentMessage = (e: any) => {
        setCurrentMessage(e.target.value);
    };

    //TODO, make this send message off to server and then send it to other clients
    const sendCurrentMessage = () => {
        if(currentMessage != '') {
            let newMessages = [...messages];
            newMessages.push({
                name: username,
                message: currentMessage
             });
            setCurrentMessage('');
            setMessages(newMessages);
            messageRef.current.value = '';
        }
    };

    //user is authenticated (chose a username and connected successfully)
    if(isAuthenticated) {
        return(
            <div className='mt-10'>
                <div className='text-center'>
                    <span>You have successfully connected to the server, {username}!</span>
                </div>
                <div className='w-[32rem] h-[32rem] border border-white inline-flex flex-wrap'>
                    <div className="h-[89%] w-full flex flex-col overflow-y-auto pl-1.5">
                        {messages.map((message, i) => 
                            <span key={i}>{message.name}: {message.message}</span>    
                        )}
                    </div>
                    <input ref={messageRef} className="shadow appearance-none border w-3/4 max-h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" type="text" placeholder="Enter message..." onChange={(e: any) => { changeCurrentMessage(e); }}></input>
                    <UnroundedButton label='Send' value='sendmessage' onClickFunction={sendCurrentMessage} disabled={false} />
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