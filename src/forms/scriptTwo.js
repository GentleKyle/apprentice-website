//Enter login info - check if it exists - sessionstorage array of objects - 
// each object is a user with "loginInfo" and "data" - also a currentUsr object outside of the array

const dataForm = document.getElementById("dataForm");

//gets background and random img - if there is saved data to usr gets put in input boxes
window.onload = displayUsrName(), randomImgFirst(), setBackground(), fillForm();

dataForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(dataForm);
    const profileFormData = Object.fromEntries(formData);

    setUserData(profileFormData);
    window.location.replace("profile.html");

}

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem("currentUser"));
}
function setCurrentUser(userNum) {
    const users = JSON.parse(sessionStorage.getItem("users"))
    const currentUser = users[userNum];
    currentUser["index"] = userNum;

    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
}

//adds data to user object and updates currentusr
function setUserData(data) {
    const users = JSON.parse(sessionStorage.getItem("users"));

    users[getCurrentUser().index]["data"] = data;

    sessionStorage.setItem("users", JSON.stringify(users));
    setCurrentUser(getCurrentUser().index);
}

//fills input fields with usr saved data if it exists
function fillForm() {
    const user = getCurrentUser();

    if (Object.hasOwn(user, "data")) {
        for (const input of Object.values(dataForm)) {
            if (input.name === "imgId") {
                axios.get(`https://picsum.photos/id/${user.data.imgId}/info`).then((picSum) => {
                    document.getElementById("pic").src = picSum.data.download_url;
                });
            }
            else if (input.name === "childs") {
                if (input.value === user.data.childs) {
                    const radios = document.querySelectorAll("input[type='radio']");
                    radios[user.data.childs].checked = true;
                }
            }
            else if (Object.hasOwn(user.data, input.name)) {
                input.value = user.data[input.name];
            }
        }
    }
}

function displayUsrName() {
    document.getElementById("curLog").innerHTML = getCurrentUser().loginInfo.userName;
}
function logOutBut() {
    window.location = "loginForm.html";
}
function setBackground() {
    const bodyBack = document.getElementById("body");

    axios.get(`https://picsum.photos/id/53/info`).then((picSum) => {
        bodyBack.style.backgroundImage = `url("${picSum.data.download_url}")`;
    });
}
function randomImgFirst() {
    if (!Object.hasOwn(getCurrentUser(), "data")) {
        const randomNum = Math.floor(Math.random() * 100);
        const picEle = document.getElementById("pic");
        const imgId = document.getElementById("imgId");
        
        axios.get(`https://picsum.photos/id/${randomNum}/info`).then((picSum) => {
    
            picEle.src = picSum.data.download_url;
            imgId.value = picSum.data.id;
        });
    }
}
function randomImgBut() {
    const randomNum = Math.floor(Math.random() * 100);
    const picEle = document.getElementById("pic");
    const imgId = document.getElementById("imgId");
    
    axios.get(`https://picsum.photos/id/${randomNum}/info`).then((picSum) => {

        picEle.src = picSum.data.download_url;
        imgId.value = picSum.data.id;
    });
}


//saved for syntax of joining two objects
//     for (const [id, value] of Object.entries(profileForm)) {
    //const userUpdated = {...user.data, ...data}; --- can join two objects

    //users.splice(user.index, 1, userUpdated);












