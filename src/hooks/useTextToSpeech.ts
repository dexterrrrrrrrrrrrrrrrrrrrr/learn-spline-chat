import { useState, useCallback, useRef, useEffect } from "react";

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, messageId: string) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // If clicking the same message that's speaking, just stop
    if (currentMessageId === messageId && isSpeaking) {
      setIsSpeaking(false);
      setCurrentMessageId(null);
      return;
    }

    // Clean text for better speech (remove emojis, markdown, etc.)
    const cleanText = text
      .replace(/[*_~`#]/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/:\w+:/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    // Try to get an Indian English female teacher-like voice
    const voices = window.speechSynthesis.getVoices();
    const preferredIndianFemaleNames = [
      "Google UK English Female",
      "Google Indian English Female",
      "Microsoft Heera - English (India)",
      "Microsoft Neerja - English (India)",
      "Microsoft Aditi - English (India)",
      "Microsoft Koyal - English (India)",
    ].map((name) => name.toLowerCase());

    const preferredVoice =
      voices.find(
        (v) =>
          v.lang === "en-IN" &&
          preferredIndianFemaleNames.includes(v.name.toLowerCase())
      ) ||
      voices.find((v) => v.lang === "en-IN") ||
      voices.find(
        (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")
      ) ||
      voices.find((v) => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentMessageId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentMessageId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentMessageId(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [currentMessageId, isSpeaking]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentMessageId(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { speak, stop, isSpeaking, currentMessageId };
}
