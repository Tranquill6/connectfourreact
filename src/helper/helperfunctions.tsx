//imports
import Column from "../components/column";
import { COLUMNS_PER_BOARD, CELLS_PER_COLUMN, WINDOW_LENGTH } from "../helper/constants";

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

//FUNCTIONS FOR MINIMAX AI ALGORITHM

export const minimaxAI = (board: any, depth: number, alpha: number, beta: number, maxPlayer: boolean, playerPiece: number, AIPiece: number) => {
    let availableMoves = availableNextMoves(board);
    let isTerminal = isTerminalNode(board);
    //if depth is zero or node is terminal
    if(depth == 0 || isTerminal) {
        if(isTerminal) {
            //AI Won
            if(winningMove(board, AIPiece)) {
                return [-1, 10000000000];
            //Player won
            } else if (winningMove(board, playerPiece)) {
                return [-1, -10000000000];
            //Game tied
            } else {
                return [-1, 0];
            }
        //depth is zero
        } else {
            return [-1, scorePosition(board, AIPiece, playerPiece, AIPiece)];
        }
    }

    //if maximizing player
    if(maxPlayer) {
        let value = Number.NEGATIVE_INFINITY;
        let randIndex = Math.floor(Math.random() * availableMoves.length);
        let column: number = availableMoves[randIndex];
        for(let i = 0;i<availableMoves.length;i++) {
            let row = getNextOpenRow(board, availableMoves[i]);
            let boardCopy = JSON.parse(JSON.stringify(board));
            dropPieceInColumn(boardCopy, row, availableMoves[i], AIPiece);
            let newScore: any = minimaxAI(boardCopy, depth-1, alpha, beta, false, playerPiece, AIPiece)[1];
            if(newScore > value) {
                value = newScore;
                column = availableMoves[i];
            }
            alpha = Math.max(alpha, value);
            if(alpha >= beta) {
                break;
            }
        }
        return [column, value];
    //if minimizing player
    } else {
        let value = Number.POSITIVE_INFINITY;
        let randIndex = Math.floor(Math.random() * availableMoves.length);
        let column: number = availableMoves[randIndex];
        for(let i = 0;i<availableMoves.length;i++) {
            let row = getNextOpenRow(board, availableMoves[i]);
            let boardCopy = JSON.parse(JSON.stringify(board));
            dropPieceInColumn(boardCopy, row, availableMoves[i], playerPiece);
            let newScore: any = minimaxAI(boardCopy, depth-1, alpha, beta, true, playerPiece, AIPiece)[1];
            if(newScore < value) {
                value = newScore;
                column = availableMoves[i];
            }
            beta = Math.min(beta, value);
            if(alpha >= beta) {
                break;
            }
        }
        return [column, value];
    }
}

const availableNextMoves = (board: any) => {
    let colsAvailable: number[] = [];

    for(let i = 0; i<COLUMNS_PER_BOARD;i++) {
        if(board[0][i] == 0) {
            colsAvailable.push(i);
        }
    }

    return colsAvailable;
}

const getNextOpenRow = (board: any, col: number) => {
    for(let i = CELLS_PER_COLUMN-1;i>=0;i--) {
        if(board[i][col] == 0) {
            return i;
        }
    }
}

const dropPieceInColumn = (board: any, row: any, col: number, piece: number) => {
    board[row][col] = piece;
}

const isTerminalNode = (board: any) => {
    return winningMove(board, 1) || winningMove(board, 2) || availableNextMoves(board).length == 0
}

