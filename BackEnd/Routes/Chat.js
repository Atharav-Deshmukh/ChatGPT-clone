import express from 'express';
import Thread from '../Models/Thread.js'; 
import getOpenAI_API_Response from '../Utils/OpenAI.js';

const router = express.Router(); 

// TEST ROUTE: Used to verify database saving works correctly
router.post("/test", async (req, res) => {
    try {
        // 1. EXTRACT message from the request body
        const { message } = req.body; 

        // 2. DEFINE the new document
        const thread = new Thread({        
            threadId: Date.now().toString(),
            messages: [{ 
                role: "user", 
                content: message // Ensures 'message' is passed to the schema
            }]
        });

        // 3. AWAIT the save operation to finish
        const response = await thread.save(); 
        
        // 4. SEND the saved document back to Thunder Client
        res.status(200).send(response);

    } catch(err) {
        console.error("Error details:", err.message);
        // Send the error message back for easier debugging
        res.status(500).json({ error: err.message });
    }
});

//__________ R O U T E S __________ R O U T E S __________ R O U T E S __________ R O U T E S __________ R O U T E S ____________//

// GET ALL THREADS: Returns the list of all chat conversations
    router.get("/thread", async (req, res) => {
        try {
        // Fetch all threads and sort them by 'updatedAt' in descending order
        // This ensures the most recently updated chats appear at the top
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        
        res.status(200).json(threads);
        } catch (err) {
            console.error("Error fetching threads:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

// GET SPECIFIC THREAD: Show all messages for a particular Thread ID
    router.get("/thread/:threadId", async(req, res) => {
        const { threadId } = req.params;
        try {
            // Use findOne because we are searching by our custom threadId string
            const thread = await Thread.findOne({ threadId });

            if (!thread) {
                return res.status(404).json({ error: "Thread Not Found" });
            }

            res.status(200).json(thread.messages);
        } catch (err) {
            console.error("Error fetching specific thread:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

// DELETE THREAD: Remove a specific conversation from the database
    router.delete("/thread/:threadId", async(req, res) => {
        const { threadId } = req.params;
        try {
            const thread = await Thread.findOneAndDelete({ threadId });

            if (!thread) {
                return res.status(404).json({ error: "Thread Not Found" });
            }

            res.status(200).json({ message: "Thread deleted successfully" });
        } catch (err) {
            console.error("Error deleting thread:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

// MAIN CHAT ROUTE: Handles User message, gets AI reply, and saves both
  router.post("/chat", async (req, res) => {
    try {
        // We MUST get these from req.body
        const { message, threadId } = req.body; 

        if (!message) {
            return res.status(400).json({ message: "No message sent" });
        }

        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({        
                threadId: threadId || Date.now().toString(),
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // Fixed: Save the user's message FIRST so it's not lost if AI is slow
        await thread.save();

        // Wait for AI response
        const aiReply = await getOpenAI_API_Response(message);
        
        // Push AI reply and save AGAIN
        thread.messages.push({ role: "assistant", content: aiReply });
        await thread.save(); 
        
        // Send back the whole thread so the UI updates
        res.status(200).json(thread);

    } catch(err) {
        console.error("CRITICAL BACKEND ERROR:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;