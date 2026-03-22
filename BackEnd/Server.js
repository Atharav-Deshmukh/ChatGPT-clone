import OpenAI from 'openai';
import "dotenv/config";
import express from 'express'
import cors from "cors";
import mongoose from 'mongoose';
import chatRoute from './Routes/Chat.js'; 


const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors())

app.use("/api", chatRoute);

const connect_database = async() => {
    try{
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("------------ COnnected With DataBase! ------------")
    } catch(err) {
        console.log("failed Connection ", err)
    }
}

// Fixed: Database connects first, then server starts
connect_database().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
});

//---------------------------------------------------------------------------

    app.get("/", (req, res) => {
      res.send("Hi, I am root");
    });

    // app.get("/test", async (req, res) => {
    //     const options = {
    //         method: "POST", // POST method is used to send our data to OpenAI so we can fetch a reply
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    //         },
    //         body: JSON.stringify({
    //             model: "gpt-4.1-nano",
    //             messages: [
    //                 {
    //                     role: "user",
    //                     content: req.body.massage   // This is the actual message/prompt we are sending to the AI to generate our output
    //                 }
    //             ]
    //         }),
    //     }
    //     try {
    //         const response = await fetch("https://api.openai.com/v1/chat/completions", options)
    //         const data = await response.json();
    //         console.log(data.choices[0].message.content);
    //         res.send(data);
    //     } catch(err) {
    //         console.log(err);
    //         res.status(500).send("Error connecting to OpenAI");
    //     }
    // })
 
//---------------------------------------------------------------------------

    // const client = new OpenAI({
    //   apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
    // });

    // const response = await client.responses.create({
    //   model: 'gpt-5-nano',
    // //   instructions: 'You are a coding assistant that talks like a pirate',
    //   input: 'Say Hello',
    // });

    // console.log(response.output_text);

//---------------------------------------------------------------------------