import Column from "./column";
import { useEffect, useState } from "react";
import { generateNewBoard, changeCurrentBoard, checkForWin } from "../helper/helperfunctions";
import { COLUMNS_PER_BOARD, CELLS_PER_COLUMN } from "../helper/constants";
import { statusContext } from "@/context/contexts";

export default function Gameboard() {
    //event listener for clicking on a cell, gets prop drilled down to cell.tsx
    const cellClick = (col: number) => {
        let newGameState = gameState;

        //go through column for lowest available space and re-render board
        let newBoard = newGameState.boardState;
        for(let i = CELLS_PER_COLUMN-1; i>=0;i--) {
            if(newBoard[i][col] == 0) {
                newBoard[i][col] = newGameState.turn;
                break;
            }
        }
        newGameState.boardState = newBoard;
        newGameState.board = changeCurrentBoard(newBoard, cellClick);

        //check if this move resulted in a win
        let winCheck = checkForWin(newBoard);
        //if player won
        if(winCheck && newGameState.turn == newGameState.playerPiece) {
            newGameState.status = 'gameover';
            newGameState.message = 'You have won!';
        //if AI won
        } else if (winCheck && newGameState.turn == newGameState.AIPiece) {
            newGameState.status = 'gameover';
            newGameState.message = 'You have lost to the AI!';
        } else {
            //edit game state for switching turns
            if(newGameState.turn == newGameState.playerPiece) {
                newGameState.turn = newGameState.AIPiece;
                newGameState.message = "AI's turn!";
            } else {
                newGameState.turn = newGameState.playerPiece;
                newGameState.message = "Your turn!";
            }
        }

        //have AI move if no one won yet
        if(!winCheck && newGameState.turn == newGameState.AIPiece) {
            
        }

        //set new state
        setGameState(newGameState);
        setTurnCount(prevTurnCount => prevTurnCount + 1);
    }

    //state
    const [gameState, setGameState] = useState({
        turn: 1,
        message: "Your turn!",
        boardState: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
        ],
        board: generateNewBoard(cellClick),
        playerPiece: 1,
        AIPiece: 2,
        status: 'playing'
    });
    const [turnCount, setTurnCount] = useState(0);

    //render the board from state
    return (
        <div>
            <div className='mt-20 flex'>
                <statusContext.Provider value={gameState.status}>
                    {gameState.board}
                </statusContext.Provider>
            </div>
            <div className='mt-10 text-center text-2xl'>{gameState.message}</div>
        </div>
    );
}