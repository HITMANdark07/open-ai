"use client";
import { Inter } from "@next/font/google";
import { MdWifi } from "react-icons/md";
import { useForm } from "react-hook-form";
import { BsBatteryFull, BsDiscFill } from "react-icons/bs";
import { AiFillAudio, AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { useCurrentTime } from "../hooks/useCurrentTime";
import axios, { AxiosError } from "axios";
import ChatBubble from "@/components/ChatBubble";
import useRecorder from "@/hooks/useRecorder";
import { useEffect, useRef, useState } from "react";
const inter = Inter({ subsets: ["latin"] });

interface SendMessageType {
  message: string;
}
type MessageType = "text" | "image" | "link";
interface MessageInterface {
  message: string;
  created_at: string;
  name: string;
  start: boolean;
  messageType: MessageType;
}

export default function Home() {
  const { time } = useCurrentTime();
  const [loading, setLoading] = useState<boolean>(false);
  let { audioBlob, isRecording, startRecording, stopRecording } = useRecorder();
  const chatScreenRef = useRef<HTMLDivElement | null>(null);
  const { register, handleSubmit, reset } = useForm<SendMessageType>();

  const [messages, setMessages] = useState<MessageInterface[]>([
    {
      name: "AI Bot",
      created_at: new Date().toISOString(),
      message: "What you want me to paint for you",
      start: true,
      messageType: "text",
    },
  ]);

  const messageSubmit = async (formData: SendMessageType) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        name: "Guest User",
        created_at: new Date().toISOString(),
        message: formData.message,
        start: false,
        messageType: "text",
      },
    ]);
    reset();
    try {
      setLoading(true);
      const { data } = await axios({
        method: "POST",
        url: `/api/open-ai`,
        data: {
          message: formData.message,
        },
      });
      const imgUrl = data.data[0].url;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "AI Bot",
          created_at: new Date().toISOString(),
          message: imgUrl,
          start: true,
          messageType: "image",
        },
      ]);
      setLoading(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message);
      }
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    const nodes = chatScreenRef.current?.children;
    const count = chatScreenRef.current?.childElementCount;
    if (nodes && count && nodes[count - 1]) {
      nodes[count - 1].scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const handleAudioClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  useEffect(() => {
    if (audioBlob instanceof Blob) {
      console.log(URL.createObjectURL(audioBlob));
    }
  }, [audioBlob]);
  return (
    <div className="flex justify-center">
      <div className="md:mockup-phone h-screen bg-warning border-primary">
        <div className="camera" />
        <div className="display w-full md:w-[320px] h-screen md:h-[95vh] bg-neutral">
          {/* notification bar */}
          <div className="bg-primary shadow-md z-50 flex flex-row flex-end pt-1 items-center justify-between px-6">
            <div className="font-semibold">{time}</div>
            <div className="flex flex-row items-center gap-2">
              <MdWifi size={20} />
              <BsBatteryFull size={21} />
            </div>
          </div>
          {/* screen */}
          <div className="relative w-full md:h-full ">
            {/* body */}
            <div
              ref={chatScreenRef}
              className="w-full h-[86vh]  md:h-[81vh] justify-end flex-col-reverse overflow-y-scroll scrollbar-none px-2"
            >
              {messages.map(
                ({ name, message, created_at, start, messageType }, _index) => (
                  <ChatBubble
                    key={_index}
                    name={name}
                    start={start}
                    messageType={messageType}
                    created_at={created_at}
                    message={message}
                  />
                )
              )}
            </div>
            {/* footer --- text box --- */}
            <div className="absolute md:bottom-7 h-[10vh] bg-primary w-full left-0 gap-2 items-center z-50 flex flex-row px-2 md:py-2 md:pb-3">
              <form
                onSubmit={handleSubmit(messageSubmit)}
                className="w-full flex flex-row justify-between gap-2 pl-4 rounded-3xl   bg-neutral"
              >
                <input
                  type="text"
                  autoComplete="false"
                  autoCapitalize="false"
                  disabled={loading}
                  {...register("message", {
                    required: true,
                  })}
                  placeholder="Type here"
                  className="border-none disabled:cursor-not-allowed outline-none bg-transparent w-[90%]  flex-1 "
                />
                <button disabled={loading} className=" btn btn-circle">
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    <IoIosSend size={20} />
                  )}
                </button>
              </form>
              {/* <button
                onClick={handleAudioClick}
                className={`btn btn-circle ${
                  isRecording
                    ? "border-2 border-red-500 hover:border-red-500 animate-pulse"
                    : ""
                }`}
              >
                {isRecording ? (
                  <BsDiscFill size={20} className="animate-spin" />
                ) : (
                  <AiFillAudio size={20} />
                )}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
