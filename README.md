### Modules used:
- Express.JS     : For handling apis
- Nodemon        : For running app continuously
- @google/genai  : For using gemini api

### Citations:
- The code to fetch information using gemini api is copied from official documentation [here](https://ai.google.dev/gemini-api/docs/quickstart).

- I have used this piece of code using ChatGPT:
    ```js
    const responseText = response.candidates[0].content.parts[0].text;
    const cleanText = responseText.replace(/```json|```/g, "").trim();
    const jsonResponse = JSON.parse(cleanText);
    ```
- I have saved the resulting json in result.txt, this required file handling in NodeJs, I have referred to official docs [here](https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs).


### How to run the code:
Run the following commands to run the app:
```bash
npm i
npm run dev
```

### Usage:
I used Postman Client to test the api. You can follow these steps to do the same:
- The 2 files `result1.txt` and `result2.txt` has the output of the two testcases I got from ChatGPT. You can copy the meeting minutes (with quotes).
- Go to Postman client
    - Set the URL to `http://localhost:3000/getSummary`
    - Set the params as follows:

        |Key   | Value                      |
        |------|----------------------------|
        |"data"|Meeting minutes you copied  |
    - Press on `Send` and you will get the result stored in `result.txt`.