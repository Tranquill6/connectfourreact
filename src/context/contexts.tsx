import { createContext } from "react";

//determines which gamemode the player is on based on titlescreen choice
export const gameModeContext = createContext<string>('mainmenu');

//used in singleplayer to keep track of status of the game, mainly to determine if player can click gameboard or not
export const statusContext = createContext<string>('playing');