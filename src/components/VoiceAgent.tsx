"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Phone, MessageSquare, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import avatarImage from "@/assets/images/nicolas-front.png";
import { ShimmeringText } from "@/components/ui/shimmering-text";

interface VoiceAgentProps {
  avatarSrc?: any;
  agentName?: string;
  onChatClick?: () => void;
}

export const VoiceAgent: React.FC<VoiceAgentProps> = ({
  avatarSrc = avatarImage,
  agentName = "Nicolas",
  onChatClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("voiceAgent");

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 2xl:bottom-12 2xl:right-12 z-[60] flex flex-col items-end font-sans">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <div key="collapsed-wrapper" className="relative group">
            {/* Pulsing Background Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -inset-2 2xl:-inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-xl pointer-events-none"
            />

            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={toggleOpen}
              aria-label={t("ariaOpen")}
              className={cn(
                "relative flex items-center gap-4 bg-[#1a1c2e]/80 backdrop-blur-xl border border-white/10 rounded-full p-2 pr-6 shadow-2xl hover:bg-[#252845]/90 transition-all group active:scale-95",
                "2xl:p-3 2xl:pr-6 2xl:gap-3", // Larger padding and gap for 1920px+
              )}
            >
              <div className="relative w-12 h-12 2xl:w-16 2xl:h-16 rounded-full overflow-hidden border-2 border-white/20">
                <Image
                  src={avatarSrc}
                  alt={agentName}
                  fill
                  sizes="(max-width: 768px) 48px, (max-width: 1200px) 48px, 64px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-3 2xl:gap-5">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full bg-white flex items-center justify-center text-black shadow-lg"
                >
                  <Phone className="w-5 h-5 2xl:w-6 2xl:h-6 fill-current" />
                </motion.div>
                <ShimmeringText
                  text={t("startCall")}
                  className="text-white font-bold tracking-tight 2xl:text-2xl"
                />
              </div>
            </motion.button>
          </div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              // Base styles: increased width from 320px to 400px for general desktop use
              "bg-[#0a0c1a] border border-white/10 rounded-[2.5rem] p-8 pb-10 shadow-3xl relative overflow-hidden flex flex-col items-center",
              "w-[400px] max-w-[90vw]",

              // Ultra-wide (1920px+) scaling
              "2xl:w-[600px] 2xl:p-12 2xl:rounded-[4rem]",
            )}
          >
            {/* Close Button - repositioned for wider layout */}
            <button
              onClick={toggleOpen}
              aria-label={t("ariaClose")}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <X className="w-6 h-6 2xl:w-10 2xl:h-10" />
            </button>

            {/* Avatar Section - scaled up for the wider modal */}
            <div className="relative w-40 h-40 2xl:w-60 2xl:h-60 rounded-full mb-8 mt-4 group">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-blue-500 rounded-full blur-2xl"
              />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#1a1c2e] shadow-2xl z-10">
                <Image
                  src={avatarSrc}
                  alt={agentName}
                  fill
                  sizes="(max-width: 768px) 160px, (max-width: 1200px) 160px, 240px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="text-center mb-10 w-full px-4">
              <h3 className="text-white text-3xl 2xl:text-3xl font-semibold mb-2">
                {t("title")}
              </h3>
              <div className="flex items-center justify-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <ShimmeringText
                  text={t("status")}
                  className="text-white/60 text-base 2xl:text-2xl"
                />
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col gap-4 w-full px-2">
              <button className="bg-white text-black rounded-full py-5 px-10 flex items-center justify-center gap-4 font-bold w-full hover:bg-stone-200 transition-all active:scale-95 shadow-lg group">
                <Phone className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" />
                <span className="text-lg 2xl:text-2xl">{t("startCall")}</span>
              </button>

              <button
                onClick={() => {
                  onChatClick?.();
                  setIsOpen(false);
                }}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-5 px-10 flex items-center justify-center gap-4 font-bold w-full transition-all active:scale-95 group"
              >
                <MessageSquare className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                <span className="text-lg 2xl:text-2xl">{t("startChat")}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
