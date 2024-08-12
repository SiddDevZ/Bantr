import React from "react";
import "./TextBar.css";
import { useState, useEffect, useRef } from "react";
import "remixicon/fonts/remixicon.css";
import EmojiPicker from "emoji-picker-react";
import config from '../../../../config.json'

const headers = {
  "Content-Type": "application/json",
  // "Authorization": `Bearer ${token}`
};

const TextBar = ({ channel, userData, channelData, setMessages }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        _id: Date.now().toString(),
        message: message,
        username: userData.username,
        userId: userData._id,
        channelId: channelData.channelId,
        timestamp: new Date().toISOString()
      };
      setMessage("");
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log("Message sent: ", message);

      const response = await fetch(`${config.url}/sendmessage`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: userData._id,
          userName: userData.username,
          channelId: channelData.channelId,
          message: message})
        });

      // await refreshMessages();
      return response;
    };
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    // console.log('emoji: ', emojiObject);
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    console.log('current state:', showEmojiPicker);
    setShowEmojiPicker((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !emojiPickerRef.current?.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="h-[3.75rem] w-full z-50 flex items-start justify-center">
      <div className="h-[calc(100%-0.45rem)] w-[calc(100%-1.5rem)] flex items-center bg-[#282824] rounded-sm">
        <button className="w-[3.79rem]">
          <i className="ri-add-large-fill text-white text-2xl font-semibold opacity-65 hover:opacity-95 transition-all duration-200"></i>
        </button>
        <div className="bg-white w-[1px] h-[58%] opacity-25"></div>
        <input
          type="text"
          placeholder={`Message #${channel}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-white placeholder-white placeholder:opacity-35 text-lg px-4 py-2 w-full focus:outline-none"
        />
        <div className="relative flex items-center">
          <button className="w-12 h-full" onClick={toggleEmojiPicker}>
            <img
              src="/happy.png"
              alt=""
              className="w-[1.8rem] rounded-full brightness-0 invert opacity-60 hover:opacity-85 transition-all duration-200"
            />
          </button>
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full right-0 mb-2 z-50"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="dark"
                emojiStyle="native"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextBar;
