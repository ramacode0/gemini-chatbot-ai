import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert image buffer to a generative part async function fileToGenerativePart(base64, mimeType) { return { inlineData: { data: base64, mimeType, }, }; }

export async function POST(req) { try { const { prompt, history, image, mimeType } = await req.json();

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const chat = model.startChat({ history: history.map(msg => ({ role: msg.role, parts: [{ text: msg.content }], })), generationConfig: { maxOutputTokens: 1000, }, });

let result; if (image && mimeType) { const imagePart = await fileToGenerativePart(image, mimeType); result = await chat.sendMessage([prompt, imagePart]); } else { result = await chat.sendMessage(prompt); }

const response = await result.response; const text = response.text();

return new Response(JSON.stringify({ text }), { status: 200, headers: { 'Content-Type': 'application/json' }, });

} catch (error) { console.error("Gemini API Error:", error); return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' }, }); } }