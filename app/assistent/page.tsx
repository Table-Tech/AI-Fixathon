"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UserProfile {
  number_of_children?: number;
  children_ages?: number[];
  is_single_parent?: boolean;
  income_range?: string;
  employment_status?: string;
  housing_type?: string;
  monthly_rent?: number;
  has_debts?: boolean;
  has_dutch_residence?: boolean;
  has_health_insurance?: boolean;
  savings_under_limit?: boolean;
}

const INITIAL_MESSAGE: Message = {
  id: "1",
  role: "assistant",
  content:
    "Hoi! Ik ben je persoonlijke hulpwijzer. Ik help je ontdekken welke toeslagen en regelingen er voor jou zijn.\n\nVertel eens, wat is je situatie? Ben je bijvoorbeeld alleenstaand, heb je kinderen, of werk je?",
};

const FALLBACK_RESPONSE = "Sorry, er ging iets mis. Probeer het nog eens of typ je vraag opnieuw.";

export default function AssistentPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Fetch user profile for personalized context
  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        console.log("=== PROFILE LOAD: No user logged in ===");
        return;
      }

      console.log("=== PROFILE LOAD: Fetching profile for user:", user.id, "===");

      const { data, error } = await supabase
        .from("profiles")
        .select("number_of_children, children_ages, is_single_parent, income_range, employment_status, housing_type, monthly_rent, has_debts, has_dutch_residence, has_health_insurance, savings_under_limit")
        .eq("id", user.id)
        .single();

      console.log("=== PROFILE LOAD RESULT ===");
      console.log("Data:", data);
      console.log("Error:", error);
      console.log("===========================");

      if (data) {
        // Only include non-PII fields for personalization
        const profile = {
          number_of_children: data.number_of_children,
          children_ages: data.children_ages,
          is_single_parent: data.is_single_parent,
          income_range: data.income_range,
          employment_status: data.employment_status,
          housing_type: data.housing_type,
          monthly_rent: data.monthly_rent,
          has_debts: data.has_debts,
          has_dutch_residence: data.has_dutch_residence,
          has_health_insurance: data.has_health_insurance,
          savings_under_limit: data.savings_under_limit,
        };
        console.log("=== PROFILE SET:", profile, "===");
        setUserProfile(profile);
      }
    }

    loadProfile();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/stt", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { text } = await response.json();
        if (text) {
          setInputValue(text);
        }
      } else {
        console.error("STT failed");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
    };

    // Add user message and clear input
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      // Build conversation history (exclude initial message for cleaner context)
      const conversationHistory = updatedMessages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Call AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText.trim(),
          conversation_history: conversationHistory,
          user_profile: userProfile || {},
        }),
      });

      let aiResponseText = FALLBACK_RESPONSE;

      if (response.ok) {
        const data = await response.json();
        aiResponseText = data.response || FALLBACK_RESPONSE;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Chat API error:", response.status, errorData);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponseText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      // Auto-speak the response if enabled
      if (autoSpeak) {
        speakText(assistantMessage.content);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: FALLBACK_RESPONSE,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusText = () => {
    if (isProcessing) return "Verwerken...";
    if (isRecording) return "Luisteren...";
    if (isTyping) return "Aan het typen...";
    if (isSpeaking) return "Aan het spreken...";
    return "Online";
  };

  return (
    <div className="flex flex-col h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-[var(--muted)] transition-colors"
              aria-label="Terug"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold">Hulpwijzer Assistent</h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {getStatusText()}
              </p>
            </div>
          </div>
          {/* Auto-speak toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              autoSpeak
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--muted)] text-[var(--muted-foreground)]"
            }`}
            title={autoSpeak ? "Geluid aan" : "Geluid uit"}
          >
            {autoSpeak ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center mr-2 flex-shrink-0 shadow-md shadow-purple-500/20">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[var(--primary)] text-white rounded-br-md"
                    : "bg-[var(--muted)] rounded-bl-md"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center mr-2 shrink-0 shadow-md shadow-purple-500/20 animate-pulse">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="bg-[var(--muted)] rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 pb-2 pt-3 border-t border-[var(--border)] bg-[var(--background)]">
        <div className="flex gap-3 items-center max-w-3xl mx-auto">
          {/* Mic button */}
          <button
            onClick={toggleRecording}
            disabled={isTyping || isProcessing || isSpeaking}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Stop speaking button */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-orange-500 text-white animate-pulse cursor-pointer flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
          )}

          {/* Text input */}
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? "Luisteren..." : isProcessing ? "Verwerken..." : "Typ je bericht..."}
              className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm leading-6"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
              disabled={isRecording || isProcessing}
            />
          </div>

          {/* Send button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
            className="w-11 h-11 rounded-full bg-[var(--primary)] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
