import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Keyboard } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useApp();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: 'C', description: 'Switch to Command Center overview' },
    { key: 'M', description: 'Open Live Risk GIS Map' },
    { key: 'A', description: 'Navigate to Alert Center' },
    { key: 'S', description: 'Open Scenario Simulation Lab' },
    { key: 'R', description: 'Generate Situation Reports' },
    { key: '⌘ + K', description: 'Open global search for assets and sectors' },
    { key: '?', description: 'Toggle this keyboard shortcut helper' },
    { key: 'ESC', description: 'Close any open drawer or modal' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4"
    >
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-xl p-5 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE5]">
          <div className="flex items-center gap-2 text-[#17202A] font-semibold text-sm">
            <Keyboard className="w-4 h-4 text-[#123B5D]" />
            <span>Command Center Keyboard Shortcuts</span>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="text-[#7B8794] hover:text-[#17202A] p-1 rounded hover:bg-[#F0F2F5]"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3.5 space-y-2">
          {shortcuts.map(sc => (
            <div key={sc.key} className="flex items-center justify-between text-xs py-1 border-b border-[#F0F2F5] last:border-0">
              <span className="text-[#5E6B78]">{sc.description}</span>
              <kbd className="font-mono text-[11px] bg-[#F0F2F5] text-[#123B5D] px-2 py-0.5 rounded border border-[#D9DEE5] font-semibold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#D9DEE5] text-center">
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="px-4 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-xs font-medium text-white transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
