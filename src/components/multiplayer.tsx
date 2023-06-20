import { useContext } from "react";
import Button from "./button";
import { gameModeContext } from "@/context/contexts";
import GameBoard from "@/app/multiplayer/gameboard";

interface MultiplayerProps {
    onClickFunction: any;
}

export default function Multiplayer({ onClickFunction }: MultiplayerProps) {
    let gameMode = useContext(gameModeContext);

    //if gamemode chosen is multiplayer, then render, else do not
    if(gameMode == 'multiplayer') {
        return(
            <div className='block p-10'>
                <div className='flex justify-center flex-wrap'>
                    <Button label='Back' value='mainmenu' onClickFunction={onClickFunction} disabled={false} />
                </div>
                <div className='flex justify-center'>
                    <GameBoard />
                </div>
            </div>
        );
    } else {
        return(null);
    }
    
}