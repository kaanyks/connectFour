var userInput = require('prompt-sync')();
var heightLevel = userInput('Wie hoch soll das Spielfeld sein: ');
var widthLevel = userInput('Wie breit soll das Spielfeld sein: ');
var level = [];
// Here you are asked whether you want to play individually against a bot or 1v1 in multiplayer :)
var singleOderMulti = userInput(`Möchtest du Singleplayer oder Multiplayer spielen? 's' für Singleplayer, 'm' für Multiplayer: `);



// Here you are asked what your name is or what the bot is called and what difficulty it should play on:
if (singleOderMulti == 's') {
    var singlePlayer = userInput('Wie heißt du? ');
    var bot = userInput(`Wie soll dein Gegner heißen ${singlePlayer}: `);
    calculateBoard();
    while (singleOderMulti == 's') {
        SinglePlayer();
    }
} else if (singleOderMulti == 'm') {
    var Spieler1 = userInput('Wie heißt du Spieler 1? ');
    var Spieler2 = userInput('Wie heißt du Spieler 2? ');
    calculateBoard();

    while (true) {
        inputWert = userInput(`Wer soll zuerst anfangen? 1 für ${Spieler1}, 2 für ${Spieler2}: `);
        if (isValidAns(inputWert) == 1 || isValidAns(inputWert) <= 2) {
            break;
        }
        else {
            überprüfungsWert = userInput("Bitte gib die Zahl 1 oder 2 ein!");
        }
        break;
    }
    // Here you are asked who may start first

    while (inputWert == 1 || inputWert == 2) {
        if (inputWert == 1) {
            firstPlayerBegins();
        }
        if (inputWert == 2) {
            secondPlayerBegins();
        }
    }
}

// This checks whether the input value is correct for the question of who should start first (player 1 for 1, player 2 for 2)
function isValidAns(inputWert) {
    if (isNaN(inputWert) || inputWert == null || inputWert > widthLevel) {
        return false;
    }
    return true;
}

// The playing field is displayed here with a small "navigation" of what you have to enter for which field
function calculateBoard() {
    for (let i = 0; i < heightLevel; i++) {
        level.push([]);
        for (j = 0; j < widthLevel; j++) {
            level[i].push('| |');
        }
    }
}

function printBoard() {
    if (widthLevel < 2) {
        if (widthLevel <= 1) {
            console.log('_1_');
        } else {
            console.log('_1_' + '_2_');
        }
    } else {
        var cellBegin = '_1_';
        var cellStop = `__${widthLevel}_`;
        var chain = [];
        for (let i = 2; i < widthLevel; i++) {
            chain.push(`__${i}_`);
        }
        var cellchain = cellBegin + chain.join("") + cellStop;
        console.log(cellchain);
    }
    var board = level?.join('\n').replaceAll(',', ' ');
    console.log(board);
}


// the stone is placed, you have a character and what you have entered as parameters

function placeStone(sign, column) {
    for (let i = 0; i <= heightLevel; i++) {
        if (level?.[heightLevel]?.[Number(column) - 1] !== '| |') {
            if (level?.[heightLevel - i]?.[Number(column) - 1] == '| |') {
                level[heightLevel - i][Number(column) - 1] = sign;
                break;
            }
        }

        else if (level?.[heightLevel]?.[Number(column) - 1] == '| |') {
            level[heightLevel][Number(column) - 1] = sign;
            break;
        }

    }
    if (level != '| |')

    checkWinner(sign);
}

function difficulty() {
    // 1. Check if the bot can win in the next move
    for (let col = 1; col <= widthLevel; col++) {
        if (canWin('|O|', col)) {
            placeStone('|O|', col);
            return;
        }
    }

    // 2. Check if the player is about to win and block it
    for (let col = 1; col <= widthLevel; col++) {
        if (canWin('|X|', col)) {
            placeStone('|O|', col);
            return;
        }
    }

    // 3. If no win/block, prefer middle columns
    let middle = Math.floor(widthLevel / 2) + 1;
    if (level[0][middle - 1] === '| |') {
        placeStone('|O|', middle);
        return;
    }

    // 4. Otherwise, place in a random column
    placeStone('|O|', getRandom(1, widthLevel));
}

