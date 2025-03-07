import { cn } from '@/lib/utils';

type ContentBlockProps = {
  children: React.ReactNode;
  className?: string;
};

const ContentBlock = ({ children, className }: ContentBlockProps) => {
  return (
    <div className={cn('bg-[#F7F8FA] shadow rounded-md overflow-hidden h-full w-full', className)}>
      {children}
    </div>
  );
};

export default ContentBlock;
