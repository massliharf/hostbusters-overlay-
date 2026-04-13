/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Trophy, Users, Skull, Crown, Crosshair, Gift } from 'lucide-react';

// --- Types & Mock Data ---
type HostbustersState = 'idle' | 'opening' | 'intro' | 'clash' | 'result' | 'winners';
type RoundWinnersState = 'idle' | 'show';
type AdminTab = 'hostbusters' | 'round_winners';
type RoundWinnersStage = 'header' | 'expanding' | 'revealing' | 'distributing' | 'celebrating';

const ROUND_WINNERS_DATA = [
  { id: 1, rank: '1', username: 'Username', avatar: 'https://picsum.photos/seed/1/100', xp: '10,000 XP', prize: 25, isYou: false },
  { id: 2, rank: '2', username: 'Username', avatar: 'https://picsum.photos/seed/2/100', xp: '10,000 XP', prize: 15, isYou: false },
  { id: 3, rank: '3', username: 'Username', avatar: 'https://picsum.photos/seed/3/100', xp: '10,000 XP', prize: 10, isYou: false },
  { id: 4, rank: '3.9K', username: 'You', avatar: 'https://picsum.photos/seed/4/100', xp: '10,000 XP', prize: 0, isYou: true }, 
];

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
  const [adminTab, setAdminTab] = useState<AdminTab>('hostbusters');
  const [hostbustersState, setHostbustersState] = useState<HostbustersState>('idle');
  const [roundWinnersState, setRoundWinnersState] = useState<RoundWinnersState>('idle');
  const [userWins, setUserWins] = useState(true);

  // Auto-advance sequence for demonstration
  const startFullSequence = () => {
    setHostbustersState('opening');
    setTimeout(() => setHostbustersState('intro'), 1500);
    setTimeout(() => setHostbustersState('clash'), 4500);
    setTimeout(() => setHostbustersState('result'), 8500);
    setTimeout(() => setHostbustersState('winners'), 12500);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* --- Admin / Director Panel (Hidden from end users) --- */}
      <div className="absolute top-4 left-4 bg-gray-800 p-5 rounded-3xl border-2 border-gray-700 border-b-4 z-50 flex flex-col gap-4 shadow-xl max-w-sm">
        <div className="flex items-center gap-2 text-white mb-2">
          <Zap className="text-yellow-400 fill-yellow-400" size={20} />
          <h3 className="font-extrabold uppercase tracking-wider">Director Panel</h3>
        </div>
        
        {/* Admin Tabs */}
        <div className="flex gap-2 p-1 bg-gray-900 rounded-xl">
          <button
            onClick={() => setAdminTab('hostbusters')}
            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${adminTab === 'hostbusters' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Hostbusters
          </button>
          <button
            onClick={() => setAdminTab('round_winners')}
            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${adminTab === 'round_winners' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Round Winners
          </button>
        </div>

        {adminTab === 'hostbusters' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <button 
              onClick={startFullSequence} 
              className="bg-purple-500 hover:bg-purple-400 text-white px-4 py-3 rounded-xl font-black uppercase tracking-wide border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              Play Full Sequence
            </button>
            
            <div className="bg-gray-900 p-3 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">Hostbusters States</p>
              <div className="flex flex-wrap gap-2">
                {['opening', 'intro', 'clash', 'result', 'winners'].map((state) => (
                  <button 
                    key={state}
                    onClick={() => setHostbustersState(state as HostbustersState)} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border-b-2 active:border-b-0 active:translate-y-0.5 transition-all ${
                      hostbustersState === state 
                        ? 'bg-sky-500 text-white border-sky-700' 
                        : 'bg-gray-700 text-gray-300 border-gray-800 hover:bg-gray-600'
                    }`}
                  >
                    {state}
                  </button>
                ))}
                <button 
                  onClick={() => setHostbustersState('idle')} 
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
        )}

        {adminTab === 'round_winners' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-gray-900 p-3 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">Overlay Control</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setRoundWinnersState('show')} 
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border-b-2 active:border-b-0 active:translate-y-0.5 transition-all ${
                    roundWinnersState === 'show'
                      ? 'bg-sky-500 text-white border-sky-700' 
                      : 'bg-gray-700 text-gray-300 border-gray-800 hover:bg-gray-600'
                  }`}
                >
                  Show Overlay
                </button>
                <button 
                  onClick={() => setRoundWinnersState('idle')} 
                  className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-500/30"
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Live Stream Overlay Containers --- */}
      <AnimatePresence mode="wait">
        {hostbustersState !== 'idle' && (
          <motion.div
            key="hostbusters-overlay-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-none"
          >
            <UnifiedCard state={hostbustersState} userWins={userWins} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {roundWinnersState !== 'idle' && (
          <motion.div
            key="round-winners-overlay-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-none"
          >
            <RoundWinnersCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Unified Card Component ---
// --- Unified Card Component (Strictly for Hostbusters) ---
function UnifiedCard({ state, userWins }: { state: HostbustersState, userWins: boolean }) {
  
  // Determine header title based on state
  const getHeaderTitle = () => {
    switch (state) {
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
        
        <div className="relative z-10 flex flex-col items-center">
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
        animate={{ height: state === 'opening' ? 0 : 'auto' }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="relative bg-white w-full overflow-hidden flex flex-col"
      >
        <div className="flex-1 flex flex-col relative min-h-[320px]">
          <AnimatePresence mode="wait">
            {state === 'winners' ? (
              <WinnersContent key="winners" />
            ) : state !== 'opening' ? (
              <GameFlowContent key="game-flow" flowState={state} userWins={userWins} />
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Round Winners Card Component ---
function RoundWinnersCard() {
  const [stage, setStage] = useState<RoundWinnersStage>('header');

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 50 }}
      transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
      className="relative w-full max-w-sm bg-white rounded-[2rem] flex flex-col overflow-hidden pointer-events-auto border-b-8 border-gray-200"
    >
      {/* Round Winners Header */}
      <div className="p-4 px-5 relative overflow-hidden bg-[#DDF4FF] border-b-[5px] border-[#BAE6FD] text-left z-20">
        {/* Design Icon Pattern - REFINED DENSITY */}
        <div className="absolute inset-0 opacity-[0.05] flex flex-wrap gap-6 p-2 justify-between items-center pointer-events-none rotate-[-5deg] scale-105">
           {[...Array(12)].map((_, i) => {
             const icons = [
               <Trophy key="t" size={20}/>, 
               <Zap key="z" size={20}/>, 
               <div key="d" className="text-xl font-bold">$</div>,
               <Gift key="g" size={20}/>
             ];
             return (
               <div key={i} className="text-[#0DA6F2]">
                 {icons[i % icons.length]}
               </div>
             );
           })}
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col items-start pt-1">
            <h3 className="text-[#0DA6F2] font-black text-[11px] uppercase tracking-[0.2em] mb-0.5">
              ROUND 1/5
            </h3>
            <h2 className="text-[#0F172A] font-[1000] text-[34px] leading-none uppercase tracking-tight">
              WINNERS
            </h2>
          </div>

          {/* Top Prize Pool Pill - COMPACT DESIGN */}
          <div id="prize-pool-origin" className="bg-[#38BDF8] text-white font-black text-xl py-3 px-6 rounded-[1.5rem] shadow-sm flex items-center justify-center min-w-[90px]">
             $50
          </div>
        </div>
      </div>

      {/* Body Area - Animated Height */}
      <motion.div 
        animate={{ height: stage === 'header' ? 0 : 'auto' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative bg-white w-full overflow-hidden flex flex-col px-0"
      >
        <div className={stage === 'header' ? 'h-0' : 'min-h-[350px]'}>
          <RoundWinnersContent stage={stage} setStage={setStage} />
        </div>
      </motion.div>

      {/* Full Celebration Overlay (triggers at end) */}
      <RoundWinnersCelebration stage={stage} />
    </motion.div>
  );
}

// --- Content Components (Rendered inside the unified card body) ---

function GameFlowContent({ flowState, userWins }: { flowState: HostbustersState, userWins: boolean }) {
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
// --- Round Winners Content ---
function RoundWinnersContent({ stage, setStage }: { stage: RoundWinnersStage, setStage: (s: RoundWinnersStage) => void }) {
  const INITIAL_PRIZE_POOL = 50;
  const [totalPrize, setTotalPrize] = useState(INITIAL_PRIZE_POOL);
  const [distributedIndices, setDistributedIndices] = useState<number[]>([]);
  const [flyingCoinIndex, setFlyingCoinIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  // Does the 'You' user exist and win something?
  const youWinner = ROUND_WINNERS_DATA.find(w => w.isYou);
  const youWon = youWinner && youWinner.prize > 0;

  useEffect(() => {
    let isMounted = true;
    
    const runSequence = async () => {
      // Stage 1: Header is visible. Wait for user to see it.
      if (stage === 'header') {
        await new Promise(r => setTimeout(r, 1200));
        if (isMounted) setStage('expanding');
        return;
      }

      // Stage 2: Expanding. Wait for CSS/Motion expansion to finish.
      if (stage === 'expanding') {
        await new Promise(r => setTimeout(r, 800));
        if (isMounted) setStage('revealing');
        return;
      }

      // Stage 3: Revealing People
      if (stage === 'revealing') {
        for (let i = 0; i < ROUND_WINNERS_DATA.length; i++) {
          if (!isMounted) return;
          setVisibleCount(i + 1);
          await new Promise(r => setTimeout(r, 250));
        }
        await new Promise(r => setTimeout(r, 500));
        if (isMounted) setStage('distributing');
        return;
      }

      // Stage 4: Distributing Coins
      if (stage === 'distributing') {
        for (let i = 0; i < ROUND_WINNERS_DATA.length; i++) {
          if (!isMounted) return;
          const winner = ROUND_WINNERS_DATA[i];
          
          if (winner.prize > 0) {
            setFlyingCoinIndex(i);
            await new Promise(r => setTimeout(r, 450));
            if (!isMounted) return;
            
            setFlyingCoinIndex(null);
            setDistributedIndices(prev => [...prev, i]);
            setTotalPrize(prev => Math.max(0, prev - winner.prize));
            
            await new Promise(r => setTimeout(r, 500));
          }
        }
        await new Promise(r => setTimeout(r, 1000));
        if (isMounted) setStage('celebrating');
        return;
      }
    };

    runSequence();
    
    return () => { isMounted = false; };
  }, [stage, setStage]);

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Total Prize Pool Floating Pill - Hidden in design header pill matches now */}
      <AnimatePresence>
        {flyingCoinIndex !== null && (
          <motion.div 
            initial={{ scale: 0, x: 300, y: -100 }}
            animate={{ scale: 1, x: 300, y: -100 }}
            exit={{ scale: 0 }}
            className="absolute z-[100] pointer-events-none"
          >
             {/* This handles the internal fly state if needed, but the list item handles its own coin origin now */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main List */}
      <div className="flex flex-col flex-1 relative overflow-hidden pt-3 pb-5 px-3 gap-1.5">
        <AnimatePresence>
          {ROUND_WINNERS_DATA.slice(0, visibleCount).map((winner, index) => {
            const isDistributed = distributedIndices.includes(index);
            const isFlying = flyingCoinIndex === index;

            return (
              <motion.div 
                key={winner.id} 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center p-2.5 rounded-xl transition-all ${winner.isYou ? 'bg-[#F3F4F6] border border-gray-100' : ''}`}
              >
                {/* Rank */}
                <div className="w-9 shrink-0 flex justify-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                    winner.rank === '1' ? 'bg-[#FDE68A] text-yellow-800 border-2 border-[#FEF3C7]' : 
                    winner.rank === '2' ? 'bg-[#FFCC99] text-orange-900 border-2 border-[#FFEDD5]' : 
                    winner.rank === '3' ? 'bg-[#E2E8F0] text-gray-800 border-2 border-white' : 'text-gray-900 font-extrabold'
                  }`}>
                    {winner.rank}
                  </div>
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-3.5 flex-1 ml-1.5">
                  <div className="relative shrink-0">
                    <img 
                      src={winner.avatar} 
                      alt="" 
                      className={`w-11 h-11 rounded-[0.9rem] object-cover shadow-sm bg-gray-100 border-2 border-white transition-all ${
                        (winner.rank === '1' || winner.rank === '2') ? 'ring-2' : ''
                      }`} 
                      style={{ 
                        ringColor: winner.rank === '1' ? '#FDE68A' : winner.rank === '2' ? '#FFCC99' : 'transparent',
                      }}
                      referrerPolicy="no-referrer" 
                    />
                    {(winner.rank === '1' || winner.rank === '2' || winner.isYou) && (
                      <div className="absolute -bottom-1 -right-0.5 bg-[#FFD700] rounded-full p-0.5 border border-white shadow-sm">
                        <Crown size={10} className="text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-black text-[15px] leading-tight ${
                      (winner.rank === '1' || winner.rank === '2' || winner.isYou) ? 'text-[#F97316]' : 'text-[#1E293B]'
                    }`}>
                      {winner.username}
                    </span>
                    <span className="text-gray-400 font-bold text-[11px] tracking-wide">
                      {winner.xp}
                    </span>
                  </div>
                </div>

                {/* Prize Slot */}
                <div className="w-[85px] shrink-0 flex items-center justify-end relative h-10">
                  {winner.prize > 0 ? (
                    <>
                      {/* Box Background */}
                      <div className={`w-full h-full rounded-[1rem] bg-[#F8FAFC] transition-opacity duration-300 ${isDistributed ? 'opacity-0' : 'opacity-100'}`} />
                      
                      {/* Money Pill Box - COMPACT */}
                      <AnimatePresence>
                        {isDistributed && (
                          <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 bg-[#38BDF8] text-white font-black text-lg rounded-[1rem] flex items-center justify-center shadow-sm"
                          >
                            ${winner.prize}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Coin Flight - Originating from top-right pool area */}
                      <AnimatePresence>
                        {isFlying && (
                          <motion.div
                            initial={{ y: -120, x: 40, scale: 0.5, opacity: 0 }}
                            animate={{ y: 0, x: 0, scale: 1.1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 150, damping: 15 }}
                            className="absolute right-[-20px] top-[-60px] bg-yellow-400 rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-lg z-30"
                          >
                            <span className="text-yellow-700 font-[1000] text-[10px]">$</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : winner.isYou ? (
                     <div className="text-[11px] font-bold text-[#991B1B] leading-tight text-center py-2 px-3 rounded-xl bg-[#FEE2E2] shadow-sm border border-[#FECACA] whitespace-nowrap">
                        Already won!
                    </div>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Celebration Overlay ---
function RoundWinnersCelebration({ stage }: { stage: RoundWinnersStage }) {
  const youWinner = ROUND_WINNERS_DATA.find(w => w.isYou);
  if (!youWinner) return null;

  return (
    <AnimatePresence>
      {stage === 'celebrating' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[100] bg-[#CAFFD7] flex flex-col items-center justify-center text-center px-6 pt-12 pb-24 pointer-events-auto"
        >
          {/* Background Coins Pattern - REFINED DENSITY & STYLE */}
          <div className="absolute inset-0 opacity-[0.12] flex flex-wrap gap-12 p-8 justify-around items-center pointer-events-none rotate-[-8deg]">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-12 h-8 border-2 border-[#4ADE80] rounded-[6px] flex items-center justify-center font-black text-[#4ADE80] text-xl">
                $
              </div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
            className="z-10 flex flex-col items-center -mt-8"
          >
            <h2 className="text-[#0F172A] font-[900] text-[15px] uppercase tracking-[0.4em] mb-6">
              YOU WIN!
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img src={youWinner.avatar} alt="You" className="w-16 h-16 rounded-[1.25rem] bg-gray-100 shadow-md border-[3px] border-white" />
                <div className="absolute -bottom-1 -right-1 bg-[#FFD700] rounded-full p-0.5 border-[2px] border-white shadow-sm">
                  <Crown size={12} className="text-white fill-white" />
                </div>
              </div>
              <span className="font-[1000] text-[#0F172A] text-[44px] leading-none tracking-tight">
                JohanGamer
              </span>
            </div>

            <div className="relative mb-0 py-2">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: [0.8, 1.05, 1] }}
                 transition={{ delay: 0.4, duration: 0.5 }}
                 className="text-[#0F172A] font-[1000] text-[120px] leading-[1.1] tracking-[-0.05em]"
               >
                 $50
               </motion.div>
            </div>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-[#0F172A] font-[900] text-[22px] tracking-tight -mt-1"
            >
              Lands in your pocket!
            </motion.p>
          </motion.div>

          {/* Bottom Branding Bar - PERFECT DESIGN MATCH */}
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-[2rem] p-4 py-3 flex items-center justify-between shadow-xl z-20 border border-gray-100/50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#1D4ED8] rounded-[14px] flex items-center justify-center p-2 shadow-sm">
                {/* Spectacles Logo as in design */}
                <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current">
                   <path d="M12 9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 4c0-3.31 2.69-6 6-6s6 2.69 6 6 2.69 6 6 6h-2c0-2.21-1.79-4-4-4s-4 1.79-4 4H5z" opacity=".3"/>
                   <path d="M7 14.5c0 1.38-1.12 2.5-2.5 2.5S2 15.88 2 14.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5zm15 0c0 1.38-1.12 2.5-2.5 2.5S17 15.88 17 14.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5zM6.5 14.5h11" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                   <circle cx="4.5" cy="14.5" r="2" fill="white"/>
                   <circle cx="19.5" cy="14.5" r="2" fill="white"/>
                </svg>
              </div>
              <span className="text-[#0F172A] font-[1000] text-[24px] tracking-tighter uppercase">TEXT SAVVY</span>
            </div>
            <div className="text-[#94A3B8] font-bold text-[15px] uppercase tracking-wider pr-2">
               TUE, MAR 31, 2026
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
