import React from "react";
import { useNavigate } from "react-router-dom"; // <-- use react-router-dom
import {
  ChannelAvatar,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import { ArrowLeft, Video } from "lucide-react";

const CustomChannelHeader = ({ handleVideoCall }) => {
  const navigate = useNavigate();
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const members = Object.values(channel?.state?.members || {});
  const otherMember = members.find(
    (m) => m?.user?.id && m.user.id !== client?.userID
  );
  const otherUser = otherMember?.user;

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // fallback to a route that exists; use replace so we don't pollute history
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-white shadow-sm relative">
      {/* Left side - back + avatar + name */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        {otherUser ? (
          <img
            src={otherUser.image}
            alt={otherUser.name || "avatar"}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <ChannelAvatar channel={channel} size={40} />
        )}

        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {otherUser?.name || channel?.data?.name || "Chat"}
          </span>
          <span className="text-xs text-gray-500">Online</span>
        </div>
      </div>

      {/* Right side - video call button */}
      <button
        onClick={handleVideoCall}
        className="p-2 bg-green-500 hover:bg-green-600 rounded-full text-white transition"
        aria-label="Start video call"
        type="button"
      >
        <Video className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CustomChannelHeader;
