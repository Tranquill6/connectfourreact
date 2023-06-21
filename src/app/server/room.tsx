class RoomStructure {
    addUserToRoom(id: string, user: Object) {}
    removeUserFromRoom(id: string) {}
    resetGameState() {}
    getUsers() {}
    getUserCount() {}
    getGameState() {}
    getRoomId() {}
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
        status: 'waiting'
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
            if(this.getUserCount() == 2) {
                this.gameState.status = 'playing';
            }
            return true;
        }
        return false;
    }

    removeUserFromRoom(id: string): boolean {
        if(this.users.has(id)) {
            this.users.delete(id);
            this.gameState.status = 'waiting';
            return true;
        }
        return false;
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
            status: 'waiting'
        };
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

}