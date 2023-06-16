//imports
import Column from "../components/column";
import { COLUMNS_PER_BOARD, CELLS_PER_COLUMN } from "../helper/constants";

//generates a fresh game board and returns it
export const generateNewBoard = (click: any) => {
    let newGameBoard:any = [];

    for(let i = 0; i<COLUMNS_PER_BOARD; i++) {
        newGameBoard.push(<Column key={i} cellClick={click} columnIndex={i} cellValueList={[0,0,0,0,0,0]} />);
    }
    
    return newGameBoard;
}

//takes in the board state array and redraws the gameboard based on that
export const changeCurrentBoard = (board: any, click: any) => {
    let newGameBoard:any = [];
    let cellValue:any = [];

    //transpose the board state list
    for(let i = 0; i<COLUMNS_PER_BOARD; i++) {
        let newCellValue = [];
        for(let j = 0; j<CELLS_PER_COLUMN;j++) {
            newCellValue.push(board[j][i]);
        }
        cellValue.push(newCellValue);
    }

    for(let i = 0; i<COLUMNS_PER_BOARD; i++) {
        newGameBoard.push(<Column key={i} cellClick={click} columnIndex={i} cellValueList={cellValue[i]} />);
    }
    
    return newGameBoard;
}

export const checkForWin = (board: any) => {
    //check for any horizontal wins
    for(let i = 0; i<CELLS_PER_COLUMN; i++) {
        for(let j = 0; j<COLUMNS_PER_BOARD-3;j++) {
            if(board[i][j] > 0 && board[i][j] == board[i][j+1] && board[i][j] == board[i][j+2] && board[i][j] == board[i][j+3]) {
                return true;
            }
        }
    }

    //check for any vertical wins
    for(let i = 0; i<COLUMNS_PER_BOARD; i++) {
        for(let j = 0; j<CELLS_PER_COLUMN-3;j++) {
            if(board[j][i] > 0 && board[j][i] == board[j+1][i] && board[j][i] == board[j+2][i] && board[j][i] == board[j+3][i]) {
                return true;
            }
        }
    }

    //check for positively sloped diaganol wins
    for(let i = 0; i<COLUMNS_PER_BOARD-3; i++) {
        for(let j = 0; j<CELLS_PER_COLUMN-3;j++) {
            if(board[j][i] > 0 && board[j][i] == board[j+1][i+1] && board[j][i] == board[j+2][i+2] && board[j][i] == board[j+3][i+3]) {
                return true;
            }
        }
    }

    //check for negatively sloped diaganol wins
    for(let i = 0; i<COLUMNS_PER_BOARD-3; i++) {
        for(let j = 3; j<CELLS_PER_COLUMN;j++) {
            if(board[j][i] > 0 && board[j][i] == board[j-1][i+1] && board[j][i] == board[j-2][i+2] && board[j][i] == board[j-3][i+3]) {
                return true;
            }
        }
    }

    return false;
}