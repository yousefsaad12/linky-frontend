"use client";

import { useState, useEffect } from "react";

interface DocsScrollProviderProps {
  sections: string[];
  children: React.ReactNode;
}

export function DocsScrollProvider({ sections, children }: DocsScrollProviderProps) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <DocsScrollContext.Provider value={{ activeSection, scrollToSection }}>
      {children}
    </DocsScrollContext.Provider>
  );
}

import { createContext, useContext } from "react";

interface DocsScrollContextValue {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

const DocsScrollContext = createContext<DocsScrollContextValue | undefined>(undefined);

export function useDocsScrollContext() {
  const context = useContext(DocsScrollContext);
  if (!context) {
    throw new Error("useDocsScrollContext must be used within DocsScrollProvider");
  }
  return context;
}
