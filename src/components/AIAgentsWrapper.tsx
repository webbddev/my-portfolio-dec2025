"use client";

import React, { useState } from "react";
import { VoiceAgent } from "./VoiceAgent";
import RAGChatBot from "./RAGChatBot";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const AIAgentsWrapper = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Voice Agent is always visible in its collapsed state */}
      <VoiceAgent onChatClick={() => setIsChatOpen(true)} />

      {/* RAG Chatbot Modal/Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed bottom-6 right-6 z-[70] w-full shadow-2xl transition-all duration-300 ease-in-out",
              isExpanded 
                ? "max-w-[90vw] h-[85vh] 2xl:max-w-[1300px] bottom-4 right-4" 
                : "w-[90vw] max-w-[450px] h-[700px] 2xl:max-w-[500px] 2xl:bottom-12 2xl:right-12"
            )}
          >
            <RAGChatBot 
              isExpanded={isExpanded} 
              onToggleExpand={() => setIsExpanded(!isExpanded)}
              onClose={() => setIsChatOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
