document.getElementById("jsTest").style.backgroundColor = "lime";

document.getElementById("jsTest").style.color = "gray";

function alertFunction() {
    alert("That is Kyle's face!");
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




