import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });

const PROMPTS = [
  `write a short funny story about student WG life that will make ETH/UZH students laugh.
   focus on universal experiences like:
   - 3am kitchen adventures
   - exam season survival
   - WG drama and chaos
   - Swiss student problems

   rules:
   - keep it under 3 short paragraphs
   - use current gen z slang naturally (no cap, fr, istg etc)
   - make it extremely relatable to students in zurich
   - include some iconic zurich/eth/uzh references
   - focus on one specific funny situation
   - no introductory text, just start with the story
   - don't use bullet points`,

  `write a hilarious WG confession that every student in zurich can relate to.
   focus on things like:
   - living on a swiss student budget
   - food stealing drama
   - passive aggressive notes
   - shared space chaos

   rules:
   - tell it like a short funny story
   - max 3 paragraphs
   - use current slang but don't overdo it
   - make it feel like a real confession
   - include specific zurich references
   - start directly with the story
   - no bullet points or lists`,

  `write a short funny rant about typical WG problems in zurich.
   topics like:
   - rent prices vs student life
   - cleaning schedule drama
   - public transport adventures
   - shared kitchen chaos

   rules:
   - keep it short and funny
   - max 3 paragraphs
   - use gen z language naturally
   - make it super relatable
   - include local references
   - start with the rant directly
   - no lists or bullet points`
];

export async function generateFunContent(): Promise<string> {
  try {
    const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Remove any markdown-style formatting that might slip through
    return response.text().replace(/^\s*[-*]\s*/gm, '').trim();
  } catch (error) {
    console.error('Error generating fun content:', error);
    return "nah fam the generator tweaking rn fr\ntry again in a sec 💀";
  }
}
