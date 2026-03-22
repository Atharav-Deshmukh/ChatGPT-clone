import './App.css'; 
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';
import { UserContext } from './MyContext';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState([]);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());

  const [prevChats, setPrevChats] = useState([]); //stores all previous chats of curr threads
  const [newChat, setNewChat] = useState(true);   // track new chat is created
  const [allThreads, setAllThreads] = useState([]);  // history SideHar
  
  const [isTyping, setIsTyping] = useState(true); 

  const providesValue = {
      prompt, 
      setPrompt,
      reply, 
      setReply,
      currThreadId, 
      setCurrThreadId,
      newChat, setNewChat,
      prevChats, setPrevChats,
      allThreads, setAllThreads,
      isTyping, setIsTyping
  }; 

  return (
    <div className='app'>

      <UserContext.Provider value={providesValue}>
        <SideBar />
        <ChatWindow />
      </UserContext.Provider>


    </div>
  );
}