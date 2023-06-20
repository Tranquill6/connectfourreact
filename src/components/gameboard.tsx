import { useState } from "react";
import { generateNewBoard, changeCurrentBoard, checkForWin, minimaxAI } from "../helper/helperfunctions";
import { CELLS_PER_COLUMN, MINIMAX_DEPTH } from "../helper/constants";
import { statusContext } from "@/context/contexts";

export default function Gameboard() {
    //event listener for clicking on a cell, gets prop drilled down to cell.tsx
    const cellClick = (col: number) => {
        let newGameState = gameState;

        //go through column for lowest available space and re-render board
        let newBoard = newGameState.boardState;
        let moveResult = putPieceInCol(newBoard, col, newGameState.playerPiece);
        newGameState.boardState = newBoard;
        newGameState.board = changeCurrentBoard(newBoard, cellClick);

        //if player couldn't put a piece down, break
        if(!moveResult) {
            return;
        }

        //check if this move resulted in a win for the player
        let winCheck = checkForWin(newBoard);
        //if player won
        if(winCheck) {
            newGameState.status = 'gameover';
            newGameState.message = 'You have won!';
        } else {
            //edit game state for switching turn to AI
            newGameState.turn = newGameState.AIPiece;
            newGameState.message = "AI's turn!";
        }

        //set new state
        setGameState(newGameState);
        setTurnCount(prevTurnCount => prevTurnCount + 1);
        if(!winCheck) {
            takeAITurn(); // have AI take turn if player hasn't won
        }
    }

    const takeAITurn = () => {
        let newGameState = gameState;

        //have AI move if no one won yet
        let miniMaxResult = minimaxAI(newGameState.boardState, MINIMAX_DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, newGameState.playerPiece, newGameState.AIPiece);
        let AIColumn: number = miniMaxResult[0];
        let newBoard = newGameState.boardState;
        putPieceInCol(newBoard, AIColumn, newGameState.AIPiece);
        newGameState.boardState = newBoard;
        newGameState.board = changeCurrentBoard(newBoard, cellClick);

        //check if this move resulted in a win for the AI
        let winCheckAI = checkForWin(newBoard);
        //if AI won
        if(winCheckAI) {
            newGameState.status = 'gameover';
            newGameState.message = 'You have lost to the AI!';
        //if AI didnt win yet, switch turn to player
        } else {
            //edit game state for switching turn to AI
            newGameState.turn = newGameState.playerPiece;
            newGameState.message = "Your turn!";
        }

        //set new state
        setGameState(newGameState);
        setTurnCount(prevTurnCount => prevTurnCount + 1);
    }

    const putPieceInCol = (board: any, col: number, piece: number) => {
        for(let i = CELLS_PER_COLUMN-1; i>=0;i--) {
            if(board[i][col] == 0) {
                board[i][col] = piece;
                return true;
            }
        }
        return false;
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