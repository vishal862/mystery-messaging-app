"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";

function Page() {
  const { toast } = useToast();
  const [userMessage, setUserMessage] = useState("");
  const { username } = useParams();

  const handleSubmit = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-messages", {
        username: username,
        content: userMessage,
      });
      toast({
        title: "Message Sent",
        description: "Your message was sent successfully!",
      });
      setUserMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send the message.",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">
          Public Profile: <span className="text-blue-400">{username}</span>
        </h1>
        <Input
          className="w-full p-2 text-black rounded-md mb-4"
          onChange={(e) => setUserMessage(e.target.value)}
          value={userMessage}
          placeholder="Enter your message..."
        />
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
          onClick={handleSubmit}
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default Page;
