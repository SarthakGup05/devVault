export type RootStackParamList = {
  '(tabs)': undefined;
  'snippet/[id]': { id: string };
  'snippet/edit': { id?: string };
  'explanation': { snippetId: string };
};\n