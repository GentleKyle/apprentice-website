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
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (currentUser === null || !currentUser.isLoggedIn) {
        dialog.showModal();
    }
}

function logout() {
    let dialog = document.getElementById("login");
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    currentUser.isLoggedIn = false;
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    dialog.showModal();
}

if (document.location.pathname === "/C:/Users/kylep/Documents/Tensure%20Apprenticeship/GitHub/apprentice-website/src/form.html") {
    window.onload = openDialog(), setBackground(), displayUsrName();
}

const loginForm = document.getElementById("loginForm");
const profileForm = document.getElementById("profileForm");

loginForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const loginFormData = Object.fromEntries(formData);

    const button = e.submitter.value;
    const isUserValid = validateLogin(loginFormData);
    const user = JSON.parse(sessionStorage.getItem("currentUser"));

    if (button === "login") {
        if (isUserValid.isValid) {
            user.isLoggedIn = true;
            if (Object.keys(user.data).length < 3) {
                closeDialog();
            }
            else {
                window.location.replace("profile.html");
            }
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
            user.isLoggedIn = true;
            //confirm msg - maybe display at top
            setLoginInfo(loginFormData);
            displayUsrName();
            closeDialog();
            randomImg();
        }
    }
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    //console.log(e);
}
profileForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(profileForm);
    const profileFormData = Object.fromEntries(formData);

    setUserProfile(profileFormData);
    window.location.replace("profile.html");
    //console.log(e);
}

function setLoginInfo(loginFormData) {
    //could add all kinds of rules for length n things but meh
    let users = JSON.parse(sessionStorage.getItem("userData"));
    let first = [loginFormData];

    if (users === null) {
        sessionStorage.setItem("userData", JSON.stringify(first));
        setCurrentUser(0);
    }
    else {
        users.push(loginFormData);
        sessionStorage.setItem("userData", JSON.stringify(users));
        setCurrentUser(users.length - 1);
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
                    setCurrentUser(index);
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
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    const users = JSON.parse(sessionStorage.getItem("userData"));

    const userUpdated = {...user.data, ...data};

    users.splice(user.index, 1, userUpdated);
    sessionStorage.setItem("userData", JSON.stringify(users));
    editCurrentUser();
}

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
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUser !== null) {
        currentUser.isLoggedIn = true;
        document.getElementById("curLog").innerHTML = currentUser.data.userName;
    }
}

function setBackground() {
    const bodyBack = document.getElementById("body");

    axios.get(`https://picsum.photos/id/53/info`).then((picSum) => {
        bodyBack.style.backgroundImage = `url("${picSum.data.download_url}")`;
    });
}

function setCurrentUser(index) {
    const users = JSON.parse(sessionStorage.getItem("userData"));
    const currentUser = {
        data: users[index],
        index: index,
        isLoggedIn: false,
    }; 

    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
}
function editCurrentUser() {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    const users = JSON.parse(sessionStorage.getItem("userData"));

    user.data = users[user.index];

    sessionStorage.setItem("currentUser", JSON.stringify(user));
}

function editProfileBut() {
    window.location.replace("form.html");
}
window.addEventListener('load', editProfile());
function editProfile() {
    const profileForm = document.getElementById("profileForm");
    const user = JSON.parse(sessionStorage.getItem("currentUser"));

    for (const [id, value] of Object.entries(profileForm)) {
        const key = value.name;
        if (Object.hasOwn(user.data, key)) {
            console.log(user.data[key]);
            if (key === "imgId") {
                const picEle = document.getElementById("pic");
                axios.get(`https://picsum.photos/id/${user.data[key]}/info`).then((picSum) => {
                    picEle.src = picSum.data.download_url;
                });
            }
            else if (key === "childs") {
                if (value.value === user.data[key]) {
                    const radios = document.querySelectorAll("input[type='radio']");
                    radios[value.value].checked = true;
                }
            }
            else {
                value.value = user.data[key];
            }
        } 
    }
}