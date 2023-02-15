import { format } from "date-fns";
import { useEffect } from "react";

interface ChatBubbbleProps {
  name: string;
  created_at: string;
  message: string;
  start?: boolean;
}

const ChatBubble = ({
  name,
  created_at,
  message,
  start = false,
}: ChatBubbbleProps) => {
  return (
    <div className="flex w-full">
      <div className={`chat w-full ${start ? "chat-start" : "chat-end"}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            {start ? (
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            ) : (
              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png" />
            )}
          </div>
        </div>
        <div className="chat-header text-gray-200 truncate">{name}</div>
        <div className="chat-bubble bg-primary">{message}</div>
        <div className="chat-footer opacity-50">
          <time className="text-xs px-1 text-gray-300">
            {format(new Date(created_at), "hh:mm")}
          </time>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
