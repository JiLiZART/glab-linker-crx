import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Description = ({ text }: { text: string }) => {
  return (
    <div className="description md text-sm">
      <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
    </div>
  );
};
