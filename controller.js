const { GoogleGenAI } = require("@google/genai");
const { response } = require("express");
const fs = require('node:fs');

const ai = new GoogleGenAI({
    apiKey: "YOUR API KEY"
});


async function fetchSummary(query) {
    const apiCall = ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: query,
    });

    // handling the timeout issues
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    try {
        const response = await Promise.race([apiCall, timeout]);
        return response;
    } catch (err) {
        // if we get into a timeout error
        if (err.message === "Request timed out") {
            throw new Error("API request timed out. Please try again later.");
        }
        // if we get into an invalid api error
        if (err.message.includes("API key") || err.message.includes("unauthorized")) {
            throw new Error("Invalid API key. Please check your credentials.");
        }
        throw err;
    }
}




async function getSummary(req, res) {

    try {
        const data = req.query.data;

        // if data is null or only whitespaces
        if (!data || data.trim() === '""') {
            return res.status(400).json({
                response: "Data cannot be empty."
            });
        }

        const query = `For the following meeting minutes, you need to give me the following things:
                    - A 2–3 sentence summary
                    - A list of key decisions
                    - A structured list of action items with task, owner (optional), and deadline (optional)
                    
                    An example of what is expected from you is as follows:
                    - Meeting minutes:
                       Team Sync – May 26
                        - We’ll launch the new product on June 10.
                        - Ravi to prepare onboarding docs by June 5.
                        - Priya will follow up with logistics team on packaging delay.
                        - Beta users requested a mobile-first dashboard.
                    
                    - Response:
                        {
                            "summary": "The team confirmed the product launch on June 10, assigned onboarding preparation and logistics follow-up, and discussed user feedback on mobile design.",
                            "decisions": [
                                "Launch set for June 10",
                                "Need mobile-first dashboard for beta users"
                            ],
                            "actionItems": [
                                {
                                "task": "Prepare onboarding docs",
                                "owner": "Ravi",
                                "due": "June 5"
                                },
                                {
                                "task": "Follow up with logistics team",
                                "owner": "Priya"
                                }
                            ]
                        }

                    You need to give ONLY a valid JSON object, nothing other than a JSON object. You MUST exsure that the JSON object has the following attributes:
                        - "summary"
                        - "decisions"
                        - "actionItems"
                    
                        The meeting minutes you have to work on are : ${data}
            `;

        const response = await fetchSummary(query);
        const responseText = response.candidates[0].content.parts[0].text;
        const cleanText = responseText.replace(/```json|```/g, "").trim();
        const jsonResponse = JSON.parse(cleanText);

        fs.writeFile('./result.txt', cleanText, err => {
            if (err) {
                console.error(err);
            }
        });

        return res.status(200).json({
            response: jsonResponse,
            status: true
        });
    } catch (err) {
        const message = err.message.includes("Invalid API key")
            ? err.message
            : err.message === "API request timed out. Please try again later."
                ? err.message
                : "Error processing the request.";
        return res.status(500).json({ response: message });
    }
}

module.exports = getSummary;