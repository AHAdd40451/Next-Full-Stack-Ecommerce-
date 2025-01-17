'use client';

import React, { useState } from "react";
import { Search, MessageCircle, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const SellerInbox = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [filter, setFilter] = useState("all");

  const chats = [
    {
      id: 1,
      buyerName: "John Doe",
      buyerImage: "https://images.unsplash.com/photo-1519456264917-42d0aa2e0625?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productName: "iPhone 13",
      lastMessage: "Is this still available?",
      timestamp: "10:30 AM",
      unread: true,
      online: true,
      lastSeen: null,
      messages: [
        { 
          id: 1, 
          sender: "buyer", 
          text: "Hi, is this still available?", 
          time: "10:30 AM",
          status: "delivered" 
        },
        { 
          id: 2, 
          sender: "seller", 
          text: "Yes, it is!", 
          time: "10:31 AM",
          status: "read" 
        },
        { 
          id: 3, 
          sender: "buyer", 
          text: "What's the best price you can offer?", 
          time: "10:32 AM",
          status: "delivered" 
        },
      ],
    },
    {
      id: 2,
      buyerName: "Jane Smith",
      buyerImage: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      productName: "MacBook Pro",
      lastMessage: "Can we meet tomorrow?",
      timestamp: "9:45 AM",
      unread: false,
      online: false,
      lastSeen: "2 hours ago",
      messages: [
        { 
          id: 1, 
          sender: "buyer", 
          text: "Hello, I'm interested in your MacBook", 
          time: "9:40 AM",
          status: "read" 
        },
        { 
          id: 2, 
          sender: "seller", 
          text: "Hi Jane, sure! What would you like to know?", 
          time: "9:42 AM",
          status: "read" 
        },
        { 
          id: 3, 
          sender: "buyer", 
          text: "Can we meet tomorrow?", 
          time: "9:45 AM",
          status: "read" 
        },
      ],
    },
  ];

  const MessageStatus = ({ status }) => {
    if (status === "sent") return <CheckCircle className="h-3 w-3 text-gray-400" />;
    if (status === "delivered") return <div className="flex"><CheckCircle className="h-3 w-3 text-gray-400" /><CheckCircle className="h-3 w-3 -ml-1 text-gray-400" /></div>;
    if (status === "read") return <div className="flex"><CheckCircle className="h-3 w-3 text-white" /><CheckCircle className="h-3 w-3 -ml-1 text-white" /></div>;
    return null;
  };

  const OnlineStatus = ({ isOnline, lastSeen }) => {
    return (
      <div className="flex items-center text-xs">
        {isOnline ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-green-500"
          >
            <span className="h-2 w-2 bg-green-500 rounded-full mr-1" />
            Online
          </motion.div>
        ) : (
          <span className="text-gray-500">Last seen {lastSeen}</span>
        )}
      </div>
    );
  };

  const filteredChats = filter === "unread" ? chats.filter((chat) => chat.unread) : chats;

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex h-[90vh] bg-gray-100">
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2 border rounded-lg pl-10"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>

          <div className="flex gap-2 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === "all" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              All Chats
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === "unread" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              Unread
            </motion.button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-180px)]">
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <Image
                    src={chat.buyerImage}
                    alt={chat.buyerName}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                  {chat.online && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{chat.buyerName}</h3>
                      <p className="text-sm text-gray-500">{chat.productName}</p>
                      <p className="text-sm text-gray-600 mt-1">{chat.lastMessage}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      {chat.unread && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-secondary text-white text-xs rounded-full px-2 py-1 mt-1"
                        >
                          New
                        </motion.span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {selectedChat ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="p-4 border-b bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={selectedChat.buyerImage}
                        alt={selectedChat.buyerName}
                        className="w-12 h-12 rounded-full object-cover"
                        width={48}
                        height={48}
                      />
                      {selectedChat.online && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
                        />
                      )}
                    </div>
                    <div>
                      <h2 className="font-medium">{selectedChat.buyerName}</h2>
                      <OnlineStatus isOnline={selectedChat.online} lastSeen={selectedChat.lastSeen} />
                      <p className="text-sm text-gray-500">{selectedChat.productName}</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseChat}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {selectedChat.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex mb-4 items-start gap-2 ${
                      message.sender === "seller" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Image
                      src={message.sender === "buyer" ? selectedChat.buyerImage : "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                      alt={message.sender === "buyer" ? selectedChat.buyerName : "You"}
                      className="w-10 h-10 rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === "seller" ? "bg-secondary text-white" : "bg-white text-gray-800"
                      }`}
                    >
                      <p>{message.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs opacity-75">{message.time}</span>
                        {message.sender === "seller" && <MessageStatus status={message.status} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary_hover"
                  >
                    Send
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center bg-primary"
            >
              <div className="text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg">Select a chat to view conversation</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellerInbox;