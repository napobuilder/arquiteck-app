import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search } from 'lucide-react';
import type { Client, Project, AnyTask } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  projects: Project[];
  tasks: AnyTask[];
  handlers: {
    setActiveView: (view: string) => void;
    handleAddToInbox: (taskName: string) => void;
  };
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, clients, projects, tasks, handlers }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const commandResults = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    const commands: any[] = [];
    if ('dashboard'.includes(lowerQuery)) commands.push({ type: 'Comando', name: 'Ir a Dashboard', action: () => handlers.setActiveView('dashboard'), id: 'cmd-dash' });
    if ('finanzas'.includes(lowerQuery)) commands.push({ type: 'Comando', name: 'Ir a Finanzas', action: () => handlers.setActiveView('finances'), id: 'cmd-fin' });
    if (query.startsWith('+ ')) commands.push({ type: 'Comando', name: `Crear tarea: "${query.substring(2)}"`, action: () => handlers.handleAddToInbox(query.substring(2)), id: 'cmd-add' });
    return commands;
  }, [query, handlers]);

  const searchResults = useMemo(() => {
    if (!query || query.startsWith('+ ')) return [];
    const lowerQuery = query.toLowerCase();
    const taskResults = tasks.filter(t => t.name.toLowerCase().includes(lowerQuery)).map(t => ({ type: 'Tarea', name: t.name, id: `task-${t.id}`, action: () => { } }));
    const projectResults = projects.filter(p => p.name.toLowerCase().includes(lowerQuery)).map(p => ({ type: 'Proyecto', name: p.name, id: `project-${p.id}`, action: () => { } }));
    const clientResults = clients.filter(c => c.name.toLowerCase().includes(lowerQuery)).map(c => ({ type: 'Cliente', name: c.name, id: `client-${c.id}`, action: () => { } }));
    return [...taskResults, ...projectResults, ...clientResults];
  }, [query, tasks, projects, clients]);

  const allResults = [...commandResults, ...searchResults];

  const handleSelect = (item: any) => { if (item && item.action) { item.action(); onClose(); } };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(prev => (prev + 1) % (allResults.length || 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(prev => (prev - 1 + (allResults.length || 1)) % (allResults.length || 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); handleSelect(allResults[selectedIndex]); }
      else if (e.key === 'Escape') { onClose(); }
    };
    if (isOpen) { window.addEventListener('keydown', handleKeyDown); }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allResults, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div className="bg-[#14171E] rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search className="text-[#6C7581]" />
          <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Escribe un comando o busca..." className="w-full bg-transparent text-white placeholder-[#6C7581] focus:outline-none" />
        </div>
        <div className="p-2 max-h-96 overflow-y-auto">
          {allResults.length > 0 ? (
            allResults.map((item, index) => (
              <div key={item.id} onClick={() => handleSelect(item)} onMouseEnter={() => setSelectedIndex(index)} className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${selectedIndex === index ? 'bg-[#00ADB5]/20' : ''}`}>
                <span className="text-white">{item.name}</span><span className="text-xs text-[#6C7581] bg-[#242933] px-2 py-1 rounded-md">{item.type}</span>
              </div>
            ))
          ) : (<p className="text-center text-[#6C7581] p-8">No hay resultados.</p>)}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;