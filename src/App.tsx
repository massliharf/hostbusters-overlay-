/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Crown, Users } from 'lucide-react';

// --- Types & Mock Data ---
type HostbustersState = 'idle' | 'opening' | 'intro' | 'clash' | 'result' | 'winners';
type RoundWinnersState = 'idle' | 'show';
type AdminTab = 'hostbusters' | 'round_winners' | 'prize_pool';
type RoundWinnersStage = 'header' | 'expanding' | 'revealing' | 'distributing' | 'celebrating' | 'done';

const ROUND_WINNERS_DATA_BASE = [
  { id: 1, rank: '1', username: 'Username', avatar: 'https://picsum.photos/seed/1/100', xp: '10,000 XP', prize: 25, isYou: false },
  { id: 2, rank: '2', username: 'Username', avatar: 'https://picsum.photos/seed/2/100', xp: '10,000 XP', prize: 15, isYou: false },
  { id: 3, rank: '3', username: 'Username', avatar: 'https://picsum.photos/seed/3/100', xp: '10,000 XP', prize: 10, isYou: false },
  { id: 4, rank: '3.9K', username: 'You', avatar: 'https://picsum.photos/seed/4/100', xp: '10,000 XP', prize: 0, isYou: true }, 
];

type WinnerData = typeof ROUND_WINNERS_DATA_BASE[number];
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
  const [roundWinnersKey, setRoundWinnersKey] = useState(0);
  const [prizePoolState, setPrizePoolState] = useState<'idle' | 'show'>('idle');
  const [prizePoolKey, setPrizePoolKey] = useState(0);
  
  const [userWins, setUserWins] = useState(true);
  const [userWinsRoundPrize, setUserWinsRoundPrize] = useState(false);

  const resetPrizePool = () => {
    setPrizePoolState('idle');
    setTimeout(() => {
      setPrizePoolKey(k => k + 1);
      setPrizePoolState('show');
    }, 80);
  };

  const resetRoundWinners = () => {
    setRoundWinnersState('idle');
    setTimeout(() => {
      setRoundWinnersKey(k => k + 1);
      setRoundWinnersState('show');
    }, 80);
  };

  // Auto-advance sequence for demonstration
  const startFullSequence = () => {
    setHostbustersState('opening');
    setTimeout(() => setHostbustersState('intro'), 1500);
    setTimeout(() => setHostbustersState('clash'), 4500);
    setTimeout(() => setHostbustersState('result'), 8500);
    setTimeout(() => setHostbustersState('winners'), 12500);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 font-sans overflow-hidden">

      {/* ── Minimal Centered Control Bar ── */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-white/[0.06] backdrop-blur-sm rounded-full p-1 border border-white/10">
          <button
            onClick={() => setAdminTab('hostbusters')}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
              adminTab === 'hostbusters'
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Hostbusters
          </button>
          <button
            onClick={() => setAdminTab('round_winners')}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
              adminTab === 'round_winners'
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Round Winners
          </button>
          <button
            onClick={() => setAdminTab('prize_pool')}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
              adminTab === 'prize_pool'
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Prize Pool
          </button>
        </div>

        {/* Hostbusters controls */}
        {adminTab === 'hostbusters' && (
          <div className="flex flex-col items-center gap-2.5">
            {/* Action buttons row */}
            <div className="flex items-center gap-2">
              <button
                onClick={startFullSequence}
                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/40 transition-all"
              >
                ▶ Play
              </button>
              <button
                onClick={() => setHostbustersState('idle')}
                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                Hide
              </button>
            </div>
            {/* Timeline steps */}
            <div className="flex items-center gap-1">
              {(['opening', 'intro', 'clash', 'result', 'winners'] as HostbustersState[]).map((state, i) => (
                <React.Fragment key={state}>
                  {i > 0 && <div className="w-3 h-px bg-white/15" />}
                  <button
                    onClick={() => setHostbustersState(state)}
                    title={state}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className={`w-2 h-2 rounded-full transition-all ${
                      hostbustersState === state
                        ? 'bg-sky-400 scale-125'
                        : 'bg-white/20 hover:bg-white/50'
                    }`} />
                    <span className={`text-[8px] uppercase tracking-wider font-bold transition-colors ${
                      hostbustersState === state ? 'text-sky-400' : 'text-white/25 group-hover:text-white/50'
                    }`}>{state}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
            {/* User wins toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setUserWins(v => !v)}
                className={`w-8 h-4 rounded-full transition-colors relative ${
                  userWins ? 'bg-sky-500' : 'bg-white/20'
                }`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${
                  userWins ? 'left-[18px]' : 'left-0.5'
                }`} />
              </div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">User Wins</span>
            </label>
          </div>
        )}

        {/* Round Winners controls */}
        {adminTab === 'round_winners' && (
          <div className="flex flex-col items-center gap-2.5">
            {/* Action buttons row */}
            <div className="flex items-center gap-2">
              <button
                onClick={resetRoundWinners}
                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/40 transition-all"
              >
                ▶ Play
              </button>
              <button
                onClick={resetRoundWinners}
                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/10 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30 transition-all"
              >
                ↺ Reset
              </button>
              <button
                onClick={() => setRoundWinnersState('idle')}
                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                Hide
              </button>
            </div>
            {/* User wins round prize toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setUserWinsRoundPrize(v => !v)}
                className={`w-8 h-4 rounded-full transition-colors relative ${
                  userWinsRoundPrize ? 'bg-sky-500' : 'bg-white/20'
                }`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${
                  userWinsRoundPrize ? 'left-[18px]' : 'left-0.5'
                }`} />
              </div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">User Wins Prize</span>
            </label>
          </div>
        )}

        {/* Prize Pool controls */}
        {adminTab === 'prize_pool' && (
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={resetPrizePool}
                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/40 transition-all"
              >
                ▶ Play
              </button>
              <button
                onClick={resetPrizePool}
                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/10 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30 transition-all"
              >
                ↺ Reset
              </button>
              <button
                onClick={() => setPrizePoolState('idle')}
                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                Hide
              </button>
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
            exit={{ opacity: 0, transition: { delay: 0.4 } }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-none"
          >
            <UnifiedCard 
              state={hostbustersState} 
              userWins={userWins} 
              onClose={() => setHostbustersState('idle')} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {roundWinnersState !== 'idle' && (
          <motion.div
            key="round-winners-overlay-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.4 } }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-none"
          >
            <RoundWinnersCard 
              key={roundWinnersKey} 
              userWinsRoundPrize={userWinsRoundPrize} 
              onClose={() => setRoundWinnersState('idle')} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {prizePoolState !== 'idle' && (
          <motion.div
            key="prize-pool-overlay-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.4 } }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-none"
          >
            <PrizePoolCard 
              key={prizePoolKey} 
              onClose={() => setPrizePoolState('idle')} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Unified Card Component ---
// --- Unified Card Component (Strictly for Hostbusters) ---
function UnifiedCard({ state, userWins, onClose }: { state: HostbustersState, userWins: boolean, onClose?: () => void }) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [winnersDone, setWinnersDone] = useState(false);
  const celebRef = React.useRef(false);

  useEffect(() => {
    if (state === 'winners' && userWins && !celebRef.current) {
      celebRef.current = true;
      setShowCelebration(true);
      const t = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(t);
    }
  }, [state, userWins]);

  useEffect(() => {
    if (state === 'winners' && winnersDone) {
      const t = setTimeout(() => {
        if (onClose) onClose();
      }, 4000); 
      return () => clearTimeout(t);
    } else if (state !== 'winners') {
      setWinnersDone(false);
    }
  }, [state, winnersDone, onClose]);

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
      animate={{ scale: 1, opacity: 1, y: 0, height: "auto" }}
      exit={{ 
        height: 0, 
        opacity: 0, 
        transition: { 
          height: { duration: 0.4, ease: "easeInOut" }, 
          opacity: { duration: 0.3, delay: 0.1 } 
        } 
      }}
      transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
      className="relative w-full max-w-sm bg-white rounded-[2rem] overflow-hidden pointer-events-auto grid items-center"
    >
      <div className="w-full relative flex flex-col">
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
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="relative bg-white w-full overflow-hidden flex flex-col"
      >
        <div className="flex-1 flex flex-col relative min-h-[320px]">
          <AnimatePresence mode="wait">
            {state === 'winners' ? (
              <WinnersContent key="winners" onComplete={() => setWinnersDone(true)} />
            ) : state !== 'opening' ? (
              <GameFlowContent key="game-flow" flowState={state} userWins={userWins} />
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── You Win celebration overlay — covers full card including header ── */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#CAFFD7] rounded-[2rem] z-50 flex flex-col items-center justify-center text-center px-8"
          >
            {/* bg pattern */}
            <div className="absolute inset-0 opacity-[0.08] rotate-[-6deg] flex flex-wrap gap-10 items-center justify-around pointer-events-none p-6">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`text-[#22C55E] font-[900] text-[${i % 2 === 0 ? '32' : '22'}px]`}>
                  {i % 2 === 0 ? '$' : '★'}
                </div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', bounce: 0.35 }}
              className="relative z-10 flex flex-col items-center gap-3"
            >
              <p className="text-[#0F172A] font-[900] text-[13px] uppercase tracking-[0.4em]">YOU WIN!</p>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src="https://picsum.photos/seed/user/100" alt="You" referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-[1rem] object-cover border-[3px] border-white bg-gray-100" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FFD700] rounded-full border-[2px] border-white flex items-center justify-center">
                    <Crown size={9} className="text-white fill-white" />
                  </div>
                </div>
                <span className="font-[900] text-[36px] text-[#0F172A] leading-none tracking-tight">You</span>
              </div>

              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }}
                className="text-[#0F172A] font-[900] text-[80px] leading-none tracking-[-0.04em]"
              >
                $50
              </motion.div>

              <motion.p
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#0F172A] font-[800] text-[16px] tracking-tight"
              >
                Lands in your pocket!
              </motion.p>
            </motion.div>

            {/* branding bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-[1.5rem] px-5 py-3 flex items-center justify-between z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#1D4ED8] rounded-[10px] flex items-center justify-center">
                  <Zap size={16} className="text-white fill-white" />
                </div>
                <span className="text-[#0F172A] font-[900] text-[18px] tracking-tight uppercase">TEXT SAVVY</span>
              </div>
              <span className="text-[#94A3B8] font-[700] text-[12px] uppercase tracking-wider">TUE, MAR 31, 2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ROUND WINNERS — 3 screens, driven by a plain step counter via setTimeout
// Step 0 → Screen 1: header alone (prize pill visible)
// Step 1 → Screen 2: body expands, tiles reveal one-by-one, then coins fly
// Step 2 → Screen 3: "You Win" celebration (only when userWinsRoundPrize)
// ─────────────────────────────────────────────────────────────────────────────
const WINNERS = [
  { id: 1, rank: '1', username: 'Username', avatar: 'https://picsum.photos/seed/w1/100', prize: 25 },
  { id: 2, rank: '2', username: 'Username', avatar: 'https://picsum.photos/seed/w2/100', prize: 15 },
  { id: 3, rank: '3', username: 'Username', avatar: 'https://picsum.photos/seed/w3/100', prize: 10 },
];
const TOTAL_PRIZE = 50;

function RoundWinnersCard({ userWinsRoundPrize, onClose }: { userWinsRoundPrize: boolean, onClose?: () => void }) {
  // ── step: which screen we're on ──────────────────────────────────────────
  const [step, setStep] = useState(0);           // 0=header, 1=list, 2=celebrate
  // ── screen 1 state ───────────────────────────────────────────────────────
  const [headerPrize, setHeaderPrize] = useState(TOTAL_PRIZE);
  const [headerOut,   setHeaderOut]   = useState(false);
  // ── screen 2 state ───────────────────────────────────────────────────────
  const [revealed,    setRevealed]    = useState<number[]>([]);  // winner ids revealed
  const [flying,      setFlying]      = useState<number | null>(null); // winner id flying coin
  const [landed,      setLanded]      = useState<number[]>([]);  // winner ids that received prize

  // Only run once on mount. Use a ref-guarded chain so React Strict Mode is harmless.
  const runRef = React.useRef(false);

  useEffect(() => {
    if (runRef.current) return;   // skip the second Strict-Mode invocation
    runRef.current = true;

    const t = (ms: number, fn: () => void) => setTimeout(fn, ms);
    let offset = 0;

    // ── SCREEN 1: header visible alone ────────────────────────────────────
    // (nothing to do, step=0 is already rendered)

    // ── Transition → SCREEN 2 ─────────────────────────────────────────────
    offset += 1800;  // header alone — viewer reads the prize
    t(offset, () => setStep(1));  // trigger expand

    // reveal all tiles once the spring has settled (~600ms)
    offset += 800; // start tiles while expand is still running (~halfway)
    t(offset, () => setRevealed([1, 2, 3, 99]));
    offset += 900; // wait for all 4 tiles to finish fading in before coins start

    // distribute coins: for each prize-holder, fly coin then land
    // (you entry is appended after top 3 if user wins)
    const allRecipients = userWinsRoundPrize
      ? [...WINNERS, { id: 99, prize: 25 }]  // 99 = you
      : WINNERS;

    offset += 600; // pause after all revealed
    allRecipients.forEach(w => {
      if (w.prize <= 0) return;
      offset += 300;
      t(offset, () => setFlying(w.id));       // show flying coin
      offset += 500;
      t(offset, () => {
        setFlying(null);
        setLanded(prev => [...prev, w.id]);
        setHeaderPrize(prev => Math.max(0, prev - w.prize));
      });
      offset += 300;
    });

    // header pill fades out after all distributed
    offset += 400;
    t(offset, () => setHeaderOut(true));

    // ── SCREEN 3: celebration (if user wins) — then stay on winners list ──
    if (userWinsRoundPrize) {
      offset += 500;
      t(offset, () => setStep(2));      // show You Win
      offset += 4000;
      t(offset, () => setStep(1));      // back to winners list — stays here
      offset += 4000;
      t(offset, () => { if (onClose) onClose(); });
    } else {
      offset += 4000;
      t(offset, () => { if (onClose) onClose(); });
    }
    // Auto-close 4 seconds after completion
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── derived ───────────────────────────────────────────────────────────────
  const isExpanded = step >= 1;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0, height: "auto" }}
      exit={{ 
        height: 0, 
        opacity: 0, 
        transition: { 
          height: { duration: 0.4, ease: "easeInOut" }, 
          opacity: { duration: 0.3, delay: 0.1 } 
        } 
      }}
      transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
      className="relative w-full max-w-sm bg-white rounded-[2rem] overflow-hidden pointer-events-auto grid items-center"
    >
      <div className="w-full relative flex flex-col">
      {/* ══════════════════════════════════ SCREEN 1 & 2: HEADER */}
      <div className="relative bg-[#DDF4FF] border-b-[4px] border-[#BAE6FD] px-6 py-5 overflow-hidden rounded-b-[2rem] z-10">
        {/* bg pattern */}
        <div className="absolute inset-0 opacity-[0.06] rotate-[-6deg] scale-110 flex flex-wrap gap-8 items-center justify-around pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="text-[#0EA5E9]">
              {i % 3 === 0
                ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="0.5" fill="currentColor"/><circle cx="15" cy="9" r="0.5" fill="currentColor"/><circle cx="9" cy="15" r="0.5" fill="currentColor"/><circle cx="15" cy="15" r="0.5" fill="currentColor"/></svg>
                : i % 3 === 1
                ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/></svg>
                : <div className="w-9 h-6 border-[2.5px] border-current rounded-md flex items-center justify-center text-[10px] font-black">100</div>
              }
            </div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[#0EA5E9] font-[900] text-[11px] uppercase tracking-[0.2em]">ROUND 1/5</p>
            <h2 className="text-[#0F172A] font-[900] text-[38px] leading-none uppercase tracking-tight mt-0.5">WINNERS</h2>
          </div>

          {/* Prize pill — fades out after distribution */}
          <AnimatePresence>
            {!headerOut && (
              <motion.div
                className="bg-[#38BDF8] text-white font-[900] text-[22px] rounded-[18px] px-6 py-2.5 min-w-[88px] text-center shadow-sm"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.35 } }}
              >
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={headerPrize}
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    ${headerPrize}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══════════════════════════════════ SCREEN 2: WINNER LIST */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden bg-white"
      >
        {/* top 3 winners */}
        <div className="flex flex-col">
          {WINNERS.map((w, i) => {
            const isRevealed = revealed.includes(w.id);
            const isFlying   = flying === w.id;
            const isLanded   = landed.includes(w.id);
            const isLast     = i === WINNERS.length - 1;
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 16 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                className={`flex items-center gap-3 px-5 py-[14px] ${!isLast ? 'border-b-[2px] border-[#F1F5F9]' : ''}`}
              >
                {/* rank */}
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center font-[900] text-[14px] shrink-0 ${
                  w.rank === '1' ? 'bg-[#FEF3C7] text-[#D97706]'
                  : w.rank === '2' ? 'bg-[#FFEDD5] text-[#EA580C]'
                  : 'bg-[#E5E7EB] text-[#6B7280]'
                }`}>{w.rank}</div>

                {/* avatar */}
                <div className="relative shrink-0">
                  <img src={w.avatar} alt="" referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-[13px] object-cover bg-gray-100"
                    style={{ boxShadow: w.rank === '1' ? '0 0 0 2.5px #FBBF24' : w.rank === '2' ? '0 0 0 2.5px #FB923C' : '0 1px 4px rgba(0,0,0,0.1)' }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FBBF24] rounded-full border-[2px] border-white flex items-center justify-center">
                    <Crown size={9} className="text-white fill-white" />
                  </div>
                </div>

                {/* name / xp */}
                <div className="flex-1 min-w-0">
                  <p className={`font-[800] text-[15px] leading-tight truncate ${w.rank === '1' || w.rank === '2' ? 'text-[#F97316]' : 'text-[#1E293B]'}`}>{w.username}</p>
                  <p className="text-[#94A3B8] font-[700] text-[11px] tracking-wide mt-0.5">10,000 XP</p>
                </div>

                {/* prize pill */}
                <div className="relative shrink-0">
                  <motion.div
                    className="w-[84px] h-[40px] rounded-[12px] flex items-center justify-center overflow-hidden"
                    animate={{ backgroundColor: isLanded ? '#38BDF8' : '#F1F5F9' }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isLanded
                        ? <motion.span key="val" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-white font-[900] text-[17px]">${w.prize}</motion.span>
                        : <motion.span key="ph"  initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="text-[#CBD5E1] font-[800] text-[15px]">$—</motion.span>
                      }
                    </AnimatePresence>
                  </motion.div>

                  {/* flying coin */}
                  <AnimatePresence>
                    {isFlying && (
                      <motion.div
                        initial={{ y: -90, scale: 0.4, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ scale: 1.6, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                      >
                        <div className="w-9 h-9 bg-[#FBBF24] rounded-full border-[2.5px] border-white shadow-lg flex items-center justify-center">
                          <span className="text-[#92400E] font-[900] text-[13px]">$</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* "You" row */}
        <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={revealed.includes(99) ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
              className="flex items-center gap-3 px-5 py-[14px] bg-[#F8FAFC] border-t-[2px] border-[#E5E7EB]"
            >
              <div className="w-9 shrink-0 flex justify-center">
                <span className="text-[#64748B] font-[900] text-[13px]">3.9K</span>
              </div>
              <div className="relative shrink-0">
                <img src="https://picsum.photos/seed/you/100" alt="" referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-[13px] object-cover bg-gray-100"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FBBF24] rounded-full border-[2px] border-white flex items-center justify-center">
                  <Crown size={9} className="text-white fill-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-[800] text-[15px] leading-tight text-[#F97316] truncate">You</p>
                <p className="text-[#94A3B8] font-[700] text-[11px] tracking-wide mt-0.5">10,000 XP</p>
              </div>
              <div className="relative shrink-0">
                {userWinsRoundPrize ? (
                  <>
                    <motion.div
                      className="w-[84px] h-[40px] rounded-[12px] flex items-center justify-center overflow-hidden"
                      animate={{ backgroundColor: landed.includes(99) ? '#38BDF8' : '#F1F5F9' }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {landed.includes(99)
                          ? <motion.span key="val" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-white font-[900] text-[17px]">$25</motion.span>
                          : <motion.span key="ph"  initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="text-[#CBD5E1] font-[800] text-[15px]">$—</motion.span>
                        }
                      </AnimatePresence>
                    </motion.div>
                    <AnimatePresence>
                      {flying === 99 && (
                        <motion.div
                          initial={{ y: -90, scale: 0.4, opacity: 0 }}
                          animate={{ y: 0, scale: 1, opacity: 1 }}
                          exit={{ scale: 1.6, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                        >
                          <div className="w-9 h-9 bg-[#FBBF24] rounded-full border-[2.5px] border-white shadow-lg flex items-center justify-center">
                            <span className="text-[#92400E] font-[900] text-[13px]">$</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="py-2 px-3 rounded-[10px] bg-[#FFE4E6] text-[#9F1239] font-[800] text-[11px] text-center whitespace-nowrap">Already won!</div>
                )}
              </div>
            </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ══════════════════════════════════ SCREEN 3: YOU WIN */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#CAFFD7] rounded-[2rem] z-50 flex flex-col items-center justify-center text-center px-8"
          >
            {/* bg pattern */}
            <div className="absolute inset-0 opacity-[0.08] rotate-[-6deg] flex flex-wrap gap-10 items-center justify-around pointer-events-none p-6">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`text-[#22C55E] font-[900] text-[${i%2===0 ? '32' : '22'}px]`}>
                  {i % 2 === 0 ? '$' : '★'}
                </div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', bounce: 0.35 }}
              className="relative z-10 flex flex-col items-center gap-4"
            >
              <p className="text-[#0F172A] font-[900] text-[13px] uppercase tracking-[0.4em]">YOU WIN!</p>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src="https://picsum.photos/seed/you/100" alt="You" referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-[1rem] object-cover border-[3px] border-white shadow-md bg-gray-100" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FFD700] rounded-full border-[2px] border-white flex items-center justify-center">
                    <Crown size={9} className="text-white fill-white" />
                  </div>
                </div>
                <span className="font-[900] text-[36px] text-[#0F172A] leading-none tracking-tight">You</span>
              </div>

              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35, type: 'spring', bounce: 0.4 }}
                className="text-[#0F172A] font-[900] text-[96px] leading-none tracking-[-0.04em]"
              >
                $25
              </motion.div>

              <motion.p
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-[#0F172A] font-[800] text-[18px] tracking-tight"
              >
                Lands in your pocket!
              </motion.p>
            </motion.div>

            {/* branding bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-[1.5rem] px-5 py-3 flex items-center justify-between shadow-lg z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#1D4ED8] rounded-[10px] flex items-center justify-center">
                  <Zap size={16} className="text-white fill-white" />
                </div>
                <span className="text-[#0F172A] font-[900] text-[18px] tracking-tight uppercase">TEXT SAVVY</span>
              </div>
              <span className="text-[#94A3B8] font-[700] text-[12px] uppercase tracking-wider">TUE, MAR 31, 2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
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
              <div className="bg-[#0DA6F2] text-white font-black text-6xl px-8 py-4 rounded-3xl inline-block">
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
                {userWins ? "You're in the running for $50" : "Close but no cash..."}
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

function WinnersContent({ onComplete }: { onComplete?: () => void }) {
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
      
      if (isMounted && onComplete) {
        onComplete();
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

// ─────────────────────────────────────────────────────────────────────────────
// PRIZE POOL
// ─────────────────────────────────────────────────────────────────────────────

function PrizePoolCard({ onClose }: { onClose?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  const runRef = React.useRef(false);

  useEffect(() => {
    if (runRef.current) return;
    runRef.current = true;

    const t = (ms: number, fn: () => void) => setTimeout(fn, ms);
    let offset = 0;

    offset += 1800; // wait 1.8s then expand body
    t(offset, () => setIsExpanded(true)); 

    offset += 800;
    t(offset, () => setRevealedCount(1));
    
    offset += 300;
    t(offset, () => setRevealedCount(2));

    // Animation takes 500ms. Wait 4000ms after completion = 4500ms
    offset += 4500;
    t(offset, () => { if (onClose) onClose(); }); // Auto close

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0, height: "auto" }}
      exit={{ 
        height: 0, 
        opacity: 0, 
        transition: { 
          height: { duration: 0.4, ease: "easeInOut" }, 
          opacity: { duration: 0.3, delay: 0.1 } 
        } 
      }}
      transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
      className="relative w-full max-w-sm bg-white rounded-[2rem] overflow-hidden pointer-events-auto grid items-center"
    >
      <div className="w-full relative flex flex-col">
        {/* HEADER */}
        <div className="relative bg-[#E1F5FE] border-b-[4px] border-[#B3E5FC] px-6 py-6 overflow-hidden rounded-b-[2rem] z-10 text-center">
          {/* subtle pattern */}
          <div className="absolute inset-0 opacity-[0.06] rotate-[-6deg] scale-110 flex flex-wrap gap-8 items-center justify-around pointer-events-none">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="text-[#0284C7]">
                {i % 3 === 0
                  ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="0.5" fill="currentColor"/><circle cx="15" cy="9" r="0.5" fill="currentColor"/><circle cx="9" cy="15" r="0.5" fill="currentColor"/><circle cx="15" cy="15" r="0.5" fill="currentColor"/></svg>
                  : i % 3 === 1
                  ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/></svg>
                  : <div className="w-9 h-6 border-[2.5px] border-current rounded-md flex items-center justify-center text-[10px] font-black">100</div>
                }
              </div>
            ))}
          </div>

          <div className="relative z-10">
            <p className="text-[#0F172A] font-[900] text-[13px] uppercase tracking-[0.2em] mb-1">TODAY'S PRIZE POOL</p>
            <h2 className="text-[#032333] font-[900] text-[48px] leading-none tracking-tight">$650</h2>
          </div>
        </div>

        {/* BODY */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden bg-white"
        >
          <div className="flex flex-col px-5 py-2">
            {/* ROW 1: ROUND PRIZES */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={revealedCount >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 py-4 border-b-[2px] border-[#F1F5F9]"
            >
              <div className="w-12 h-12 flex items-center justify-center text-4xl shrink-0 drop-shadow-sm">
                🏆
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-[900] text-[16px] text-[#1E293B] leading-tight mt-1">ROUND PRIZES</p>
                <p className="text-[#64748B] font-[700] text-[12px] uppercase mt-0.5">7 ROUNDS</p>
              </div>
              <div className="shrink-0 bg-[#38BDF8] text-white font-[900] text-[18px] px-4 py-1.5 rounded-[12px] shadow-sm">
                $350
              </div>
            </motion.div>

            {/* ROW 2: HOSTBUSTER PRIZES */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={revealedCount >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 py-4 mb-2"
            >
              <div className="relative w-12 h-12 shrink-0 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center">
                 <img src="https://picsum.photos/seed/host/100" alt="Hostbuster" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
                 {/* Ghostbuster Red Sign Overlay */}
                 <div className="absolute inset-0 z-10 rounded-full border-[4px] border-[#E11D48]"></div>
                 <div className="absolute h-[4px] w-[140%] bg-[#E11D48] rotate-[-45deg] z-10"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-[900] text-[16px] text-[#1E293B] leading-tight mt-1">HOSTBUSTER PRIZES</p>
                <p className="text-[#64748B] font-[700] text-[12px] uppercase mt-0.5">6 WINNERS</p>
              </div>
              <div className="shrink-0 bg-[#38BDF8] text-white font-[900] text-[18px] px-4 py-1.5 rounded-[12px] shadow-sm">
                $300
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
