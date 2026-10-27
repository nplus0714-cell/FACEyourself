
import './styles/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const CHUNK_RELOAD_KEY = 'face_chunk_reload_at';
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  try {
    const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? 0);
    if (Date.now() - lastReload < 30_000) return;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
  } catch {
    // The error boundary below still gives visitors a way to reload manually.
    return;
  }
  window.location.reload();
});

class AppErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('Unable to render FACE', error);
  }

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;
    return <main className="mx-auto max-w-lg px-6 py-24 text-center text-[#2D2D2D]">
      <h1 className="serif text-3xl">頁面暫時無法載入</h1>
      <p className="mt-5 text-sm leading-7 text-[#70665D]">網站可能剛完成更新。重新載入後，已完成的測驗會從這個瀏覽器找回。</p>
      <button type="button" onClick={() => window.location.reload()} className="mt-8 bg-[#2D2D2D] px-7 py-3 text-sm font-bold text-white">重新載入頁面</button>
    </main>;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppErrorBoundary><App /></AppErrorBoundary>
  </React.StrictMode>
);
