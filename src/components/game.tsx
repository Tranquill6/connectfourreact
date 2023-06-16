//declare as client component so we can use onClick
'use client';

//imports
import { useState } from "react";
import TitleScreen from "./titlescreen";
import Singleplayer from "./singleplayer";
import Multiplayer from "./multiplayer";
import { gameModeContext } from "@/context/contexts";

export default function Game() {

    const [gameMode, setGameMode] = useState('mainmenu');

    function handleModeButtons(e: any) {
        setGameMode(e.target.value);
    }

    return (
        <gameModeContext.Provider value={gameMode}>
            <TitleScreen onClickFunction={handleModeButtons} />
            <Singleplayer onClickFunction={handleModeButtons} />
            <Multiplayer onClickFunction={handleModeButtons} />
        </gameModeContext.Provider>
    );
}