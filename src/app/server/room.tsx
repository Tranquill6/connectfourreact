class RoomStructure {
    addUserToRoom(id: string, user: Object) {}
    removeUserFromRoom(id: string) {}
    startGame() {}
    resetGameState() {}
    makeMoveOnBoard(col: number) {}
    checkForDraw() {}
    checkForWin() {}
    restartGame() {}
    getUsers() {}
    getUserCount() {}
    getGameState() {}
    getRoomId() {}
    getGameStatus() {}
}

export default class Room extends RoomStructure {
    id: number;
    users: Map<String, Object>;
    gameState: any = {
        turn: 1,
        boardState: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
        ],
        status: 'waiting',
        turns: {}
    };
    roomCapacity: number = 2;

    constructor(id: number) {
        super();
        this.id = id;
        this.users = new Map();
    }

    addUserToRoom(id: string, user: Object): boolean {
        if(this.getUserCount() < this.roomCapacity) {
            this.users.set(id, user);
            this.gameState.status = 'waiting';
            //if we have 2 players, start the game
            if(this.getUserCount() == 2) {
                this.gameState.status = 'playing';
                this.startGame();
            }
            return true;
        }
        return false;
    }

    removeUserFromRoom(id: string): boolean {
        if(this.users.has(id)) {
            this.users.delete(id);
            //if game didn't end, set status to waiting for other players
            if(this.gameState.status != 'gameover' && this.gameState.status != 'gameover-draw') {
                this.gameState.status = 'waiting';
            }
            delete this.gameState.turns.id;
            return true;
        }
        return false;
    }

    startGame(): void {
        //figure out who goes first
        const userIterator = this.users.keys();
        this.gameState.turns[userIterator.next().value] = 1;
        this.gameState.turns[userIterator.next().value] = 2;
    }

    resetGameState(): void {
        this.gameState = {
            turn: 1,
            boardState: [
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
            ],
            status: 'waiting',
            turns: {}
        };
    }

    makeMoveOnBoard(col: number): void {
        //make change on board to reflect move
        for(let i = 5;i>=0;i--) {
            if(this.gameState.boardState[i][col] == 0) {
                this.gameState.boardState[i][col] = this.gameState.turn;
                break;
            }
        }

        //check for win
        let checkWin = this.checkForWin();
        if(checkWin) {
            console.log("game over, user won!");
            this.gameState.status = 'gameover';
        } else {
            //check for draw
            let checkDraw = this.checkForDraw();
            if(checkDraw) {
                console.log("game over - draw");
                this.gameState.status = 'gameover-draw';
            } else {
                //if not, then change turn to other player
                if(this.gameState.turn == 1) {
                    this.gameState.turn = 2;
                } else {
                    this.gameState.turn = 1;
                }
            }
        }
    }

    checkForDraw(): boolean {
        let isDraw = true;
        for(let i = 0; i < 6;i++) {
            for(let j = 0;j<7;j++) {
                if(this.gameState.boardState[i][j] == 0) {
                    isDraw = false;
                }
            }
        }
        return isDraw;
    }

    checkForWin(): boolean {
        //check for any horizontal wins
        for(let i = 0; i<6; i++) {
            for(let j = 0; j<4;j++) {
                if(this.gameState.boardState[i][j] > 0 && this.gameState.boardState[i][j] == this.gameState.boardState[i][j+1] && this.gameState.boardState[i][j] == this.gameState.boardState[i][j+2] && this.gameState.boardState[i][j] == this.gameState.boardState[i][j+3]) {
                    return true;
                }
            }
        }

        //check for any vertical wins
        for(let i = 0; i<7; i++) {
            for(let j = 0; j<3;j++) {
                if(this.gameState.boardState[j][i] > 0 && this.gameState.boardState[j][i] == this.gameState.boardState[j+1][i] && this.gameState.boardState[j][i] == this.gameState.boardState[j+2][i] && this.gameState.boardState[j][i] == this.gameState.boardState[j+3][i]) {
                    return true;
                }
            }
        }

        //check for positively sloped diaganol wins
        for(let i = 0; i<4; i++) {
            for(let j = 0; j<3;j++) {
                if(this.gameState.boardState[j][i] > 0 && this.gameState.boardState[j][i] == this.gameState.boardState[j+1][i+1] && this.gameState.boardState[j][i] == this.gameState.boardState[j+2][i+2] && this.gameState.boardState[j][i] == this.gameState.boardState[j+3][i+3]) {
                    return true;
                }
            }
        }

        //check for negatively sloped diaganol wins
        for(let i = 0; i<4; i++) {
            for(let j = 3; j<6;j++) {
                if(this.gameState.boardState[j][i] > 0 && this.gameState.boardState[j][i] == this.gameState.boardState[j-1][i+1] && this.gameState.boardState[j][i] == this.gameState.boardState[j-2][i+2] && this.gameState.boardState[j][i] == this.gameState.boardState[j-3][i+3]) {
                    return true;
                }
            }
        }

        return false;
    }

    restartGame(): void {
        if(this.gameState.status == 'gameover' || this.gameState.status == 'gameover-draw') {
            this.resetGameState();
            this.startGame();
        }
    }

    getUsers(): Map<String, Object> {
        return this.users;
    }

    getUserCount(): number {
        return this.users.size;
    }

    getGameState(): any {
        return this.gameState;
    }

    getRoomId(): number {
        return this.id;
    }

    getGameStatus(): string {
        return this.gameState.status;
    }

}