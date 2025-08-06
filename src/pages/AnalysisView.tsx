import React, { useMemo } from 'react';
import { Phone, Mail, WifiOff, Lightbulb, HelpCircle } from 'lucide-react';

const AnalysisView = ({ distractions }: { distractions: string[] }) => {
   const distractionCounts = useMemo(() => {
       return distractions.reduce((acc, curr) => {
           acc[curr] = (acc[curr] || 0) + 1;
           return acc;
       }, {} as Record<string, number>);
   }, [distractions]);

   const sortedDistractions = useMemo(() => {
       return Object.entries(distractionCounts).sort(([, a], [, b]) => b - a);
   }, [distractionCounts]);

   const iconMap: Record<string, React.ElementType> = {
       'Llamada': Phone,
       'Email Urgente': Mail,
       'Redes Sociales': WifiOff,
       'Otra Idea': Lightbulb,
   };

   return (
       <div>
           <h2 className="text-2xl font-bold text-[#E0E3E8] mb-6">Análisis de Productividad</h2>
           <div className="bg-[#101116] p-6 rounded-2xl">
               <h3 className="text-lg font-semibold text-white mb-4">Ladrones de Foco</h3>
               {sortedDistractions.length === 0 ? (
                   <p className="text-gray-500">No se han registrado interrupciones. ¡Sigue así!</p>
               ) : (
                   <div className="space-y-3">
                       {sortedDistractions.map(([reason, count]) => {
                           const Icon = iconMap[reason] || HelpCircle;
                           return (
                               <div key={reason} className="flex items-center justify-between bg-[#14171E] p-3 rounded-lg">
                                   <div className="flex items-center gap-3">
                                       <Icon className="text-[#6C7581]" size={20} />
                                       <span className="text-white">{reason}</span>
                                   </div>
                                   <span className="font-bold text-lg text-white">{count}</span>
                               </div>
                           );
                       })}
                   </div>
               )}
           </div>
       </div>
   );
};

export default AnalysisView;