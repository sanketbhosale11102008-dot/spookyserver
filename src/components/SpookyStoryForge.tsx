import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Download,
  BookOpen,
  RefreshCw,
  Terminal,
  Zap,
  Play,
  Pause,
  Square,
  Ghost,
  Radio,
  Sliders,
} from 'lucide-react';
import { AnimatedPumpkin } from './AnimatedPumpkin';
import { spookyAudio } from '../utils/soundEffects';
import {
  RIDESHARE_HORROR_STORY,
  generateProceduralScaryStory,
  GeneratedStory,
  StoryParams,
} from '../utils/spookyTemplates';
import { ghostSpeech } from '../utils/ghostSpeech';

export interface NarratorVoicePreset {
  id: 'ancient_crypt' | 'shrieking_banshee' | 'gravelly_gravedigger';
  name: string;
  tagline: string;
  badge: string;
  pitch: number;
  rate: number;
  description: string;
  icon: string;
  ambientSound: 'toll' | 'wind' | 'creak';
  ambientTitle: string;
  sampleQuote: string;
  theme: {
    border: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    ring: string;
  };
}

export const NARRATOR_VOICE_PRESETS: NarratorVoicePreset[] = [
  {
    id: 'ancient_crypt',
    name: 'Ancient Crypt',
    tagline: 'low pitch / slow',
    badge: 'Pitch 0.28 · Rate 0.68x',
    pitch: 0.28,
    rate: 0.68,
    description: 'Subterranean sub-bass resonance echoing through cold stone catacombs.',
    icon: '⚰️',
    ambientSound: 'toll',
    ambientTitle: 'Catacomb Bell Toll',
    sampleQuote: 'From beneath the cold granite slabs, the ancient dead stir and awaken.',
    theme: {
      border: 'border-purple-500/80',
      bg: 'bg-purple-950/40',
      badgeBg: 'bg-purple-950/80',
      badgeText: 'text-purple-300',
      glow: 'shadow-purple-900/30',
      ring: 'ring-purple-500/60',
    },
  },
  {
    id: 'shrieking_banshee',
    name: 'Shrieking Banshee',
    tagline: 'high pitch / reverb',
    badge: 'Pitch 1.70 · Rate 1.15x',
    pitch: 1.70,
    rate: 1.15,
    description: 'Piercing supernatural cadence delivering frantic horror urgency with ghostly wind reverb.',
    icon: '👻',
    ambientSound: 'wind',
    ambientTitle: 'Supernatural Howl Reverb',
    sampleQuote: 'Heed the blood-moon omen! The shroud is woven and the grave stands open!',
    theme: {
      border: 'border-cyan-500/80',
      bg: 'bg-cyan-950/40',
      badgeBg: 'bg-cyan-950/80',
      badgeText: 'text-cyan-300',
      glow: 'shadow-cyan-900/30',
      ring: 'ring-cyan-500/60',
    },
  },
  {
    id: 'gravelly_gravedigger',
    name: 'Gravelly Grave-Digger',
    tagline: 'deep / scratchy',
    badge: 'Pitch 0.52 · Rate 0.82x',
    pitch: 0.52,
    rate: 0.82,
    description: 'Gritty, measured baritone worn down by years digging haunted graveyard sod.',
    icon: '🪦',
    ambientSound: 'creak',
    ambientTitle: 'Rusted Crypt Gate Creak',
    sampleQuote: 'Six feet of damp sod is all that separates your warm breath from the eternal dark.',
    theme: {
      border: 'border-amber-500/80',
      bg: 'bg-amber-950/40',
      badgeBg: 'bg-amber-950/80',
      badgeText: 'text-amber-300',
      glow: 'shadow-amber-900/30',
      ring: 'ring-amber-500/60',
    },
  },
];

interface SpookyStoryForgeProps {
  onOpenPythonTerminal?: () => void;
}

