"use client";
import { Inter } from "@next/font/google";
import { MdWifi } from "react-icons/md";
import { useForm } from "react-hook-form";
import { BsBatteryFull, BsDiscFill } from "react-icons/bs";
import { AiFillAudio } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { useCurrentTime } from "../hooks/useCurrentTime";
import axios from "axios";
import ChatBubble from "@/components/ChatBubble";
import useRecorder from "@/hooks/useRecorder";
import { useEffect, useRef, useState } from "react";
const inter = Inter({ subsets: ["latin"] });

interface SendMessageType {
  message: string;
}

interface MessageType {
  message: string;
  created_at: string;
  name: string;
  start: boolean;
}

export default function Home() {
  // const { time } = useTime();
  const { time } = useCurrentTime();
  let { audioBlob, isRecording, startRecording, stopRecording } = useRecorder();
  const chatScreenRef = useRef<HTMLDivElement | null>(null);
  const { register, handleSubmit, reset } = useForm<SendMessageType>();

  const [messages, setMessages] = useState<MessageType[]>([]);

  const messageSubmit = async (formData: SendMessageType) => {
    console.log(formData);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        name: "Guest User",
        created_at: new Date().toISOString(),
        message: formData.message,
        start: false,
      },
    ]);

    reset();
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
    <div className="flex justify-center pt-8">
      <div className="mockup-phone border-primary">
        <div className="camera" />
        <div className="display w-[320px] h-[90vh] bg-neutral">
          {/* notification bar */}
          <div className="bg-primary shadow-md z-50 flex flex-row flex-end pt-1 items-center justify-between px-6">
            <div className="font-semibold">{time}</div>
            <div className="flex flex-row items-center gap-2">
              <MdWifi size={20} />
              <BsBatteryFull size={21} />
            </div>
          </div>
          {/* screen */}
          <div className="relative w-full h-full ">
            {/* body */}
            <div
              ref={chatScreenRef}
              className="w-full  h-[76vh] justify-end flex-col-reverse overflow-y-scroll scrollbar-none px-2"
            >
              {messages.map(({ name, message, created_at, start }, _index) => (
                <ChatBubble
                  key={_index}
                  name={name}
                  start={start}
                  created_at={created_at}
                  message={message}
                />
              ))}
            </div>
            {/* footer --- text box --- */}
            <div className="absolute bottom-7 h-[10vh] bg-primary w-full left-0 gap-2 items-center z-50 flex flex-row px-2 py-2 pb-3">
              <form
                onSubmit={handleSubmit(messageSubmit)}
                className="w-full flex flex-row justify-between gap-2 pl-4 rounded-3xl   bg-neutral"
              >
                <input
                  type="text"
                  autoComplete="false"
                  disabled
                  autoCapitalize="false"
                  {...register("message", {
                    required: true,
                  })}
                  placeholder="Type here"
                  className="border-none disabled:cursor-not-allowed outline-none bg-transparent w-[90%]  flex-1 "
                />
                <button className=" btn btn-circle">
                  <IoIosSend size={20} />
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
