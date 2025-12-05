- [restaurant-finder](#restaurant-finder)
  - [Project Structure](#project-structure)
  - [Running the project Locally](#running-the-project-locally)
    - [Setup Environment:](#setup-environment)
    - [Get your API keys Keys](#get-your-api-keys-keys)
    - [Running the development server\*\*:](#running-the-development-server)
  - [Endpoints](#endpoints)
    - [Overview](#overview)
      - [Query Parameters](#query-parameters)
      - [Example Usage](#example-usage)
    - [Test in Postman](#test-in-postman)
      - [Response Format](#response-format)
      - [Response Status Codes](#response-status-codes)
    - [Unit Tests](#unit-tests)

# restaurant-finder
LLM-Driven Restaurant Finder API that allows users to enter a free‑form message
describing what they want to do. The API processes natural language queries and returns relevant restaurant information from the Foursquare Places API.

## Project Structure

```
|--- README.md
|--- src/
| |--- config/
| | |--- config.ts
| |--- controllers/
| | |--- searchController.ts
| |--- middlewares/
| |--- models
| |--- routes/
| | |--- searchRoutes.ts
| |--- services/
| | |--- runUserPrompt.ts
| |--- utils/
| | |--- utils.test.ts
| | |--- utils.ts
| |--- app.ts
| |--- server.ts
|--- jest.config.js
|--- package-lock.json
|--- package.json
|--- tsconfig.json
|--- .gitignore
```
## Running the project Locally

**Prerequistes**
- node.js version 20 or later

1. clone this repo and cd into project root**:

    git@github.com:sangwani-coder/restaurant-finder.git

### Setup Environment:

1. Install requirements
Ensure you are in the root directory where package.json is and run:

    npm install

2. Set Environment Variables

    copy the .env.example to .env and set your API Keys.


### Get your API keys Keys
After generating the API keys ffrom the listed sites below, set your api keys in .env.

1. Google Gen AI

    https://aistudio.google.com/app/apikey

2. Four Square

    https://foursquare.com/


### Running the development server**:

    npm run dev

## Endpoints

    `{BaseUrl}/api/execute?message={user_message}&code=pioneerdevai`

### Overview
This endpoint allows you to search for restaurants based on location and search criteria. The API processes natural language queries and returns relevant restaurant information from the Foursquare Places API.

#### Query Parameters

| Parameter | Type   | Required | Description                                                                           |
| --------- | ------ | -------- | ------------------------------------------------------------------------------------- |
| message   | string | Yes      | The search query in natural language format. Example: "Find me restaurants in Zambia" |
| code      | string | Yes      | The API access code for authentication. Example: "pioneerdevai"                       |


#### Example Usage

    GET http://localhost:3000/api/execute?message=Find me restaurants in zambia lusaka&code=pioneerdevai


### Test in Postman

    https://lipilatech.postman.co/workspace/My-Workspace~1fa1f36f-7ea8-4a6a-81de-23683e9e2690/collection/19566920-7c3427ae-c0f8-4197-a68c-202d39f89d2c?action=share&creator=19566920&active-environment=19566920-109a6a13-c696-4a4e-8efd-633e24cfceaa&live=f5j3x41y6w


#### Response Format
**Success Response (200 OK)**
The API returns a JSON object containing the action type and an array of restaurant results.

*Response Structure:*

    ```{
        "action": "restaurant_search",
        "results": [
            {
            "name": "Restaurant Name",
            "address": "Full Address",
            "detail_url": "https://places-api.foursquare.com/places/...",
            "Cuisine": "Cuisine Type"
            }
        ]
        }
    ```

**Field Descriptions:**
- action: The type of search performed (e.g., "restaurant_search")
- results: Array of restaurant objects matching the search criteria
- name: Name of the restaurant
- address: Physical address of the restaurant (may be null if unavailable)
- detail_url: URL to get detailed information about the restaurant from Foursquare
- Cuisine: Type of cuisine or restaurant category


#### Response Status Codes
| Status Code | Description |
|---|---|
| 200 | Success - Restaurant results returned |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid access code |
| 500 | Server Error - Internal processing error |
    
    
### Unit Tests
Run tests to ensure Jest is configured correctly.

    npm run test