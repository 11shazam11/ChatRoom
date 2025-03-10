import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const nameRef = useRef();
  const roomIdRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const roomId = roomIdRef.current.value.trim();

    if (!name || !roomId) return;

    navigate(`/chat/${name}/${roomId}`);
    nameRef.current.value = "";
    roomIdRef.current.value = "";
  }

  return (
    <div className="flex justify-center items-center h-100vh w-100vw bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-white text-xl font-semibold mb-4 text-center">
          Join a Chat Room
        </h2>
        <p>Tell your friend to enter the same room Id</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter name"
            ref={nameRef}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter room ID"
            ref={roomIdRef}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
