import React, { useMemo } from 'react';

interface PreviewProps {
  code: string;
  className?: string;
}

const Preview: React.FC<PreviewProps> = ({ code, className }) => {
  const srcDoc = useMemo(() => {
    if (!code.trim()) {
      return `
        <html>
          <body style="background-color: #0a0a0a; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #333; font-family: sans-serif;">
            <div style="opacity: 0.2">waiting for signal...</div>
          </body>
        </html>
      `;
    }

    // Basic heuristic: if it looks like a full HTML doc, use it. 
    // Otherwise, wrap it in a body with Tailwind.
    if (code.includes('<!DOCTYPE html>') || code.includes('<html')) {
      return code;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background-color: white; }
          </style>
        </head>
        <body>
          ${code}
        </body>
      </html>
    `;
  }, [code]);

  return (
    <div className={`relative flex flex-col h-full bg-white rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden group ${className}`}>
       {/* Browser Bar */}
       <div className="absolute top-0 left-0 right-0 h-14 bg-gray-100 border-b border-gray-200 z-10 flex items-center px-6 gap-4">
          <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
             <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-gray-200/50 px-4 py-1 rounded-full text-[10px] text-gray-400 font-mono tracking-widest uppercase">
              localhost:3000
            </div>
          </div>
          <div className="w-12"></div> {/* Spacer for alignment */}
       </div>

       <div className="flex-1 pt-14 bg-white h-full">
         <iframe 
           srcDoc={srcDoc}
           title="preview"
           className="w-full h-full border-none"
           sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
         />
       </div>
    </div>
  );
};

export default Preview;