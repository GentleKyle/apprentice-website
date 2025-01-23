document.getElementById("jsTest").style.backgroundColor = "lime";

document.getElementById("jsTest").style.color = "gray";

function alertFunction() {
    alert("Ouch!");
}

function newPickleBackColor() {
    let ele = document.getElementsByClassName("pickle");
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    for (let i = 0; i < ele.length; i++) {
        ele[i].style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
}

function gamble(ele) {
    let emojis = [127799, 127795, 127808];//, 127812, 129365]; 
    let randE = Math.floor(Math.random() * emojis.length);

    const newEle = document.createElement("div");
    newEle.textContent = String.fromCodePoint(emojis[randE]);
    newEle.className = "emoji";
    ele.replaceWith(newEle);
}

function reload() {
    location.reload();
}

function outcomeAlert(grids) {
    let grads = grids.getElementsByClassName("grad");
    let emojis = grids.getElementsByClassName("emoji");
    let gameObj = {
        matchNum: 3,
        arrData: emojis,
        matchCount: 0,
    };
    const winPop = document.getElementById("winPop");
    const losePop = document.getElementById("losePop");

    if (!grids.contains(grads[0])) {
        for (let i = 0; i < emojis.length; i++) {
            let lookBack = i % gameObj.matchNum;
            if (lookBack === 0) {
                gameObj.matchCount = 1;
            } 
            else if (emojis[i].innerHTML === emojis[i - lookBack].innerHTML) {
                gameObj.matchCount++;
            }
            if (gameObj.matchCount === gameObj.matchNum) {
                return winPop.showPopover();
            }  
        }

        for (let i = 0; i < emojis.length / gameObj.matchNum; i++) {
            let lookAhead = gameObj.matchNum;
            gameObj.matchCount = 1;
            for (let j = 1; j < lookAhead; j++) {
                if (emojis[i].innerHTML === emojis[i + (lookAhead * j)].innerHTML) {
                    gameObj.matchCount++;
                }  
            }
            if (gameObj.matchCount === gameObj.matchNum) {
                return winPop.showPopover();
            }
        }    
        return losePop.showPopover();
    } 
}

function autoDate() {
    const d = new Date();
    const dStr = d.toLocaleString();

    document.getElementById("time").textContent = dStr;
}
setInterval(autoDate, 1000);



   