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
    "Hallo! Ik ben je digitale hulpwijzer. Ik ga je helpen om te ontdekken welke financiële regelingen er voor jou beschikbaar zijn.\n\nOm te beginnen, kun je me wat vertellen over jezelf? Bijvoorbeeld:\n- Ben je alleenstaand of heb je een partner?\n- Heb je kinderen? Zo ja, hoe oud zijn ze?\n- Wat is je woonsituatie (huur of koop)?",
};

const MOCK_RESPONSES = [
  "Bedankt voor die informatie! Dat helpt me al een stuk verder.\n\nKun je me ook vertellen of je op dit moment werkt? Zo ja, hoeveel uur per week ongeveer? En zo nee, ontvang je een uitkering?",
  "Duidelijk! Op basis van wat je me vertelt, zie ik al een aantal regelingen die mogelijk interessant voor je zijn.\n\nNog een paar vragen: Wat is ongeveer je maandelijkse inkomen (netto)? En betaal je huur of heb je een koopwoning?",
  "Bedankt! Ik heb nu genoeg informatie om een eerste inschatting te maken.\n\nOp basis van je situatie kom je mogelijk in aanmerking voor:\n- Zorgtoeslag\n- Huurtoeslag\n- Kindgebonden budget\n\nWil je dat ik deze matches voor je bewaar zodat je ze later kunt bekijken? Dan stuur ik je een link om in te loggen.",
];

export default function IntakePage() {
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

    // Simulate AI response delay
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
    <div className="min-h-screen flex flex-col bg-[var(--muted)]">
      {/* Header */}
      <header className="bg-[var(--background)] border-b border-[var(--border)] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HW</span>
              </div>
              <span className="text-xl font-bold hidden sm:inline">Hulpwijzer</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                Sluiten
              </Button>
            </Link>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[var(--muted-foreground)]">
                Intake voortgang
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

          {/* Input area */}
          <div className="p-4 bg-[var(--background)] border-t border-[var(--border)]">
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Typ je antwoord..."
                className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                rows={1}
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="px-4"
              >
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
            <p className="mt-2 text-xs text-center text-[var(--muted-foreground)]">
              Je gegevens worden veilig opgeslagen en nooit gedeeld zonder je toestemming.
            </p>
          </div>
        </div>
      </main>

      {/* Completed state - show when progress is 100% */}
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
              <h2 className="text-2xl font-bold mb-2">Intake voltooid!</h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                We hebben genoeg informatie om je matches te tonen. Maak een
                account aan om je resultaten te bekijken en op te slaan.
              </p>
              <div className="space-y-3">
                <Link href="/login" className="block">
                  <Button className="w-full">Bekijk mijn matches</Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full">
                    Later verder gaan
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
