declare module 'react-native-syntax-highlighter' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    fontSize?: number;
    fontFamily?: string;
    customStyle?: ViewStyle | any;
    highlighter?: string;
    PreTag?: any;
    CodeTag?: any;
    pointerEvents?: 'none' | 'box-none' | 'box-only' | 'auto';
    children?: string;
  }

  export default class SyntaxHighlighter extends Component<SyntaxHighlighterProps> {}
}

declare module 'react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark' {
  const style: any;
  export default style;
}
