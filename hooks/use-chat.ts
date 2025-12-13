"use client";

import { useState, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseChatOptions {
  initialMessages?: Message[];
  onComplete?: () => void;
}

// Mock responses for demo - will be replaced with AI API calls
const MOCK_RESPONSES = [
  "Bedankt voor die informatie! Dat helpt me al een stuk verder.\n\nKun je me ook vertellen of je op dit moment werkt? Zo ja, hoeveel uur per week ongeveer? En zo nee, ontvang je een uitkering?",
  "Duidelijk! Op basis van wat je me vertelt, zie ik al een aantal regelingen die mogelijk interessant voor je zijn.\n\nNog een paar vragen: Wat is ongeveer je maandelijkse inkomen (netto)? En betaal je huur of heb je een koopwoning?",
  "Bedankt! Ik heb nu genoeg informatie om een eerste inschatting te maken.\n\nOp basis van je situatie kom je mogelijk in aanmerking voor:\n- Zorgtoeslag\n- Huurtoeslag\n- Kindgebonden budget\n\nWil je dat ik deze matches voor je bewaar zodat je ze later kunt bekijken?",
];

export function useChat(options: UseChatOptions = {}) {
  const { initialMessages = [], onComplete } = options;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setError(null);

      try {
        // Simulate AI response delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Add assistant response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: MOCK_RESPONSES[responseIndex % MOCK_RESPONSES.length],
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setResponseIndex((prev) => prev + 1);

        // Check if conversation is complete
        if (responseIndex >= MOCK_RESPONSES.length - 1 && onComplete) {
          onComplete();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to send message"));
      } finally {
        setIsTyping(false);
      }
    },
    [responseIndex, onComplete]
  );

  const clearMessages = useCallback(() => {
    setMessages(initialMessages);
    setResponseIndex(0);
    setError(null);
  }, [initialMessages]);

  const progress = Math.min((responseIndex / MOCK_RESPONSES.length) * 100, 100);

  return {
    messages,
    isTyping,
    error,
    progress,
    sendMessage,
    clearMessages,
  };
}
