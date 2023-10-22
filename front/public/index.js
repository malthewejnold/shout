const API_URL = 'http://localhost:3000/shout';

document.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded");
    getShouts();

    const createShoutForm = document.querySelector(".shout_form");

    console.log(createShoutForm)

    createShoutForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        let formData = new FormData(createShoutForm)

        let payload = {
            name: formData.get("name"),
            content: formData.get("content")
        };

        console.log(JSON.stringify(payload))
        let response = await fetch(API_URL, {
            method: "POST",
            header: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        alert(response.status)

        if (response.status == 200){
            createShoutForm.reset();
            getShouts();
        } else {
            console.error(response.statusText);
            alert(response.statusText);
            return;
        }

    });
});

// Get all
async function getShouts() {
    let response = await fetch(API_URL)
    let shouts = await response.json()

    //Display the result
    displayShouts(shouts)
    console.log(shouts)
}

// Get by tags
async function getShoutsByTags(tag) {
    let response = await fetch(API_URL + `?tags=${tag}`);
    let shouts = await response.json()

    //Display the result
    displayShouts(shouts)
    console.log(shouts)
}

// Get by name
async function getShoutsByName(name) {
    let response = await fetch(API_URL + `?name=${name}`);
    let shouts = await response.json()

    //Display the result
    displayShouts(shouts)
    console.log(shouts)
}

function displayShouts(data) {
    const shoutContainer = document.querySelector(".shout_container");

    if (data.count > 0) {
        data.shouts.forEach((rec) => {
            let shoutDiv = document.createElement("div")
            shoutDiv.classList.add("shout")

            let name = document.createElement("h3")
            name.textContent = rec.name

            let shoutContentDiv = document.createElement("div")
            shoutContentDiv.classList.add("shout_content")

            let shoutContent = document.createElement("p")
            shoutContent.textContent = rec.content
            shoutContentDiv.appendChild(shoutContent)

            let date = document.createElement("span")
            date.classList.add("shout_date")
            date.textContent = new Date(rec.createdAt).toDateString();
            shoutContentDiv.appendChild(date)

            shoutDiv.appendChild(name)
            shoutDiv.appendChild(shoutContentDiv)

            shoutContainer.appendChild(shoutDiv)
        });
    } else {
        return;
    }
}