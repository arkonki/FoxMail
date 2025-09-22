import React, { useState, useEffect, useRef, useMemo } from 'react';
import { logService } from '../services/logService';
import type { LogEntry, LogCategory } from '../types';
import { CloseIcon, TrashIcon } from './icons';

interface DiagnosticsViewProps {
  onClose: () => void;
}

const CATEGORIES: LogCategory[] = ['System', 'UI', 'Service'];

const categoryColors: Record<LogCategory, string> = {
  System: 'bg-indigo-100 text-indigo-800',
  UI: 'bg-green-100 text-green-800',
  Service: 'bg-yellow-100 text-yellow-800',
};

const DraggableHeader: React.FC<{ onMouseDown: (e: React.MouseEvent) => void; children: React.ReactNode }> = ({ onMouseDown, children }) => {
  return (
    <header
      onMouseDown={onMouseDown}
      className="flex items-center justify-between p-3 bg-gray-800 text-white rounded-t-lg cursor-move"
    >
      {children}
    </header>
  );
};

const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>(logService.getLogs());
  const [filter, setFilter] = useState<LogCategory | 'All'>('All');
  const panelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: window.innerWidth - 620, y: 50 });

  useEffect(() => {
    const handleLogsChanged = () => {
      setLogs(logService.getLogs());
    };
    const unsubscribe = logService.subscribe(handleLogsChanged);
    return () => unsubscribe();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    isDragging.current = true;
    const rect = panelRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const filteredLogs = useMemo(() => {
    if (filter === 'All') return logs;
    return logs.filter(log => log.category === filter);
  }, [logs, filter]);

  const handleClearLogs = () => {
    logService.clearLogs();
  };

  return (
    <div
      ref={panelRef}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className="fixed top-0 left-0 bg-white rounded-lg shadow-2xl w-full max-w-xl flex flex-col z-50"
    >
      <DraggableHeader onMouseDown={handleMouseDown}>
        <h2 className="text-lg font-semibold">Diagnostics Panel</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
          <CloseIcon className="w-6 h-6" />
        </button>
      </DraggableHeader>
      <div className="p-3 border-b flex items-center justify-between">
         <div className="flex items-center gap-2">
            <button onClick={() => setFilter('All')} className={`px-3 py-1 text-sm rounded-full ${filter === 'All' ? 'bg-primary text-white' : 'bg-gray-200'}`}>All</button>
            {CATEGORIES.map(cat => (
                 <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1 text-sm rounded-full ${filter === cat ? 'bg-primary text-white' : 'bg-gray-200'}`}>{cat}</button>
            ))}
         </div>
         <button onClick={handleClearLogs} className="p-2 rounded-full hover:bg-gray-200" aria-label="Clear Logs">
            <TrashIcon className="w-5 h-5 text-gray-600" />
         </button>
      </div>
      <div className="p-3 bg-gray-50 flex-grow h-96 overflow-y-auto font-mono text-xs">
        {filteredLogs.length > 0 ? (
            <ul>
                {filteredLogs.map((log, index) => (
                    <li key={index} className="flex items-start gap-2 p-1 border-b border-gray-200">
                        <span className="text-gray-400">{log.timestamp.toLocaleTimeString()}</span>
                        <span className={`px-2 py-0.5 rounded-md text-xs ${categoryColors[log.category]}`}>{log.category}</span>
                        <span className="flex-1 text-gray-700 whitespace-pre-wrap">{log.message}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                No logs to display.
            </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticsView;