import OpenAI from "openai";


let prompts = [];
let images = [];

let imagesDiv = document.querySelector("#imagesDiv");
let promptsDiv = document.querySelector("#promptsDiv");

let promptInputDiv = document.querySelector("#promptInput");
let apiKeyInputDiv = document.querySelector("#apiKeyInput");

console.log("hello world");

async function generate() {
    console.log("GENERATE FUNCTION");
    let prompt = promptInputDiv.value;

    if (prompts.length == 0) {
        prompts.push(prompt);
    }

    let apiKey = apiKeyInputDiv.value;

    try {
        const dall_e_response = await openai.images.generate({
            model: "dall-e-2",
            // prompt: "I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: " + prompt,
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const image = dall_e_response.data[0].url;
        images.push(image);

        if (images) {
            imagesDiv.innerHTML = '<div style="width: 50%; aspect-ratio: 2 / 1;"></div>';

            images.forEach(image => {
                imagesDiv.innerHTML += '<img src=' + image + ' style="width: 50%;"></img>';
            })

            imagesDiv.innerHTML += '<br/>';
        }
        

        console.log();
        console.log("IMAGE URL:");
        console.log(image);

        const vision_response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
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
            max_tokens: 300
        });

        prompt = vision_response.choices[0].message.content;
        prompts.push(prompt);

        if (prompts) {
            prompts.forEach(prompt => {
                promptsDiv.innerHTML += '<textarea readonly style="width: 50%; aspect-ratio: 1 / 1; font-size: large;">' + prompt + '</textarea>';
            })
            promptsDiv.innerHTML += '<br/>';
        }

        console.log();
        console.log("IMAGE PROMPT:");
        console.log(prompt);
        console.log();
    } catch (error) {
        console.log();
        console.error("Error generating image:", error);
        console.log();
    }

    promptInputDiv.value = prompts[prompts.length - 1];
    apiKeyInputDiv.value = apiKey;
}

let generateButton = document.querySelector('#generate');

function test() {
    promptInputDiv.value = "hello world";
    console.log("HELLO WORLD");
}

generateButton.addEventListener('click', test);
