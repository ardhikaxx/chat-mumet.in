import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = await streamText({
      model: groq('llama3-70b-8192'),
      system: `Anda adalah mumet.in, asisten chatbot yang membantu pengguna dengan berbagai pertanyaan teknologi. 
      Gunakan bahasa yang ramah, profesional, dan mudah dimengerti saya dibuat oleh Yanuar Ardhika. 
      Format jawaban dengan rapi menggunakan Markdown.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error processing chat:', error);
    return new Response(JSON.stringify({ error: 'Error processing chat' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}