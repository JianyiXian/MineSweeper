const numberOfRow = 10
const numberOfColumn = 10
const numberOfMine = 10
let grid;
let visitedGrid;
let randomMine;
let numberOfMineNotFound = numberOfMine;
// Initialize timer to control the Timer
let timerInterval;
let isGameOver = false;
let isGameStart = false;

// Get references 
const startButton = document.getElementById("startButton");
const second = document.getElementById("second");
const gameInfo = document.getElementById("gameInfo");
const mineLeft = document.getElementById('MineLeft');

// Initialize the game
createBoard(numberOfRow, numberOfColumn);
generateMine(numberOfMine, numberOfRow, numberOfColumn);
resetVisitedGrid(numberOfRow, numberOfColumn);

function startGame() {
    if (!isGameStart) {
        resetTimer();
        isGameStart = true;
        timerInterval = setInterval(startTimer, 1000);
    }
}

function stopGame() {
    isGameStart = false;
    clearInterval(timerInterval);
}

// Create the game board
function createBoard(numberOfRow, numberOfColumn) {
    // Get references to the grid container element
    const gridContainer = document.getElementById("gridContainer");

    // Generate the grid HTML
    let gridContent = '';
    for (let c = 0; c < numberOfColumn; c++) {
        gridContent += '<div class="grid-column">';
        for (let r = 0; r < numberOfRow; r++) {
            gridContent += `<div class="grid-row" id= ${r},${c}></div>`;
        }
        gridContent += "</div>";
    }
    gridContainer.innerHTML = gridContent;


    // Get all the cells
    const cells = document.getElementsByClassName('grid-row');

    // Attach right-click event listener to the cells
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('contextmenu', HandleRightClick);
    }

    // Attach left-click event listener to the cells
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', handleLeftClick);
    }

    startButton.addEventListener("click", () => {
        stopGame();
        isGameOver = false;
        resetTimer();
        createBoard(numberOfRow, numberOfColumn);
        generateMine(numberOfMine, numberOfRow, numberOfColumn);
        resetVisitedGrid(numberOfRow, numberOfColumn);
        gameInfo.textContent = '';
        mineLeft.innerHTML = handleStringFormat(numberOfMine);
        numberOfMineNotFound = numberOfMine;
    });
}


// Create a global variable count initialize to 0
let count = 0;

function startTimer() {
    // Increment count by 1
    count += 1;
    // Convert the count to string with '000' format
    const countString = handleStringFormat(count);
    second.innerHTML = countString;
}

function stopTimer() {
    let totalTime = count;
    clearInterval(timerInterval);
    return totalTime;
}


function resetTimer() {
    // Set count and countString to default value
    count = 0;
    const countString = handleStringFormat(count);
    // Update the innierHTML
    second.innerHTML = countString;
    timerInterval = null;
}

// Convert number to string with '000' format
function handleStringFormat(num) {
    let formatString;
    if (num < 0) {
        formatString = "0" + num;
    } else if (num < 10) {
        formatString = "00" + num;
    } else if (num < 100) {
        formatString = "0" + num;
    } else {
        formatString = num;
    }
    return formatString;
}


// Generate unique coordinates that is not in the array
function generateRandomMine(numberOfMine, numberOfRow, numberOfColumn) {
    randomMine = [];
    while (randomMine.length < numberOfMine) {
        let randomRow = Math.floor(Math.random() * numberOfRow);
        let randomColumn = Math.floor(Math.random() * numberOfColumn);
        const coordinate = [randomRow, randomColumn]

        // Check if the coordinate already exists in the array
        const isUnique = randomMine.every(([r, c]) => {
            return r !== randomRow || c !== randomColumn;
        })
        if (isUnique) {
            randomMine.push(coordinate);
        }

    } return randomMine;
}

// Generate random mine and place it to the grid
function generateMine(numberOfMine, numberOfRow, numberOfColumn) {

    // Generate random mines
    generateRandomMine(numberOfMine, numberOfRow, numberOfColumn);

    // Create two-dimensional array
    //[[E, E, E, E...E],
    // [E, E, E, E...E],
    // [E, E, E, M...E],
    // ...
    // [E, E, E, E...E]]
    grid = [];
    for (let r = 0; r < numberOfRow; r++) {
        grid[r] = []
        for (let c = 0; c < numberOfColumn; c++) {
            grid[r][c] = 'E';
        }
    }

    // Place the mine into the grid
    // iterate over randomRow, if [r][c] is in randomRow and randomColumn, mark as mine
    console.log(randomMine)
    for (let i = 0; i < randomMine.length; i++) {
        grid[randomMine[i][0]][randomMine[i][1]] = 'M';
    }

}

function resetVisitedGrid(numberOfRow, numberOfColumn) {
    // Create a separate 2D array visitedGrid to keep track of the visited cells
    visitedGrid = [];
    for (let r = 0; r < numberOfRow; r++) {
        visitedGrid[r] = []
        for (let c = 0; c < numberOfColumn; c++) {
            visitedGrid[r][c] = false;
        }
    }

}

const numberOfvisitedCells = () => {
    let numberOfClickedCells = 0;
    for (let r = 0; r < visitedGrid.length; r++) {
        for (let c = 0; c < visitedGrid[0].length; c++) {
            if (visitedGrid[r][c] === true) {
                numberOfClickedCells += 1;
            }
        }
    }
    return numberOfClickedCells;
};


let numberOfClickedCells = numberOfvisitedCells();


