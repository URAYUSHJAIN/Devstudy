'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Play, RotateCcw, Copy, Download, Eye, Loader2 } from 'lucide-react';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
}

const BOILERPLATES: Record<string, string> = {
  javascript: `// JavaScript Playground
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));
console.log("Math.random():", Math.random());`,
  
  typescript: `// TypeScript Playground
interface User {
  name: string;
  id: number;
}

const user: User = {
  name: "Hayes",
  id: 0,
};

console.log("User:", user);`,

  python: `# Python Playground (Mock)
def greet(name):
    return f"Hello, {name}!"

print(greet("Pythonista"))
# Note: Python execution is simulated in this demo`,

  html: `<!-- HTML/CSS Visualization -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; color: #333; }
    .box { 
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4); 
      padding: 20px; 
      border-radius: 8px; 
      color: white;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="box">
    <h1>Hello World</h1>
    <p>Edit this code to see live changes!</p>
  </div>
</body>
</html>`,

  java: `// Java Playground
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`,

  cpp: `// C++ Playground
#include <iostream>

int main() {
    std::cout << "Hello from C++!" << std::endl;
    return 0;
}`,

  csharp: `// C# Playground
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#!");
    }
}`,

  go: `// Go Playground
package main

import "fmt"

func main() {
    fmt.Println("Hello from Go!")
}`,

  rust: `// Rust Playground
fn main() {
    println!("Hello from Rust!");
}`,

  php: `<?php
// PHP Playground
echo "Hello from PHP!";
?>`,
};

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode = BOILERPLATES.javascript, 
  language: initialLanguage = 'javascript' 
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [output, setOutput] = useState<string | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(BOILERPLATES[newLang] || '');
    setOutput(null);
    setIsVisualizing(newLang === 'html');
  };

  const handleReset = () => {
    setCode(BOILERPLATES[language] || initialCode);
    setOutput(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      html: 'html',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      go: 'go',
      rust: 'rs',
      php: 'php'
    };
    
    link.download = `main.${extensions[language] || 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleRun = async () => {
    if (language === 'html') {
      setIsVisualizing(true);
      return;
    }

    setIsRunning(true);
    setOutput(null);

    // Local execution for JS/TS
    if (language === 'javascript' || language === 'typescript') {
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
        // For TS, we're just running it as JS for now since browsers don't execute TS directly.
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
      } finally {
        setIsRunning(false);
      }
      return;
    }

    // Remote execution via internal API (proxies to Piston)
    const API_URL = '/api/code/execute';
    const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
      python: { language: 'python', version: '3.10.0' },
      java: { language: 'java', version: '15.0.2' },
      cpp: { language: 'c++', version: '10.2.0' },
      csharp: { language: 'csharp', version: '6.12.0' },
      go: { language: 'go', version: '1.16.2' },
      rust: { language: 'rust', version: '1.68.2' },
      php: { language: 'php', version: '8.2.3' },
    };

    const config = LANGUAGE_MAP[language];
    if (!config) {
      setOutput(`Execution for ${language} is not supported yet.`);
      setIsRunning(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: config.language,
          version: config.version,
          content: code
        })
      });

      const data = await response.json();
      
      if (data.run) {
        setOutput(data.run.output || 'Code executed successfully (no output)');
      } else if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput('Error: Failed to execute code. Service might be unavailable.');
      }
    } catch (error) {
      setOutput('Error: Failed to connect to execution service. Please check your internet connection.');
    } finally {
      setIsRunning(false);
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
          <select
            aria-label="Select language"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="ml-2 bg-slate-800 text-slate-300 text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML/CSS</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="php">PHP</option>
          </select>
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
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Download Code"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
          </button>
          {language === 'html' && (
            <button 
              onClick={() => setIsVisualizing(!isVisualizing)}
              className={`p-1.5 rounded transition-colors ${isVisualizing ? 'text-blue-400 bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="Toggle Visualization"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-medium rounded transition-colors"
          >
            {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Area */}
        <div className={`flex-1 relative ${isVisualizing && language === 'html' ? 'h-1/2 lg:h-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-800' : 'h-full'}`}>
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

        {/* Visualization Area (HTML Preview) */}
        {isVisualizing && language === 'html' && (
          <div className="flex-1 bg-white h-1/2 lg:h-full lg:w-1/2">
            <iframe 
              srcDoc={code}
              title="preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>

      {/* Output Area */}
      {output && !isVisualizing && (
        <div className="h-32 bg-slate-900 border-t border-slate-800 p-4 font-mono text-sm text-slate-300 overflow-auto relative group">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-slate-500">Console Output:</div>
            <button 
              onClick={() => setOutput(null)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          </div>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
