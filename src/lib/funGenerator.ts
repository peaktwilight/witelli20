export async function generateFunContent(): Promise<string> {
  try {
    const response = await fetch('/api/generate');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate content');
    }
    
    return data.content;
  } catch (error) {
    console.error('Error generating fun content:', error);
    return "nah fam the generator tweaking rn fr\ntry again in a sec 💀";
  }
}
