from sanic import Sanic
from sanic.response import json
import requests
import threading
from sanic_cors import CORS, cross_origin

from diffusers import StableDiffusionPipeline
# from diffusers import StableDiffusionUpscalePipeline
import torch
import uuid

HOST = "192.168.59.66"
model_id = "MohamedRashad/diffusion_fashion"
pipeline = StableDiffusionPipeline.from_pretrained(
    model_id, 
    torch_dtype=torch.float16)
pipeline.to("cuda")
#pipeline.enable_attention_slicing()

# model_id_2 = "stabilityai/stable-diffusion-x4-upscaler"
# pipeline_2 = StableDiffusionUpscalePipeline.from_pretrained(model_id_2, torch_dtype=torch.float16)
# pipeline_2 = pipeline_2.to("cuda")
# pipeline_2.enable_attention_slicing()

def worker(prompt):
    image = pipeline(prompt).images[0]

    # upscaled_image = pipeline_2(prompt=prompt, image=image).images[0]

    image_name = uuid.uuid4().hex
    image_path = "./pics/" + image_name + ".png"
    image.save(image_path)

    try:
        requests.post(f'http://{HOST}:8080/on-image-generated',
                       json={"image_path": image_path})
        return json({'suggestions': "OK"})
    except Exception as e:
        return json({'suggestions': f"Error:{e}"})

app = Sanic("Stable_Diffusion_API")
CORS(app)

@app.post('/get-suggestions')
async def submit_data(request):
    data = request.json
    print(data)
    prompt=data["prompt"]
    design_thread = threading.Thread(target=worker, args=(prompt,))
    design_thread.start()
    return json({'suggestions': "GENERATING"})


if __name__ == "__main__":
    app.run(host='0.0.0.0', 
            port=8000,
            #debug = True,
            #auto_reload = True,
            #single_process = True
            )




































    