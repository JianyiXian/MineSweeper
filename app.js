
// Get references to the button
const startButton = document.getElementById("startButton");
// Get references to the second
const second = document.getElementById("second");
// Initialize timer to control the Timer
let timer = false;

startButton.addEventListener("click", () => {
    timer = true;
    resetTimer();
});


// Create a global variable count initialize to 0
let count = 0;
function startTimer() {
    // If timer is true, increment count by 1
    if (timer) {
        count += 1;
        let countString = count;
        // Convert the count to string with '000' format
        if (count < 10) {
            countString = "00" + countString;
        } else if (count < 100) {
            countString = "0" + countString;
        }
        second.innerHTML = countString;
    }
}


function stopTimer() {
    timer = false;
}


function resetTimer() {
    // Set count and countString to default value
    count = 0;
    countString = "000";
    // Update the innierHTML
    second.innerHTML = countString;
}


const numberOfRow = 10
const numberOfColumn = 10
const numberOfMine = 10

// Generate randomRow with the length of numberOfMine in range of (0, row) and save as array 
let randomRow = new Array(numberOfMine)
randomRow = randomRow.fill().map(() => Math.floor(Math.random() * (numberOfRow - 1)));

// Generate randomColumn with the length of numberOfMine in range of (0, column) and save as array   
let randomColumn = new Array(numberOfMine)
randomColumn = randomColumn.fill().map(() => Math.floor(Math.random() * (numberOfColumn - 1)));



// Create two-dimensional array
//[[E, E, E, E...E],
// [E, E, E, E...E],
// [E, E, E, M...E],
// ...
// [E, E, E, E...E]]
const grid = [];
for (let r = 0; r < numberOfRow; r++) {
    grid[r] = []
    for (let c = 0; c < numberOfColumn; c++) {
        grid[r][c] = 'E';
    }
}


// Place the mine into the grid
// iterate over randomRow, if [r][c] is in randomRow and randomColumn, mark as mine
for (let i = 0; i < randomRow.length; i++) {
    grid[randomRow[i]][randomColumn[i]] = 'M';
}
console.log(grid);


// Create a separate 2D array visitedGrid to keep track of the visited cells
const visitedGrid = [];
for (let r = 0; r < numberOfRow; r++) {
    visitedGrid[r] = []
    for (let c = 0; c < numberOfColumn; c++) {
        visitedGrid[r][c] = false;
    }
}
console.log('')


// Get references to the grid container element
const gridContainer = document.getElementById("gridContainer");

// Generate the grid HTML
let gridContent = '';
for (let c = 0; c < grid[0].length; c++) {
    gridContent += '<div class="grid-column">';
    for (let r = 0; r < grid.length; r++) {
        gridContent += `<div class="grid-row" id= ${r},${c}></div>`;
    }
    gridContent += "</div>";
}
gridContainer.innerHTML = gridContent;


// Get all the cells
const cells = document.getElementsByClassName('grid-row');

// Attach right-click event listener to the cells
for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('contextmenu', HandlerightClick);
}

// Right click event handler
function HandlerightClick(event) {

    // Prevent the default right-click context menu
    event.preventDefault();
    const cell = event.target;
    const cellId = cell.id;
    const cellClass = cell.className;
    // Get the index of the row column
    const index = cellId.split(',');
    const r = index[0];
    const c = index[1];
    console.log(r)
    console.log(c)
    if (!cellClass.includes('is-right-click')) {
        // Set the cell to visited
        visitedGrid[r][c] = true;
        // Set isClick to true
        isRightClick = true;
        console.log(visitedGrid);
        // update the CSS
        cell.classList.add('is-right-click');

    } else {
        // Set the cell to not visited
        visitedGrid[r][c] = false;
        // Set the isClick to false
        cell.classList.remove('is-right-click');
    }


};

function revealSafeArea(grid, mine) {
    startTimer()
}


