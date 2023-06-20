import Button from "./button";
import { useContext } from "react";
import { gameModeContext } from "@/context/contexts";

interface TitleScreenProps {
    onClickFunction: any;
}

export default function TitleScreen({onClickFunction}: TitleScreenProps) {
    let gameMode = useContext(gameModeContext);

    //render title screen if gamemode hasn't been picked yet
    if(gameMode == 'mainmenu') {
        return (
            <div className='block p-10'>
                <div className='flex justify-center flex-wrap'>
                    <Button label='Singleplayer' value='singleplayer' onClickFunction={onClickFunction} disabled={false} />
                    <Button label='Multiplayer' value='multiplayer' onClickFunction={onClickFunction} disabled={false} />
                </div>
            </div>
        );
    } else {
        return(null);
    }
            
}