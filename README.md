# restaurant-finder
LLM-Driven Restaurant Finder API that allows users to enter a free‑form message
describing what they want to do.

# Running the project Locally

**Prerequistes**
- node.js version 20 or later

**clone this repo and cd into project root**:

    git@github.com:sangwani-coder/restaurant-finder.git

## Requirements:

*Install requirements*

    npm install

**Set Variables**

    copy the .env.example to .env and set your API Keys.

**Install GoogleGenAI**

1. Installation

    npm install @google/genai

2. Obtain API  Key

You need a Gemeni API key from [Google AI](https://aistudio.google.com/app/apikey) studio to use `@google/genai`.

    Go to: https://aistudio.google.com/app/apikey and get it FREE.


3. Environment Variables
set LLM_API_KEY in .env
    
    LLM_API_KEY=<your-gemini-api-key>


Run:
    
    npx ts-node src/test_gemini.ts

    **Example OutPut (Success)**

    ```
        I ran in front of a car and got tired.
        Then I ran behind the car.
        And I got exhausted.
    ```


**Running the Dev server**:

    npm run dev

**Test in Browser**:
*Check server status*:
    http:localhost:3000

*Search for restaurant**

    http://localhost:3000/api/execute?message=Find%20me%20a%20cheap%20sushi%20restaurant%20in%20downtown%20Los%20Angeles%20that's%20open%20now%20and%20has%20at%20least%20a%204-star%20rating&code=pioneerdevai
    
    
