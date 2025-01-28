function closeDialog() {
    let dialog = document.getElementById("login");

    dialog.close();
}

function openDialog() {
    let dialog = document.getElementById("login");

    dialog.showModal();
    return false;
}

window.onload = openDialog();

const loginForm = document.getElementById("loginForm");
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
        }
    }
    return false;
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

function editProfile() {
    //populate all elements with data
}
function addData(name, value) {
    //add data to profile/user
    let users = JSON.parse(sessionStorage.getItem("userData"));
    let userID = users.findIndex((user) => {
        user.userName === currentUser;
    });


}