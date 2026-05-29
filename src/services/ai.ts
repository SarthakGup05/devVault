export interface AiExplanationResponse {
  explanation: string;
}

type LlmProvider = 'openai' | 'anthropic' | 'gemini' | 'openrouter';

const detectProvider = (key: string): LlmProvider => {
  const clean = key.trim();
  if (clean.startsWith('sk-ant-')) {
    return 'anthropic';
  }
  if (clean.startsWith('sk-or-')) {
    return 'openrouter';
  }
  if (clean.startsWith('AIzaSy')) {
    return 'gemini';
  }
  return 'openai'; // Fallback for standard sk- keys, custom proxies, Groq, DeepSeek etc.
};

/**
 * Resilient fetch wrapper that retries on transient errors (503, 429, 502, 504)
 * or network failures using exponential backoff.
 */
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    
    // If it's a transient server error, retry with backoff
    if (retries > 0 && (response.status === 503 || response.status === 429 || response.status === 502 || response.status === 504)) {
      console.warn(`Transient HTTP error ${response.status} detected. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    
    return response;
  } catch (error: any) {
    if (retries > 0) {
      console.warn(`Network/Connection failure: ${error.message || error}. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const generateCodeExplanation = async (
  code: string,
  language: string,
  apiKey: string
): Promise<AiExplanationResponse> => {
  const provider = detectProvider(apiKey);
  const systemPrompt = 'You are a senior developer. Explain this code snippet clearly, focusing on its architecture, efficiency, and potential edge cases.';
  const userPrompt = 'Language: ' + language + '\nCode:\n```' + language + '\n' + code + '\n```';

  try {
    if (provider === 'anthropic') {
      const response = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });

      if (!response.ok) {
        throw new Error('Anthropic HTTP Error: ' + response.status);
      }
      const json = await response.json();
      const explanation = json.content?.[0]?.text || 'No explanation generated.';
      return { explanation };
    }

    if (provider === 'gemini') {
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { temperature: 0.2 },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Gemini HTTP Error: ' + response.status);
      }
      const json = await response.json();
      const explanation = json.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation generated.';
      return { explanation };
    }

    // Default: OpenAI / OpenRouter / DeepSeek / Custom proxies
    const endpoint = provider === 'openrouter' 
      ? 'https://openrouter.ai/api/v1/chat/completions' 
      : 'https://api.openai.com/v1/chat/completions';
      
    const model = provider === 'openrouter' 
      ? 'google/gemini-2.5-flash' 
      : 'gpt-4o-mini';

    const response = await fetchWithRetry(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`${provider === 'openrouter' ? 'OpenRouter' : 'OpenAI'} HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    const explanation = json.choices?.[0]?.message?.content || 'No explanation generated.';
    return { explanation };
  } catch (error: any) {
    console.error('AI Service Error:', error);
    throw new Error(error.message || 'Failed to connect to AI provider');
  }
};

export const generateCodeSuggestion = async (
  code: string,
  title: string,
  language: string,
  apiKey: string
): Promise<string> => {
  const provider = detectProvider(apiKey);
  const systemPrompt = 'You are an AI code autocomplete assistant. Generate the single NEXT line of code or completion to naturally continue the user\'s input based on the snippet title and language. Return ONLY the raw code suggestion to append, with no markdown formatting, no code blocks, and no explanations. Keep it concise (maximum 1-2 lines).';
  const userPrompt = `Language: ${language}\nTitle: ${title}\nCode Context:\n${code}`;

  try {
    if (provider === 'anthropic') {
      const response = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 60,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error('Anthropic Autocomplete HTTP Error: ' + response.status);
      }
      const json = await response.json();
      let suggestion = json.content?.[0]?.text || '';
      suggestion = suggestion.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '');
      return suggestion;
    }

    if (provider === 'gemini') {
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 60,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Gemini Autocomplete HTTP Error: ' + response.status);
      }
      const json = await response.json();
      let suggestion = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      suggestion = suggestion.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '');
      return suggestion;
    }

    // Default: OpenAI / OpenRouter / DeepSeek / Custom proxies
    const endpoint = provider === 'openrouter' 
      ? 'https://openrouter.ai/api/v1/chat/completions' 
      : 'https://api.openai.com/v1/chat/completions';
      
    const model = provider === 'openrouter' 
      ? 'google/gemini-2.5-flash' 
      : 'gpt-4o-mini';

    const response = await fetchWithRetry(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 60,
      }),
    });

    if (!response.ok) {
      throw new Error(`${provider === 'openrouter' ? 'OpenRouter' : 'OpenAI'} Autocomplete HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    let suggestion = json.choices?.[0]?.message?.content || '';
    suggestion = suggestion.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '');
    return suggestion;
  } catch (error: any) {
    console.error('AI Suggestion Service Error:', error);
    throw error;
  }
};
