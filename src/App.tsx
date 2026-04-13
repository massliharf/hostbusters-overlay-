/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Trophy, Users, Skull, Crown, Crosshair, Gift } from 'lucide-react';

// --- Types & Mock Data ---
type FlowState = 'idle' | 'opening' | 'intro' | 'clash' | 'result' | 'winners';

const MOCK_WINNERS = [
  { id: 1, username: 'AlexHunter', avatar: 'https://picsum.photos/seed/alex/100', prize: 50 },
  { id: 2, username: 'SarahWin', avatar: 'https://picsum.photos/seed/sarah/100', prize: 50 },
  { id: 3, username: 'MikePro', avatar: 'https://picsum.photos/seed/mike/100', prize: 50 },
  { id: 4, username: 'JohnDoe', avatar: 'https://picsum.photos/seed/john/100', prize: 50 },
  { id: 5, username: 'JaneSmith', avatar: 'https://picsum.photos/seed/jane/100', prize: 50 },
  { id: 6, username: 'EpicGamer', avatar: 'https://picsum.photos/seed/epic/100', prize: 50 },
];

// --- Main App Component ---
export default function App() {
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [userWins, setUserWins] = useState(true);

  // Auto-advance sequence for demonstration
  const startFullSequence = () => {
    setFlowState('opening');
    setTimeout(() => setFlowState('intro'), 1500);
    setTimeout(() => setFlowState('clash'), 4500);
    setTimeout(() => setFlowState('result'), 8500);
    setTimeout(() => setFlowState('winners'), 12500);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* --- Admin / Director Panel (Hidden from end users) --- */}
      <div className="absolute top-4 left-4 bg-gray-800 p-5 rounded-3xl border-2 border-gray-700 border-b-4 z-50 flex flex-col gap-4 shadow-xl max-w-xs">
        <div className="flex items-center gap-2 text-white">
          <Zap className="text-yellow-400 fill-yellow-400" size={20} />
          <h3 className="font-extrabold uppercase tracking-wider">Director Panel</h3>
        </div>
        
        <button 
          onClick={startFullSequence} 
          className="bg-purple-500 hover:bg-purple-400 text-white px-4 py-3 rounded-xl font-black uppercase tracking-wide border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 transition-all"
        >
          Play Full Sequence
        </button>
        
        <div className="bg-gray-900 p-3 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-xs font-bold uppercase mb-2">Manual State Control</p>
          <div className="flex flex-wrap gap-2">
            {['opening', 'intro', 'clash', 'result', 'winners'].map((state) => (
              <button 
                key={state}
                onClick={() => setFlowState(state as FlowState)} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border-b-2 active:border-b-0 active:translate-y-0.5 transition-all ${
                  flowState === state 
                    ? 'bg-sky-500 text-white border-sky-700' 
                    : 'bg-gray-700 text-gray-300 border-gray-800 hover:bg-gray-600'
                }`}
              >
                {state}
              </button>
            ))}
            <button 
              onClick={() => setFlowState('idle')} 
              className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-500/30"
            >
              Hide
            </button>
          </div>
        </div>

        <label className="flex items-center gap-3 text-white font-bold cursor-pointer bg-gray-700 p-3 rounded-xl border-b-2 border-gray-800">
          <input 
            type="checkbox" 
            checked={userWins} 
            onChange={e => setUserWins(e.target.checked)} 
            className="w-5 h-5 rounded accent-sky-500"
          />
          User Wins Clash
        </label>
      </div>

      {/* --- Live Stream Overlay Container --- */}
      <AnimatePresence mode="wait">
        {flowState !== 'idle' && (
          <motion.div
            key="overlay-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-none"
          >
            <UnifiedCard flowState={flowState} userWins={userWins} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Unified Card Component ---
// This creates the seamless transition by keeping the container and header consistent
function UnifiedCard({ flowState, userWins }: { flowState: FlowState, userWins: boolean }) {
  
  // Determine header title based on state
  const getHeaderTitle = () => {
    switch (flowState) {
      case 'opening':
      case 'intro':
      case 'clash':
      case 'result':
        return 'PRIZE RAFFLE';
      case 'winners':
        return 'WINNERS';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 50 }}
      transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
      className="relative w-full max-w-sm bg-white rounded-[2rem] flex flex-col overflow-hidden pointer-events-auto border-b-8 border-gray-200"
    >
      {/* Unified Header */}
      <div className="bg-[#E0DDFE] p-6 text-center relative overflow-hidden border-b-4 border-[#C4BFFE] rounded-b-[2rem] z-10">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 justify-center items-center pointer-events-none">
           {[...Array(20)].map((_, i) => (
             <div key={i} className="w-8 h-8 border-2 border-indigo-900 rounded-lg rotate-12 flex items-center justify-center">
               <span className="text-indigo-900 font-bold text-xs">$</span>
             </div>
           ))}
        </div>
        
        <div className="relative z-10">
          <h3 className="text-indigo-950 font-extrabold text-xs uppercase tracking-[0.2em] mb-1">
            HOSTBUSTERS
          </h3>
          <AnimatePresence mode="wait">
            <motion.h2 
              key={getHeaderTitle()}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[#0F172A] font-black text-4xl uppercase tracking-tight"
            >
              {getHeaderTitle()}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic Body Content */}
      <motion.div 
        initial={false}
        animate={{ height: flowState === 'opening' ? 0 : 'auto' }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="relative bg-white w-full overflow-hidden flex flex-col"
      >
        <div className="flex-1 flex flex-col relative min-h-[320px]">
          <AnimatePresence mode="wait">
            {flowState === 'winners' ? (
              <WinnersContent key="winners" />
            ) : flowState !== 'opening' ? (
              <GameFlowContent key="game-flow" flowState={flowState} userWins={userWins} />
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Content Components (Rendered inside the unified card body) ---

function GameFlowContent({ flowState, userWins }: { flowState: FlowState, userWins: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col p-6 gap-2"
    >
      {/* TOP SLOT: Fixed height for visual consistency */}
      <div className="h-16 w-full flex items-center justify-center shrink-0">
        <AnimatePresence mode="wait">
          {(flowState === 'clash' || flowState === 'result') && (
            <motion.div 
              key="clash-top"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full"
            >
              <ClashBars userWins={userWins} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM SLOT: Flex-1 for dynamic content */}
      <div className="flex-1 relative w-full flex items-center justify-center mt-2">
        <AnimatePresence mode="wait">
          {flowState === 'intro' && (
            <motion.div 
              key="intro-bottom"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <p className="text-gray-400 font-extrabold uppercase tracking-widest text-sm mb-2">
                Chance to win
              </p>
              <div className="bg-yellow-400 text-yellow-900 font-black text-6xl px-8 py-4 rounded-3xl inline-block">
                $50
              </div>
            </motion.div>
          )}
          
          {flowState === 'clash' && (
            <motion.div 
              key="clash-bottom"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
               <h2 className="font-black text-xl uppercase tracking-widest text-gray-400">
                 Calculating XP...
               </h2>
            </motion.div>
          )}

          {flowState === 'result' && (
            <motion.div 
              key="result-bottom"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center w-full"
            >
              <h2 className={`font-black text-2xl uppercase tracking-widest mb-1 ${
                userWins ? 'text-green-500' : 'text-gray-500'
              }`}>
                {userWins ? 'HOSTBUSTER!' : 'NICE TRY'}
              </h2>
              
              <p className={`font-extrabold text-sm mb-4 ${userWins ? 'text-green-600' : 'text-gray-400'}`}>
                {userWins ? "You’re in the running for $50" : "Close but no cash..."}
              </p>

              <div className="bg-gray-100 rounded-2xl p-3 flex items-center justify-center gap-2 border-2 border-gray-200 w-full max-w-[220px]">
                <Users size={18} className="text-gray-500" />
                <span className="font-black tracking-wide text-gray-600 text-xs">1,245 players qualified</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ClashBars({ userWins }: { userWins: boolean }) {
  return (
    <div className="flex items-center w-full gap-2 relative">
      {/* User Avatar */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <img src="https://picsum.photos/seed/user/100" alt="You" className="w-10 h-10 rounded-xl border-2 border-sky-400 object-cover shadow-sm" referrerPolicy="no-referrer" />
        <span className="text-sky-500 font-black text-[9px] uppercase tracking-wider">You</span>
      </div>

      {/* Bars Container */}
      <div className="flex-1 flex items-center h-8 relative">
        {/* User Bar */}
        <div className="flex-1 h-full bg-gray-100 rounded-l-xl relative border-2 border-gray-200 border-r-0 overflow-hidden shadow-inner">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-sky-500" 
            initial={{ width: "0%" }} 
            animate={{ width: userWins ? '100%' : '40%' }} 
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} 
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-white drop-shadow-md z-10">
            {userWins ? '2,450' : '1,200'} XP
          </span>
        </div>
        
        {/* VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-200 shadow-sm">
           <span className="text-gray-400 font-black italic text-[8px]">VS</span>
        </div>

        {/* Host Bar */}
        <div className="flex-1 h-full bg-gray-100 rounded-r-xl relative border-2 border-gray-200 border-l-0 overflow-hidden shadow-inner">
          <motion.div 
            className="absolute right-0 top-0 bottom-0 bg-red-500" 
            initial={{ width: "0%" }} 
            animate={{ width: userWins ? '40%' : '100%' }} 
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} 
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-white drop-shadow-md z-10">
            {userWins ? '1,200' : '2,450'} XP
          </span>
        </div>
      </div>

      {/* Host Avatar */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <img src="https://picsum.photos/seed/host/100" alt="Host" className="w-10 h-10 rounded-xl border-2 border-red-400 object-cover shadow-sm" referrerPolicy="no-referrer" />
        <span className="text-red-500 font-black text-[9px] uppercase tracking-wider">Host</span>
      </div>
    </div>
  );
}

function WinnersContent() {
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const PAGE_SIZE = 3;

  useEffect(() => {
    let isMounted = true;
    
    const runSequence = async () => {
      for (let i = 1; i <= MOCK_WINNERS.length; i++) {
        if (!isMounted) return;
        
        // Wait before revealing the next one
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (!isMounted) return;
        
        setRevealedCount(i);
        
        // If we just revealed the last item on the current page, and there are more pages
        if (i % PAGE_SIZE === 0 && i < MOCK_WINNERS.length) {
          // Wait a bit for users to see the full page
          await new Promise(resolve => setTimeout(resolve, 2500));
          if (!isMounted) return;
          
          // Turn the page
          setCurrentPage(p => p + 1);
          
          // Wait for the page turn animation to finish before revealing the next item
          await new Promise(resolve => setTimeout(resolve, 500)); 
        }
      }
    };
    
    runSequence();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const currentWinners = MOCK_WINNERS
    .map((w, i) => ({ ...w, absoluteIndex: i }))
    .slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full w-full absolute inset-0"
    >
      {/* List */}
      <div className="flex flex-col p-2 flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            {currentWinners.map((winner) => (
              <div key={winner.id} className="flex items-center justify-between p-4 border-b-2 border-gray-100 last:border-0">
                <SlotMachineReveal isRevealed={winner.absoluteIndex < revealedCount} winner={winner} />
                
                {/* Prize is always visible */}
                <div className="bg-[#0DA6F2] text-white font-black text-xl px-5 py-2.5 rounded-xl shrink-0 ml-4 flex items-center justify-center min-w-[80px]">
                  ${winner.prize}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-5 border-t-2 border-gray-100 flex items-center justify-between mt-auto shrink-0">
        <span className="text-gray-500 font-extrabold text-sm uppercase tracking-wider">
          {revealedCount < MOCK_WINNERS.length ? 'Revealing winners...' : 'All revealed!'}
        </span>
        <div className="bg-gray-200 text-gray-700 font-black text-xs px-4 py-2 rounded-full uppercase tracking-widest">
          {revealedCount}/{MOCK_WINNERS.length} WINNERS
        </div>
      </div>
    </motion.div>
  );
}

// --- Helper Component: Slot Machine Reveal ---
function SlotMachineReveal({ isRevealed, winner }: { isRevealed: boolean, winner: any }) {
  return (
    <div className="relative h-12 flex-1 overflow-hidden flex items-center">
      <AnimatePresence mode="popLayout">
        {!isRevealed ? (
          <motion.div
            key="spinning"
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 w-full absolute inset-0"
          >
             {/* Avatar Placeholder Slot */}
             <div className="w-12 h-12 rounded-xl bg-[#DDF4FF] relative overflow-hidden shrink-0">
                <motion.div 
                  animate={{ y: [0, -48] }} 
                  transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="w-full h-12 bg-[#DDF4FF] shrink-0" />
                  <div className="w-full h-12 bg-[#BAE6FD] shrink-0" />
                </motion.div>
             </div>
             {/* Name Placeholder Slot */}
             <div className="h-7 w-32 rounded-full bg-[#DDF4FF] relative overflow-hidden">
                <motion.div 
                  animate={{ y: [0, -28] }} 
                  transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="w-full h-7 bg-[#DDF4FF] shrink-0" />
                  <div className="w-full h-7 bg-[#BAE6FD] shrink-0" />
                </motion.div>
             </div>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex items-center gap-3 w-full absolute inset-0"
          >
            <div className="relative shrink-0">
              <img 
                src={winner.avatar} 
                alt="" 
                className="w-12 h-12 rounded-xl border-2 border-yellow-400 object-cover bg-white" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute -bottom-1.5 -right-1.5 bg-yellow-400 rounded-full p-0.5 border-2 border-white">
                <Crown size={12} className="text-white fill-white" />
              </div>
            </div>
            <span className="font-extrabold text-orange-500 text-xl truncate">
              {winner.username}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

