const dall_e_url = 'https://api.openai.com/v1/images/generations';
const vision_url = 'https://api.openai.com/v1/chat/completions';

let prompts = [];
let images = [];

let promptInputDiv = document.querySelector("#promptInput");
let apiKeyInputDiv = document.querySelector("#apiKeyInput");

function generate() {
    console.log();
    console.log("GENERATING!!");

    let prompt = promptInputDiv.value;
    if (prompts.length == 0) {
        prompts.push(prompt);
    }

    dall_e_call(prompt);
}

function dall_e_call(prompt) {
    fetch(dall_e_url, {
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
        console.log("IMAGE");
        console.log(image);

        vision_call(image);
    })
    .catch(error => console.error(error));
}

function vision_call(image) {
    fetch(vision_url, {
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

        promptInputDiv.value = prompts[prompts.length - 1];

        console.log();
        console.log("PROMPT");
        console.log(prompt);
    })
    .catch(error => console.error(error));
}

function displayImages() {
    let imagesDiv = document.querySelector("#imagesDiv");

    let imagesDivList = '<div style="width: 50%; aspect-ratio: 2 / 1;"></div>';
    images.forEach(image => {
        imagesDivList += '<img src=' + image + ' style="width: 50%;"></img>';
    });
    imagesDivList += '<br/>';

    imagesDiv.innerHTML = imagesDivList;
}

function displayPrompts() {
    let promptsDiv = document.querySelector("#promptsDiv");

    let promptDivList = "";
    prompts.forEach(prompt => {
        promptDivList += `<textarea readonly style="width: 50%; aspect-ratio: 1 / 1; font-size: large;">${prompt}</textarea>`;
    });
    promptDivList += '<br/>';

    promptsDiv.innerHTML = promptDivList;
}

let generateButton = document.querySelector('#generate');
generateButton.addEventListener('click', generate);
