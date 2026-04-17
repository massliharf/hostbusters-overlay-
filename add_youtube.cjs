const fs = require('fs');
let code = fs.readFileSync('src/CasualWordle.tsx', 'utf8');

// 1. Insert YouTube container right after in the return block
const returnTarget = `<div className="fixed inset-0 z-[100] touch-manipulation font-sans bg-white overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">`;
const youtubeHTML = `
      {/* YouTube Lofi Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden mix-blend-multiply">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] min-w-[800px] min-h-[800px]">
          <div id="youtube-lofi-bg" className="w-full h-full pointer-events-none"></div>
        </div>
      </div>
`;
code = code.replace(returnTarget, returnTarget + youtubeHTML);

// 2. Insert useEffect near other effects
const effectTarget = `  const fastReset = () => {`;
const youtubeEffect = `
  // --- YouTube Lofi Background ---
  globalThis.ytPlayerRef = globalThis.ytPlayerRef || null;
  useEffect(() => {
    const initPlayer = () => {
      if (globalThis.ytPlayerRef) return; // Zaten basladiysa
      globalThis.ytPlayerRef = new (window as any).YT.Player('youtube-lofi-bg', {
        videoId: '-OxhdktyI9w',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          loop: 1,
          start: 123,
          playlist: '-OxhdktyI9w'
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(12);
            event.target.playVideo();
          }
        }
      });
    };

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
         firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
         document.head.appendChild(tag);
      }
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    } else if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    }
  }, []);

`;
code = code.replace(effectTarget, youtubeEffect + effectTarget);

fs.writeFileSync('src/CasualWordle.tsx', code);
