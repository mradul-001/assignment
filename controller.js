const { GoogleGenAI } = require("@google/genai");
const fs = require('node:fs');

const ai = new GoogleGenAI({
    apiKey: "AIzaSyAR45DOv6knyYD7zIWY3CIPsklJRBM0YZk"
});


async function fetchSummary(query) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: query,
    });
    return response;
}

async function getSummary(req, res) {

    const data = req.query.data;

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
}

module.exports = getSummary;