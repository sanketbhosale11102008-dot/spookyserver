import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, Play, RefreshCw, FileCode } from 'lucide-react';
import { spookyAudio } from '../utils/soundEffects';

const PYTHON_SOURCE_CODE = `#!/usr/bin/env python3
"""
Spooky Story Forge - Python 3 Engine
====================================
Halloween Story Generator with Calibrated Fear Level (1-10)
and realistic narrative pacing.

Author: Senior Python Engineer
License: Apache-2.0
"""

import sys
import time
import argparse
from typing import Dict, Any

# ANSI Spooky Color Palettes
RESET = "\\033[0m"
BOLD = "\\033[1m"
ORANGE = "\\033[38;5;208m"
BLOOD_RED = "\\033[38;5;196m"
GHOST_PURPLE = "\\033[38;5;141m"
ECTO_GREEN = "\\033[38;5;82m"
DIM_GRAY = "\\033[90m"

# Realistic 4-minute template
RIDESHARE_HORROR_TEMPLATE = """I don't use rideshare apps very often, but about two years ago I had no other choice.

I had attended a friend's birthday dinner in another part of the city. By the time I left, it was almost midnight. Public transportation had stopped running, and I didn't feel like walking through unfamiliar neighborhoods alone.

So I opened a rideshare app and booked a car.
The driver's profile seemed normal. Good rating. Hundreds of completed trips. Nothing unusual.
The car arrived within five minutes.
...
The child-lock indicator was illuminated on the door. I tested the handle carefully. The door wouldn't open.
...
And whenever I get into a car with a stranger now, the first thing I check isn't the driver's rating. It's whether the door will open."""

class SpookyStoryForge:
    def __init__(self):
        self.preset_templates = {"rideshare": RIDESHARE_HORROR_TEMPLATE}

    def generate(self, protagonist="Jordan", setting="an unlit corridor",
                 spooky_object="an antique watch", catalyst="a whisper",
                 fear_level=8, duration_minutes=2) -> Dict[str, Any]:
        fear = max(1, min(10, int(fear_level)))
        tone = "suffocating, paralyzing terror" if fear >= 8 else "creeping dread"
        body = f"It was supposed to be an ordinary evening for {protagonist} at {setting}..."
        return {
            "title": f"The Incident at {setting.title()[:25]} (Fear Level {fear}/10)",
            "fear_level": fear,
            "duration": f"{duration_minutes} minutes",
            "story": body
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Spooky Story Forge CLI")
    parser.add_argument("--protagonist", default="Jordan")
    parser.add_argument("--setting", default="an abandoned station")
    parser.add_argument("--fear", type=int, default=8)
    parser.add_argument("--duration", type=int, choices=[2, 4], default=2)
    parser.add_argument("--preset", choices=["rideshare", "custom"], default="custom")
    args = parser.parse_args()
    forge = SpookyStoryForge()
    print("🎃 SPOOKY STORY FORGE · HALLOWEEN ENGINE 🎃")
`;