export const winningMove = (board: any, piece: number) => {
    //check for any horizontal wins
    for(let i = 0; i<CELLS_PER_COLUMN; i++) {
        for(let j = 0; j<COLUMNS_PER_BOARD-3;j++) {
            if(board[i][j] == piece && board[i][j] == board[i][j+1] && board[i][j] == board[i][j+2] && board[i][j] == board[i][j+3]) {
                return true;
            }
        }
    }

    //check for any vertical wins
    for(let i = 0; i<COLUMNS_PER_BOARD; i++) {
        for(let j = 0; j<CELLS_PER_COLUMN-3;j++) {
            if(board[j][i] == piece && board[j][i] == board[j+1][i] && board[j][i] == board[j+2][i] && board[j][i] == board[j+3][i]) {
                return true;
            }
        }
    }

    //check for positively sloped diaganol wins
    for(let i = 0; i<COLUMNS_PER_BOARD-3; i++) {
        for(let j = 0; j<CELLS_PER_COLUMN-3;j++) {
            if(board[j][i] == piece && board[j][i] == board[j+1][i+1] && board[j][i] == board[j+2][i+2] && board[j][i] == board[j+3][i+3]) {
                return true;
            }
        }
    }

    //check for negatively sloped diaganol wins
    for(let i = 0; i<COLUMNS_PER_BOARD-3; i++) {
        for(let j = 3; j<CELLS_PER_COLUMN;j++) {
            if(board[j][i] == piece && board[j][i] == board[j-1][i+1] && board[j][i] == board[j-2][i+2] && board[j][i] == board[j-3][i+3]) {
                return true;
            }
        }
    }

    return false;
}

const scorePosition = (board: any, piece: number, playerPiece: number, AIPiece: number) => {
    let score: number = 0;

    //scoring the center column
    let centerColumn: number[] = [];
    for(let i = 0;i<CELLS_PER_COLUMN;i++) {
        centerColumn.push(board[i][3]);
    }
    let centerCount = countOccurrances(centerColumn, piece);
    score += centerCount * 3;

    //scoring horizontally
    for(let i = 0;i<CELLS_PER_COLUMN;i++) {
        let rowArray: number[] = [];
        for(let j = 0;j<COLUMNS_PER_BOARD;j++) {
            rowArray.push(board[i][j]);
        }
        for(let j = 0;j<COLUMNS_PER_BOARD-3;j++) {
            let window = rowArray.slice(j, j+WINDOW_LENGTH);
            score += evaluateBoard(window, piece, playerPiece, AIPiece);
        }
    }

    //scoring vertically
    for(let i = 0;i<COLUMNS_PER_BOARD;i++) {
        let rowArray: number[] = [];
        for(let j = 0;j<CELLS_PER_COLUMN;j++) {
            rowArray.push(board[j][i]);
        }
        for(let j = 0;j<CELLS_PER_COLUMN-3;j++) {
            let window = rowArray.slice(j, j+WINDOW_LENGTH);
            score += evaluateBoard(window, piece, playerPiece, AIPiece);
        }
    }

    //scoring positive sloped diagonal
    for(let i = 0;i<CELLS_PER_COLUMN-3;i++) {
        for(let j=0;j<COLUMNS_PER_BOARD-3;j++) {
            let windowList: number[] = [];
            for(let z=0;z<WINDOW_LENGTH;z++) {
                windowList.push(board[i+z][j+z]);
            }
            score += evaluateBoard(windowList, piece, playerPiece, AIPiece);
        }
    }

    //scoring negative sloped diagonal
    for(let i = 0;i<CELLS_PER_COLUMN-3;i++) {
        for(let j=0;j<COLUMNS_PER_BOARD-3;j++) {
            let windowList: number[] = [];
            for(let z=0;z<WINDOW_LENGTH;z++) {
                windowList.push(board[i+3-z][j+z]);
            }
            score += evaluateBoard(windowList, piece, playerPiece, AIPiece);
        }
    }

    return score;
}

const evaluateBoard = (window: any, piece: number, playerPiece: number, AIPiece: number) => {
    let score: number = 0;
    let oppPiece = playerPiece;
    if(piece == playerPiece) {
        oppPiece = AIPiece;
    }

    if(countOccurrances(window, piece) == 4) {
        score += 100;
    } else if (countOccurrances(window, piece) == 3 && countOccurrances(window, 0) == 1) {
        score += 5;
    } else if (countOccurrances(window, piece) == 2 && countOccurrances(window, 0) == 2) {
        score += 2;
    }

    if(countOccurrances(window, oppPiece) == 3 && countOccurrances(window, 0) == 1) {
        score -= 4;
    }

    return score;
}

const countOccurrances = (list: number[], toBeCounted: number) => {
    let counter: number = 0;

    for(let thisList of list) {
        if(thisList == toBeCounted) {
            counter++;
        }
    }

    return counter;
}