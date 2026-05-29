// src/utils/tokenizer.ts

export interface Token {
  type: string;
  text: string;
}

export const tokenize = (code: string, language: string): Token[] => {
  const rules = [
    { type: 'comment', regex: /(\/\/.*|\/\*[\s\S]*?\*\/)/ },
    { type: 'string', regex: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/ },
    { type: 'number', regex: /\b(\d+(?:\.\d+)?)\b/ },
    { type: 'keyword', regex: /\b(const|let|var|function|return|import|export|class|if|else|for|while|async|await|def|from|as|interface|type|public|private|export|default|extends|implements|package|func)\b/ },
    { type: 'builtin', regex: /\b(console|log|print|Math|JSON|Object|Array|React|useState|useEffect|useRef|useCallback|useMemo)\b/ },
    { type: 'operator', regex: /([+\-*/=<>!&|^%{}()\[\];.:,])/ }
  ];

  const combinedRegex = new RegExp(
    rules.map(r => `(${r.regex.source})`).join('|') + '|(\\s+)|([^\\s+\\-*/=<>!&|^%{}()[\\];.:,]+)',
    'g'
  );

  let match;
  const tokens: Token[] = [];

  while ((match = combinedRegex.exec(code)) !== null) {
    const lexeme = match[0];
    if (!lexeme) continue;

    let matchedType = 'plain';
    for (let i = 0; i < rules.length; i++) {
      if (match[i + 1] !== undefined) {
        matchedType = rules[i].type;
        break;
      }
    }

    if (matchedType === 'plain' && match[rules.length + 1] !== undefined) {
      matchedType = 'whitespace';
    }

    tokens.push({ type: matchedType, text: lexeme });
  }

  return tokens;
};
