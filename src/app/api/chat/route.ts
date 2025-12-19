import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
    apiKey: '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'
});

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();
        const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const systemPrompt = `
      You are Khoroch AI, a smart expense assistant.
      Today is ${currentDate}.

      Here is the current expense data in JSON format:
      ${JSON.stringify(context)}

      INSTRUCTIONS:
      1. Answer the user's question STRICTLY based on the expense data provided above.
      2. If the answer cannot be found in the data, state that you don't have that information.
      3. Be helpful, concise, and friendly.
      4. If the user asks for suggestions to reduce costs, analyze the data and give specific advice.
      5. Format your response in Markdown.
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'llama-3.3-70b-versatile',
        });

        const text = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

        return NextResponse.json({ response: text });
    } catch (error: any) {
        console.error('Error generating AI response:', error);
        const fs = require('fs');
        try {
            fs.writeFileSync('error_log.txt', `Timestamp: ${new Date().toISOString()}\nError Name: ${error.name}\nError Message: ${error.message}\nStack: ${error.stack}\nFull Error: ${JSON.stringify(error, null, 2)}`);
        } catch (e) {
            console.error('Failed to write log', e);
        }
        return NextResponse.json({
            error: `Failed to generate response: ${error.message || 'Unknown error'}`
        }, { status: 500 });
    }
}
