import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./MyContext"; 
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    // 1. ADD isTyping HERE
    const { newChat, reply, isTyping } = useContext(UserContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (!reply || reply.length === 0) {
            setLatestReply(null); 
            return;
        }
        const lastMessage = reply[reply.length - 1];

        // 2. ADD '&& isTyping' to this rule! 
        // Now it only animates if it's an AI message AND isTyping is true
        if (lastMessage.role === "assistant" && isTyping) {
            const content = lastMessage.content.split(" "); 

            let idx = 0;
            setLatestReply(""); 
            
            const interval = setInterval(() => {
                setLatestReply(content.slice(0, idx + 1).join(" "));
                idx++;
                
                if (idx >= content.length) {
                    clearInterval(interval);
                }
            }, 40); 

            return () => clearInterval(interval);
        } else {
            // If you clicked an old chat (isTyping is false), it comes here and shows instantly!
            setLatestReply(null);
        }

    }, [reply, isTyping]); // 3. Added isTyping here

    return (
        <>
            {newChat && (
                <div className="start-screen">
                    <img src="src/assets/blacklogo.png" alt="StayGPT Logo" className="big-logo" />
                    
                    <div className="suggestion-grid">
                        <div className="card">
                            <p>Plan a trip</p>
                            <span>to explore the beaches of Goa</span>
                        </div>
                        <div className="card">
                            <p>Write code</p>
                            <span>for a simple HTML button</span>
                        </div>
                        <div className="card">
                            <p>Explain</p>
                            <span>how quantum physics works</span>
                        </div>
                        <div className="card">
                            <p>Brainstorm names</p>
                            <span>for my new startup idea</span>
                        </div>
                    </div>
                </div>
            )}


            <div className="chats">    
                {
                    reply?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user" ? "userDiv" : "AiDiv"} key={idx}>
                            {
                                chat.role === "user" ? 
                                <p className="userMessage">{chat.content}</p> : 
                                <div className="GPTMassage">
                                    <Markdown rehypePlugins={[rehypeHighlight]}>{chat.content}</Markdown>
                                </div>
                            }
                        </div>
                    )
                }

                {
                    reply?.length > 0 && (
                        <div className={reply[reply.length - 1].role === "user" ? "userDiv" : "AiDiv"} key="last-message">
                            {
                                reply[reply.length - 1].role === "user" ? (
                                    <p className="userMessage">{reply[reply.length - 1].content}</p>
                                ) : (
                                    <div className="GPTMassage">
                                        <Markdown rehypePlugins={[rehypeHighlight]}>
                                            {latestReply !== null ? latestReply : reply[reply.length - 1].content}
                                        </Markdown>
                                    </div>
                                )
                            }
                        </div>
                    )
                }

            </div>
        </>
    )
}

export default Chat;