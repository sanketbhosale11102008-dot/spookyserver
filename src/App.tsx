import React, { useState } from 'react';
import { HalloweenHeader } from './components/HalloweenHeader';
import { HalloweenCountdown } from './components/HalloweenCountdown';
import { SpookyStoryForge } from './components/SpookyStoryForge';
import { SpookySuiteTabs } from './components/SpookySuiteTabs';
import { PythonEngineViewer } from './components/PythonEngineViewer';
import { SoundEffectsController } from './components/SoundEffectsController';
import { Halloween3DGame } from './components/Halloween3DGame';
import { HalloweenMusicStudio } from './components/HalloweenMusicStudio';
import { AnimatedPumpkin } from './components/AnimatedPumpkin';
import { spookyAudio } from './utils/soundEffects';
import { Skull, Ghost, Flame, Radio, Code2, Sparkles, ShieldCheck, Gamepad2, Music } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('story-forge');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090610] text-[#e3daf3] selection:bg-orange-500 selection:text-black overflow-x-hidden">
      {/* Subtle Atmospheric Lightning Flash Screen Effect */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-indigo-200/5 animate-lightning-flash" />

      {/* Top Bar Navigation */}
      <HalloweenHeader onNavClick={scrollToSection} activeSection={activeSection} />

      {/* Hero Visual Spotlight */}
      <section id="home" className="relative overflow-hidden border-b border-orange-500/20">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/spooky_halloween_banner_1793084078808.jpg"
            alt="Halloween Haunted Forest with Glowing Jack-o'-Lanterns and Blood Moon"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-35 filter blur-[0.5px] scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090610] via-[#090610]/75 to-[#090610]/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="max-w-3xl">
            {/* Unboxed Metadata Kicker */}
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-3">
              <span>Halloween 2026 Edition</span>
              <span aria-hidden="true">·</span>
              <span>PS 1.1–1.10 Suite</span>
              <span aria-hidden="true">·</span>
              <span>Python 3 Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-cinzel tracking-tight text-balance leading-none mb-4">
              Where Terrors Are Forged in the Dark
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl text-balance mb-8">
              Generate calibrated horror tales from minimal keywords, dial your exact fear level,
              and explore the full Halloween problem statement suite with real-time soundscapes and Python export.
            </p>

            {/* Quick action buttons & pumpkin teaser */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  scrollToSection('story-forge');
                  spookyAudio.playDoorCreak();
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-sm flex items-center gap-2 shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
              >
                <Flame className="w-4 h-4" />
                <span>Launch Story Forge</span>
              </button>

              <button
                onClick={() => {
                  scrollToSection('game-3d');
                  spookyAudio.playTollBell();
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-900/30 active:scale-95 transition-all"
              >
                <Gamepad2 className="w-4 h-4 text-purple-200" />
                <span>Play 3D Pumpkin Crypt</span>
              </button>

              <button
                onClick={() => {
                  scrollToSection('music-studio');
                  spookyAudio.playHeartbeat(75);
                }}
                className="px-6 py-3 rounded-xl bg-[#1c1430] hover:bg-[#281c44] border border-purple-500/30 text-white font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Music className="w-4 h-4 text-orange-400" />
                <span>Halloween Music</span>
              </button>

              <div className="flex items-center gap-2 pl-2">
                <AnimatedPumpkin size={48} fearLevel={8} tooltip="Click to awaken the ancient Jack-o'-lantern" />
                <span className="text-xs text-zinc-400 hidden sm:inline-block font-mono">
                  Interactive Pumpkin SFX
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Workspace Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Section 1: 3D Halloween Game (Three.js WebGL Engine) */}
        <section id="game-3d">
          <div className="mb-4">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Interactive 3D Experience · Three.js PBR</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-cinzel">Pumpkin Crypt: The Haunting of Blackwood</h2>
            <p className="text-sm text-zinc-400">Full 3D WebGL survival game with procedural lantern spirit, phantoms, and altars</p>
          </div>
          <Halloween3DGame />
        </section>

        {/* Section 2: Halloween Music */}
        <section id="music-studio">
          <HalloweenMusicStudio />
        </section>

        {/* Section 3: Halloween Countdown */}
        <section id="timer-section">
          <HalloweenCountdown />
        </section>

        {/* Section 4: Flagship Spooky Story Forge (PS 1.1) */}
        <section id="story-forge">
          <SpookyStoryForge onOpenPythonTerminal={() => scrollToSection('python-engine')} />
        </section>

        {/* Section 5: Spooky Soundboard & Ambient Audio Engine */}
        <section id="soundboard">
          <SoundEffectsController />
        </section>

        {/* Section 6: Comprehensive Halloween Suite (PS 1.2 through PS 1.10) */}
        <section id="spooky-tools">
          <div className="mb-4">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Modular Toolkit</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-cinzel">Halloween Problem Statement Suite</h2>
            <p className="text-sm text-zinc-400">Complete implementations for PS 1.2 through PS 1.10</p>
          </div>
          <SpookySuiteTabs />
        </section>

        {/* Section 7: Python Engine Hub & Terminal Simulator */}
        <section id="python-engine">
          <div className="mb-4">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Code Architecture & CLI</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-cinzel">Professional Python Engine</h2>
            <p className="text-sm text-zinc-400">Review, run, or export spooky_forge.py for your local terminal</p>
          </div>
          <PythonEngineViewer />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-purple-500/20 bg-[#07050d] py-10 px-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AnimatedPumpkin size={28} fearLevel={3} interactive={false} />
            <span className="text-zinc-400 font-cinzel font-semibold">Spooky Story Forge & Halloween Suite</span>
            <span aria-hidden="true">·</span>
            <span>All 10 Halloween Problem Statements Supported</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection('story-forge')}
              className="hover:text-orange-400 transition-colors"
            >
              Story Forge
            </button>
            <button
              onClick={() => scrollToSection('python-engine')}
              className="hover:text-orange-400 transition-colors"
            >
              Python Code
            </button>
            <button
              onClick={() => scrollToSection('soundboard')}
              className="hover:text-orange-400 transition-colors"
            >
              Sound Effects
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
