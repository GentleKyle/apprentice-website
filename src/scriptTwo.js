function closeDialog() {
    const dialog = document.getElementById("login");
    const usrBox = document.getElementById("usernameBox");
    const pwBox = document.getElementById("passwordBox");

    usrBox.value = "";
    pwBox.value = "";
    dialog.close();
}

function openDialog() {
    let dialog = document.getElementById("login");

    dialog.showModal();
}

window.onload = openDialog(), setBackground(), randomImg();

const loginForm = document.getElementById("loginForm");
const profileForm = document.getElementById("profileForm");
let currentUser;

loginForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const loginFormData = Object.fromEntries(formData);

    const button = e.submitter.value;
    const isUserValid = validateLogin(loginFormData);

    if (button === "login") {
        if (isUserValid.isValid) {
            currentUser = loginFormData.userName;
            window.location.replace("profile.html");
        }
        else {
            alert(isUserValid.reason);
        }
    }

    if (button === "signUp") {
        if (isUserValid.usernameTaken) {
            alert("Username is taken. Log in instead or choose another.");
        }
        else {
            //confirm msg - maybe display at top
            setLoginInfo(loginFormData);
            currentUser = loginFormData.userName;
            loggedInAs();
            closeDialog();
        }
    }
}
profileForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(profileForm);
    const profileFormData = Object.fromEntries(formData);

    console.log(profileFormData);
}

function setLoginInfo(loginFormData) {
    //could add all kinds of rules for length n things but meh
    let users = JSON.parse(sessionStorage.getItem("userData"));
    let first = [loginFormData];

    if (users === null) {
        sessionStorage.setItem("userData", JSON.stringify(first));
    }
    else {
        users.push(loginFormData);
        sessionStorage.setItem("userData", JSON.stringify(users));
    }
}

function validateLogin(loginFormData) {
    let validUser = {
        isValid: false,
        usernameTaken: false,
        reason: "Username does not exist. Try again or sign up instead.",
    }

    const users = JSON.parse(sessionStorage.getItem("userData"));

    if (users !== null)  {
        users.forEach((user) => {
            if (user.userName === loginFormData.userName) {
                validUser.usernameTaken = true;
                if (user.password === loginFormData.password) {
                    validUser.isValid = true;
                }
                else {
                    validUser.reason = "Incorrect Password";
                    return validUser;
                }
            }
        })
    }
    return validUser;
}
/*
function editProfile() {
    //populate all elements with data
}
function addData(name, value) {
    //add data to profile/user
    let users = JSON.parse(sessionStorage.getItem("userData"));
    let userID = users.findIndex((user) => {
        user.userName === currentUser;
    });

    users[userID][name] = value;

    console.log(users);
}
*/

function randomImg() {
    const randomNum = Math.floor(Math.random() * 100);
    const picEle = document.getElementById("pic");
    const imgId = document.getElementById("imgId");
    
    axios.get(`https://picsum.photos/id/${randomNum}/info`).then((picSum) => {

        picEle.src = picSum.data.download_url;
        imgId.value = picSum.data.id;
    });
}

function loggedInAs() {
    document.getElementById("curLog").innerHTML = currentUser;
}

function setBackground() {
    const bodyBack = document.getElementById("body");

    axios.get(`https://picsum.photos/id/53/info`).then((picSum) => {
        bodyBack.style.backgroundImage = `url("${picSum.data.download_url}")`;
    });
}