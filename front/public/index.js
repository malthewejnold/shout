const API_URL = 'http://localhost:3000/shout';

document.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded");
    getShouts();

    const createShoutForm = document.querySelector(".shout_form");

    console.log(createShoutForm)

    createShoutForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(createShoutForm);
    
        let payload = {
            name: formData.get("name"),
            content: formData.get("content")
        };
    
        console.log(JSON.stringify(payload));
        
        try {
            let response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                createShoutForm.reset();
                getShouts();
				hide_shout_form();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
        } catch (error) {
            console.error("Fetch error: " + error.message);
        }
    });
});

// Get all
async function getShouts() {
    let response = await fetch(API_URL)
    let shouts = await response.json()

    //Display the result
    displayShouts(shouts)
}

// Get by tags
async function getShoutsByTags(tag) {
    let response = await fetch(API_URL + `?tags=${tag}`);
    let shouts = await response.json()

    //Display the result
    displayShouts(shouts)
}

// Get by name
async function getShoutsByName(name) {
    let response = await fetch(API_URL + `?name=${name}`);
    let shouts = await response.json()

    //Display the result
    displayShouts(shouts)
}

function displayShouts(data) {
    const shoutContainer = document.querySelector(".shout_container");

	// Clear container before filling again
	shoutContainer.innerHTML = '';

    if (data.count > 0) {
        data.shouts.forEach((rec) => {
			console.log(rec)
            let shoutDiv = document.createElement("div")
            shoutDiv.classList.add("shout")
			shoutDiv.id = rec._id;

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

function unhide_shout_form() {
	let createShoutForm = document.querySelector(".shout_form");
	createShoutForm.style.display = "flex";

	let createShoutButton = document.querySelector(".create_button_div");
	createShoutButton.style.display = "none";
}

function hide_shout_form() {
	let createShoutForm = document.querySelector(".shout_form");
	createShoutForm.style.display = "none";

	let createShoutButton = document.querySelector(".create_button_div");
	createShoutButton.style.display = "flex";
}