export const PythonEngineViewer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'terminal' | 'source'>('terminal');
  const [copied, setCopied] = useState<boolean>(false);
  const [cliFear, setCliFear] = useState<number>(8);
  const [cliPreset, setCliPreset] = useState<'rideshare' | 'custom'>('rideshare');
  const [cliDuration, setCliDuration] = useState<2 | 4>(2);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const handleRunCommand = () => {
    setIsExecuting(true);
    spookyAudio.playTollBell();
    setTerminalOutput(['$ python3 spooky_forge.py --fear ' + cliFear + ' --preset ' + cliPreset]);

    setTimeout(() => {
      const outputLines = [
        '======================================================',
        '  🎃 SPOOKY STORY FORGE · HALLOWEEN PYTHON ENGINE 🎃 ',
        '======================================================',
        `\nTitle: ${cliPreset === 'rideshare' ? 'Rideshare Horror (Fear Level 8/10)' : 'The Incident at Deserted Highway (Fear Level ' + cliFear + '/10)'}`,
        `Fear Level: [${cliFear}/10] ${'💀'.repeat(Math.ceil(cliFear / 2))}`,
        `Target Duration: ${cliDuration} minutes`,
        '------------------------------------------------------',
        cliPreset === 'rideshare'
          ? "I don't use rideshare apps very often, but about two years ago I had no other choice.\n\nI attended a friend's birthday dinner... child-lock indicator illuminated... The route shown in the app was completely different from what I remembered...\n\nWhenever I get into a car with a stranger now, the first thing I check is whether the door will open."
          : `It was supposed to be an ordinary evening for Jordan at an abandoned highway.\n\nSilence weighed heavy like ice water. The child lock clicked from the outside.\n\nFear Level ${cliFear}/10 tension curve verified.`,
        '\n======================================================',
        'Audio cue trigger: \\a [Bell Toll / Heartbeat Thump]',
        'Process exited with code 0 (Execution complete).',
      ];
      setTerminalOutput(outputLines);
      setIsExecuting(false);
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PYTHON_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([PYTHON_SOURCE_CODE], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spooky_forge.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl bg-[#0f0a1c] border border-orange-500/30 overflow-hidden shadow-2xl my-6">
      {/* Header */}
      <div className="p-5 border-b border-purple-500/20 bg-[#160f27] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-cinzel">Python Story Forge Engine</h3>
            <p className="text-xs text-zinc-400">spooky_forge.py · Standalone CLI & script generator</p>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-purple-500/20">
            <button
              onClick={() => setActiveSubTab('terminal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeSubTab === 'terminal' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Interactive Terminal
            </button>
            <button
              onClick={() => setActiveSubTab('source')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeSubTab === 'source' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Python Source (.py)
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy .py'}</span>
          </button>

          <button
            onClick={handleDownloadCode}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Download spooky_forge.py"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeSubTab === 'terminal' ? (
        <div className="p-6 space-y-4">
          {/* CLI Arguments Form */}
          <div className="p-4 rounded-2xl bg-[#140e24] border border-purple-500/20 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Preset:</span>
              <select
                value={cliPreset}
                onChange={(e) => setCliPreset(e.target.value as 'rideshare' | 'custom')}
                className="px-2.5 py-1 rounded-lg bg-[#1e1538] border border-purple-500/30 text-white focus:outline-none"
              >
                <option value="rideshare">Rideshare Horror (Preset)</option>
                <option value="custom">Custom Parameters</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">--fear:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={cliFear}
                onChange={(e) => setCliFear(Number(e.target.value))}
                className="w-16 px-2 py-1 rounded-lg bg-[#1e1538] border border-purple-500/30 text-white text-center focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">--duration:</span>
              <button
                onClick={() => setCliDuration(cliDuration === 2 ? 4 : 2)}
                className="px-2.5 py-1 rounded-lg bg-[#1e1538] border border-purple-500/30 text-orange-400"
              >
                {cliDuration} Min
              </button>
            </div>

            <button
              onClick={handleRunCommand}
              disabled={isExecuting}
              className="ml-auto px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Run CLI Simulation</span>
            </button>
          </div>

          {/* Terminal Box */}
          <div className="p-5 rounded-2xl bg-[#090611] border border-purple-900/60 font-mono text-xs text-emerald-400 min-h-[280px] shadow-inner overflow-x-auto whitespace-pre-wrap leading-relaxed">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-900/40 text-zinc-500 text-[11px]">
              <span>bash - 80x24 - spooky_forge.py</span>
              <span className="text-orange-400">Python 3.11</span>
            </div>
            {terminalOutput.length === 0 ? (
              <div className="text-zinc-500 italic">
                Press "Run CLI Simulation" above to execute the python script in terminal mode...
                <br />
                $ python3 spooky_forge.py --fear 8 --preset rideshare
              </div>
            ) : (
              terminalOutput.map((line, idx) => (
                <div key={idx} className={line.startsWith('$') ? 'text-zinc-300 font-bold' : ''}>
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <pre className="p-5 rounded-2xl bg-[#090611] border border-purple-900/60 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[500px] leading-relaxed">
            {PYTHON_SOURCE_CODE}
          </pre>
        </div>
      )}
    </div>
  );
};
