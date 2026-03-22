import "dotenv/config";

const getOpenAI_API_Response = async(message) => { 
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }]
        }),
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        
        if (!response.ok) {
            console.error("OpenAI Error:", data);
            return "AI Error: " + data.error.message;
        }

        if (!data.choices || data.choices.length === 0) {
            return "Sorry, I could not get a response from AI at this moment.";
        }
        return data.choices[0].message.content;
    } catch(err) {
        console.error("OpenAI Fetch Error:", err);
        return "Internal AI Error";
    }
}

export default getOpenAI_API_Response;