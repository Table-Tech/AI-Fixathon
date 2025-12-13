import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY?.trim().replace(/"/g, "");

    if (!elevenLabsApiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    console.log("Audio file size:", audioFile.size, "type:", audioFile.type);

    // Create form data for ElevenLabs
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append("file", audioFile, "recording.webm");
    elevenLabsFormData.append("model_id", "scribe_v1");
    elevenLabsFormData.append("language_code", "nld"); // Dutch

    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsApiKey,
      },
      body: elevenLabsFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ElevenLabs STT error:", response.status, errorData);
      return NextResponse.json(
        { error: errorData.detail?.message || "Speech-to-text failed", details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("STT result:", result);

    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    );
  }
}