// Function checks whether the specified player would win by placing a checker in a column
function canWin(sign, col) {
    // Temporarily copy the field to simulate a move
    let tempLevel = JSON.parse(JSON.stringify(level));

    // Simulation: Find the first free row in the column
    for (let row = heightLevel - 1; row >= 0; row--) {
        if (tempLevel[row][col - 1] === '| |') {
            tempLevel[row][col - 1] = sign;
            break;
        }
    }

    // Check whether this move means a win
    return checkWinningMove(tempLevel, sign);
}

// Function checks whether the transferred player wins on the transferred playing field
function checkWinningMove(board, sign) {
    for (let i = 0; i < heightLevel; i++) {
        for (let j = 0; j < widthLevel; j++) {
            // horizontal testing
            if (j <= widthLevel - 4 &&
                board[i][j] === sign && board[i][j + 1] === sign &&
                board[i][j + 2] === sign && board[i][j + 3] === sign) {
                return true;
            }
            // vertical testing
            if (i <= heightLevel - 4 &&
                board[i][j] === sign && board[i + 1][j] === sign &&
                board[i + 2][j] === sign && board[i + 3][j] === sign) {
                return true;
            }
            // diagonal (↘) testing (right)
            if (i <= heightLevel - 4 && j <= widthLevel - 4 &&
                board[i][j] === sign && board[i + 1][j + 1] === sign &&
                board[i + 2][j + 2] === sign && board[i + 3][j + 3] === sign) {
                return true;
            }
            // diagonal (↙) testing (left)
            if (i <= heightLevel - 4 && j >= 3 &&
                board[i][j] === sign && board[i + 1][j - 1] === sign &&
                board[i + 2][j - 2] === sign && board[i + 3][j - 3] === sign) {
                return true;
            }
        }
    }
    return false;
}


// Here it is checked whether someone has placed 4 of the same characters vertically, horizontally or diagonally, if so the function winner() is called

function checkWinner(sign) {
    for (let i = 0; i <= heightLevel; i++) {
        var counter = 0;
        for (let j = 0; j <= widthLevel; j++) {
            var cell = level?.[i]?.[j];
            if (cell == sign) {
                counter++;
            } else {
                var counter = 0;
            }
            if (counter == 4) {
                winner();
            }
        }
    }


    for (let g = 0; g <= widthLevel; g++) {
        var counterStraight = 0;
        for (let s = 0; s <= heightLevel; s++) {
            var cellStraight = level?.[s]?.[g];
            if (cellStraight == sign) {
                counterStraight++;
            } else {
                var counterStraight = 0;
            }
            if (counterStraight == 4) {
                winner();
            }
        }
    }


    for (let i = heightLevel; i >= 0; i--) {
        var counter = 0;
        for (let j = 0; j <= widthLevel; j++) {
            var cell = level?.[i]?.[j];
            if (cell == sign) {
                counter++;
                for (k = 1; k <= i; k++) {
                    if (level[i - k][j + k] == sign) {
                        counter++;
                        if (counter == 4) {
                            winner();
                        }
                    } else {
                        counter = 0;
                    }
                }
            } else {
                counter = 0;
            }
        }
    }

    for (let i = heightLevel; i >= 0; i--) {
        var counter = 0;
        for (let j = 0; j <= widthLevel; j++) {
            var cell = level?.[i]?.[j];
            if (cell == sign) {
                counter++;
                for (k = 1; k <= i; k++) {
                    if (level[i - k][j - k] == sign) {
                        counter++;
                        if (counter == 4) {
                            winner();
                        }
                    } else {
                        counter = 0;
                    }
                }
            } else {
                counter = 0;
            }
        }
    }
}

function difficulty() {
    placeStone('|O|', getRandom(1, widthLevel));
}



function getRandom(min, max) {
    const floatRandom = Math.random();
    const difference = max - min;
    const random = Math.round(difference * floatRandom);
    const randomWithinRange = random + min;
    console.log(randomWithinRange);
    return randomWithinRange;
}

