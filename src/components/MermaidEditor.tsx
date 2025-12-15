'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { RotateCcw, Copy, HelpCircle } from 'lucide-react';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const DIAGRAM_TEMPLATES = {
  flowchart: `graph TD
    Client[Client App] -->|HTTPS| LB[Load Balancer]
    
    subgraph "Cloud VPC"
        LB -->|Round Robin| API[API Gateway]
        
        subgraph "Microservices"
            API --> Auth[Auth Service]
            API --> Users[User Service]
            API --> Payments[Payment Service]
        end
        
        subgraph "Data Layer"
            Auth --> Redis[Redis Cache]
            Users --> DB[(Primary DB)]
            Payments --> DB
            DB -.->|Replication| Replica[(Read Replica)]
        end
    end
    
    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style LB fill:#ff9,stroke:#333,stroke-width:2px
    style DB fill:#9f9,stroke:#333,stroke-width:2px`,
  sequence: `sequenceDiagram
    participant Client
    participant API as API Gateway
    participant Auth as Auth Service
    participant DB as Database

    Client->>API: Login Request
    API->>Auth: Validate Credentials
    Auth->>DB: Check User
    DB-->>Auth: User Found
    Auth-->>API: Token Generated
    API-->>Client: Return JWT Token`,
  class: `classDiagram
    class User {
        +String username
        +String password
        +login()
        +logout()
    }
    class Admin {
        +String role
        +manageUsers()
    }
    User <|-- Admin`,
  state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Request Received
    Processing --> Success: Processed
    Processing --> Error: Failed
    Success --> Idle
    Error --> Idle`,
  er: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
  gantt: `gantt
    title Project Roadmap
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements      :a1, 2024-01-01, 30d
    Design           :after a1  , 20d
    section Development
    Backend          :2024-03-01  , 45d
    Frontend         :2024-03-15  , 35d`,
  pie: `pie title Cloud Usage
    "AWS" : 45
    "Azure" : 30
    "GCP" : 25`
};

const MermaidEditor = () => {
  const [code, setCode] = useState(DIAGRAM_TEMPLATES.flowchart);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMermaid = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ 
          startOnLoad: true,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'monospace',
        });
      } catch (e) {
        console.error("Failed to initialize mermaid", e);
      }
    };
    initMermaid();
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return;
      
      try {
        const mermaid = (await import('mermaid')).default;
        
        // Clear previous error
        setError(null);
        
        // Generate unique ID to prevent conflicts
        const id = `mermaid-${Date.now()}`;
        
        // Render the diagram
        // mermaid.render returns { svg } in v10+
        const { svg } = await mermaid.render(id, code);
        
        if (containerRef.current) {
            containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        // Show a friendly error message
        setError('Syntax Error: Please check your Mermaid syntax.'); 
      }
    };

    const timeoutId = setTimeout(renderDiagram, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [code]);

  const handleReset = () => setCode(DIAGRAM_TEMPLATES.flowchart);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Diagram code copied!');
  };

  const handleTypeChange = (type: keyof typeof DIAGRAM_TEMPLATES) => {
    setCode(DIAGRAM_TEMPLATES[type]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
      {/* Editor Side */}
      <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-950">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 font-mono">diagram.mmd</span>
            <select 
              aria-label="Select diagram type"
              className="bg-slate-800 text-slate-300 text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none focus:border-blue-500"
              onChange={(e) => handleTypeChange(e.target.value as keyof typeof DIAGRAM_TEMPLATES)}
            >
              <option value="flowchart">Flowchart</option>
              <option value="sequence">Sequence</option>
              <option value="class">Class</option>
              <option value="state">State</option>
              <option value="er">ER Diagram</option>
              <option value="gantt">Gantt</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowHelp(!showHelp)} 
              className={`p-1.5 rounded ${showHelp ? 'text-blue-400 bg-slate-800' : 'text-slate-400 hover:text-white'}`}
              title="How to use"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button onClick={handleReset} className="p-1.5 text-slate-400 hover:text-white rounded" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-white rounded" title="Copy Code">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          {showHelp && (
            <div className="absolute inset-0 z-10 bg-slate-900/90 p-6 text-slate-300 overflow-auto backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4">How to use</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Select a diagram type from the dropdown menu above.</li>
                <li>Edit the Mermaid.js syntax in this editor pane.</li>
                <li>The preview on the right will update automatically.</li>
                <li>Use the <strong>Reset</strong> button to restore the template.</li>
                <li>Use the <strong>Copy</strong> button to copy your code.</li>
              </ul>
              <div className="mt-6">
                <p className="text-xs text-slate-500">
                  Example syntax:
                  <br />
                  <code className="text-blue-400">graph TD; A--&gt;B;</code>
                </p>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                Got it
              </button>
            </div>
          )}
          <Editor
            height="100%"
            defaultLanguage="mermaid"
            value={code}
            theme="vs-dark"
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
          />
        </div>
      </div>

      {/* Preview Side */}
      <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Preview</span>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
        <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-white dark:bg-slate-900">
          <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
        </div>
      </div>
    </div>
  );
};

export default MermaidEditor;
