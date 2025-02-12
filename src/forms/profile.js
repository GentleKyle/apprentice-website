const user = JSON.parse(sessionStorage.getItem("currentUser"));

document.getElementById("title").textContent = `${user.data.firstName}'s Profile`;
document.getElementById("profile").style.backgroundColor = user.data.favColor;

axios.get(`https://picsum.photos/id/${user.data.imgId}/info`).then((picSum) => {
    document.getElementById("pic").src = picSum.data.download_url;
});

document.getElementById("name").textContent = `${user.data.firstName} ${user.data.lastName}`;

const info = document.getElementsByClassName("data");
for (let element of info) {
    if (Object.hasOwn(user.data, element.id)) {
        element.textContent = user.data[element.id];
    }
}

//could add redirects if at wrong page at wrong time
//could add contraints to inputs
