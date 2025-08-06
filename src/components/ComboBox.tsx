import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';

const ComboBox = ({ items, value, onChange, onCreate, placeholder, disabled, className = '' }: any) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setQuery(value); }, [value]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredItems = query === '' ? items : items.filter((item: any) => item.name.toLowerCase().includes(query.toLowerCase()));
    const showCreateOption = query.length > 0 && !items.some((c: any) => c.name.toLowerCase() === query.toLowerCase());
    const handleSelect = (itemName: string) => { onChange(itemName); setQuery(itemName); setIsOpen(false); };
    const handleCreate = () => { onCreate(query); onChange(query); setIsOpen(false); };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); if(onChange) onChange(e.target.value); setIsOpen(true); }} onFocus={() => setIsOpen(true)} placeholder={placeholder} className="bg-[#242933] w-full text-sm rounded-md px-3 py-2 placeholder-[#6C7581] text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]" disabled={disabled} />
            {isOpen && !disabled && (<div className="absolute z-10 w-full mt-1 bg-[#242933] border border-white/10 rounded-md shadow-lg"><ul className="py-1 max-h-40 overflow-y-auto">{filteredItems.map((item: any) => (<li key={item.id} onClick={() => handleSelect(item.name)} className="px-3 py-2 text-sm text-[#E0E3E8] hover:bg-[#00ADB5]/20 cursor-pointer">{item.name}</li>))}{showCreateOption && (<li onClick={handleCreate} className="px-3 py-2 text-sm text-[#00ADB5] hover:bg-[#00ADB5]/20 cursor-pointer flex items-center gap-2"><Plus size={16} /> Crear "{query}"</li>)}</ul></div>)}
        </div>
    );
};

export default ComboBox;
