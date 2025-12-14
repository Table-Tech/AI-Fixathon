import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message: string;
  conversation_history?: ChatMessage[];
  user_profile?: Record<string, unknown>;
}

// Strip PII from message
function stripPII(text: string): string {
  let cleaned = text;

  // Remove Dutch BSN numbers (9 digits, often formatted as XXX.XX.XXX or XXXXXXXXX)
  cleaned = cleaned.replace(/\b\d{3}[.\s]?\d{2}[.\s]?\d{3}\b/g, "[BSN VERWIJDERD]");

  // Remove phone numbers (Dutch formats)
  cleaned = cleaned.replace(/\b(0|\+31|0031)[\s.-]?[1-9][\s.-]?\d{1,2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b/g, "[TELEFOON VERWIJDERD]");
  cleaned = cleaned.replace(/\b06[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b/g, "[TELEFOON VERWIJDERD]");

  // Remove email addresses
  cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL VERWIJDERD]");

  // Remove Dutch postal codes (1234 AB format)
  cleaned = cleaned.replace(/\b\d{4}\s?[A-Za-z]{2}\b/g, "[POSTCODE VERWIJDERD]");

  // Remove IBAN numbers
  cleaned = cleaned.replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/gi, "[IBAN VERWIJDERD]");

  return cleaned;
}

// Build user context string from profile (non-PII only)
function buildUserContext(profile: Record<string, unknown>): string {
  const parts: string[] = [];

  if (profile.is_single_parent) {
    parts.push("alleenstaande ouder");
  }

  if (profile.number_of_children && Number(profile.number_of_children) > 0) {
    const childCount = Number(profile.number_of_children);
    parts.push(`${childCount} ${childCount === 1 ? "kind" : "kinderen"}`);

    if (Array.isArray(profile.children_ages) && profile.children_ages.length > 0) {
      const ages = profile.children_ages.filter((a: unknown) => typeof a === "number" && a > 0);
      if (ages.length > 0) {
        parts.push(`leeftijden: ${ages.join(", ")} jaar`);
      }
    }
  }

  if (profile.income_range) {
    const incomeMap: Record<string, string> = {
      low: "laag inkomen",
      middle: "middeninkomen",
      high: "hoog inkomen",
    };
    const incomeText = incomeMap[String(profile.income_range)];
    if (incomeText) parts.push(incomeText);
  }

  if (profile.employment_status) {
    const statusMap: Record<string, string> = {
      employed: "in loondienst",
      self_employed: "zelfstandige",
      unemployed: "werkloos",
      student: "student",
      retired: "gepensioneerd",
    };
    const statusText = statusMap[String(profile.employment_status)];
    if (statusText) parts.push(statusText);
  }

  if (profile.housing_type === "rent") {
    parts.push("huurt");
    if (profile.monthly_rent && Number(profile.monthly_rent) > 0) {
      parts.push(`huur €${profile.monthly_rent}/maand`);
    }
  } else if (profile.housing_type === "own") {
    parts.push("koopwoning");
  }

  if (profile.has_debts) {
    parts.push("heeft schulden");
  }

  if (profile.has_dutch_residence === false) {
    parts.push("geen verblijfsvergunning");
  }

  if (profile.has_health_insurance === false) {
    parts.push("geen zorgverzekering");
  }

  return parts.length > 0 ? parts.join(", ") : "";
}

// Instructions for the assistant (prepended to first message since GreenPT doesn't support system prompts)
const ASSISTANT_INSTRUCTIONS = `Je bent Hulpwijzer, een vriendelijke assistent voor alleenstaande moeders in Nederland. Spreek simpel Nederlands (B1), wees warm en geduldig. Help met toeslagen: huurtoeslag, zorgtoeslag, kinderbijslag, kindgebonden budget, kinderopvangtoeslag, bijzondere bijstand. Geef GEEN juridisch advies. Houd antwoorden kort (max 3-4 zinnen). Als je informatie mist om goed te kunnen helpen (zoals gezinssituatie, inkomen, of woonsituatie), vraag dan vriendelijk naar wat je nodig hebt.`;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, conversation_history = [], user_profile = {} } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const apiKey = process.env.GREENPT_API_KEY;
    const apiUrl = process.env.GREENPT_API_URL || "https://api.greenpt.ai/v1/chat/completions";

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI API key not configured" },
        { status: 500 }
      );
    }

    // Strip PII from the user message
    const cleanedMessage = stripPII(message);

    // Build user context from profile (for personalized responses)
    const userContext = buildUserContext(user_profile);

    // GreenPT doesn't support system messages, so we use a roleplay-style approach
    // First, add a "setup" exchange that establishes the AI's role and user's context
    const isFirstMessage = conversation_history.length === 0;

    const messages: ChatMessage[] = [];

    if (isFirstMessage) {
      // Setup message: tell AI who it is and who the user is
      let setupPrompt = `Jij bent Hulpwijzer, een vriendelijke assistent die alleenstaande moeders in Nederland helpt met toeslagen en regelingen. Spreek simpel Nederlands. Houd antwoorden kort (2-3 zinnen).`;

      if (userContext) {
        setupPrompt += `\n\nDeze gebruiker is: ${userContext}. Begin je antwoord met het bevestigen dat je deze situatie kent, bijvoorbeeld: "Ik zie dat je..." en geef dan direct relevant advies.`;
      }

      setupPrompt += `\n\nDe gebruiker vraagt: ${cleanedMessage}`;

      messages.push({ role: "user", content: setupPrompt });
    } else {
      // For follow-up messages, include history and add context reminder
      for (const m of conversation_history) {
        messages.push({
          role: m.role as "user" | "assistant",
          content: stripPII(m.content),
        });
      }

      // Add the new message with a subtle context reminder
      const userContent = userContext
        ? `(Context: ${userContext})\n\n${cleanedMessage}`
        : cleanedMessage;
      messages.push({ role: "user", content: userContent });
    }

    console.log("=== GREENPT API CALL ===");
    console.log("User context:", userContext);
    console.log("Is first message:", isFirstMessage);
    console.log("Total messages:", messages.length);
    console.log("Full first message:", messages[0]?.content);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "green-l",
        messages,
        stream: false,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GreenPT error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to get AI response", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("GreenPT response received");

    // Extract the response text (OpenAI-compatible format)
    const aiResponse = result.choices?.[0]?.message?.content || "Sorry, ik kon geen antwoord genereren.";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
