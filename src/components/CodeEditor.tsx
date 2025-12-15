'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Play, RotateCcw, Copy, MessageSquare } from 'lucide-react';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode = '// Start coding here...', 
  language = 'javascript' 
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleRun = () => {
    try {
      // Capture console.log output
      const logs: string[] = [];
      const originalLog = console.log;
      
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      // Execute code safely
      // Note: eval is used here for demonstration. In production, use a sandboxed environment.
      const result = new Function(code)();
      
      // Restore console.log
      console.log = originalLog;

      if (logs.length > 0) {
        setOutput(logs.join('\n'));
      } else if (result !== undefined) {
        setOutput(String(result));
      } else {
        setOutput('Code executed successfully (no output)');
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="flex flex-col h-full border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-3 text-xs text-slate-400 font-mono">{language === 'javascript' ? 'script.js' : 'main.ts'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors opacity-50 cursor-not-allowed"
            title="Explain Code (Coming Soon)"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button 
            onClick={handleRun}
            className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition-colors opacity-50 cursor-not-allowed"
          >
            <Play className="w-3 h-3" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output Area (Mock) */}
      {output && (
        <div className="h-32 bg-slate-900 border-t border-slate-800 p-4 font-mono text-sm text-slate-300 overflow-auto">
          <div className="text-xs text-slate-500 mb-2">Console Output:</div>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
