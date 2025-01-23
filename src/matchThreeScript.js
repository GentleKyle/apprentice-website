///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//match three
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const numOfCells = 64;
const numInRow = 8;
const startTime = "Time: 1:22";

const parentDiv = document.getElementById("matchThree");


function randomGem() {
    const gemArr = ["red", "silver", "green", "yellow", "purple", "orange", "blue"];
    
    return gemArr[Math.floor(Math.random() * 7)];
}

function firstCells() {
    let newCell;

    for (let i = 0; i < numOfCells; i++) {
        newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.classList.add(randomGem());
        newCell.classList.add("special");
        newCell.classList.toggle("special");
        newCell.draggable = true;
        newCell.id = i.toString();
        parentDiv.appendChild(newCell);
    }

    return document.querySelectorAll(".cell");
}

document.getElementById("timer").textContent = startTime;
const cells = firstCells();
cells.forEach(cell => {
    cell.addEventListener("dragstart", dragStart);
    cell.addEventListener("drop", dragDrop);
    cell.addEventListener("dragover", (event) => {event.preventDefault()});

    //cell.addEventListener("touch")
});

window.onload = start();

function switchGems(gemId, newGemId) {
    let gem = cells[gemId].classList[1];
    let newGem = cells[newGemId].classList[1];

    if (isSpecial(gemId)) {
        toggleSpecial(gemId);
        toggleSpecial(newGemId);
    }
    else if (isSpecial(newGemId)) {
        toggleSpecial(gemId);
        toggleSpecial(newGemId);
    }
    cells[gemId].classList.replace(gem, newGem);
    cells[newGemId].classList.replace(newGem, gem);
}
function makeGemRandom(gemId) {
    let gem = cells[gemId].classList[1];

    cells[gemId].classList.replace(gem, randomGem());
}
function toggleSpecial(gemId) {
    cells[gemId].classList.toggle("special");
}
function isSpecial(gemId) {
    return cells[gemId].classList.contains("special");
}

let beingDragged;
function dragStart(e) {
    beingDragged = e.target;
    timer();
}

function checkForMatches() {
    let gems = [];
    for (let i = 0; i < cells.length; i++) {
        gems.push(cells[i].classList[1]);
    }

    let matchNum = 0;
    let currentGem = "";
    let matchLog = {
        horizontal: [],
        vertical: [],
        matches: false
    };
    //horizontal
    for (let i = 0; i < gems.length; i++) {
        if (i % numInRow === 0) {
            currentGem = gems[i];
            matchNum = 1;
        }
        if (gems[i] === currentGem) {
            if (i % numInRow !== 0) {
                matchNum++;
            }
            if (i % numInRow === 7 && i < gems.length - 1) {
                if (matchNum >= 3) {
                    for (let j = 0; j < matchNum; j++) {
                        matchLog.horizontal.push(i - j);
                    }
                }
            }
        }
        else {
            currentGem = gems[i];
            if (matchNum >= 3) {
                for (let j = 1; j <= matchNum; j++) {
                    matchLog.horizontal.push(i - j);
                }
            }
            matchNum = 1;
        }
        if (i === gems.length - 1) {
            if (matchNum >= 3) {
                for (let j = 0; j < matchNum; j++) {
                    matchLog.horizontal.push(i - j);
                }
            }
        }
    }
    //vertical
    matchNum = 0;
    currentGem = "";
    let above = numInRow;
    let at = 0;
    for (let i = numOfCells - 1; i >= numOfCells - numInRow; i--) {
        currentGem = gems[i];
        matchNum = 0;
        for (let j = 0; j < numInRow; j++) {
            if (currentGem === gems[i - (above * j)]) {
                matchNum++;
            }
            else {
                currentGem = gems[i - (above * j)];
                if (matchNum >= 3) {
                    at = (i - (j * numInRow));
                    for (let k = 1; k <= matchNum; k++) { 
                        matchLog.vertical.push((k * numInRow) + at)
                    }
                }
                matchNum = 1;
            } 
            if (j === numInRow - 1 && matchNum >= 3) {
                at = (i - (j * numInRow));
                for (let k = 0; k < matchNum; k++) { 
                    matchLog.vertical.push((k * numInRow) + at)
                }
            }
        }
    }
    if (matchLog.vertical.length > 0 || matchLog.horizontal.length > 0) {
        matchLog.matches = true;
    }
    return matchLog;
}

