function createPosition(a, b){
    const x = a;
    const y = b;

    return {x, y};
}

function createGameController(player1, player2){
    let gameboard = createGameboard();
    let current_player = player1;
    let winning_player = null;

    function getGameboard(){
        return gameboard;
    }

    function switchCurrentPlayer(){
        if(current_player == player1){
            current_player = player2;
        }
        else{
            current_player = player1;
        }
    }

    const getCurrentPlayer = () => {
        return current_player;
    }

    const setWinningPlayer = () => {
        winning_player = current_player;
    }

    const getWinningPlayer = () => {
        return winning_player;
    }

    const playRound = (position) => {
        if(!gameboard.isPositionValid(position)){
            return;
        }

        gameboard.setPosition(position, current_player);

        gameboard.printGameboardToConsole();

        if(gameboard.didPlayerWin(current_player)){
            setWinningPlayer();
        }

        switchCurrentPlayer();
    }

    return {getGameboard, getCurrentPlayer, getWinningPlayer, playRound};
}

function createPlayer(name, token, icon, cpu){
    let wins = 0;

    const getPosition = (gameboard) => {
        let position = createPosition(-1, -1);

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
    ];

    const getBoardState = () => {
        let board_copy = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                board_copy[i][j] = board[i][j];
            }
        }

        return board_copy;
    }
    
    const printGameboardToConsole = () => {
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
    const didPlayerWin = (player) => {
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
                            continue;
                        }

                        const pos2_r = i + position.pos2[0]
                        const pos2_c = j + position.pos2[1]

                        if(pos2_r < 0 || pos2_r >= 3 || pos2_c < 0 || pos2_c >= 3){
                            continue;
                        }

                        if(board[pos1_r][pos1_c] == player.token && board[pos2_r][pos2_c] == player.token){
                            console.log(`${player.name} wins!`);
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
    
    return {getBoardState, printGameboardToConsole, setPosition, didPlayerWin, isPositionValid, resetBoard};
}

function createDisplay(gameController){
}

function createDisplayController(){ 
    const player1 = createPlayer("Player 1", 1, "X");
    const player2 = createPlayer("CPU player", 2, "O");
    
    const gameController = createGameController(player1, player2);

    function updateDisplay(){
        const win_div = document.getElementById("win");
        const winning_player = gameController.getWinningPlayer();

        if(winning_player){
            win_div.textContent = `${winning_player.name} Wins!`;

            // play again + reset logic here
        }

        const board = gameController.getGameboard();
        const board_state = board.getBoardState();

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(board_state[i][j] == player1.token){
                    board_squares[i][j].textContent = player1.icon;
                }
                if(board_state[i][j] == player2.token){
                    board_squares[i][j].textContent = player2.icon;
                }
            }
        }
    }

    // set up display
    const board_container = document.getElementById("board-container");
    const board_squares = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            const board_square = document.createElement("div");
            board_squares[i][j] = board_square;

            board_square.classList.add("board-square");
    
            board_square.addEventListener("click", () => {
                let current_player = gameController.getCurrentPlayer();

                gameController.playRound(createPosition(i, j));

                updateDisplay();
            });
    
            board_container.appendChild(board_square);
        }
    }
}

const display = createDisplayController();

