from openai import OpenAI
import openai
import requests
import os
from datetime import datetime

client = OpenAI()

from flask import Flask, redirect, render_template, request, url_for
app = Flask(__name__)
# openai.api_key = os.getenv("OPENAI_API_KEY")

prompts = []
images = []
folder_datetime = datetime.now()
api_key = ""

@app.route("/", methods=("GET", "POST"))
def index():
    if request.method == "POST":
        
        # folder_path = os.path.expanduser(f'~/Downloads/image_folder_{folder_datetime}')
        # prompt_file_path = os.path.expanduser(f'~/Downloads/image_folder_{folder_datetime}/prompts.txt')

        # if not os.path.exists(folder_path):
        #     os.makedirs(folder_path)

        # if not os.path.exists(prompt_file_path):
        #     prompt_file_path = os.path.join(folder_path, f'prompts.txt')
        #     with open(prompt_file_path, 'a') as file:
        #         file.write("")

        prompt = request.form["prompt"]
        openai.api_key = request.form["api-key"]
        # if os.path.getsize(prompt_file_path) == 0:
        if len(prompts) == 0:
            prompts.append(prompt)

        #     with open(prompt_file_path, 'a') as file:
        #         file.write(prompt)
        #         file.write("\n####################################################\n")

        dall_e_response = client.images.generate(
            model="dall-e-2",
            prompt="I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: " + prompt,
            # prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1
        )

        print()
        print("DALL_E_RESPONSE")
        print(dall_e_response.data[0].revised_prompt)
        print()

        image = dall_e_response.data[0].url
        images.append(image)

        vision_response = client.chat.completions.create(
            model = "gpt-4-vision-preview",
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Describe this image as a Generative AI prompt."},
                        {
                            "type": "image_url",
                            "image_url": image,
                        },
                    ],
                }
            ],
            max_tokens = 300,
        )

        prompt = vision_response.choices[0].message.content
        prompts.append(prompt)

        # response = requests.get(image)

        # if response.status_code == 200:
        #     image_datetime = datetime.now()
        #     image_file_path = os.path.join(folder_path, f'{image_datetime}.png')

        #     with open(image_file_path, 'wb') as file:
        #         file.write(response.content)

        #     with open(prompt_file_path, 'a') as file:
        #         file.write(prompt)
        #         file.write("\n####################################################\n")

        return redirect(url_for("index", images=images, prompt=prompt, api_key=request.form["api-key"]))

    # print()
    # print("PROMPTS")
    # print(prompts)
    # print()
    # print("IMAGES")
    # print(images)
    # print()

    prompt = request.args.get("prompt")
    api_key = request.args.get("api_key")
    return render_template("index.html", len=1, images=images, prompts=prompts, prompt=prompt, api_key=api_key)
