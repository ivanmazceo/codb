import React from 'react';

interface EditorProps {
  code: string;
  onChange: (code: string) => void;
  className?: string;
}

const Editor: React.FC<EditorProps> = ({ code, onChange, className }) => {
  return (
    <div className={`relative flex flex-col h-full bg-vibe-dark/30 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden group ${className}`}>
      
      {/* Editor Header */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-vibe-black/20 to-transparent z-10 flex items-center px-8 pointer-events-none">
         <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
         </div>
         <div className="ml-auto text-xs text-white/30 font-mono tracking-wider">main.ts</div>
      </div>

      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full bg-transparent text-vibe-light/90 font-mono text-sm p-8 pt-16 outline-none resize-none selection:bg-white/20 placeholder-white/10"
        spellCheck={false}
        placeholder="// начни творить здесь..."
      />
      
      {/* Status Bar */}
      <div className="absolute bottom-6 right-8 text-xs text-white/20 font-mono pointer-events-none">
        {code.length} chars
      </div>
    </div>
  );
};

export default Editor;