//Here is the function for the single player, the single player plays against a bot:
function SinglePlayer() {
    printBoard();
    var singleplayer = userInput(`Okay ${singlePlayer}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);

    if (singleplayer == 'Exit' || singleplayer == 'x') {
        console.log(`${singlePlayer} hat aufgegeben, ${bot} hat gewonnen!`);
        gameOver();
    }
    if (isNaN(singleplayer) || singleplayer == null) {
        console.log('Neuer Versuch: ');
        var singleplayer = userInput(`Okay ${singleplayer}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
        while (isNaN(singleplayer) || singleplayer == null) {
            var singleplayer = userInput(`Okay ${singleplayer}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
        }
    }
    placeStone('|X|', singleplayer);
    if(widthLevel >= 5) {
        difficulty();
    }
    else {
        placeStone('|O|', getRandom(1, singleplayer));
    }    
}
// As just mentioned, you could decide whether player 1 or player 2 should start, here player 1 starts:

function firstPlayerBegins() {
    printBoard();
    console.log(`Gebe "Exit"  oder "x" ein um das Spiel zu schließen, falls du aufgeben möchtest ${Spieler1} ;)`);
    var Player1 = userInput(`Okay ${Spieler1}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
    if (Player1 == 'Exit' || Player1 == 'x') {
        console.log(`${Spieler1} hat aufgegeben, ${Spieler2} hat gewonnen!`);
        gameOver();
    }

    if (isNaN(Player1) || Player1 == null) {
        console.log('Neuer Versuch: ');
        var Player1 = userInput(`Okay ${Spieler1}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
        while (isNaN(Player1) || Player1 == null) {
            var Player1 = userInput(`Okay ${Spieler1}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
        }
    }

    placeStone('|X|', Player1);

    printBoard();
    console.log(`Gebe "Exit" oder "x" ein um das Spiel zu schließen, falls du aufgeben möchtest ${Spieler2} ;)`);
    var Player2 = userInput(`Okay ${Spieler2}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
    if (Player2 == 'Exit' || Player2 == 'x') {
        console.log(`${Spieler2} hat aufgegeben, ${Spieler1} hat gewonnen!`);
        gameOver();
    }
    if (isNaN(Player2) || Player2 == null) {
        console.log('Neuer Versuch: ');
        var Player2 = userInput(`Okay ${Spieler2}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
        while (isNaN(Player2) || Player2 == null) {
            var Player2 = userInput(`Okay ${Spieler2}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
        }
    }
    placeStone('|O|', Player2);
    console.log(`Gebe "Exit"  oder "x" ein um das Spiel zu schließen, falls du aufgeben möchtest ${Spieler1} ;)`);
}


// Player 2 starts here:

function secondPlayerBegins() {
    printBoard();
    var Player2 = userInput(`Okay ${Spieler2}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
    if (Player2 == 'Exit' || Player2 == 'x') {
        console.log(`${Spieler2} hat aufgegeben, ${Spieler1} hat gewonnen!`);
        gameOver();
    }
    if (isNaN(Player2) || Player2 == null) {
        console.log('Neuer Versuch: ');
        var Player2 = userInput(`Okay ${Spieler2}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
        while (isNaN(Player2) || Player2 == null) {
            var Player2 = userInput(`Okay ${Spieler2}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
        }
    }
    placeStone('|O|', Player2);
    printBoard();
    console.log(`Gebe "Exit"  oder "x" ein um das Spiel zu schließen, falls du aufgeben möchtest ${Spieler1} ;)`);

    var Player1 = userInput(`Okay ${Spieler1}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
    if (Player1 == 'Exit' || Player1 == 'x') {
        console.log(`${Spieler1} hat aufgegeben, ${Spieler2} hat gewonnen!`);
        gameOver();
    }
    if (isNaN(Player1) || Player1 == null) {
        console.log('Neuer Versuch: ');
        var Player1 = userInput(`Okay ${Spieler1}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
        while (isNaN(Player1) || Player1 == null) {
            var Player1 = userInput(`Okay ${Spieler1}, gib eine Zahl zwischen 1 bis ${widthLevel} ein, um deinen Stein zu legen: `);
        }
    }
    placeStone('|X|', Player1);
    console.log(`Gebe "Exit" oder "x" ein um das Spiel zu schließen, falls du aufgeben möchtest ${Spieler2} ;)`);
}

// the function winner() honors the respective player in the console and closes the program

function winner() {
    printBoard();
    console.log('Winner Winner, chicken Dinnner!');
    process.exit(0);
}

function gameOver() {
    console.log('Game Over');
    process.exit(0);
}
