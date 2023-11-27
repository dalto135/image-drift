let prompts = [];
let images = [];

let promptInputDiv = document.querySelector("#promptInput");
let apiKeyInputDiv = document.querySelector("#apiKeyInput");

function generate() {
    if (!promptInputDiv.value || !apiKeyInputDiv.value) {
        alert("All fields must be completed.");
        return
    }

    console.log();
    console.log("GENERATING!");

    let prompt = promptInputDiv.value;
    if (prompts.length == 0) {
        prompts.push(prompt);

        console.log();
        console.log("PROMPT:");
        console.log(prompt);
    }

    dall_e_call(prompt);
}

function dall_e_call(prompt) {
    fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeyInputDiv.value}`
        },
        body: JSON.stringify({
            model: "dall-e-2",
            // prompt: "I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: " + prompt,
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        })
    })
    .then(response => response.json())
    .then(data => {
        let image = data.data[0].url;
        images.push(image);
        displayImages();

        console.log();
        console.log("IMAGE:");
        console.log(image);

        vision_call(image);
    })
    .catch(error => console.error(error));
}

function vision_call(image) {
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeyInputDiv.value}`
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Describe this image as a Generative AI prompt."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                "url": image,
                            },
                        },
                    ],
                },
            ],
            model: 'gpt-4-vision-preview',
            max_tokens: 300
        })
    })
    .then(response => response.json())
    .then(data => {
        let prompt = data.choices[0].message.content;
        prompts.push(prompt);

        displayPrompts();

        promptInputDiv.value = prompt;

        console.log();
        console.log("PROMPT:");
        console.log(prompt);
    })
    .catch(error => console.error(error));
}

function displayImages() {
    let imagesDiv = document.querySelector("#imagesDiv");

    let imagesDivList = '<div style="width: 75%; aspect-ratio: 2 / 1;"></div>';
    images.forEach(image => {
        imagesDivList += `<img src=${image}></img>`;
    });

    imagesDiv.innerHTML = imagesDivList;
}

function displayPrompts() {
    let promptsDiv = document.querySelector("#promptsDiv");

    let promptDivList = "";
    prompts.forEach(prompt => {
        promptDivList += `<textarea readonly>${prompt}</textarea>`;
    });

    promptsDiv.innerHTML = promptDivList;
}

let generateButton = document.querySelector('#generate');
generateButton.addEventListener('click', generate);

// Code for toggling Dark Mode
let html_element = document.querySelector("html");

function setTheme() {
    let date = new Date();
    let time = date.getHours();

    if (time >= 8 && time < 21) {
        html_element.setAttribute("id", "light");
    }
}

setTheme();

function toggleTheme() {
    if (html_element.getAttribute("id") === "light") {
        html_element.removeAttribute("id");
    }
    else {
        html_element.setAttribute("id", "light");
    }
}

let darkModeButton = document.querySelector("#darkMode");
darkModeButton.addEventListener('click', toggleTheme);