const user = JSON.parse(sessionStorage.getItem("currentUser"));

document.getElementById("title").textContent = `${user.data.firstName}'s Profile`;
document.getElementById("profile").style.backgroundColor = user.data.favColor;

//showing saved img
axios.get(`https://picsum.photos/id/${user.data.imgId}/info`).then((picSum) => {
    document.getElementById("pic").src = picSum.data.download_url;
});

//show full name
document.getElementById("name").textContent = `${user.data.firstName} ${user.data.lastName}`;

//displaying user data
const info = document.getElementsByClassName("data");
for (let element of info) {
    if (Object.hasOwn(user.data, element.id)) {
        element.textContent = user.data[element.id];
    }
}

//could add redirects if at wrong page at wrong time
//could add contraints to inputs