export const SpookyStoryForge: React.FC<SpookyStoryForgeProps> = ({ onOpenPythonTerminal }) => {
  // Input parameters
  const [protagonist, setProtagonist] = useState<string>('Jordan');
  const [setting, setSetting] = useState<string>('a late-night rideshare car');
  const [spookyObject, setSpookyObject] = useState<string>('the illuminated child-lock indicator');
  const [catalyst, setCatalyst] = useState<string>('an overheard speakerphone query: "Is she with you?"');
  const [fearLevel, setFearLevel] = useState<number>(8);
  const [duration, setDuration] = useState<2 | 4>(4);

  // Story state
  const [currentStory, setCurrentStory] = useState<GeneratedStory>(RIDESHARE_HORROR_STORY);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('rideshare');

  // Narrator Voice Web Speech API State
  const [selectedVoice, setSelectedVoice] = useState<'ancient_crypt' | 'shrieking_banshee' | 'gravelly_gravedigger'>('ancient_crypt');
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [isNarratingPaused, setIsNarratingPaused] = useState<boolean>(false);
  const [auditioningPreset, setAuditioningPreset] = useState<string | null>(null);
  const [spokenCharIndex, setSpokenCharIndex] = useState<number>(-1);
  const [activeReadingParagraph, setActiveReadingParagraph] = useState<number>(-1);
  const [ambientAudioEnabled, setAmbientAudioEnabled] = useState<boolean>(true);
  const [showAdvancedTuning, setShowAdvancedTuning] = useState<boolean>(false);
  const [customPitch, setCustomPitch] = useState<number>(0.28);
  const [customRate, setCustomRate] = useState<number>(0.68);
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  // Subscribe to system voices
  useEffect(() => {
    const unsub = ghostSpeech.subscribeVoices((voices) => {
      setBrowserVoices(voices);
      if (voices.length > 0 && !selectedVoiceURI) {
        const preferred = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('David'))
        ) || voices[0];
        if (preferred) setSelectedVoiceURI(preferred.voiceURI);
      }
    });

    return () => {
      unsub();
      ghostSpeech.stop();
    };
  }, []);

  // Sync custom pitch/rate when preset changes
  useEffect(() => {
    const p = NARRATOR_VOICE_PRESETS.find((preset) => preset.id === selectedVoice);
    if (p) {
      setCustomPitch(p.pitch);
      setCustomRate(p.rate);
    }
  }, [selectedVoice]);

  // Handle Fear Slider Change
  const handleFearChange = (val: number) => {
    setFearLevel(val);
    if (val >= 8) {
      spookyAudio.playHeartbeat(90);
    } else if (val >= 5) {
      spookyAudio.playDoorCreak();
    }
  };

  // Quick preset loader
  const loadPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    if (presetKey === 'rideshare') {
      setProtagonist('A solo passenger');
      setSetting('a late-night rideshare car on empty roads');
      setSpookyObject('the illuminated child-lock indicator');
      setCatalyst('an overheard speakerphone query: "Is she with you?"');
      setFearLevel(8);
      setDuration(4);
      setCurrentStory(RIDESHARE_HORROR_STORY);
      spookyAudio.playDoorCreak();
    } else if (presetKey === 'subway') {
      setProtagonist('Alex');
      setSetting('the deserted final subway train of the night');
      setSpookyObject('a vintage cassette player left on an empty vinyl seat');
      setCatalyst('a distorted conductor broadcast speaking in reverse');
      setFearLevel(7);
      setDuration(2);
      generateStoryDirect({
        protagonist: 'Alex',
        setting: 'the deserted final subway train of the night',
        spookyObject: 'a vintage cassette player left on an empty vinyl seat',
        catalyst: 'a distorted conductor broadcast speaking in reverse',
        fearLevel: 7,
        storyDurationMinutes: 2,
      });
    } else if (presetKey === 'cabin') {
      setProtagonist('Elena');
      setSetting('a snowed-in hunting lodge deep in the pines');
      setSpookyObject('an antique full-length mirror with clouded silvering');
      setCatalyst('three rhythmic knocks coming from inside the wardrobe');
      setFearLevel(9);
      setDuration(2);
      generateStoryDirect({
        protagonist: 'Elena',
        setting: 'a snowed-in hunting lodge deep in the pines',
        spookyObject: 'an antique full-length mirror with clouded silvering',
        catalyst: 'three rhythmic knocks coming from inside the wardrobe',
        fearLevel: 9,
        storyDurationMinutes: 2,
      });
    } else if (presetKey === 'dorm') {
      setProtagonist('Marcus');
      setSetting('the 4th-floor archive room after curfew');
      setSpookyObject('a student thesis marked with charcoal handprints');
      setCatalyst('the sound of bare feet pacing outside the locked door');
      setFearLevel(6);
      setDuration(2);
      generateStoryDirect({
        protagonist: 'Marcus',
        setting: 'the 4th-floor archive room after curfew',
        spookyObject: 'a student thesis marked with charcoal handprints',
        catalyst: 'the sound of bare feet pacing outside the locked door',
        fearLevel: 6,
        storyDurationMinutes: 2,
      });
    }
  };

  const generateStoryDirect = async (params: StoryParams) => {
    setIsGenerating(true);
    spookyAudio.playEerieWind();

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.story) {
          setCurrentStory({
            title: data.title,
            fearLevel: data.fearLevel,
            wordCount: data.wordCount,
            estimatedReadTime: data.estimatedReadTime,
            summary: `A ${data.estimatedReadTime} chilling horror tale calibrated to Fear Level ${data.fearLevel}/10.`,
            jumpScareTriggerParagraphIndex: Math.floor(data.story.split('\n\n').length * 0.7),
            text: data.story,
          });
          setIsGenerating(false);
          return;
        }
      }
    } catch {
      // Graceful fallback to local procedural engine
    }

    // Local procedural story generation
    setTimeout(() => {
      const localStory = generateProceduralScaryStory(params);
      setCurrentStory(localStory);
      setIsGenerating(false);
      if (params.fearLevel >= 8) {
        spookyAudio.playHeartbeat(85);
      }
    }, 400);
  };

  const handleGenerate = () => {
    setActivePreset('custom');
    generateStoryDirect({
      protagonist,
      setting,
      spookyObject,
      catalyst,
      fearLevel,
      storyDurationMinutes: duration,
    });
  };

  const handleCopyStory = () => {
    navigator.clipboard.writeText(`${currentStory.title}\n\n${currentStory.text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadStory = () => {
    const blob = new Blob([`${currentStory.title}\n\n${currentStory.text}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentStory.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Start or Resume Reading the Generated Story with Web Speech API
  const handleStartNarration = () => {
    if (isNarratingPaused) {
      ghostSpeech.resume();
      setIsNarratingPaused(false);
      setIsNarrating(true);
      return;
    }

    if (!currentStory.text.trim()) return;

    const preset = NARRATOR_VOICE_PRESETS.find((p) => p.id === selectedVoice) || NARRATOR_VOICE_PRESETS[0];

    // Play atmospheric soundscape cue matching selected preset
    if (ambientAudioEnabled) {
      if (preset.ambientSound === 'toll') {
        spookyAudio.playTollBell();
      } else if (preset.ambientSound === 'wind') {
        spookyAudio.playEerieWind();
      } else if (preset.ambientSound === 'creak') {
        spookyAudio.playDoorCreak();
      }
    }

    setIsNarrating(true);
    setIsNarratingPaused(false);

    // Calculate paragraph boundaries for live text tracking
    const paragraphs = currentStory.text.split('\n\n');
    let runningCharCount = currentStory.title.length + 6;
    const paraRanges = paragraphs.map((p) => {
      const start = runningCharCount;
      runningCharCount += p.length + 2;
      return { start, end: runningCharCount };
    });

    const fullNarrative = `${currentStory.title}. ... ${currentStory.text}`;

    ghostSpeech.speak(fullNarrative, {
      pitch: customPitch,
      rate: customRate,
      voiceURI: selectedVoiceURI,
      onBoundary: (charIndex) => {
        setSpokenCharIndex(charIndex);
        const activeIdx = paraRanges.findIndex((r) => charIndex >= r.start && charIndex <= r.end);
        if (activeIdx !== -1) {
          setActiveReadingParagraph(activeIdx);
        }
      },
      onEnd: () => {
        setIsNarrating(false);
        setIsNarratingPaused(false);
        setSpokenCharIndex(-1);
        setActiveReadingParagraph(-1);
        spookyAudio.playTollBell();
      },
      onError: () => {
        setIsNarrating(false);
        setIsNarratingPaused(false);
        setSpokenCharIndex(-1);
        setActiveReadingParagraph(-1);
      },
    });
  };

  const handlePauseNarration = () => {
    ghostSpeech.pause();
    setIsNarratingPaused(true);
  };

  const handleStopNarration = () => {
    ghostSpeech.stop();
    setIsNarrating(false);
    setIsNarratingPaused(false);
    setSpokenCharIndex(-1);
    setActiveReadingParagraph(-1);
    setAuditioningPreset(null);
  };

  const handleAuditionVoice = (e: React.MouseEvent, preset: NarratorVoicePreset) => {
    e.stopPropagation();
    setSelectedVoice(preset.id);
    setCustomPitch(preset.pitch);
    setCustomRate(preset.rate);
    setAuditioningPreset(preset.id);

    if (ambientAudioEnabled) {
      if (preset.ambientSound === 'toll') spookyAudio.playTollBell();
      else if (preset.ambientSound === 'wind') spookyAudio.playEerieWind();
      else if (preset.ambientSound === 'creak') spookyAudio.playDoorCreak();
    }

    ghostSpeech.speak(preset.sampleQuote, {
      pitch: preset.pitch,
      rate: preset.rate,
      voiceURI: selectedVoiceURI,
      onEnd: () => setAuditioningPreset(null),
      onError: () => setAuditioningPreset(null),
    });
  };

  const getFearTierLabel = (fear: number) => {
    if (fear >= 8) return { label: 'Unhinged Terror', color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-950/40' };
    if (fear >= 5) return { label: 'Spine Chiller', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/40' };
    return { label: 'Mild Goosebumps', color: 'text-orange-300', border: 'border-orange-500/30', bg: 'bg-orange-950/30' };
  };

  const tier = getFearTierLabel(fearLevel);

  return (
    <div className="space-y-6">
      {/* Hero Banner / Preset Quick-Picker */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181129] to-[#0f0a1c] border border-orange-500/30 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <AnimatedPumpkin size={64} fearLevel={fearLevel} />
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-orange-400">PS 1.1 · Flagship Generator</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-cinzel">Spooky Story Forge</h2>
              <p className="text-sm text-zinc-300">Turn keywords into a bone-chilling 2-min or 4-min scary tale</p>
            </div>
          </div>

          {/* Quick preset selector buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-purple-500/20">
            <button
              onClick={() => loadPreset('rideshare')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activePreset === 'rideshare'
                  ? 'bg-orange-500 text-black font-bold shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🚗 Rideshare Horror (Fear 8/10)
            </button>
            <button
              onClick={() => loadPreset('subway')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activePreset === 'subway'
                  ? 'bg-orange-500 text-black font-bold shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🚇 Subway at Midnight
            </button>
            <button
              onClick={() => loadPreset('cabin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activePreset === 'cabin'
                  ? 'bg-orange-500 text-black font-bold shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🌲 Cabin in the Pines
            </button>
            <button
              onClick={() => loadPreset('dorm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activePreset === 'dorm'
                  ? 'bg-orange-500 text-black font-bold shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🕯️ Curfew Archive
            </button>
          </div>
        </div>

        {/* Forge Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#0d0818]/80 border border-purple-500/20 backdrop-blur-sm">
          <div>
            <label className="block text-xs font-medium text-orange-300 mb-1">Protagonist</label>
            <input
              type="text"
              value={protagonist}
              onChange={(e) => setProtagonist(e.target.value)}
              placeholder="e.g. Jordan, A lone traveler"
              className="w-full px-3 py-2 rounded-xl bg-[#1a122e] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-orange-300 mb-1">Eerie Setting</label>
            <input
              type="text"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="e.g. an unmapped industrial district"
              className="w-full px-3 py-2 rounded-xl bg-[#1a122e] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-orange-300 mb-1">Spooky Object / Detail</label>
            <input
              type="text"
              value={spookyObject}
              onChange={(e) => setSpookyObject(e.target.value)}
              placeholder="e.g. child-lock indicator illuminated"
              className="w-full px-3 py-2 rounded-xl bg-[#1a122e] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-orange-300 mb-1">Catalyst Event</label>
            <input
              type="text"
              value={catalyst}
              onChange={(e) => setCatalyst(e.target.value)}
              placeholder='e.g. phone speaker: "Is she with you?"'
              className="w-full px-3 py-2 rounded-xl bg-[#1a122e] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Fear Level Slider & Duration Selector */}
        <div className="mt-5 pt-4 border-t border-purple-500/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          {/* Fear Slider */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${fearLevel >= 8 ? 'text-red-500 animate-pulse' : 'text-orange-400'}`} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Fear Level Slider</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded border font-bold ${tier.bg} ${tier.border} ${tier.color}`}>
                  {tier.label}
                </span>
                <span className="text-base font-black font-mono text-orange-400 tabular-nums">
                  {fearLevel}/10
                </span>
              </div>
            </div>

            <div className="relative flex items-center">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={fearLevel}
                onChange={(e) => handleFearChange(Number(e.target.value))}
                className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>1: Mild Draft</span>
              <span>5: Spine Chiller</span>
              <span>8: Rideshare Horror</span>
              <span>10: Unhinged Dread</span>
            </div>
          </div>

          {/* Duration Selector & Action CTA */}
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-purple-500/20">
              <button
                onClick={() => setDuration(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  duration === 2 ? 'bg-orange-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                2-Min Tale
              </button>
              <button
                onClick={() => setDuration(4)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  duration === 4 ? 'bg-orange-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                4-Min Deep Dive
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Forging Terror...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Forge Scary Tale
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Story Reader Output Card */}
      <div className="rounded-3xl bg-[#0f0a1c] border border-orange-500/30 overflow-hidden shadow-2xl">
        {/* Story Header */}
        <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-[#170e2b] via-[#120b22] to-[#170e2b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-xs text-orange-400/90 mb-1">
              <span>Fear Level {currentStory.fearLevel}/10</span>
              <span aria-hidden="true">·</span>
              <span>{currentStory.estimatedReadTime} read</span>
              <span aria-hidden="true">·</span>
              <span>{currentStory.wordCount} words</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-cinzel tracking-wide">
              {currentStory.title}
            </h3>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => spookyAudio.playJumpScare()}
              className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs flex items-center gap-1.5 transition-colors"
              title="Test jump-scare audio cue"
            >
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span>Jump-Scare Cue</span>
            </button>

            <button
              onClick={handleCopyStory}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadStory}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Download Tale (.txt)"
            >
              <Download className="w-4 h-4" />
            </button>

            {onOpenPythonTerminal && (
              <button
                onClick={onOpenPythonTerminal}
                className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs flex items-center gap-1.5 transition-colors"
                title="View in Python Terminal"
              >
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>Python Engine</span>
              </button>
            )}
          </div>
        </div>

        {/* Flagship Narrator Voice Selector (Web Speech API) */}
        <div className="p-6 border-b border-purple-500/25 bg-[#120b22]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold">
                  Narrator Voice Selector
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-950/80 text-orange-300 border border-orange-500/30">
                  Web Speech API
                </span>
              </div>
              <h4 className="text-lg font-black text-white font-cinzel">
                Select Horror Narrator Persona
              </h4>
              <p className="text-xs text-zinc-400">
                Calibrated voice synthesis with atmospheric pitch, speed, and real-time paragraph tracking
              </p>
            </div>

            {/* Narration Main Action Controls */}
            <div className="flex items-center gap-2">
              {!isNarrating || isNarratingPaused ? (
                <button
                  onClick={handleStartNarration}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isNarratingPaused ? 'Resume Tale' : 'Read Story Aloud'}</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseNarration}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={handleStopNarration}
                disabled={!isNarrating && !isNarratingPaused}
                className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-35 transition-colors"
                title="Stop Narration"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={() => setAmbientAudioEnabled(!ambientAudioEnabled)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  ambientAudioEnabled
                    ? 'bg-purple-950/80 border-purple-500/60 text-purple-200'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
                title={ambientAudioEnabled ? 'Ambient Audio On (Click to Mute)' : 'Ambient Audio Muted (Click to Enable)'}
              >
                {ambientAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowAdvancedTuning(!showAdvancedTuning)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  showAdvancedTuning
                    ? 'bg-orange-500 text-black font-bold border-orange-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
                title="Fine-tune pitch & rate sliders"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* The 3 Specific Presets: Ancient Crypt, Shrieking Banshee, Gravelly Grave-Digger */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {NARRATOR_VOICE_PRESETS.map((preset) => {
              const isSelected = selectedVoice === preset.id;
              const isAuditioning = auditioningPreset === preset.id;
              const isCurrentlyReading = isNarrating && isSelected;

              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    setSelectedVoice(preset.id);
                    if (isNarrating) {
                      handleStopNarration();
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? `${preset.theme.bg} ${preset.theme.border} ring-2 ${preset.theme.ring} shadow-xl ${preset.theme.glow}`
                      : 'bg-[#18112c]/80 border-purple-500/20 text-zinc-300 hover:bg-[#20153a] hover:border-purple-500/40'
                  }`}
                >
                  <div>
                    {/* Header: Icon, Name & Audition Button */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl" role="img" aria-label={preset.name}>
                          {preset.icon}
                        </span>
                        <div>
                          <h5 className="font-cinzel font-bold text-sm text-white flex items-center gap-1.5">
                            {preset.name}
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            )}
                          </h5>
                          <span className="text-[11px] font-mono text-orange-300 block">
                            {preset.tagline}
                          </span>
                        </div>
                      </div>

                      {/* Audition / Sample Voice Button */}
                      <button
                        onClick={(e) => handleAuditionVoice(e, preset)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                          isAuditioning
                            ? 'bg-orange-500 text-black shadow-md shadow-orange-500/30 animate-pulse'
                            : 'bg-black/60 hover:bg-black/90 text-orange-300 border border-orange-500/30'
                        }`}
                        title={`Sample ${preset.name} voice`}
                      >
                        <Volume2 className="w-3 h-3 text-orange-400" />
                        <span>{isAuditioning ? 'Speaking...' : 'Audition'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-3">
                      {preset.description}
                    </p>
                  </div>

                  {/* Footer Badges */}
                  <div className="pt-2 border-t border-purple-900/30 flex items-center justify-between text-[10px] font-mono">
                    <span className={`px-2 py-0.5 rounded font-bold ${preset.theme.badgeBg} ${preset.theme.badgeText}`}>
                      {preset.badge}
                    </span>
                    <span className="text-zinc-400 flex items-center gap-1">
                      <span>FX:</span>
                      <span className="text-zinc-300">{preset.ambientTitle}</span>
                    </span>
                  </div>

                  {/* Active Reading Glow Strip */}
                  {isCurrentlyReading && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-rose-500 rounded-t-2xl animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Narration Indicator Banner */}
          {isNarrating && (
            <div className="mt-3.5 py-2 px-3.5 rounded-xl bg-orange-950/40 border border-orange-500/40 text-xs text-orange-300 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-orange-400 animate-spin" />
                <span className="font-semibold">
                  Ghost Host is reading aloud in <strong className="text-white">{NARRATOR_VOICE_PRESETS.find((p) => p.id === selectedVoice)?.name}</strong> voice...
                </span>
              </div>
              <span className="font-mono text-[11px] text-orange-400">
                Pitch: {customPitch.toFixed(2)} · Rate: {customRate.toFixed(2)}x
              </span>
            </div>
          )}

          {/* Collapsible Advanced Voice Tuning Drawer */}
          {showAdvancedTuning && (
            <div className="mt-4 p-4 rounded-xl bg-[#0c0818] border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-orange-300 uppercase font-bold">
                  Advanced Synthesizer Calibration
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Manual Web Speech override
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400">Pitch Multiplier:</span>
                    <span className="font-mono text-orange-400 font-bold">{customPitch.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.05"
                    value={customPitch}
                    onChange={(e) => setCustomPitch(parseFloat(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-0.5">
                    <span>0.1: Crypt Sub-Bass</span>
                    <span>2.0: Banshee Screech</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400">Speech Rate:</span>
                    <span className="font-mono text-orange-400 font-bold">{customRate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="1.6"
                    step="0.05"
                    value={customRate}
                    onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-0.5">
                    <span>0.4x: Cemetery Crawl</span>
                    <span>1.6x: Panic Rush</span>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Browser Voice Engine:</label>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-[#18112e] border border-purple-500/30 text-white text-xs focus:outline-none"
                  >
                    {browserVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Story Prose Display with Paragraph Tracking */}
        <div
          className={`p-6 sm:p-8 max-h-[600px] overflow-y-auto space-y-4 bg-[#0a0714] text-zinc-200 leading-relaxed text-base font-serif selection:bg-orange-500/30 transition-all duration-300 ${
            isNarrating ? 'ring-1 ring-orange-500/30 bg-[#0c0819]' : ''
          }`}
        >
          {currentStory.text.split('\n\n').map((para, idx) => {
            const isJumpScareParagraph = idx === currentStory.jumpScareTriggerParagraphIndex;
            const isCurrentlySpoken = activeReadingParagraph === idx;

            return (
              <p
                key={idx}
                className={`transition-all duration-300 rounded-xl p-2.5 ${
                  isCurrentlySpoken
                    ? 'text-white bg-orange-950/30 border-l-4 border-orange-500 shadow-md pl-4'
                    : isJumpScareParagraph
                    ? 'text-orange-200 bg-red-950/20 border-l-2 border-red-500'
                    : 'text-zinc-300'
                }`}
              >
                {para}
              </p>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-[#0d091a] border-t border-purple-500/20 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-400" />
            <span>Interactive Horror Reader · Audio narration & Web Speech synthesis</span>
          </div>
          <span className="font-mono text-zinc-500">spooky_forge.py compatible</span>
        </div>
      </div>
    </div>
  );
};
