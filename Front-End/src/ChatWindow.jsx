import "./ChatWindow.css";
import Chat from "./Chat";
import { UserContext } from "./MyContext.jsx";  // for accessing shared context data
import { useContext, useEffect, useState } from "react";
import {GridLoader} from "react-spinners";

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId,  setPrevChats, setNewChat, setIsTyping, setAllThreads } = useContext(UserContext); 
  const [loading, setLoading] = useState(false);
  const [isOpen, setisOpen] = useState(false);


// setNewChat ---------------------------------------------------------------------|
    
const getReplyFunction = async () => {
      if (!prompt.trim()) return;
      // Instantly show user's message on screen before the server responds
      const currentPrompt = prompt;
      setReply([...reply, { role: "user", content: currentPrompt }]);
      setPrompt(""); 
      setLoading(true);
      setNewChat(false);
      setIsTyping(true);

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentPrompt,
          threadId: currThreadId, 
        }),
      };

      //------------- Type → Send → Show instantly → API call → Get reply → Update UI --

      try {
        const response = await fetch("http://localhost:8000/api/chat", options);
        const data = await response.json();
        
        if (response.ok) {
          setReply(data.messages); 
          
          // Move this chat to the top of the Sidebar instantly!
          setAllThreads(prevThreads => {
            const otherThreads = prevThreads.filter(t => t.threadId !== currThreadId);
            const updatedThread = {
                threadId: currThreadId,
                messages: data.messages 
            };
            return [updatedThread, ...otherThreads];
          });

        } else {
          console.error("Backend Error:", data.message);
        }
      } catch (err) {
        console.error("Network Error:", err);
      }
      setLoading(false)
    };

    //----------------------Append new chat to prevChats---------------------------|
    // (Note: Removed the infinite loop useEffect here, but keeping your section comment!)


    const handleProfileClick = () => {
      setisOpen(!isOpen)
    }
//---------------------------------------------------------------------------------|

  return (
    <div className="chatWindow">
      <div className="navebar"> 
        <span>StayGPT <i className="fa-solid fa-angle-down"></i></span>
        <div className="userIconDIv" onClick={handleProfileClick}>
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>
        </div>
      </div>

      {isOpen && (
          <div className="dropDown">
            <div className="dropDownItem">
              <i className="fa-regular fa-user"></i>
              <span>Create New Account</span>
            </div>
            
            <div className="dropDownItem">
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              <span>Log In</span>
            </div>

            <hr className="divider" />

            <div className="dropDownItem">
              <i className="fa-solid fa-gear"></i>
              <span>Settings</span>
            </div>
            
            <div className="dropDownItem logout">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Log Out</span>
            </div>

           </div>
        )}

      <Chat />

      <div className="loaderContainer">
        <GridLoader color="#fff" loading={loading} />
      </div>

      <div className="chatInput">
        <div className="InputBox">
          <input 
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? getReplyFunction() : null}
          />
          <div id="submit" onClick={getReplyFunction} style={{cursor: "pointer"}}>
            <i className="fa-solid fa-arrow-up sender"></i>
          </div>
        </div>
        <p className="infoStayGPT">StayGPT can make mistakes. Check important info. See <a>Cookie Preferences</a></p>
      </div>
    </div>
  );
}

export default ChatWindow;