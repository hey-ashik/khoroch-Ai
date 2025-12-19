import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: Request) {
    try {
        // Hardcoded key to resolve env loading issue
        const apiKey = 'AIzaSyCaEnX4nA0i9ShDU6GeL2RYTK-Xto4qk9o';

        const { message, context } = await req.json();
        const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
      You are Khoroch AI, a smart expense assistant.
      Today is ${currentDate}.

      Here is the current expense data in JSON format:
      ${JSON.stringify(context)}

      User Question: ${message}

      Answer the user's question based on the data provided. 
      Be helpful, concise, and friendly. 
      If the user asks for suggestions to reduce costs, analyze the data and give specific advice.
      Format your response in Markdown.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

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
