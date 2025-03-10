// All chat Related
//Emits events and listen .display messages
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const Chat = () => {
  const { name, roomId } = useParams();      //comes from home page
  const [newUser, setNewUser] = useState(null); //every time new User Logs in (name, and updated online Users list)
  const [messages, setMessages] = useState([]); //Contains messages 
  const msgRef = useRef();                      //Enterd messages ref
  const [leavedUser,setLeavedUser] = useState(null); //When any user leaves (name and updated online users list)
  const socketRef = useRef(null);                   //contains the socket instance
  const [onlineUsers,setOnlineUsers] = useState(null); //all the online users of particular room

  useEffect(() => {
    //on mount invokes only one time 
    //set all socket listner here because this block on executes once from the mounting
    //if u set you listner somewher else it might gats triggerd twice and cause performance issues

    socketRef.current = io("https://chatroomserver-cugp.onrender.com");  //connect to io

    socketRef.current.on("connect", () => {     //on conection set up our new User
      console.log(socketRef.current.id);
      socketRef.current.emit("newUser", name, roomId);
    });
    //When new User Registers ig fivers the Name,Online Users array,SocketId
    socketRef.current.on("userAdded", async (recivedName, users, socketId) => {
      setNewUser({ addedUser: recivedName, onlineUsers: users, socketId });
      setOnlineUsers(users);
    });
    //When a message is added i.e sender's message 
    socketRef.current.on("msgAdded", async (newMsg) => {
      setMessages((prev) => [
        ...prev,                                        //Append t messages
        { sender: newMsg.user, text: newMsg.text },
      ]);
    });
    //When a user leaves the chat room
    socketRef.current.on("leave",(leavedName,users)=>{
        setLeavedUser({leaved:leavedName,users});
        setOnlineUsers(users);
    })
  }, [name, roomId]); 

  //Hook for newUser Arrival
  useEffect(()=>{
    if(newUser){  //Set up the new User
    if(newUser.addedUser !== name){  //if the new User is not us display the joined message
        let data={
            sender:"system",
            text:`${newUser.addedUser}! Joined the chat room`  
        }
        setMessages((prev)=>[...prev,data]);
    }}
  },[newUser]);
//When a user leaves the chat room
  useEffect(()=>{
    if(leavedUser){  //It brings the updated onlineUsers list therfore this hook
   let data = {
     sender: "system",
     text: `${newUser.addedUser}! left the chat room`,
   };
   setMessages((prev)=>[...prev,data]);
}
  },[leavedUser])

  //Send mesage even handeler
  function sendMessage() {
    const msg = msgRef.current.value.trim();
    if (!msg) return;
    socketRef.current.emit("newMsg", msg, roomId);  //Emmit the message
    setMessages((prev) => [...prev, { sender: name, text: msg }]); //As the broadcast will not send us back our message Updaate it manually
    msgRef.current.value = "";
  }

  return (
    <div className="relative flex min-h-screen bg-gray-900 text-white">
      {/* Online Users Panel */}
      <div className="absolute left-180 top-0 h-full w-64 bg-gray-800 shadow-lg p-4">
        <h2 className="text-lg font-bold border-b border-gray-700 pb-2">
          Online Users {/* online User Block */}
        </h2>
        {onlineUsers && (
          <>
            <p className="text-sm mt-2">Total: {onlineUsers.length}</p>
            <ul className="mt-2 space-y-2">
              {onlineUsers.map((user, index) => (
                <li
                  key={index}
                  className="bg-gray-700 px-3 py-2 rounded-md text-sm"
                >
                  {user}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col items-center justify-center mx-auto p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">
          Welcome <span className="text-blue-400">{name}</span> to Room {roomId}
        </h1>

        {/* Messages Display */}
        <div className="w-full h-96 bg-gray-800 rounded-lg p-4 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 my-2 rounded-lg max-w-[75%] w-fit ${
                  msg.sender === "system"
                    ? "text-white text-center mx-auto w-full" // Center system messages
                    : msg.sender === name
                    ? "bg-blue-600 text-white ml-auto" // Align sender's messages to right
                    : "bg-gray-700 text-white mr-auto" // Align received messages to left
                }`}
              >
                {msg.sender !== "system" && <strong>{msg.sender}: </strong>}{" "}
                {msg.text}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No messages yet...</p>
          )}
        </div>

        {/* Message Input */}
        <div className="flex w-full mt-4">
          <input
            type="text"
            placeholder="Enter message"
            ref={msgRef}
            className="flex-1 p-2 rounded-l-md bg-gray-700 text-white border-none focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

