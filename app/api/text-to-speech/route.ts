import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Call OpenAI's TTS API to convert text to speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // You can also use "tts-1-hd" for higher quality
      voice: "nova", // Using "nova" as it's a female voice similar to the Rachel sample
      input: text,
    })

    // Convert the response to an ArrayBuffer
    const buffer = await mp3.arrayBuffer()

    // Return the audio data with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Error generating speech:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}

