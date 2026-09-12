import React, { useState, useEffect, useCallback } from 'react';
import { Download, X, Smartphone, CheckCircle, Share2, PlusSquare, Shield } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __pwaPrompt?: BeforeInstallPromptEvent | null;
  }
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // 1. Mobile Detection - Strictly only enable on mobile devices or small viewports
    const checkIsMobile = () => {
      const ua = window.navigator.userAgent.toLowerCase();
      const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
      const isSmallScreen = window.innerWidth < 768;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      return (isMobileUA || isSmallScreen) && hasTouch;
    };

    setIsMobile(checkIsMobile());

    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    window.addEventListener('resize', handleResize);

    // 2. Check if already running in standalone PWA mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();

    // 3. Check if device is iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isApple);

    // 4. Check if previously dismissed in this session
    if (sessionStorage.getItem('janasamadhan_pwa_dismissed')) {
      setDismissed(true);
    }

    // 5. Pick up early captured prompt if available
    if (window.__pwaPrompt) {
      setDeferredPrompt(window.__pwaPrompt);
    }

    // 6. Listen for beforeinstallprompt and pwa-prompt-ready events
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__pwaPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handlePromptReady = () => {
      if (window.__pwaPrompt) {
        setDeferredPrompt(window.__pwaPrompt);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.__pwaPrompt = null;
      console.log('[PWA] JanaSamadhan installed successfully on device');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-prompt-ready', handlePromptReady);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-ready', handlePromptReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Direct 1-tap installation handler
  const handleInstallClick = useCallback(async () => {
    // 1. Direct native prompt on Chromium/Android
    const promptEvent = deferredPrompt || window.__pwaPrompt;

    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setDismissed(true);
        }
        setDeferredPrompt(null);
        window.__pwaPrompt = null;
      } catch (err) {
        console.error('[PWA] Direct install prompt error:', err);
      }
      return;
    }

    // 2. Direct guided action on iOS Safari
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // 3. Fallback for mobile browsers where prompt was blocked or deferred
    alert('To install the app: Tap your browser menu (⋮) at the top right and select "Install app" or "Add to Home screen".');
  }, [deferredPrompt, isIOS]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('janasamadhan_pwa_dismissed', 'true');
  };

  // STRICT REQUIREMENT: Only show on mobile, and hide if already in standalone app, installed, or dismissed
  if (!isMobile || isStandalone || isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      {/* Mobile-Only Direct Install Card (Floats right above mobile bottom navigation bar) */}
      <aside
        aria-label="Install JanaSamadhan Mobile App"
        className="fixed bottom-16 inset-x-2.5 z-50 md:hidden animate-fade-in pointer-events-auto"
      >
        <div className="bg-slate-950/95 text-white rounded-2xl p-3.5 shadow-2xl border border-emerald-500/40 backdrop-blur-lg flex items-center justify-between gap-3 ring-1 ring-black/20">
          {/* App Icon */}
          <div className="relative shrink-0">
            <img
              src="/icon-192.png"
              alt="JanaSamadhan App"
              className="w-11 h-11 rounded-xl shadow border border-white/20 object-cover"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
              <Shield className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* App Title & Benefits */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-black tracking-tight text-white truncate">
                JanaSamadhan App
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Official
              </span>
            </div>
            <p className="text-[10px] text-slate-300 truncate mt-0.5">
              1-Tap Install • Works Offline & Fast
            </p>
          </div>

          {/* Direct Install & Dismiss Buttons */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow flex items-center space-x-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Safari Direct 1-Tap Instructions Sheet */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end justify-center p-3 sm:items-center">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl animate-fade-in text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-sm">Install JanaSamadhan on iOS</h4>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <p>
                  Tap the <strong className="text-slate-900 font-bold">Share</strong> icon{' '}
                  <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> at the bottom bar of Safari.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <p>
                  Scroll down and select <strong className="text-slate-900 font-bold">Add to Home Screen</strong>{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline text-slate-800 mx-0.5" />.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <p>
                  Tap <strong className="text-emerald-700 font-bold">Add</strong>. The official JanaSamadhan app icon will appear on your home screen!
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Works offline anytime</span>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl active:scale-95"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
