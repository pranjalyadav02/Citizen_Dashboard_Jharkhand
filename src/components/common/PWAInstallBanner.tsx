import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle, Share2, PlusSquare, Shield } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed as PWA)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 2. Check if device is iOS (iPhone/iPad/iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isAppleDevice);

    // 3. Check if user already dismissed banner this session
    const isDismissed = sessionStorage.getItem('janasamadhan_pwa_dismissed');
    if (isDismissed) {
      setDismissed(true);
    }

    // 4. Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 5. Track successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('[PWA] JanaSamadhan installed successfully');
    };

    // 6. Custom trigger event (e.g. from header button)
    const handleCustomTrigger = () => {
      setDismissed(false);
      handleInstallClick();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('trigger-pwa-install', handleCustomTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('trigger-pwa-install', handleCustomTrigger);
    };
  }, [deferredPrompt, isIOS]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback instruction if browser doesn't support direct prompt
      alert('To install JanaSamadhan as an app: Open your browser menu (⋮) and tap "Install app" or "Add to Home Screen".');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('[PWA] Install prompt error:', err);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('janasamadhan_pwa_dismissed', 'true');
  };

  // Do not show if already in standalone app mode or marked installed or dismissed
  if (isStandalone || isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom App Installation Bar */}
      <aside 
        aria-label="Install App Banner"
        className="fixed bottom-16 lg:bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-bounce-subtle"
      >
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/30 backdrop-blur-md flex items-center justify-between gap-3">
          {/* App Icon */}
          <div className="relative shrink-0">
            <img
              src="/icon-192.png"
              alt="JanaSamadhan App"
              className="w-12 h-12 rounded-xl shadow-md border border-white/20 object-cover"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
              <Shield className="w-3 h-3" />
            </span>
          </div>

          {/* App Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-black tracking-tight truncate text-white">JanaSamadhan App</h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Official PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate mt-0.5">
              Govt of Jharkhand • Fast, Offline & 0MB Storage
            </p>
          </div>

          {/* Install & Dismiss Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 transition-all transform active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Safari Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-fade-in text-slate-900 border border-slate-200">
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

            <div className="mt-4 space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <p>
                  Tap the <strong className="text-slate-800 font-semibold">Share</strong> button{' '}
                  <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> at the bottom of Safari.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <p>
                  Scroll down and tap <strong className="text-slate-800 font-semibold">Add to Home Screen</strong>{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mx-0.5" />.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <p>
                  Tap <strong className="text-emerald-700 font-bold">Add</strong> at the top right corner. The app will appear on your home screen!
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Works offline anytime</span>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
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
