import { useContext } from "react";
import Button from "./button";
import { gameModeContext } from "@/context/contexts";
import Gameboard from "./gameboard";

interface SingleplayerProps {
    onClickFunction: any;
}

export default function Singleplayer({ onClickFunction }: SingleplayerProps) {
    let gameMode = useContext(gameModeContext);

    //if gamemode chosen is singleplayer, then render, else do not
    if(gameMode == 'singleplayer') {
        return(
            <div className='block p-10'>
                <div className='flex justify-center flex-wrap'>
                    <Button label='Back' value='mainmenu' onClickFunction={onClickFunction} disabled={false} />
                </div>
                <div className='flex justify-center'>
                    <Gameboard />
                </div>
            </div>
        );
    } else {
        return(null);
    }
    
}