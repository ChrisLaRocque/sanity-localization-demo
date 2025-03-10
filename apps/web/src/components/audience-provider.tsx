"use client";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type Audience = "retail" | "professional" | null;

interface AudienceContextProps {
  audience: Audience;
  setAudience: (audience: Audience) => void;
}

const AudienceContext = createContext<AudienceContextProps | undefined>(
  undefined,
);

export const AudienceProvider = ({ children }: { children: ReactNode }) => {
  const [audience, setAudience] = useState<Audience>(null);

  return (
    <AudienceContext.Provider value={{ audience, setAudience }}>
      {children}
    </AudienceContext.Provider>
  );
};

export const useAudience = (): AudienceContextProps => {
  const context = useContext(AudienceContext);
  if (!context) {
    throw new Error("useAudience must be used within an AudienceProvider");
  }
  return context;
};
