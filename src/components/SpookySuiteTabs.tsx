import React, { useState } from 'react';
import {
  GraduationCap,
  Building,
  Shirt,
  Ghost,
  Compass,
  Search,
  BookMarked,
  Cpu,
  ShieldCheck,
  Check,
  ArrowRight,
  RefreshCw,
  Heart,
  Brain,
  Backpack,
} from 'lucide-react';
import {
  GHOST_STUDY_QUIZZES,
  CAMPUS_GHOST_FAQS,
  COSTUME_RECIPES,
  HAUNTED_HOUSE_ROOMS,
  MONSTER_MENTOR_TOPICS,
  HALLOWEEN_SAFETY_DATA,
} from '../utils/spookyTemplates';
import { spookyAudio } from '../utils/soundEffects';

export const SpookySuiteTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('study-buddy');

  // PS 1.2 State
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // PS 1.3 State
  const [faqInput, setFaqInput] = useState<string>('');
  const [ghostAnswer, setGhostAnswer] = useState<string>(CAMPUS_GHOST_FAQS[0].response);
  const [ghostLoading, setGhostLoading] = useState<boolean>(false);

  // PS 1.4 State
  const [userItems, setUserItems] = useState<string>('Old trenchcoat, umbrella, notebook');
  const [customCostumeAdvice, setCustomCostumeAdvice] = useState<string | null>(null);

  // PS 1.5 State
  const [normalText, setNormalText] = useState<string>(
    'Hi team, please find the meeting agenda attached. The deadline is tomorrow at 5 PM. Let me know if you have questions.'
  );
  const [isGothicMode, setIsGothicMode] = useState<boolean>(true);
  const [gothicText, setGothicText] = useState<string>(
    'Tremble, condemned souls. Fastened hereto lies the decree of our final reckoning. The eleventh chime shall strike on the morrow at dusk; thereafter, the gates of reprieve shall slam shut forevermore. Speak now, or let silence consume you in the crypt.'
  );

  // PS 1.6 State (Text Adventure)
  const [currentRoomId, setCurrentRoomId] = useState<string>('foyer');
  const [sanity, setSanity] = useState<number>(85);
  const [health, setHealth] = useState<number>(100);
  const [inventory, setInventory] = useState<string[]>(['Faded Matchbox']);
  const [gameLog, setGameLog] = useState<string[]>([
    'You wake on the frigid marble floor of Blackwood Manor. The storm howls outside.',
  ]);

  // PS 1.7 State (Fake or Phantom)
  const [debunkQuery, setDebunkQuery] = useState<string>(
    'A white translucent figure was caught floating across a doorbell security camera at 3 AM.'
  );
  const [debunkAnalysis, setDebunkAnalysis] = useState<string>(
    'FORENSIC CONCLUSION: Likely a tiny spider or moth crawling directly over the IR illuminator lens. When an insect is millimeters from an infrared camera, it is far outside the focal plane, appearing as a blurred, glowing translucent "orb" or floating apparition.'
  );

  // PS 1.8 State (Nightmare Journal)
  const [dreamNotes, setDreamNotes] = useState<string>(
    'I was running through an endless hallway of doors. Every door I opened led back to an empty exam room where an old telephone kept ringing.'
  );
  const [dreamThemes, setDreamThemes] = useState<{ theme: string; meaning: string }[]>([
    { theme: 'Endless Corridors', meaning: 'Subconscious feeling of repetitive career or academic stagnation.' },
    { theme: 'Unanswered Telephones', meaning: 'Urgent communication or unresolved conflict you are avoiding.' },
    { theme: 'Empty Exam Room', meaning: 'Classic "impostor phenomenon" fear of unanticipated evaluation.' },
  ]);

  // PS 1.9 State (Monster Mentor)
  const [mentorIdx, setMentorIdx] = useState<number>(0);
  const [mentorAnswered, setMentorAnswered] = useState<boolean>(false);
  const [mentorSelected, setMentorSelected] = useState<number | null>(null);

  // PS 1.10 State (Multilingual Safety)
  const [safetyLang, setSafetyLang] = useState<'en' | 'kn' | 'hi'>('en');

  // PS 1.6 Adventure Action Handler
  const handleRoomChoice = (option: (typeof HAUNTED_HOUSE_ROOMS)['foyer']['options'][0]) => {
    if (option.requiredItem && !inventory.includes(option.requiredItem)) {
      spookyAudio.playDoorCreak();
      setGameLog((prev) => [
        `❌ You cannot do that! You require: ${option.requiredItem}.`,
        ...prev.slice(0, 7),
      ]);
      return;
    }

    if (option.itemFound && !inventory.includes(option.itemFound)) {
      setInventory((prev) => [...prev, option.itemFound!]);
    }

    const nextSanity = Math.max(0, Math.min(100, sanity + option.sanityDelta));
    const nextHealth = Math.max(0, Math.min(100, health + option.healthDelta));
    setSanity(nextSanity);
    setHealth(nextHealth);
    setGameLog((prev) => [option.logMessage, ...prev.slice(0, 7)]);
    setCurrentRoomId(option.targetRoomId);

    if (nextSanity <= 20 || nextHealth <= 20) {
      spookyAudio.playJumpScare();
    } else {
      spookyAudio.playHeartbeat(75);
    }
  };

  const handleAskCampusGhost = async (question: string) => {
    setGhostLoading(true);
    spookyAudio.playEerieWind();
    try {
      const res = await fetch('/api/spooky-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'campus-ghost', input: question }),
      });
      const data = await res.json();
      if (data.result) {
        setGhostAnswer(data.result);
        setGhostLoading(false);
        return;
      }
    } catch {
      // fallback
    }
    const matched = CAMPUS_GHOST_FAQS.find((f) =>
      question.toLowerCase().includes(f.query.toLowerCase().split(' ')[0])
    );
    setGhostAnswer(
      matched
        ? matched.response
        : `Ah, mortal scholar! In my 130 years drifting across this academy, I have watched countless students wander lost. The answer you seek is locked within the Dean's sealed ledgers!`
    );
    setGhostLoading(false);
  };

  const currentRoom = HAUNTED_HOUSE_ROOMS[currentRoomId] || HAUNTED_HOUSE_ROOMS.foyer;
  const currentQuiz = GHOST_STUDY_QUIZZES[quizIdx];
  const currentMentor = MONSTER_MENTOR_TOPICS[mentorIdx];
  const safetyContent = HALLOWEEN_SAFETY_DATA[safetyLang];

  return (
    <div className="rounded-3xl bg-[#0f0a1c] border border-orange-500/30 overflow-hidden shadow-2xl my-8">
      {/* Navigation Tabs Bar */}
      <div className="p-3 bg-[#150e26] border-b border-purple-500/20 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('study-buddy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'study-buddy'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>PS 1.2 · Study Buddy</span>
          </button>

          <button
            onClick={() => setActiveTab('campus-ghost')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'campus-ghost'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>PS 1.3 · Campus Ghost</span>
          </button>

          <button
            onClick={() => setActiveTab('costume')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'costume'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>PS 1.4 · Costume Concierge</span>
          </button>

          <button
            onClick={() => setActiveTab('jumpscare-rewriter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'jumpscare-rewriter'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Ghost className="w-3.5 h-3.5" />
            <span>PS 1.5 · Jump-Scare Rewriter</span>
          </button>

          <button
            onClick={() => setActiveTab('adventure')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'adventure'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>PS 1.6 · Haunted Adventure</span>
          </button>

          <button
            onClick={() => setActiveTab('fake-phantom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'fake-phantom'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>PS 1.7 · Fake or Phantom?</span>
          </button>

          <button
            onClick={() => setActiveTab('nightmare-journal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'nightmare-journal'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>PS 1.8 · Nightmare Journal</span>
          </button>

          <button
            onClick={() => setActiveTab('monster-mentor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'monster-mentor'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>PS 1.9 · Monster Mentor</span>
          </button>

          <button
            onClick={() => setActiveTab('safety-guide')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'safety-guide'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PS 1.10 · Safety Guide</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {/* PS 1.2 · Haunted Study Buddy */}
        {activeTab === 'study-buddy' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Exam Revision Host · Master Phineas</span>
                <h3 className="text-xl font-bold text-white font-cinzel">Haunted Study Buddy</h3>
                <p className="text-xs text-zinc-400">Answer correctly to appease the ghostly tutor</p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-[#1c1430] text-purple-300 border border-purple-500/30">
                Topic: {currentQuiz.subject}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#130d22] border border-purple-500/20">
              <p className="text-base font-semibold text-white mb-4 leading-relaxed">
                "{currentQuiz.question}"
              </p>

              <div className="space-y-2">
                {currentQuiz.options.map((opt, i) => {
                  let optStyle = 'bg-[#1b1230] border-purple-500/20 text-zinc-200 hover:bg-[#251842]';
                  if (quizAnswered) {
                    if (i === currentQuiz.correctIndex) {
                      optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (i === selectedOption) {
                      optStyle = 'bg-red-950/80 border-red-500 text-red-200';
                    }
                  }
                  return (
                    <button
                      key={i}
                      disabled={quizAnswered}
                      onClick={() => {
                        setSelectedOption(i);
                        setQuizAnswered(true);
                        if (i === currentQuiz.correctIndex) {
                          spookyAudio.playTollBell();
                        } else {
                          spookyAudio.playJumpScare();
                        }
                      }}
                      className={`w-full p-3 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {quizAnswered && i === currentQuiz.correctIndex && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div className="mt-4 p-4 rounded-xl bg-[#090611] border border-purple-500/30 text-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Ghost className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-white">Ghost Host Verdict:</span>
                  </div>
                  <p className="italic text-purple-200 mb-2">
                    {selectedOption === currentQuiz.correctIndex
                      ? currentQuiz.ghostPraise
                      : currentQuiz.ghostChastise}
                  </p>
                  <p className="text-zinc-400 border-t border-purple-900/40 pt-2">
                    <strong>Spectral Explanation:</strong> {currentQuiz.explanation}
                  </p>

                  <button
                    onClick={() => {
                      setQuizAnswered(false);
                      setSelectedOption(null);
                      setQuizIdx((prev) => (prev + 1) % GHOST_STUDY_QUIZZES.length);
                    }}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-orange-500 text-black font-bold text-xs hover:bg-orange-400 transition-colors"
                  >
                    Next Question
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PS 1.3 · Ghost in the Campus */}
        {activeTab === 'campus-ghost' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Blackwood Hall Resident Specter</span>
              <h3 className="text-xl font-bold text-white font-cinzel">Ghost in the Campus</h3>
              <p className="text-xs text-zinc-400">Ask campus FAQs (timetables, labs, curfews) to the resident phantom</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {CAMPUS_GHOST_FAQS.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setFaqInput(faq.query);
                    handleAskCampusGhost(faq.query);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#1a122e] hover:bg-[#241940] border border-purple-500/20 text-xs text-zinc-300 transition-colors"
                >
                  "{faq.query}"
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={faqInput}
                onChange={(e) => setFaqInput(e.target.value)}
                placeholder="Ask about labs, library hours, dining hall mystery stew..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#140e24] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={() => handleAskCampusGhost(faqInput || 'Where are the CS labs?')}
                disabled={ghostLoading}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm transition-colors disabled:opacity-50"
              >
                {ghostLoading ? 'Summoning...' : 'Ask Ghost'}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#090611] border border-purple-500/30 font-serif text-sm leading-relaxed text-purple-200">
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-orange-400">
                <Ghost className="w-4 h-4 animate-ghost-float" />
                <span>Sir Phineas (Deceased 1892) speaks:</span>
              </div>
              <p className="italic">"{ghostAnswer}"</p>
            </div>
          </div>
        )}

        {/* PS 1.4 · Costume Concierge */}
        {activeTab === 'costume' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">DIY Halloween Stylist</span>
              <h3 className="text-xl font-bold text-white font-cinzel">Costume Concierge</h3>
              <p className="text-xs text-zinc-400">Turn everyday household items into creative Halloween costumes</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#140e24] border border-purple-500/20">
              <label className="block text-xs font-medium text-orange-300 mb-1.5">
                Items You Already Own:
              </label>
              <input
                type="text"
                value={userItems}
                onChange={(e) => setUserItems(e.target.value)}
                placeholder="e.g. trenchcoat, sunglasses, umbrella, cardboard, marker"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1432] border border-purple-500/30 text-white text-sm mb-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Curated DIY Recipes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COSTUME_RECIPES.map((recipe, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#140e24] border border-purple-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-orange-950/60 border border-orange-500/30 text-orange-300">
                      {recipe.difficulty}
                    </span>
                    <h4 className="text-base font-bold text-white font-cinzel mt-2 mb-1">
                      {recipe.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mb-2">
                      <strong>Needs:</strong> {recipe.itemsNeeded.join(', ')}
                    </p>
                    <ol className="text-xs text-zinc-300 space-y-1.5 list-decimal pl-4">
                      {recipe.instructions.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PS 1.5 · Jump-Scare Rewriter */}
        {activeTab === 'jumpscare-rewriter' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Text Creepifier</span>
                <h3 className="text-xl font-bold text-white font-cinzel">Jump-Scare Rewriter</h3>
                <p className="text-xs text-zinc-400">Rewrite plain text, emails, and notes in a gothic Poe/Lovecraft voice</p>
              </div>

              {/* Normal Mode vs Gothic Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-black/40 border border-purple-500/20">
                <button
                  onClick={() => setIsGothicMode(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    !isGothicMode ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  Normal Mode
                </button>
                <button
                  onClick={() => {
                    setIsGothicMode(true);
                    spookyAudio.playTollBell();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    isGothicMode ? 'bg-red-600 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  Cursed Gothic Mode
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Original Mundane Text:</label>
                <textarea
                  value={normalText}
                  onChange={(e) => setNormalText(e.target.value)}
                  rows={6}
                  className="w-full p-4 rounded-2xl bg-[#140e24] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-orange-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-orange-400 mb-1">
                  {isGothicMode ? 'Gothic Horror Incantation:' : 'Normal Safe Voice:'}
                </label>
                <div className={`p-4 rounded-2xl border min-h-[148px] text-sm leading-relaxed ${
                  isGothicMode
                    ? 'bg-[#0a0614] border-red-500/40 text-red-200 font-serif'
                    : 'bg-[#140e24] border-purple-500/30 text-zinc-300 font-sans'
                }`}>
                  {isGothicMode ? gothicText : normalText}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PS 1.6 · Haunted House Text Adventure */}
        {activeTab === 'adventure' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Choose-Your-Path Horror Game</span>
                <h3 className="text-xl font-bold text-white font-cinzel">Haunted House Text Adventure</h3>
                <p className="text-xs text-zinc-400">Explore Blackwood Manor · Manage your sanity and health to survive</p>
              </div>

              {/* Status HUD */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-300">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Sanity: {sanity}%</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Health: {health}%</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-950/80 border border-orange-500/30 text-orange-300">
                  <Backpack className="w-4 h-4 text-orange-400" />
                  <span>Inventory: {inventory.length}</span>
                </div>
              </div>
            </div>

            {/* Room Card */}
            <div className="p-6 rounded-2xl bg-[#140e24] border border-orange-500/30 space-y-4">
              <div className="border-b border-purple-500/20 pb-3">
                <span className="text-xs font-mono text-orange-400 uppercase">Current Chamber:</span>
                <h4 className="text-lg font-bold text-white font-cinzel">{currentRoom.name}</h4>
                <p className="text-sm text-zinc-300 mt-1 font-serif leading-relaxed">{currentRoom.description}</p>
              </div>

              {/* Inventory Pill Strip */}
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="font-semibold text-orange-400">Items Carried:</span>
                {inventory.map((item, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#1f1538] border border-purple-500/30 text-purple-200 font-mono">
                    {item}
                  </span>
                ))}
              </div>

              {/* Interactive Choices */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-zinc-400">Select Next Action:</span>
                {currentRoom.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleRoomChoice(opt)}
                    className="w-full p-3.5 rounded-xl bg-[#1c1432] hover:bg-orange-500 hover:text-black border border-purple-500/30 text-left text-sm text-zinc-200 transition-all flex items-center justify-between group"
                  >
                    <span>{opt.text}</span>
                    <ArrowRight className="w-4 h-4 text-orange-400 group-hover:text-black shrink-0 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>

              {/* Action Log */}
              <div className="p-3 rounded-xl bg-[#090611] border border-purple-900/60 font-mono text-xs text-zinc-400 space-y-1">
                <span className="text-orange-400 font-bold block mb-1">Dungeon Master Chronicler:</span>
                {gameLog.map((log, lIdx) => (
                  <p key={lIdx} className={lIdx === 0 ? 'text-zinc-200 font-semibold' : 'text-zinc-500'}>
                    › {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PS 1.7 · Fake or Phantom? */}
        {activeTab === 'fake-phantom' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Media-Literacy Paranormal Debunker</span>
              <h3 className="text-xl font-bold text-white font-cinzel">Fake or Phantom?</h3>
              <p className="text-xs text-zinc-400">Forensic optical analysis explaining why scary-looking sightings and hoaxes are false</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#140e24] border border-purple-500/20 space-y-3">
              <label className="block text-xs font-medium text-orange-300">Examine a Viral Sighting or Hoax Claim:</label>
              <textarea
                value={debunkQuery}
                onChange={(e) => setDebunkQuery(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-[#1c1432] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-orange-500"
              />

              <div className="p-4 rounded-xl bg-[#090611] border border-purple-500/30 text-xs text-zinc-300 leading-relaxed font-mono">
                <span className="text-orange-400 font-bold block mb-1">Scientific Optical Breakdown:</span>
                {debunkAnalysis}
              </div>
            </div>
          </div>
        )}

        {/* PS 1.8 · Nightmare Journal */}
        {activeTab === 'nightmare-journal' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Private Offline Dream Logger</span>
              <h3 className="text-xl font-bold text-white font-cinzel">Nightmare Journal</h3>
              <p className="text-xs text-zinc-400">Synthesize dream notes into short psychological stories and recurring-theme summaries</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#140e24] border border-purple-500/20">
                <label className="block text-xs font-medium text-orange-300 mb-2">Dream Notes & Fragments:</label>
                <textarea
                  value={dreamNotes}
                  onChange={(e) => setDreamNotes(e.target.value)}
                  rows={6}
                  className="w-full p-3 rounded-xl bg-[#1c1432] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#140e24] border border-purple-500/20">
                <span className="text-xs font-mono text-orange-400 block mb-2 font-bold">Jungian Theme Analysis:</span>
                <div className="space-y-2.5">
                  {dreamThemes.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#090611] border border-purple-900/60 text-xs">
                      <span className="font-bold text-purple-300 block">{item.theme}</span>
                      <span className="text-zinc-400">{item.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PS 1.9 · Monster Mentor */}
        {activeTab === 'monster-mentor' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Computer Science Monster Analogies</span>
                <h3 className="text-xl font-bold text-white font-cinzel">Monster Mentor</h3>
                <p className="text-xs text-zinc-400">Master difficult OS, DBMS, and ML concepts through spooky creatures</p>
              </div>

              <div className="flex gap-1.5">
                {MONSTER_MENTOR_TOPICS.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMentorIdx(i);
                      setMentorAnswered(false);
                      setMentorSelected(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                      mentorIdx === i ? 'bg-orange-500 text-black font-bold' : 'bg-[#1b1230] text-zinc-400'
                    }`}
                  >
                    Concept {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#140e24] border border-purple-500/20 space-y-4">
              <div>
                <span className="text-xs font-mono text-orange-400">Concept:</span>
                <h4 className="text-lg font-bold text-white font-cinzel">{currentMentor.topic}</h4>
                <p className="text-xs text-purple-300 italic mb-2">Creature Analogy: {currentMentor.monster}</p>
                <div className="p-4 rounded-xl bg-[#090611] border border-purple-900/60 text-xs text-zinc-300 whitespace-pre-line leading-relaxed font-mono">
                  {currentMentor.analogy}
                </div>
              </div>

              {/* Quick Concept Quiz */}
              <div className="border-t border-purple-500/20 pt-4">
                <p className="text-sm font-semibold text-white mb-2">{currentMentor.quiz.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentMentor.quiz.options.map((opt, i) => {
                    let optStyle = 'bg-[#1c1432] border-purple-500/20 text-zinc-200';
                    if (mentorAnswered) {
                      if (i === currentMentor.quiz.correctIndex) {
                        optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                      } else if (i === mentorSelected) {
                        optStyle = 'bg-red-950/80 border-red-500 text-red-200';
                      }
                    }
                    return (
                      <button
                        key={i}
                        disabled={mentorAnswered}
                        onClick={() => {
                          setMentorSelected(i);
                          setMentorAnswered(true);
                          if (i === currentMentor.quiz.correctIndex) spookyAudio.playTollBell();
                        }}
                        className={`p-3 rounded-xl border text-xs text-left transition-all ${optStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {mentorAnswered && (
                  <p className="mt-3 p-3 rounded-xl bg-[#090611] text-xs text-emerald-300 border border-emerald-500/30">
                    {currentMentor.quiz.feedback}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PS 1.10 · Trick-or-Treat Safety Guide */}
        {activeTab === 'safety-guide' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Multilingual Assistant</span>
                <h3 className="text-xl font-bold text-white font-cinzel">Trick-or-Treat Safety Guide</h3>
                <p className="text-xs text-zinc-400">Practical, age-appropriate safety checklist for kids & guardians</p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-black/40 border border-purple-500/20">
                <button
                  onClick={() => setSafetyLang('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    safetyLang === 'en' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-400'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setSafetyLang('kn')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    safetyLang === 'kn' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-400'
                  }`}
                >
                  ಕನ್ನಡ (Kannada)
                </button>
                <button
                  onClick={() => setSafetyLang('hi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    safetyLang === 'hi' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-400'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140e24] border border-purple-500/20 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white font-cinzel">{safetyContent.title}</h4>
                <p className="text-xs text-orange-300/80">{safetyContent.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {safetyContent.tips.map((tip, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#090611] border border-purple-900/60">
                    <span className="text-xs font-bold text-orange-400 block mb-1">
                      {tip.category}
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>

              {/* Emergency Card Box */}
              <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/40 text-xs">
                <div className="flex items-center gap-2 text-orange-300 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>{safetyContent.emergencyCard.title}</span>
                </div>
                <p className="text-zinc-300">{safetyContent.emergencyCard.rule}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
