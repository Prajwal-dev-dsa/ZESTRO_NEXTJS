"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Send,
    MessageCircle,
    User,
    Minimize2,
    Loader2
} from "lucide-react";
import { initSocket } from "@/lib/socket.io";
import axios from "axios";

interface Message {
    _id?: string;
    text: string;
    senderId: string;
    time: string;
}

interface DeliveryChatProps {
    orderId: string;
    currentUserId: string; // The ID of the logged-in person (User or DeliveryBoy)
    otherPartyName: string; // Name to display in header
}

export default function DeliveryChat({ orderId, currentUserId, otherPartyName }: DeliveryChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<any>(null);

    // 1. Initialize Socket & Load History
    useEffect(() => {
        if (!isOpen) return;

        setLoading(true);
        socketRef.current = initSocket();

        // A. Join Room
        socketRef.current.emit("join-chat-room", orderId);

        // B. Listen for messages
        const handleReceiveMessage = (newMessage: Message) => {
            setMessages((prev) => {
                return [...prev, newMessage];
            });
            scrollToBottom();
        };

        socketRef.current.on("receive-message", handleReceiveMessage);

        // C. Fetch History
        const fetchHistory = async () => {
            try {
                const res = await axios.post(`/api/chat/get-particular-room-messages`, {
                    roomId: orderId,
                });
                console.log("Chat history fetched:", res.data.length);
                setMessages(res.data);
                scrollToBottom();
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();

        return () => {
            socketRef.current.off("receive-message", handleReceiveMessage);
        };
    }, [isOpen, orderId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            text: inputText,
            senderId: currentUserId,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setInputText("");

        if (socketRef.current) {
            socketRef.current.emit("send-message", {
                roomId: orderId,
                text: newMessage.text,
                senderId: currentUserId,
                time: newMessage.time
            });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <>
            {/* --- Floating Button --- */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-500 w-14 h-14 bg-linear-to-tr from-blue-600 to-blue-500 rounded-full shadow-lg shadow-blue-300 flex items-center justify-center text-white cursor-pointer"
                    >
                        <div className="relative">
                            <MessageCircle className="w-7 h-7" />
                            {/* Dot only if unread? For now just static */}
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* --- Chat Window --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[380px] h-[85vh] md:h-[600px] z-500 flex flex-col bg-white md:rounded-3xl rounded-t-3xl shadow-2xl border border-gray-100 overflow-hidden font-sans"
                    >
                        {/* Header */}
                        <div className="bg-linear-to-r from-blue-600 to-blue-500 p-4 flex items-center justify-between text-white shrink-0 shadow-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight">{otherPartyName}</h3>
                                    <p className="text-[10px] text-blue-100 font-medium tracking-wide">
                                        Order #{orderId.slice(-6)}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors">
                                <Minimize2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3">
                            {loading && (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                                </div>
                            )}

                            <div className="flex justify-center mb-2">
                                <span className="bg-yellow-50 text-yellow-700 text-[10px] px-3 py-1 rounded-full border border-yellow-100 font-medium">
                                    Messages are encrypted
                                </span>
                            </div>

                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === currentUserId;
                                const isSystem = msg.senderId === "system";

                                if (isSystem) {
                                    return (
                                        <div key={index} className="flex justify-center my-2">
                                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">{msg.text}</span>
                                        </div>
                                    )
                                }

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex flex-col max-w-[80%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                                    >
                                        <div
                                            className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm relative ${isMe
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-white text-slate-700 border border-gray-100 rounded-tl-none"
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 px-1 opacity-70">
                                            {msg.time}
                                        </span>
                                    </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message..."
                                className="flex-1 bg-slate-100 text-slate-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
                            />
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSend}
                                className={`p-3 rounded-xl flex items-center justify-center transition-all ${inputText.trim()
                                    ? "bg-blue-600 text-white shadow-md cursor-pointer shadow-blue-200"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                                disabled={!inputText.trim()}
                            >
                                <Send className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}