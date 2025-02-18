window.onload = logout();

const loginForm = document.getElementById("loginForm");


loginForm.onsubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const loginFormData = Object.fromEntries(formData);

    const button = e.submitter.value;
    const userInfo = validateLogin(loginFormData);

    if (button === "login") {
        if (userInfo.isValid) {
            setCurrentUser(userInfo.userNumber);
            //check if current user has data yet
            if (Object.hasOwn(userInfo, "data")) {
                window.location = "form.html";
            }
            else {
                window.location = "profile.html";
            }
        }
        else {
            alert(userInfo.reason);
        }
    }

    if (button === "signUp") {
        if (userInfo.usernameTaken) {
            alert("Username is taken. Log in instead or choose another.");
        }
        else {
            //add user
            addUser(loginFormData);
            //set current user to last
            setCurrentUser(validateLogin(loginFormData).userNumber);
            window.location = "form.html";
        }
    }
}

//could add requirements for username/pw
function validateLogin(loginFormData) {
    let validUser = {
        isValid: false,
        usernameTaken: false,
        reason: "Username does not exist. Try again or sign up instead.",
        userNumber: 0,
    }

    const users = JSON.parse(sessionStorage.getItem("users"));
    const nameMatch = (user) => user.loginInfo.userName === loginFormData.userName;

    //username matches
    if (users !== null) {
        if (users.some(nameMatch)) {
            const userIndex = users.findIndex(nameMatch);
            const user = users[userIndex];

            validUser.userNumber = userIndex;
            validUser.usernameTaken = true;

            if (user.loginInfo.password === loginFormData.password) {
                validUser.isValid = true;
                return validUser;
            }
            else {
                validUser.reason = "Incorrect Password";
                return validUser;
            }
        }
    }
    //new user
    return validUser;
}

//array of user objects - starts with loginInfo only - add data in scriptTwo.js
function addUser(loginInfo) {
    let users = JSON.parse(sessionStorage.getItem("users"));
    const newUser = {loginInfo: loginInfo};

    if (users === null) {
        sessionStorage.setItem("users", JSON.stringify([newUser]));
    }
    else {
        users.push(newUser);
        sessionStorage.setItem("users", JSON.stringify(users));
    }

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

function logout() {
    //add thing so if you are not logged in but you get to page then you redirect to login
    if (getCurrentUser() !== null) {
        sessionStorage.removeItem("currentUser");
    }
}