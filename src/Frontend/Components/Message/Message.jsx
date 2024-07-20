import React, { useState } from "react";
import moment from "moment";

const Message = ({ message, userData, isFirstMessageFromUser, msgusrData }) => {

  const [messageData, setMessageData] = useState(null)
  const headers = {
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${token}`
  };

  const formatTimestamp = (timestamp) => {
    const nowMoment = moment();
    const inputDate = moment(timestamp);

    if (inputDate.isSame(nowMoment, "day")) {
      return `Today at ${inputDate.format("h:mm A")}`;
    } else if (inputDate.isSame(nowMoment.clone().subtract(1, "day"), "day")) {
      return `Yesterday at ${inputDate.format("h:mm A")}`;
    } else {
      return inputDate.format("MMMM Do YYYY, h:mm A");
    }
  };

  const getMessageUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/getmsguser`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          channelId: message.userId
        }),
      })

      const MessageData = await response.json();
      setMessageData(MessageData);
    } catch (err) {
      console.log("Error Fetching Message: ", err)
    }
  }

  return (
    <div
      key={message._id}
      className={`w-full flex z-30 justify-between ${
        !isFirstMessageFromUser ? "mt-1" : "mt-4"
      }`}
    >
      {!isFirstMessageFromUser ? (
        <div className="flex items-center pl-[4.82rem]">
          <h1 className="font-pop text-[#d1d0ce] leading-5">
            {message.message}
          </h1>
        </div>
      ) : (
        <div className="flex items-center pl-4">
          <div className={`relative rounded-full flex items-center justify-center bg-[${msgusrData.color}] h-[2.85rem] w-[2.85rem] i unselectable`}>
            {msgusrData.avatar ? (
              <img src={`${msgusrData.avatar}`} alt="" className="rounded-full" />
            ) : (
              <img src="/log.png" alt="" className="w-[80%]" />
            )}
          </div>

          <div className="ml-4">
            <div className="flex items-center">
              <h1 className="mr-2 font-inter font-[530] text-[#e1e1e1] text-lg leading-6">
                {msgusrData.username}
              </h1>

              <p className="font-pop font-light text-sm opacity-25 leading-3">
                {formatTimestamp(message.timestamp)}
              </p>
            </div>

            <h1 className="font-pop text-[#d1d0ce] leading-6">
              {message.message}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
