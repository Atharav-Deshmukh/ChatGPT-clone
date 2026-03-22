import './SideBar.css';
import { useEffect, useContext } from 'react';
import { UserContext } from "./MyContext.jsx"; 
import { v4 as uuidv4 } from 'uuid';

function SideBar() { 
    const { 
        allThreads, setAllThreads, 
        setNewChat, setPrompt, 
        setReply, setCurrThreadId, currThreadId, setIsTyping
    } = useContext(UserContext);

// ============================================================================
// 1. INITIAL LOAD: Fetch all old chats when the sidebar first appears
// ============================================================================
        useEffect(() => {
            const fetchHistory = async () => {
                try {
                    const response = await fetch("http://localhost:8000/api/thread");
                    const data = await response.json();
                    
                    // Save the fetched data into global state so the whole app can see it
                    setAllThreads(data); 
                } catch (err) {
                    console.error("Error fetching history:", err);
                }
            };
            fetchHistory();
        }, []); // Empty array [] means this runs ONLY ONCE when the app starts


// ============================================================================
// 2. CREATE NEW CHAT: Resets the screen for a brand new conversation
// ============================================================================
    const createNewChat = () => {
        setNewChat(true);          // Shows the "Start a New Chat!" heading
        setPrompt("");             // Clears whatever is in the input box
        setReply([]);              // Empties the main chat screen safely 
        setCurrThreadId(uuidv4()); // Generates a brand new unique ID for the database
    }

// ============================================================================
// 3. CHANGE THREAD: Loads a specific old chat onto the main screen
// ============================================================================
    const changeThread = async (NewthreadId) => {
        setCurrThreadId(NewthreadId); // Update the active ID
        setIsTyping(false);
        
        try {
            // Fetch only the messages for this specific Thread ID
            let response = await fetch(`http://localhost:8000/api/thread/${NewthreadId}`);
            let data = await response.json(); 
            
            setReply(data);    // Load the old messages onto the screen
            setNewChat(false); // Hide the "Start a New Chat!" heading
        } catch (err) {
            console.log("Error loading thread:", err);
        }
    }

// ============================================================================
// 4. DELETE THREAD: Removes a chat from the database AND the sidebar
// ============================================================================
    const deleteThread = async (Deleting_ThreadID) => {
        try {
            let response = await fetch(`http://localhost:8000/api/thread/${Deleting_ThreadID}`, { 
                method: "DELETE" 
            });
            
            // Step 2: If backend deletion is successful, update the UI instantly
            if (response.ok) {
                // We filter the array to keep everything EXCEPT the deleted thread.
                // This makes the deleted chat instantly vanish from the sidebar!
                setAllThreads(prevThreads => prevThreads.filter(thread => thread.threadId !== Deleting_ThreadID));
                
                // Optional: If you delete the chat you are currently looking at, clear the screen
                setReply([]);
                setNewChat(true);
            }
        } catch (err) {
            console.log("Error deleting thread:", err);
        }
    }

    return(
        <section className='sidebar'>
            
            {/* New Chat Button */}
            <button className='addbutton' onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" className='logo' alt="GPT Logo" />
                <span><i className="fa-solid fa-pen-to-square new-icon"></i></span>
            </button>

            {/* History List */}
            <ul className='history'>
                {!allThreads || allThreads.length === 0 ? (
                    <li>No history found</li>
                ) : (
                    allThreads.map((thread) => (
                        <li 
                            key={thread.threadId}
                            onClick={() => changeThread(thread.threadId)} 
                            className={thread.threadId === currThreadId ? "highlighter" : " "}
                            style={{ cursor: "pointer" }} 
                        >
                            {/* Get the first 20 letters of the first message to use as the title */}
                            {thread.messages && thread.messages.length > 0 
                                ? thread.messages[0].content.substring(0, 20) + ".."
                                : "New Chat"}

                            {/* Delete Button (Trash Can Icon) */}
                            <i 
                                className="fa-solid fa-trash-can" 
                                onClick={(e) => {
                                    // STOP PROPAGATION: This is crucial! 
                                    // It prevents the click event from bubbling up to the <li> tag.
                                    // Without this, clicking the trash can would ALSO trigger changeThread()
                                    e.stopPropagation(); 
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                )}
            </ul>
            
            {/* Signature Area */}
            <div className="sign">
                <p>Atharv Deshmukh</p>
            </div>
        </section>
    )
}

export default SideBar;