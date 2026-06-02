"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface IntroContextType {
  isIntroComplete: boolean;
  setIntroComplete: () => void;
}

const IntroContext = createContext<IntroContextType>({
  isIntroComplete: true, // Default to true so components work normally without the provider
  setIntroComplete: () => {},
});

export const IntroProvider = ({ children }: { children: ReactNode }) => {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  const setIntroComplete = () => setIsIntroComplete(true);

  return (
    <IntroContext.Provider value={{ isIntroComplete, setIntroComplete }}>
      {children}
    </IntroContext.Provider>
  );
};

export const useIntro = () => useContext(IntroContext);