// Right click event handler
function HandleRightClick(event) {
    // Prevent the default right-click context menu
    event.preventDefault();

    const cell = event.target;
    const cellId = cell.id;
    const cellClass = cell.className;

    const clickedCell = document.getElementById(cellId)

    // If the cell have been visited, disabled the click
    if (clickedCell.classList.contains('number-hint') || clickedCell.classList.contains('empty-cell')) {
        return
    }
    // If the game is over, disabled all the cells
    if (isGameOver) {
        return
    }

    if (!cellClass.includes('is-right-click')) {
        numberOfMineNotFound -= 1;
        // update the CSS
        handleStringFormat(numberOfMineNotFound)
        mineLeft.innerHTML = handleStringFormat(numberOfMineNotFound);
        clickedCell.classList.add('is-right-click');
    } else {
        numberOfMineNotFound += 1;
        // update the CSS
        handleStringFormat(numberOfMineNotFound)
        mineLeft.innerHTML = handleStringFormat(numberOfMineNotFound);
        clickedCell.innerHTML = '';
        clickedCell.classList.remove('is-right-click');
    }
    // Check whether finish the game
    if (isGameSuccess()) {
        gameSuccess();
        return
    }

    mineLeft.innerHTML = handleStringFormat(numberOfMineNotFound);
}

function handleLeftClick(event) {
    event.preventDefault();
    startGame();

    // Get the click cell
    const cell = event.target;
    const cellId = cell.id;

    // Get the index of the row column
    const index = cellId.split(',');
    const r = Number(index[0]);
    const c = Number(index[1]);

    // If the cell has been right clicked, disabled the left click
    if (document.getElementById(cellId).classList.contains('is-right-click')) {
        return
    }

    // Check whether game over
    if (isGameOver) {
        return
    }

    // If the cell is a mine, marked the cell as visited, game over
    if (grid[r][c] === 'M') {
        visitedGrid[r][c] = true;
        stopTimer();
        console.log(grid)
        gameover();
    }
    revealSafeArea(r, c)
    // Check whether the game finished
    if (isGameSuccess()) {
        gameSuccess();
        return
    }

}

function revealSafeArea(r, c) {
    // If all the not mine cell are visited
    if (numberOfClickedCells === numberOfRow * numberOfColumn - numberOfMine) {
        return
    }
    if (grid[r][c] === 'M') {
        return
    }


    // Calculate the number of adjacent mines and display it on the cell, marked the cell as visited
    const adjacent = [] // [[r-1, c-1], [r-1, c], [r-1, c+1],[r, c-1],[r+1, c-1], [r+1, c], [r+1, c+1]]
    for (let dr = -1; dr <= 1; dr++) {
        for (let cr = -1; cr <= 1; cr++) {
            if (dr === 0 && cr === 0) {
                continue
            }
            let newRow = r + dr
            let newColumn = c + cr
            adjacent.push([newRow, newColumn])
        }
    }
    let totalMine = 0;
    for (let i = 0; i < adjacent.length; i++) {
        // If the adjacent exits and adnacent is a mine, increment the total mine by 1
        if (adjacent[i][0] >= 0 && adjacent[i][0] < numberOfRow &&
            adjacent[i][1] >= 0 && adjacent[i][1] < numberOfColumn &&
            grid[adjacent[i][0]][adjacent[i][1]] === 'M') {
            totalMine += 1;
        }
    }
    let leftClickCell = document.getElementById(`${r},${c}`)
    // If there is mine around the cell, marked the cell as visited
    if (totalMine > 0) {
        grid[r][c] = totalMine.toString();
        visitedGrid[r][c] = true;
        //update the CSS of the cell
        // If it is right clicked but not a mine, change its class  
        if (leftClickCell.classList.contains('is-right-click')) {
            leftClickCell.classList.remove('is-right-click')
        }
        leftClickCell.classList.add('number-hint');
        leftClickCell.textContent = totalMine;
        return
    } else {
        visitedGrid[r][c] = true;
        // If it is right clicked but not a mine, change its class  
        if (leftClickCell.classList.contains('is-right-click')) {
            leftClickCell.classList.remove('is-right-click')
        }
        leftClickCell.classList.add('empty-cell');
        // Recursively explores its neighbors(up, down, left, right and diagonals) that are not visited yet
        for (let i = 0; i < adjacent.length; i++) {
            if (adjacent[i][0] >= 0 && adjacent[i][0] < numberOfRow &&
                adjacent[i][1] >= 0 && adjacent[i][1] < numberOfColumn &&
                visitedGrid[adjacent[i][0]][adjacent[i][1]] === false) {
                revealSafeArea(adjacent[i][0], adjacent[i][1])
            }

        }

    }


}

function isGameSuccess() {
    numberOfClickedCells = numberOfvisitedCells()
    if (numberOfClickedCells === numberOfRow * numberOfColumn - numberOfMine) {
        return true;
    } return false;
}

function gameover() {
    // Timer stops
    stopTimer()

    isGameOver = true;
    // All the mines shows up
    for (let r = 0; r < numberOfRow; r++) {
        for (let c = 0; c < numberOfColumn; c++) {
            if (grid[r][c] === 'M') {
                // Update the CSS style
                document.getElementById(`${r},${c}`).classList.add('game-over');
                gameInfo.textContent = 'Game Over!!';
            } else if (
                // If the right clicked cell is not a mine
                document.getElementById(`${r},${c}`).classList.contains('is-right-click') &&
                !document.getElementById(`${r},${c}`).classList.contains('game-over')) {
                // Update the CSS style
                document.getElementById(`${r},${c}`).innerHTML = '<img src="xmark-solid.svg" class="xmark"/>';

            }

        }

    }


}

function gameSuccess() {
    const totalTime = stopTimer();
    gameInfo.textContent = `You did it! Total time: ${totalTime} sec.`;
}


