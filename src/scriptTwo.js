function closeDialog() {
    const dialog = document.getElementById("login");
    const usrBox = document.getElementById("usernameBox");
    const pwBox = document.getElementById("passwordBox");
    
    document.getElementById("profileForm").reset();
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

loginForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const loginFormData = Object.fromEntries(formData);

    const button = e.submitter.value;
    const isUserValid = validateLogin(loginFormData);

    if (button === "login") {
        if (isUserValid.isValid) {
            //currentUser = loginFormData.userName;
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
            //currentUser = loginFormData.userName;
            displayUsrName();
            closeDialog();
        }
    }
}
profileForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(profileForm);
    const profileFormData = Object.fromEntries(formData);

    setUserProfile(profileFormData);
    console.log(profileFormData);
}
// set isLoggedIn? to each object or save currentUser to session storage
function setLoginInfo(loginFormData) {
    //could add all kinds of rules for length n things but meh
    let users = JSON.parse(sessionStorage.getItem("userData"));
    let first = [loginFormData];

    if (users === null) {
        sessionStorage.setItem("userData", JSON.stringify(first));
        setCurrentUserIndex(0);
    }
    else {
        users.push(loginFormData);
        sessionStorage.setItem("userData", JSON.stringify(users));
        setCurrentUserIndex(users.length - 1);
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
        users.forEach((user, index) => {
            console.log(index);
            if (user.userName === loginFormData.userName) {
                validUser.usernameTaken = true;
                if (user.password === loginFormData.password) {
                    validUser.isValid = true;
                    setCurrentUserIndex(index);
                    console.log("yooo " + index);
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

function setUserProfile(data) {
    const user = getCurrentUser();
    const users = JSON.parse(sessionStorage.getItem("userData"));

    const userUpdated = {...user.data, ...data};

    users.splice(user.index, 1, userUpdated);
    sessionStorage.setItem("userData", JSON.stringify(users));
}
/*    
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

function displayUsrName() {
    const currentUser = getCurrentUser();
    document.getElementById("curLog").innerHTML = currentUser.userName;
}

function setBackground() {
    const bodyBack = document.getElementById("body");

    axios.get(`https://picsum.photos/id/53/info`).then((picSum) => {
        bodyBack.style.backgroundImage = `url("${picSum.data.download_url}")`;
    });
}

function setCurrentUserIndex(index) {
    sessionStorage.setItem("currentUserIndex", JSON.stringify(index));
}
function getCurrentUser() {
    const currentUserIndex = JSON.parse(sessionStorage.getItem("currentUserIndex"));
    const users = JSON.parse(sessionStorage.getItem("userData"));
    const currentUser = {
        data: users[currentUserIndex],
        index: currentUserIndex
    };

    return currentUser;
}