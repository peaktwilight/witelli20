import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function generateDailyStory() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Write a short, engaging story (2-3 paragraphs) about daily life in a student housing in Zurich, Switzerland. 
  The story should be set at Witellikerstrasse 20 near Balgrist University Hospital. 
  Include details about:
  - Student interactions
  - Local surroundings
  - A touch of Swiss culture
  - A hint of humor
  Make it feel personal and authentic.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating story:', error);
    return 'We\'re brewing up today\'s story. Check back in a moment!';
  }
}
