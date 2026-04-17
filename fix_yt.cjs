const fs = require('fs');
let code = fs.readFileSync('src/CasualWordle.tsx', 'utf8');

const targetA = `  // --- YouTube Lofi Background ---
  (globalThis as any).ytPlayerRef = (globalThis as any).ytPlayerRef || null;
  useEffect(() => {
    const initPlayer = () => {
      if ((globalThis as any).ytPlayerRef) return; // Zaten basladiysa
      (globalThis as any).ytPlayerRef = new (window as any).YT.Player('youtube-lofi-bg', {
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
            
            // Tarayıcı autoplay engelini (mute olmadığı için) aşmak adına
            // kullanıcı sayfaya ilk tıkladığında veya tuşa bastığında oynatmayı zorla
            const unlockPlay = () => {
              try {
                if (event.target.getPlayerState() !== 1) {
                  event.target.playVideo();
                }
              } catch(e) {}
              window.removeEventListener('click', unlockPlay);
              window.removeEventListener('keydown', unlockPlay);
              window.removeEventListener('touchstart', unlockPlay);
            };
            window.addEventListener('click', unlockPlay);
            window.addEventListener('keydown', unlockPlay);
            window.addEventListener('touchstart', unlockPlay);
            
            // Yine de şansımızı deneyelim
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
  }, []);`;

const replacementA = `  // --- YouTube Lofi Background ---
  useEffect(() => {
    // Aynı div'in yeniden render edilmesi durumunda eski iframelerin birikmesini önlemek
    // ve React Strict Mode sorununu çözmek için temiz bir div üzerinde çalışıyoruz
    const containerItem = document.getElementById('youtube-lofi-bg');
    if (!containerItem || containerItem.tagName === 'IFRAME') return;

    const initPlayer = () => {
      // Start time belirtilen süre: 201
      new (window as any).YT.Player('youtube-lofi-bg', {
        videoId: '-OxhdktyI9w',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          loop: 1,
          start: 201, // Kullanıcı t=201 istedi
          playlist: '-OxhdktyI9w'
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(12);
            
            // Kullanıcı sayfaya ilk tıkladığında veya tuşa bastığında oynatmayı zorla
            const unlockPlay = () => {
              try {
                if (event.target.getPlayerState() !== 1) {
                  event.target.playVideo();
                }
              } catch(e) {}
              ['click', 'keydown', 'touchstart'].forEach(e => window.removeEventListener(e, unlockPlay));
            };
            ['click', 'keydown', 'touchstart'].forEach(e => window.addEventListener(e, unlockPlay));
            
            try { event.target.playVideo(); } catch(e) {}
          }
        }
      });
    };

    if (!(window as any).YT || !(window as any).YT.Player) {
      if (!document.getElementById('yt-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      // Orijinal callback'i ezmeden yenisini ekliyoruz
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        initPlayer();
      };
    } else {
      initPlayer();
    }
  }, []);`;

code = code.replace(targetA, replacementA);
fs.writeFileSync('src/CasualWordle.tsx', code);
