import { NextRequest, NextResponse } from "next/server";

// VietTTS Gradio API - HuggingFace Space: ntt123/vietTTS
const VIETTTS_API = "https://ntt123-viettts.hf.space";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Giới hạn độ dài để tránh timeout (TTS miễn phí thường giới hạn)
    const truncatedText = text.slice(0, 500);

    // Gọi Gradio Predict API của VietTTS HuggingFace Space
    const predictRes = await fetch(`${VIETTTS_API}/run/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [truncatedText],
        fn_index: 0,
      }),
      signal: AbortSignal.timeout(30000), // Timeout 30s
    });

    if (!predictRes.ok) {
      throw new Error(`VietTTS API error: ${predictRes.status}`);
    }

    const result = await predictRes.json();

    // Gradio trả về: { data: [{ name: "...", data: "...", is_file: true }] }
    // hoặc { data: ["data:audio/wav;base64,..."] }
    if (!result?.data?.[0]) {
      throw new Error("No audio data returned");
    }

    const audioData = result.data[0];

    // Nếu là object có url file
    if (typeof audioData === "object" && audioData.name) {
      const audioUrl = `${VIETTTS_API}/file=${audioData.name}`;
      return NextResponse.json({ audioUrl });
    }

    // Nếu là base64 hoặc url trực tiếp
    if (typeof audioData === "string") {
      return NextResponse.json({ audioUrl: audioData });
    }

    throw new Error("Unexpected response format");
  } catch (error: any) {
    console.error("VietTTS error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "TTS generation failed" },
      { status: 500 }
    );
  }
}