function destroyMatches(droppedId) {
    let matchLog = checkForMatches();

    let vertical = matchLog.vertical.reduce((accu, gemId, index, arr) => {
        if (index === 0) {
            accu.push([gemId]);
        }
        else if (gemId - numInRow === arr[index - 1]) {
            accu[accu.length - 1].push(gemId);
        }
        else {
            accu.push([gemId]);
        }
        return accu;
    }, []);
    
    let horizontal = matchLog.horizontal.reduce((accu, gemId, index, arr) => {
        if (index === 0) {
            accu.push([gemId]);
        }
        else if (gemId + 1 === arr[index - 1]) {
            accu[accu.length - 1].push(gemId);
        }
        else {
            accu.push([gemId]);
        }
        return accu;
    }, []);
//base case
    if (vertical.length === 0 && horizontal.length === 0) {
        return; 
    }


    let userMatched = false;
    for (let i = 0; i < horizontal.length; i++) {
        for (let j = 0; j < horizontal[i].length; j++) {
            if (horizontal[i][j] == droppedId) {
                userMatched = true;
                if (horizontal[i].length >= 4) {
                    toggleSpecial(droppedId);
                    horizontal[i].splice(j, 1);
                }
            }
        }
        if (!userMatched) {
            if (horizontal[i].length >= 4) {
                toggleSpecial(horizontal[i][0]);
                horizontal[i].splice(0, 1);
            }
        }   
        
    }

    for (let i = 0; i < vertical.length; i++) {
        if (vertical[i].length >= 4) {
            toggleSpecial(vertical[i].pop());
        }

        
    }

    let tempArr;
    let specialGemList;
    let diff = [];

    for (let i = 0; i < horizontal.length; i++) {
        for (let j = 0; j < horizontal[i].length; j++) {
            if (horizontal[i][j] >= 0) {
                if (isSpecial(horizontal[i][j])) {
                    specialGemList = bustSpecialGem(horizontal[i][j]);
                    tempArr = horizontal.slice(i, i + 1);

                    tempArr.flat().forEach((gem) => {
                        if (!specialGemList.flat().includes(gem)) {
                            diff.push(gem);
                        }
                    });
                    horizontal.splice(i, 1, ...bustSpecialGem(horizontal[i][j]));
                    horizontal.push(diff);
                }
            }
        }
    }

    diff = [];
    tempArr = [];
    for (let i = 0; i < vertical.length; i++) {
        for (let j = 0; j < vertical[i].length; j++) {
            if (vertical[i][j] >= 0) {
                if (isSpecial(vertical[i][j])) {
                    specialGemList = bustSpecialGem(vertical[i][j]);
                    tempArr = vertical.slice(i, i + 1);
                    tempArr.flat().forEach((gem) => {
                        if (!specialGemList.flat().includes(gem)) { 
                            diff.push(gem);
                        }
                    });
                    vertical.splice(i, 1, ...bustSpecialGem(vertical[i][j]));
                    vertical.push(diff);
                }
            }
        }
    }

    for (let i = 0; i < horizontal.length; i++) {
        if (horizontal[i][0] > 0) {
            horizontal[i].unshift(-1);
        }
    }
    for (let i = 0; i < vertical.length; i++) {
        if (vertical[i][0] > 0) {
            vertical[i].unshift((vertical[i].length * -1));
        }
    }

    let flatHor = horizontal.flat();
    let flatVer = vertical.flat();

    flatHor.forEach((ele, index) => {
        if (flatVer.includes(ele)) {
            flatHor.splice(index, 1)
        }
    })

    let gemsToDisappear = flatHor.concat(flatVer);

    if (document.getElementById("timer").textContent !== startTime) {
        score(gemsToDisappear);
    }

    dropNewGems(gemsToDisappear);
    
    return destroyMatches();
//recursion? to get them all
}

