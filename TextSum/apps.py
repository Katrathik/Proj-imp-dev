from fastapi import FastAPI, Body
import cohere

app = FastAPI()

co = cohere.Client(api_key="Your api key")

# Allow CORS for local development
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process_text/")
async def process_text(input_text: str = Body(...)):
    message = """
    Simplify the medical jargon into simple language(in layman’s terminology) below such that even a illiterate person understands, don't ask follow up.

    When the user describes their condition, provide them with the health needs and self care at home for such a condition. 
    Also, identify the symptoms of cardiac problem for early detection when they describe their condition.

    The above two lines only apply if the user describes their condition, otherwise, do not provide answers for it.

    {input_text}
    """.format(input_text=input_text)

    response = co.chat(
        message=message,
        model="command-r-plus",
        temperature=0.3
    )
    return {"response": response.text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
