let prompts = [];
let images = [];

let promptInputDiv = document.querySelector("#promptInput");
let apiKeyInputDiv = document.querySelector("#apiKeyInput");

let slideshowDiv = document.querySelector("#slideshow");

let imageModel = document.querySelector("#imageModel");

function generate() {
    if (!promptInputDiv.value || !apiKeyInputDiv.value) {
        alert("All fields must be completed.");
        return
    }

    document.documentElement.style.cursor = 'wait';
    generateButton.disabled = true;
    generateButton.style.color = 'grey';

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
    if (imageModel.value == "dall-e-3") {
        prompt = "I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: " + prompt;
    }

    fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeyInputDiv.value}`
        },
        body: JSON.stringify({
            model: imageModel.value,
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        })
    })
    .then(response => response.json())
    .then(data => {
        let image = data.data[0].url;
        images.push(image);

        console.log();
        console.log("IMAGE:");
        console.log(image);

        vision_call(image);
    })
    .catch(error => {
        console.error(error);
        resetUI();
        alert(error + "\n\nMake sure your API Key is correct.");
    });
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
            model: 'gpt-4o',
            max_tokens: 250
        })
    })
    .then(response => response.json())
    .then(data => {
        let prompt = data.choices[0].message.content;
        prompts.push(prompt);

        displayContents(prompt);

        console.log();
        console.log("PROMPT:");
        console.log(prompt);
    })
    .catch(error => {
        console.error(error);
        resetUI();
        alert(error + "\n\nMake sure your API Key is correct.");
    });
}

function displayContents(prompt) {
    let imagesDiv = document.querySelector("#imagesDiv");
    let promptsDiv = document.querySelector("#promptsDiv");

    let imagesDivList = '<div style="width: 100%; max-width: 500px; aspect-ratio: 2 / 1;"></div>';
    images.forEach(image => {
        imagesDivList += `<img src=${image}></img>`;
    });

    let promptDivList = "";
    prompts.forEach(prompt => {
        promptDivList += `<textarea readonly>${prompt}</textarea>`;
    });

    if (images.length > 0) {
        slideshowDiv.innerHTML = `<img src=${images[images.length - 1]} style="max-width: 350px; aspect-ratio: 1 / 1;"></img>`;
    }
    
    imagesDiv.innerHTML = imagesDivList;
    promptsDiv.innerHTML = promptDivList;
    promptInputDiv.value = prompt;
    resetUI();
}

let generateButton = document.querySelector('#generate');
generateButton.addEventListener('click', generate);

function slideshow() {
    let timeDelay = 300;

    slideshowButton.disabled = true;
    slideshowButton.style.color = 'grey';

    for (let i = 0; i < images.length; i++) {
        setTimeout(function() {
            slideshowDiv.innerHTML = `<img src=${images[i]} style="max-width: 350px; aspect-ratio: 1 / 1;"></img>`
        }, i * timeDelay);
    }

    setTimeout(function() {
        slideshowButton.disabled = false;
        slideshowButton.style.color = '';
    }, (images.length - 1) * timeDelay);
}

let slideshowButton = document.querySelector("#slideshowButton");
slideshowButton.addEventListener('click', slideshow);

// // This code allows the user to upload an image
// var dropZone = document.getElementById('drop_zone');

// // Add event listeners for drag and drop
// dropZone.addEventListener('dragover', function(event) {
//     event.stopPropagation();
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'copy';
//     dropZone.classList.add('over');
// });

// dropZone.addEventListener('dragleave', function(event) {
//     dropZone.classList.remove('over');
// });

// dropZone.addEventListener('drop', function(event) {
//     event.stopPropagation();
//     event.preventDefault();
//     dropZone.classList.remove('over');

//     var files = event.dataTransfer.files; // FileList object.

//     // Process all File objects
//     for (var i = 0, f; f = files[i]; i++) {
//         // Handle files[i] upload here
//         console.log('File name ' + f.name);
//     }
// });

function resetUI() {
    document.documentElement.style.cursor = 'default';
    generateButton.disabled = false;
    generateButton.style.color = '';
}

// Code for toggling Dark Mode
let html_element = document.querySelector("html");

function toggleTheme() {
    if (html_element.getAttribute("id") === "light") {
        html_element.removeAttribute("id");
    }
    else {
        html_element.setAttribute("id", "light");
    }
}

function setTheme() {
    let date = new Date();
    let time = date.getHours();

    if (time >= 8 && time < 21) {
        toggleTheme();
    }
}

// setTheme();

let darkModeButton = document.querySelector("#darkMode");
darkModeButton.addEventListener('click', toggleTheme);