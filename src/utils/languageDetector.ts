export const detectLanguage = (code: string): string => {
  const codeTrimmed = code.trim();
  
  if (codeTrimmed.startsWith('import ') || codeTrimmed.startsWith('export ') || codeTrimmed.includes('const ') || codeTrimmed.includes('let ')) {
    if (codeTrimmed.includes(':') || codeTrimmed.includes('interface ') || codeTrimmed.includes('type ')) {
      return 'typescript';
    }
    return 'javascript';
  }
  
  if (codeTrimmed.includes('def ') && codeTrimmed.includes(':')) {
    return 'python';
  }
  
  if (codeTrimmed.startsWith('<?php')) {
    return 'php';
  }
  
  if (codeTrimmed.startsWith('package ') && codeTrimmed.includes('import ') && codeTrimmed.includes('func ')) {
    return 'go';
  }
  
  if (codeTrimmed.includes('#include <')) {
    return 'cpp';
  }
  
  if (codeTrimmed.startsWith('<') && (codeTrimmed.includes('html') || codeTrimmed.includes('div'))) {
    return 'html';
  }
  
  return 'markdown';
};
