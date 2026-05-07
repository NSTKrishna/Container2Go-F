import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { API_BASE_URL, WS_BASE_URL } from './apiConfig';

type ConnectionStatus = 'Connecting' | 'Running' | 'Disconnected' | 'Error';

export default function TerminalPage() {
  const navigate = useNavigate();
  const terminalRef = useRef<HTMLDivElement>(null);
  const [containerId, setContainerId] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('Connecting');

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.error('Logout error', e);
    }
    navigate('/login');
  };

  useEffect(() => {
    let term: Terminal;
    let ws: WebSocket;
    let fitAddon: FitAddon;

    const setupContainer = async () => {
      try {
        // Create or get persistent container
        const res = await fetch(`${API_BASE_URL}/api/containers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (res.status === 401) {
          navigate('/login');
          return;
        }

        if (!res.ok) throw new Error('Failed to create container');

        const data = await res.json();
        setContainerId(data.id);

        if (!terminalRef.current) return;

        // Initialize xterm.js
        term = new Terminal({
          cursorBlink: true,
          theme: {
            background: '#0d1117', // GitHub Dark inspired background
            foreground: '#c9d1d9',
            cursor: '#c9d1d9',
            black: '#484f58',
            red: '#ff7b72',
            green: '#3fb950',
            yellow: '#d29922',
            blue: '#58a6ff',
            magenta: '#bc8cff',
            cyan: '#39c5cf',
            white: '#b1bac4',
            brightBlack: '#6e7681',
            brightRed: '#ffa198',
            brightGreen: '#56d364',
            brightYellow: '#e3b341',
            brightBlue: '#79c0ff',
            brightMagenta: '#d2a8ff',
            brightCyan: '#56d4dd',
            brightWhite: '#f0f6fc',
          },
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          fontSize: 14,
        });

        fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        // Connect WebSocket
        ws = new WebSocket(`${WS_BASE_URL}/ws/${data.id}`);
        // Set binaryType to process raw sh/bash output correctly
        ws.binaryType = 'arraybuffer';

        ws.onopen = () => {
          setStatus('Running');
          // Start with an accurate fit when the connection opens
          fitAddon.fit();
        };

        // Output from server matching ArrayBuffer decoded -> terminal
        ws.onmessage = (event) => {
          if (event.data instanceof ArrayBuffer) {
            const text = new TextDecoder().decode(event.data);
            term.write(text);
          } else if (typeof event.data === 'string') {
            // Occasionally servers send metadata/string logic bounds
            term.write(event.data);
          }
        };

        ws.onclose = () => setStatus('Disconnected');
        ws.onerror = () => setStatus('Error');

        // Input from user -> server raw bytes
        term.onData((data: string) => {
          if (ws.readyState === WebSocket.OPEN) {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(data);
            ws.send(bytes);
          }
        });

        // Resize from user -> fit() -> resize event to server
        term.onResize((size: { cols: number; rows: number }) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'resize',
              cols: size.cols,
              rows: size.rows
            }));
          }
        });

        // Browser window resizing
        const handleResize = () => {
          fitAddon.fit();
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          ws.close();
          term.dispose();
        };

      } catch (err) {
        console.error(err);
        setStatus('Error');
      }
    };

    setupContainer();

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
      if (term) term.dispose();
    };
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen bg-[#0d1117]">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800 bg-[#161b22]">
        <div className="flex items-center space-x-4">
          <h1 className="text-sm font-semibold text-white">Container2Go</h1>
          {containerId && (
            <span className="text-xs text-gray-400 font-mono">
              ID: {containerId.substring(0, 12)}
            </span>
          )}
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${status === 'Running' ? 'bg-green-900 text-green-300' :
              status === 'Connecting' ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
            }`}>
            {status}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Terminal Container */}
      <div className="flex-1 w-full overflow-hidden p-2">
        <div className="w-full h-full" ref={terminalRef} />
      </div>
    </div>
  );
}