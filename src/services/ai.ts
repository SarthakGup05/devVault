export interface AiExplanationResponse {
  explanation: string;
}

export const generateCodeExplanation = async (
  code: string,
  language: string,
  apiKey: string
): Promise<AiExplanationResponse> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a senior developer. Explain this code snippet clearly, focusing on its architecture, efficiency, and potential edge cases.',
          },
          {
            role: 'user',
            content: 'Language: ' + language + '\nCode:\n```' + language + '\n' + code + '\n```',
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error('AI Provider HTTP Error: ' + response.status);
    }

    const json = await response.json();
    const explanation = json.choices?.[0]?.message?.content || 'No explanation generated.';
    return { explanation };
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error(error.message || 'Failed to connect to AI provider');
  }
};\n