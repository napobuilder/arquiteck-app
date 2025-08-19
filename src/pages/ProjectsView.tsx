import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store/store';
import { Plus, Edit2 } from 'lucide-react';
import type { Client, Project } from '../types/index.ts';

const ProjectsView = () => {
    const clients = useStore(state => state.clients);
    const projects = useStore(state => state.projects);
    const onCreateClient = useStore(state => state.addClient);
    const onCreateProject = useStore(state => state.addProject);
    const onUpdateProject = useStore(state => state.updateProject);
    const onStartEditClient = useStore(state => state.setEditingClient);
    const onStartEditProject = useStore(state => state.setEditingProject);

    const [newClientName, setNewClientName] = useState('');
    const [newProjectName, setNewProjectName] = useState('');
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const handleCreateClient = () => { if(newClientName.trim()) { onCreateClient(newClientName); setNewClientName(''); } };
    const handleCreateProject = () => { if(newProjectName.trim() && selectedClientId) { onCreateProject(newProjectName, parseInt(selectedClientId)); setNewProjectName(''); } };
    return (
        <div>
            <h2 className="text-2xl font-bold text-[#E0E3E8] mb-6">Clientes y Proyectos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div><h3 className="text-lg font-semibold text-white mb-4">Clientes</h3><div className="space-y-2 mb-4">{clients.length === 0 && <p className="text-gray-500">Añade tu primer cliente.</p>}{clients.map((client: Client) => <div key={client.id} className="group bg-[#101116] p-3 rounded-lg flex justify-between items-center"><span>{client.name}</span><button onClick={() => onStartEditClient(client)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity"><Edit2 size={16} /></button></div>)}</div><div className="flex gap-2"><input value={newClientName} onChange={e => setNewClientName(e.target.value)} placeholder="Nuevo cliente..." className="bg-[#242933] flex-1 text-sm rounded-md px-3 py-2" /><button onClick={handleCreateClient} className="bg-[#00ADB5] text-white p-2 rounded-md"><Plus/></button></div></div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Proyectos</h3>
                    <div className="space-y-4">
                        {projects.length === 0 && <p className="text-gray-500">Crea un cliente y luego añade un proyecto.</p>}
                        {projects.map((project: Project) => {
                            const client = clients.find((c: Client) => c.id === project.clientId);
                            return (
                                <div key={project.id} className="bg-[#101116] p-4 rounded-lg">
                                    <div className="flex justify-between items-center group">
                                        <p className="font-semibold text-white">{project.name}</p>
                                        <button onClick={() => onStartEditProject(project)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity"><Edit2 size={16} /></button>
                                    </div>
                                    <p className="text-sm text-[#6C7581] mb-3">{client?.name || "Proyecto Interno"}</p>
                                    <div className="flex gap-2 text-sm">
                                        <select value={project.billingType} onChange={e => onUpdateProject(project.id, 'billingType', e.target.value)} className="bg-[#242933] p-2 rounded-md w-1/2">
                                            <option value="task">Por Tarea</option>
                                            <option value="retainer">Retainer Mensual</option>
                                        </select>
                                        {project.billingType === 'retainer' && <input type="number" value={project.retainerValue} onChange={e => onUpdateProject(project.id, 'retainerValue', parseFloat(e.target.value) || 0)} placeholder="Valor ($)" className="bg-[#242933] p-2 rounded-md w-1/2"/>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 space-y-2">
                        <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className="bg-[#242933] w-full p-2 rounded-md text-sm">
                            <option value="">Selecciona un cliente...</option>
                            {clients.map((c: Client) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <div className="flex gap-2">
                            <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="Nuevo proyecto..." className="bg-[#242933] flex-1 text-sm rounded-md px-3 py-2" disabled={!selectedClientId} />
                            <button onClick={handleCreateProject} className="bg-[#00ADB5] text-white p-2 rounded-md" disabled={!selectedClientId}><Plus/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsView;
