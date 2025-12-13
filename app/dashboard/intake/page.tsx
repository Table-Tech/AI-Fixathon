"use client";

import { Button, Card, CardContent, Progress } from "@/components/ui";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: "1",
  role: "assistant",
  content:
    "Hallo Maria! Fijn dat je je profiel wilt bijwerken. Ik ga je een paar vragen stellen om je situatie beter te begrijpen.\n\nIs er iets veranderd in je woonsituatie, werk of gezin sinds de laatste keer?",
};

const MOCK_RESPONSES = [
  "Bedankt voor de update! Dat is belangrijke informatie.\n\nHeb je onlangs nog wijzigingen gehad in je inkomen? Bijvoorbeeld een loonsverhoging, minder uren gaan werken, of een andere baan?",
  "Goed om te weten. Op basis van deze nieuwe informatie ga ik kijken of er andere regelingen zijn die nu beter bij je situatie passen.\n\nNog één vraag: Zijn er veranderingen in de situatie van je kinderen? Bijvoorbeeld schoolkeuze, kinderopvang, of bijzondere zorgbehoeften?",
  "Perfect, ik heb je profiel bijgewerkt met alle nieuwe informatie!\n\nIk zie dat je door deze wijzigingen mogelijk in aanmerking komt voor een hogere huurtoeslag. Wil je dat ik dit voor je nakijk?",
];

export default function DashboardIntakePage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: MOCK_RESPONSES[responseIndex % MOCK_RESPONSES.length],
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setResponseIndex((prev) => prev + 1);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const progress = Math.min((responseIndex / 3) * 100, 100);

  return (
    <div className="h-[calc(100vh-4rem-4rem)] lg:h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--background)] border-b border-[var(--border)] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Profiel bijwerken</h1>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Terug naar dashboard
              </Button>
            </Link>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[var(--muted-foreground)]">Voortgang</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[var(--primary)] text-white rounded-br-md"
                    : "bg-[var(--background)] border border-[var(--border)] rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-[var(--background)] border-t border-[var(--border)] p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Typ je antwoord..."
            className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            rows={1}
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
          <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Completion modal */}
      {progress >= 100 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Profiel bijgewerkt!</h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                Je profiel is succesvol bijgewerkt. We hebben je matches opnieuw berekend.
              </p>
              <div className="space-y-3">
                <Link href="/dashboard/matches" className="block">
                  <Button className="w-full">Bekijk nieuwe matches</Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    Terug naar dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
