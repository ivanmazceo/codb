import React, { useState } from 'react';
import Background from './components/Background';
import ChatInterface from './components/Chat';
import Editor from './components/Editor';
import Preview from './components/Preview';

type ViewMode = 'code' | 'preview';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('code');

  return (
    <div className="relative w-full h-screen overflow-hidden text-vibe-light selection:bg-white/20 selection:text-white bg-vibe-black">
      <Background />
      
      {/* Navbar / Title */}
      {/* Moved to z-50 and ensured pointer-events don't block layout if needed, though position is fixed */}
      <div className="fixed top-6 left-8 z-50 flex items-center gap-4 pointer-events-none">
        <h1 className="text-4xl font-light tracking-tighter text-white/90 font-sans lowercase mix-blend-difference pointer-events-auto">
          кодъ
        </h1>
      </div>

      <div className="fixed top-6 right-8 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all duration-300 shadow-lg"
        >
          {isSidebarOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Main Layout */}
      {/* Changed items-center to items-start with top padding to prevent overlap with title */}
      <main className="relative w-full h-full flex flex-row items-stretch justify-center p-4 sm:p-6 pt-28 gap-6 z-10">
        
        {/* Editor/Preview Area */}
        <div 
          className={`relative h-full transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] flex flex-col ${
            isSidebarOpen ? 'w-1/2 lg:w-3/5 opacity-100' : 'w-full max-w-5xl opacity-100'
          }`}
        >
          {/* View Toggle - Moved inside the column flow (relative) instead of absolute top */}
          <div className="flex justify-center mb-4 flex-shrink-0">
             <div className="flex bg-vibe-gray/50 backdrop-blur-xl rounded-full p-1.5 border border-white/10 shadow-xl">
                <button 
                  onClick={() => setViewMode('code')}
                  className={`px-6 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                    viewMode === 'code' 
                      ? 'bg-white text-black shadow-lg scale-105' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  code
                </button>
                <button 
                  onClick={() => setViewMode('preview')}
                  className={`px-6 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                    viewMode === 'preview' 
                      ? 'bg-white text-black shadow-lg scale-105' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  preview
                </button>
             </div>
          </div>

          <div className="relative flex-1 w-full min-h-0">
            {/* Editor Layer */}
            <div className={`absolute inset-0 transition-all duration-500 transform ${viewMode === 'code' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
               <Editor code={code} onChange={setCode} />
            </div>
            
            {/* Preview Layer */}
             <div className={`absolute inset-0 transition-all duration-500 transform ${viewMode === 'preview' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
               <Preview code={code} />
            </div>
          </div>
        </div>

        {/* Chat Sidebar Area */}
        <div 
          className={`h-full transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] flex-shrink-0 ${
            isSidebarOpen 
              ? 'w-1/2 lg:w-2/5 translate-x-0 opacity-100' 
              : 'w-0 translate-x-20 opacity-0 pointer-events-none absolute right-6'
          }`}
        >
           {/* Wrap chat to prevent layout thrashing when width is 0 */}
           <div className="w-full h-full overflow-hidden pt-[3.25rem]"> {/* Align chat top with editor content (below toggle) */}
             <ChatInterface className="h-full" />
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;