function bustSpecialGem(gemId) {
    let bonusGems = [];
    let check = [
        [-(numInRow + 1), -1, numInRow - 1],
        [ -numInRow, 0, numInRow],
        [ -(numInRow - 1), 1, numInRow + 1]
    ];
    let column = gemId % numInRow;
    let lookColumn;
    let count = 0;
    

    for (let i = 0; i < 3; i++) {
        bonusGems.push([]);
        for (let j = 0; j < 3; j++) {
            lookColumn = (gemId + check[i][j]) % numInRow;
            if (gemId + check[i][j] >= 0 && gemId + check[i][j] < numOfCells) {
                if (Math.abs(column - lookColumn) <= 1) {
                    bonusGems[count].push(gemId + check[i][j]);
                }
            }
        }
        if (bonusGems[count].length === 0) {
            bonusGems.pop();
        }
        else {
            count++;
        }
        
    }

    for (let i = 0; i < bonusGems.length; i++) {
        bonusGems[i].unshift(bonusGems[i].length * -1);
    }

    if (isSpecial(gemId)) {
        toggleSpecial(gemId);
    }
    
    return bonusGems;
}

function dropNewGems(gemsToDisappear) {
    let factor = numInRow;
    let gem;
    let gemAbove;

    for (let i = 0; i < gemsToDisappear.length; i++) {
        gem = gemsToDisappear[i];
        if (gem < 0) {
            factor = (gem * -1) * numInRow;
        }
        else {
            gemAbove = gem - factor;

            while (gemAbove > 0) {
                switchGems(gem, gemAbove);
                gem = gemAbove;
                gemAbove = gem - factor;
            }
            makeGemRandom(gem);
        }
    }
}

function score(list) {

    let scoreElement = document.getElementById("score").textContent.trim().split(" ");
    let add = 0;

    if (list === undefined) {
        return scoreElement[1];
    }

    list.forEach((gemId) => {
        if (gemId >= 0) {
            add++;
        }
    })
    scoreElement.push(Number(scoreElement.pop()));
    document.getElementById("score").textContent = `${scoreElement[0]} ${scoreElement[1] + add}`;
}

let intervalId = false;
function timer() {
    let currentTime = document.getElementById("timer").textContent.trim().split(" ");
    currentTime.push(currentTime.pop().split(":"));
    currentTime = currentTime.flat()
 
    let time = currentTime[0];
    let minutes = Number(currentTime[1]);
    let seconds = Number(currentTime[2]);

    if (seconds === 0) {
        if (minutes > 0) {
            minutes--; 
            seconds = 59;
        }
    }
    else {
        seconds--;
    }

    let strSeconds = seconds.toString().padStart(2, "0");

    document.getElementById("timer").textContent = `${time} ${minutes}:${strSeconds}`;

    if (seconds === 0 && minutes === 0) {
        clearInterval(intervalId);
        return gameOver();
    }

    if (!intervalId) {
        intervalId = setInterval(timer, 1000);
    }
    
}

function gameOver() {
    let dialog = document.getElementById("gameOver");
    let msg = "Time's Up! <br> Your Score: " + score() + "<br>";
    dialog.innerHTML = msg;

    const aganeBut = document.createElement("button");
    aganeBut.focus();
    aganeBut.textContent = "Play Again!";
    aganeBut.addEventListener("click", () => {
        dialog.close();
        resetGame()
    });
    dialog.appendChild(aganeBut);
    
    dialog.showModal();
    intervalId = false;
}

function start() {
    destroyMatches();

    let dialog = document.getElementById("gameStart");

    const startBut = document.createElement("button");
    startBut.focus();
    startBut.textContent = "Got It!";
    startBut.addEventListener("click", () => dialog.close());
    dialog.appendChild(startBut);
    
    dialog.showModal();
}

function resetGame() {
    document.getElementById("timer").textContent = startTime;
    //document.getElementById("lgScore").textContent = "Previous Score: " + score();
    document.getElementById("score").textContent = "Score: 0";

    cells.forEach((gem) => {
        makeGemRandom(gem.id);
        if (isSpecial(gem.id)) {
            toggleSpecial(gem.id);
        }
    });

    destroyMatches();
}

function dragDrop(e) {
    
    let legalCheck = Math.abs(e.target.id - beingDragged.id);

    if (legalCheck === 1 || legalCheck === numInRow) {
        switchGems(e.target.id, beingDragged.id);
        let matchObj = checkForMatches();
        if (matchObj.matches) {
            destroyMatches(e.target.id);
        }
        else {
            setTimeout(() => {
                switchGems(e.target.id, beingDragged.id);    
            }, 222)
        }

    }
    
    //bonus - add special gem behavior, animation(falling and specials), scoring/board, background/pretty
    //add cell classes for background glow/effect for special - and add background grids for normal cell
    //also https://www.spriters-resource.com/pc_computer/bejeweled2/ for spin animation
    //transparent star effect in n out opacity
    //touch support
}
 