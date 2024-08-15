// change to factory function
function GameController(gameboard, player1, player2){
    this.gameboard = gameboard;
    this.player1 = player1;
    this.player2 = player2;

    this.current_player;

    this.switchCurrentPlayer = function(){
        if(this.current_player == this.player1){
            this.current_player = this.player2;
        }
        else{
            this.current_player = this.player1;
        }
    }

    this.playGame = function(){
        this.current_player = player1;
        while(1){
            // get position
            let position = this.current_player.getPosition(this.gameboard);

            // set and see new position
            this.gameboard.setPosition(position, this.current_player);
            this.gameboard.printGameboard();

            // check for win
            if(this.gameboard.playerWin(this.current_player)){
                console.log(`${this.current_player.name} Wins!`);
                this.current_player.wins += 1;

                this.gameboard.resetBoard();
                this.current_player = player1;
                continue;
            }

            // swap active player
            this.switchCurrentPlayer();
        }
    }
}

function createPlayer(name, token, icon, cpu){
    let wins = 0;

    const getPosition = (gameboard) => {
        let position = {
            x: -1,
            y: -1
        }

        if(cpu){
            while(!gameboard.isPositionValid(position)){
                position.x = Math.floor(Math.random() * 3);
                position.y = Math.floor(Math.random() * 3);
            }
        }
        else{
            position.x = prompt("Enter x position:");
            position.y = prompt("Enter y position:");
            while(!gameboard.isPositionValid(position)){
                console.log("Invalid position, please enter a new one");
                position.x = prompt("Enter x position:");
                position.y = prompt("Enter y position:");
            }
        }

        return position;
    }

    return {name, token, icon, wins, getPosition};
}

function createGameboard(){
    let board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    
    const printGameboard = () => {
        for(let i = 0; i < 3; i++){
            console.log(`${board[i][0]} ${board[i][1]} ${board[i][2]}`);
        }
    }

    const setPosition = (position, player) => {
        board[position.x][position.y] = player.token;
    }

    const isPositionValid = (position) => {
        if(position.x < 0 || position.x >= 3){
            return false;
        }
        if(position.y < 0 || position.y >= 3){
            return false;
        }
        if(board[position.x][position.y] != 0){
            return false;
        }
        return true;
    }

    // check for wins
    const playerWin = (player) => {
        // winning positions from the perspective of the middle square
        const winning_positions = [
            // straight across
            {pos1: [0, -1], pos2: [0, 1]},
            // straight down
            {pos1: [-1, 0], pos2: [1, 0]},
            // diagonal down
            {pos1: [-1, -1], pos2: [1, 1]},
            // diagonal up
            {pos1: [1, -1], pos2: [-1, 1]}
        ]

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(board[i][j] == player.token){
                    for(const position of winning_positions){
                        const pos1_r = i + position.pos1[0]
                        const pos1_c = j + position.pos1[1]

                        if(pos1_r < 0 || pos1_r >= 3 || pos1_c < 0 || pos1_c >= 3){
                            break;
                        }

                        const pos2_r = i + position.pos2[0]
                        const pos2_c = j + position.pos2[1]

                        if(pos2_r < 0 || pos2_r >= 3 || pos2_c < 0 || pos2_c >= 3){
                            break;
                        }

                        if(board[pos1_r][pos1_c] == player.token && board[pos2_r][pos2_c] == player.token){
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    const resetBoard = () => {
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                board[i][j] = 0;
            }
        }
    }
    
    return {printGameboard, setPosition, playerWin, isPositionValid, resetBoard};
}



const gameboard = createGameboard();
gameboard.printGameboard();

const player1 = createPlayer("Player 1", 1, "X");
const player2 = createPlayer("Player 2", 2, "O", true);

let gameController = new GameController(gameboard, player1, player2);

gameController.playGame();