import { useMemo, useState } from 'react';
import MainLayout from './components/Layout/MainLayout.jsx';
import ChannelList from './components/Sidebar/ChannelList.jsx';
import ChatArea from './components/Chat/ChatArea.jsx';

export default function App() {
  const [activePalette, setActivePalette] = useState('dark');

  const isDark = activePalette === 'dark';

  // Example: dynamic Tailwind layouts driven by state
  // (classes computed at runtime; tokens come from tailwind.config.js)
  const layoutMode = useMemo(() => {
    return isDark
      ? {
          container: 'min-h-[100svh] bg-slack-dark-950 text-slack-dark-text',
          left: 'bg-slack-dark-panel/80 border-slack-dark-border',
          right: 'bg-slack-dark-panel',
          card: 'bg-slack-dark-800/25 border-slack-dark-border',
          accent: 'text-slack-accent-500',
          accentBg: 'bg-slack-accent-500/10',
          focusRing: 'ring-slack-accent-500/25',
        }
      : {
          container: 'min-h-[100svh] bg-slate-50 text-slate-900',
          left: 'bg-white border-slate-200/80',
          right: 'bg-white',
          card: 'bg-white border-slate-200/80',
          accent: 'text-indigo-600',
          accentBg: 'bg-indigo-600/10',
          focusRing: 'ring-indigo-600/20',
        };
  }, [isDark]);

  return (
    <MainLayout>
      <div className={layoutMode.container}>
        {/* Demonstrate dynamic Tailwind + token-based colors/radii */}
        <div
          className={
            'grid min-h-[100svh] grid-cols-[280px_1fr] gap-0 ' +
            (isDark ? 'dark' : '')
          }
        >
          <aside
            className={
              'border-r border-r-[1px] ' +
              'p-4 ' +
              layoutMode.left +
              ' backdrop-blur'
            }
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold tracking-tight">HuddleUp</div>
                <div className="mt-1 text-xs text-opacity-70">Slack-inspired UI</div>
              </div>

              <div className={layoutMode.accentBg + ' rounded-comp-md px-2 py-1'}>
                <span className={'text-xs font-medium ' + layoutMode.accent}>
                  {isDark ? 'Slack Dark' : 'Light Mode'}
                </span>
              </div>
            </div>

            {/* Using existing component, but wrapper uses token-based radii + borders */}
            <div className="mt-4 rounded-comp-lg border border-slack-dark-border/70">
              <ChannelList />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActivePalette('dark')}
                className={
                  'rounded-comp-md border px-3 py-2 text-xs font-semibold transition ' +
                  (isDark
                    ? 'border-slack-accent-500/35 bg-slack-accent-500/10 ring-1 ' +
                      layoutMode.focusRing
                    : 'border-slack-dark-border/60 bg-transparent text-slack-dark-muted hover:bg-slack-dark-800/20')
                }
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setActivePalette('light')}
                className={
                  'rounded-comp-md border px-3 py-2 text-xs font-semibold transition ' +
                  (!isDark
                    ? 'border-indigo-500/35 bg-indigo-600/10 ring-1 ring-indigo-600/20'
                    : 'border-slate-200/70 bg-transparent text-slate-600 hover:bg-slate-100')
                }
              >
                Light
              </button>
            </div>
          </aside>

          <section className={layoutMode.right + ' p-4'}>
            <div
              className={
                'rounded-comp-xl border p-4 ' + layoutMode.card +
                ' shadow-[0_0_0_1px_rgba(99,102,241,0.08)]'
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold tracking-tight">Workspace</div>
                  <div className="mt-1 text-sm opacity-80">
                    Tokens drive colors, radii, and shadows.
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="rounded-comp-md border border-slack-dark-border/70 px-3 py-2">
                    <div className="text-[11px] font-semibold opacity-80">Accent</div>
                    <div className={'text-sm font-bold ' + layoutMode.accent}>
                      Emerald/Indigo
                    </div>
                  </div>
                  <div className="rounded-comp-md border border-slack-dark-border/70 px-3 py-2">
                    <div className="text-[11px] font-semibold opacity-80">Radius</div>
                    <div className="text-sm font-bold">Comp-LG</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-comp-lg border border-slack-dark-border/60 bg-slack-dark-800/20 p-4">
                  <div className="text-xs font-semibold opacity-80">Dynamic layout</div>
                  <div className="mt-2 text-sm opacity-90">
                    Switch themes to update background, borders, focus rings, and accent states.
                  </div>
                  <div
                    className={
                      'mt-3 inline-flex items-center gap-2 rounded-comp-md px-3 py-2 text-xs font-semibold ring-1 ring-inset ' +
                      (isDark
                        ? 'bg-slack-accent-500/10 ring-slack-accent-500/25 text-slack-accent-500'
                        : 'bg-indigo-600/10 ring-indigo-600/20 text-indigo-600')
                    }
                  >
                    <span className="h-2 w-2 rounded-full bg-slack-accent-500" />
                    Token-driven pill
                  </div>
                </div>

                <div className="rounded-comp-lg border border-slack-dark-border/60 bg-slack-dark-800/20 p-4">
                  <div className="text-xs font-semibold opacity-80">Rounded components</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="rounded-comp-sm border border-slack-dark-border/60 px-3 py-2 text-xs">
                      sm
                    </div>
                    <div className="rounded-comp-md border border-slack-dark-border/60 px-3 py-2 text-xs">
                      md
                    </div>
                    <div className="rounded-comp-lg border border-slack-dark-border/60 px-3 py-2 text-xs">
                      lg
                    </div>
                    <div className="rounded-comp-xl border border-slack-dark-border/60 px-3 py-2 text-xs">
                      xl
                    </div>
                  </div>
                  <div className="mt-4 text-sm opacity-85">
                    Uses <span className="font-semibold">--radius-comp-*</span> variables from global CSS.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <ChatArea />
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

