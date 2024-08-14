function GameController(gameboard, player1, player2){
    this.gameboard = gameboard;
    this.player1 = player1;
    this.player2 = player2;

    this.current_player;

    this.setPosition = function(x, y){
        // change this to a function setPosition on gameboard
        this.gameboard.board[x][y] = this.current_player.token;
    }

    // playAgain

    // reset

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
            if(this.current_player == this.player1){
                console.log("current player = player1");
            }
            if(this.current_player == this.player2){
                console.log("current player = player2");
            }
            
            // need to repeat this until valid input entered
            let position = this.current_player.getPosition();
            while(!this.gameboard.isPositionValid(position)){
                console.log("Invalid position, please enter a new one");
                position = this.current_player.getPosition();
            }

            if(position.x == "q" || position.x == "quit" || 
                position.y == "q" || position.y == "quit"){
                    break;
                }

            this.setPosition(position.x, position.y);
            gameboard.printGameboard();

            if(gameboard.checkForWin(this.current_player)){
                // reset game state

                // check if player wants to play again

                this.current_player = player1;
                continue;
            }

            this.switchCurrentPlayer();
        }
    }
}

function Player(token, icon){
    this.token = token;
    this.icon = icon;
    this.wins = 0;

    this.getPosition = function() {
        const x = prompt("Enter x position:");
        const y = prompt("Enter y position:");

        return {x, y};
    }
}

function createGameboard(){
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    
    const printGameboard = () => {
        for(let i = 0; i < 3; i++){
            console.log(`${board[i][0]} ${board[i][1]} ${board[i][2]}`);
        }
    }

    const setPosition = (player) => {

    }

    const isPositionValid = (position) => {
        if(board[position.x][position.y] != 0){
            return false;
        }
        return true;
    }

    // check for wins
    const checkForWin = (player) => {
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
    
    return {board, printGameboard, setPosition, checkForWin, isPositionValid};
}



const gameboard = createGameboard();
gameboard.printGameboard();

const player1 = new Player(1, "X");
const player2 = new Player(2, "O");

let gameController = new GameController(gameboard, player1, player2);

gameController.playGame();