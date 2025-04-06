import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Description = ({ text }: { text: string }) => {
  console.log('Description', { text });

  return (
    <div className="text-muted-foreground text-sm">
      <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
    </div>
  );
};
