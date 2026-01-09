import React, { useMemo, useEffect, useState } from 'react';
import { TravelPlan } from '../types';
import { Compass, Sparkles, Flag, Anchor, Loader2 } from 'lucide-react';
import { generateMonumentArt } from '../geminiService';

interface Props {
  plan: TravelPlan;
}

interface MapNode {
  name: string;
  type: string;
  day: number;
  x: number;
  y: number;
  imageUrl?: string | null;
}

const TripMap: React.FC<Props> = ({ plan }) => {
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [loadingArt, setLoadingArt] = useState(false);

  // Initialize nodes with safe-zones to prevent clipping of polaroid frames
  const baseNodes = useMemo(() => {
    const list: any[] = [];
    plan.itinerary.forEach(day => {
      day.activities.forEach(activity => {
        list.push({ name: activity.name, type: 'activity', day: day.day });
      });
    });
    
    // Pick key highlights (max 6) to keep the diagram clean
    const subset = list.slice(0, 6);
    
    return subset.map((node, i) => {
      const progress = i / (subset.length - 1 || 1);
      const isEven = i % 2 === 0;
      
      // Safe horizontal range (30% to 70%) to leave room for stamps
      const x = isEven ? 30 + (Math.sin(i) * 5) : 70 - (Math.sin(i) * 5);
      
      // Safe vertical range (25% to 85%) to leave room for the stamp above/below
      const y = 25 + (progress * 60); 
      
      return { ...node, x, y };
    });
  }, [plan]);

  useEffect(() => {
    let active = true;
    const fetchArt = async () => {
      setLoadingArt(true);
      const nodesWithArt = await Promise.all(baseNodes.map(async (node) => {
        const art = await generateMonumentArt(node.name, plan.destination);
        return { ...node, imageUrl: art };
      }));
      if (active) {
        setNodes(nodesWithArt);
        setLoadingArt(false);
      }
    };
    fetchArt();
    return () => { active = false; };
  }, [baseNodes, plan.destination]);

  // Generate smooth cubic Bezier path
  const pathData = useMemo(() => {
    if (nodes.length < 2) return "";
    let d = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) {
      const curr = nodes[i];
      const prev = nodes[i - 1];
      const cp1y = prev.y + (curr.y - prev.y) / 2;
      const cp2y = cp1y;
      d += ` C ${prev.x} ${cp1y}, ${curr.x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [nodes]);

  return (
    <div className="relative w-full h-[800px] overflow-hidden rounded-[3.5rem] bg-[#f4e4bc] border-[16px] border-white shadow-2xl group scroll-container">
      {/* Hand-painted aesthetic textures */}
      <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')]"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4)_0%,transparent_100%)]"></div>
      
      {/* Decorative Headers */}
      <div className="absolute top-12 left-12 z-10 opacity-30 pointer-events-none">
        <div className="font-handwriting text-2xl text-[#8b5e34] -rotate-12 border-b-2 border-[#8b5e34]/20 pb-1">
          Travel Journal
        </div>
      </div>

      <div className="absolute bottom-12 right-12 z-10 opacity-30">
        <Compass className="w-24 h-24 text-[#8b5e34] animate-[spin_40s_linear_infinite]" />
      </div>

      <div className="relative w-full h-full">
        {loadingArt && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#e6dcc5] shadow-xl">
            <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
            <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">Sketching Landmarks...</span>
          </div>
        )}

        {/* Base SVG Layer */}
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <path d="M0,2 L10,5 L0,8 L1,5 Z" fill="#1a1a1a" />
            </marker>
            <filter id="shadowLine" x="-10%" y="-10%" width="120%" height="120%">
              <feOffset in="SourceAlpha" dx="0.2" dy="0.2" result="offset" />
              <feGaussianBlur in="offset" stdDeviation="0.1" result="blur" />
              <feFlood floodColor="#8b5e34" floodOpacity="0.2" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main Journey Path - Designer Solid Black Arrow */}
          <path 
            d={pathData} 
            fill="none" 
            stroke="#1a1a1a" 
            strokeWidth="0.5" 
            strokeLinecap="round"
            markerEnd="url(#arrowhead)"
            className="journey-trail-designer"
            filter="url(#shadowLine)"
          />
        </svg>

        {/* Floating Content Overlay */}
        {nodes.map((node, i) => (
          <div
            key={i}
            className="absolute transition-all duration-700 hover:z-50"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Monument Polaroid Style Frame */}
            {node.imageUrl && (
              <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-500 group-hover:scale-105 ${i % 2 === 0 ? '-rotate-2' : 'rotate-2'}`}>
                <div className="bg-white p-1.5 pb-4 shadow-2xl border border-slate-100 w-28 sm:w-36 transform-gpu group-hover:rotate-0">
                  <div className="relative overflow-hidden aspect-square bg-slate-50">
                    <img 
                      src={node.imageUrl} 
                      alt={node.name} 
                      className="w-full h-full object-cover grayscale-[0.2] sepia-[0.1]" 
                    />
                  </div>
                  <div className="mt-2 text-center overflow-hidden">
                    <span className="block text-[8px] font-bold text-slate-500 italic truncate px-1 font-handwriting">"{node.name}"</span>
                  </div>
                </div>
              </div>
            )}

            {/* Path Marker Node */}
            <div className="relative group/node">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shadow-xl cursor-pointer
                backdrop-blur-md border-[2.5px] border-white/90 
                ${i === 0 ? 'bg-blue-600' : i === nodes.length - 1 ? 'bg-rose-600' : 'bg-[#1a1a1a]'}
                text-white transition-all hover:scale-110
              `}>
                {i === 0 ? <Flag className="w-4 h-4" /> : i === nodes.length - 1 ? <Anchor className="w-4 h-4" /> : <Sparkles className="w-3 h-3" />}
              </div>

              {/* Hover Tooltip */}
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-all duration-300 pointer-events-none z-[100]">
                <div className="bg-[#2d241e] text-white px-4 py-1.5 rounded-xl whitespace-nowrap shadow-2xl border border-white/10 flex items-center gap-2">
                  <span className="text-[10px] font-black text-amber-500">DAY {node.day}</span>
                  <span className="text-xs font-bold font-handwriting">{node.name}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .scroll-container {
          box-shadow: 
            0 35px 60px -15px rgba(0, 0, 0, 0.2),
            inset 0 0 100px rgba(139, 94, 52, 0.15);
        }
        .journey-trail-designer {
          transition: stroke-width 0.3s ease;
        }
        .font-handwriting {
          font-family: 'Caveat', cursive;
        }
      `}</style>
    </div>
  );
};

export default TripMap;