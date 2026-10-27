/**
 * Spooky Story Templates & Halloween Problem Statement Logic
 */

export interface StoryParams {
  protagonist: string;
  setting: string;
  spookyObject: string;
  catalyst: string;
  fearLevel: number; // 1 to 10
  storyDurationMinutes: 2 | 4;
}

export interface GeneratedStory {
  title: string;
  fearLevel: number;
  wordCount: number;
  estimatedReadTime: string;
  summary: string;
  text: string;
  jumpScareTriggerParagraphIndex: number;
}

export const RIDESHARE_HORROR_STORY: GeneratedStory = {
  title: "Rideshare Horror",
  fearLevel: 8,
  wordCount: 840,
  estimatedReadTime: "4 minutes",
  summary: "A routine late-night rideshare veers into an unmapped industrial district, with child locks engaged and a phone conversation not meant for the passenger.",
  jumpScareTriggerParagraphIndex: 26,
  text: `I don't use rideshare apps very often, but about two years ago I had no other choice.

I had attended a friend's birthday dinner in another part of the city. By the time I left, it was almost midnight. Public transportation had stopped running, and I didn't feel like walking through unfamiliar neighborhoods alone.

So I opened a rideshare app and booked a car.

The driver's profile seemed normal. Good rating. Hundreds of completed trips. Nothing unusual.

The car arrived within five minutes.

When I got in, the driver greeted me politely and confirmed my destination. Everything felt routine.

For the first ten minutes, the ride was exactly what you'd expect. I scrolled through my phone while he drove in silence.

Then I noticed something.

The driver had turned off the main road.

At first, I assumed he was taking a shortcut.

But after another few minutes, the route on my phone showed we were moving farther away from the destination.

I leaned forward and said, "I think we missed a turn."

The driver glanced at the mirror.

"No, this is faster."

His answer sounded rehearsed.

I checked the navigation again.

The estimated arrival time had actually increased.

I felt a small knot form in my stomach.

Maybe the app hadn't updated.

Maybe there was road construction.

There was always a reasonable explanation.

Still, I decided to stay alert.

A few minutes later, we entered an industrial area.

Most businesses were closed.

Streetlights were sparse.

The roads were nearly empty.

I looked around and realized I hadn't seen another pedestrian for several blocks.

That was when my phone buzzed.

A text from my friend.

"Made it home?"

I quickly replied.

"Not yet. Driver is taking a weird route."

My friend responded immediately.

"Share your live location."

I did.

Just to be safe.

The driver looked into the rearview mirror again.

Almost as if he knew something had changed.

The silence inside the car became uncomfortable.

Then his phone rang.

He answered using speakerphone.

A male voice asked where he was.

The driver replied with a street name I didn't recognize.

The caller then asked, "Is she with you?"

For a second, nobody spoke.

The driver turned off speakerphone.

My stomach dropped.

Maybe they were talking about someone else.

Maybe not.

But every instinct told me something was wrong.

I quietly opened the emergency features inside the app.

At that moment, I noticed another detail.

The child-lock indicator was illuminated on the door.

I tested the handle carefully.

The door wouldn't open.

Now I was genuinely scared.

I tried to stay calm.

Panic would only make things worse.

I told the driver I felt car sick and needed to get out.

He didn't respond.

Instead, he accelerated.

Not dramatically.

Just enough to tell me he had heard me and didn't care.

I immediately called my friend.

Not because I needed help from them.

I wanted the driver to know somebody else was listening.

The moment he heard me speaking to another person, his behavior changed.

Suddenly he became friendly.

Started making small talk.

Started acting normal.

It was forced.

Too forced.

Meanwhile, my friend was tracking my location and had already called the police non-emergency line.

I learned that later.

A few minutes passed.

Then I saw something up ahead.

A gas station.

Bright lights.

Several people outside.

I made a decision.

As soon as the vehicle slowed near the entrance, I unlocked my seat belt.

I reached for the manual lock.

For some reason, this time it released.

Before the car fully stopped, I opened the door and stepped out.

The driver immediately drove away.

No apology.

No explanation.

Gone.

I went inside the gas station and stayed there until my friend arrived.

The next morning, I contacted the rideshare company.

I expected them to dismiss my concerns.

Instead, they asked a surprising number of questions.

Questions about the route.

The conversation I overheard.

The child lock.

Everything.

Several days later they informed me the driver's account had been permanently suspended.

They never explained why.

I never learned what really happened that night.

Maybe there was an innocent explanation.

Maybe there wasn't.

But one thing still bothers me.

A week later I checked my trip history.

The route shown in the app was completely different from the one I remembered taking.

According to the map, we had stayed on normal roads the entire trip.

There was no industrial district.

No detour.

No strange route.

Nothing.

Yet my friend still has screenshots of my live location from that night.

Screenshots showing my phone moving through streets that don't appear on the ride record at all.

I've never used that rideshare service again.

And whenever I get into a car with a stranger now, the first thing I check isn't the driver's rating.

It's whether the door will open.`
};

/**
 * Procedural horror generator calibrated strictly to keywords and fear level (1-10)
 */
export function generateProceduralScaryStory(params: StoryParams): GeneratedStory {
  const protagonist = params.protagonist.trim() || "Jordan";
  const setting = params.setting.trim() || "an unlit basement corridor";
  const object = params.spookyObject.trim() || "an antique ticking pocketwatch";
  const catalyst = params.catalyst.trim() || "a whisper calling out their middle name";
  const fear = params.fearLevel;
  const is2Min = params.storyDurationMinutes === 2;

  // Fear tier descriptions
  let toneAdjective = "unsettling";
  let sensoryDetail = "The temperature dropped three degrees within seconds.";
  let threatLevel = "a quiet suspicion";
  let climaxAction = "a shadow that shouldn't have been cast";

  if (fear >= 8) {
    toneAdjective = "suffocating, paralyzing terror";
    sensoryDetail = "The stench of ozone and damp grave earth filled the lungs until breathing felt like swallowing glass.";
    threatLevel = "an inescapable predatory presence";
    climaxAction = "a pale, elongated face pressed against the glass from inside the room where nobody was supposed to be alive";
  } else if (fear >= 5) {
    toneAdjective = "creeping dread";
    sensoryDetail = "Every hair on the back of the neck stood rigid as the fluorescent bulb flickered and hummed in agony.";
    threatLevel = "a sinister realization that someone had been watching";
    climaxAction = "footsteps dragging slowly across the floorboards directly overhead";
  } else {
    toneAdjective = "an eerie chill";
    sensoryDetail = "A draft seemed to rise from nowhere, stirring the dust in soft spirals.";
    threatLevel = "an odd trick of the light";
    climaxAction = "the door clicking shut on its own latch";
  }

  const titlePrefixes = ["The Curse of", "Whispers in", "The Incident at", "Echoes from", "No Escape from"];
  const randomPrefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
  const title = `${randomPrefix} ${setting.slice(0, 24)} (Fear ${fear}/10)`;

  let storyBody = "";

  if (is2Min) {
    // 2-minute version (~350 words)
    storyBody = `It was supposed to be an ordinary evening for ${protagonist}.

There was no forecast of trouble, no ominous omen—just the mundane reality of arriving at ${setting}. The silence there was neither peaceful nor empty; it had weight, like water pressing against an eardrum.

That was when ${protagonist} first noticed ${object}.

It wasn't where it belonged. It rested on an uneven surface, untouched by dust, cold to the touch despite the stifling air. When ${protagonist} reached down to inspect it, the ambient noise of the outside world evaporated. No distant traffic. No wind against the windowpanes. Nothing.

Then came ${catalyst}.

${sensoryDetail}

At first, ${protagonist} tried to rationalize it. The mind is adept at manufacturing polite excuses for impossible things. It was just acoustics. It was just fatigue.

"Hello?" ${protagonist} called out. The voice sounded hollow, swallowed whole by the corners of ${setting}.

No human voice answered. Instead, ${climaxAction}.

The realization struck with ${toneAdjective}: whatever had brought ${object} here had not left. It was waiting for ${protagonist} to turn around.

${protagonist} took two steps backward, keeping eyes fixed on the empty corridor. The exit door was only twelve paces away. But when ${protagonist}'s hand struck the metal handle, the latch refused to budge. A heavy deadbolt turned from the outside with a slow, deliberate click.

And in the silence that followed, a soft breath brushed against the right ear.

"You're late," the voice rasped.

${protagonist} has never spoken of that night to anyone since. But whenever ${setting} is mentioned, their hands tremble so violently they can barely hold a pen.`;
  } else {
    // 4-minute version (~750 words)
    storyBody = `Nobody deliberately walks into a nightmare. It usually starts with a simple, practical choice.

For ${protagonist}, that choice was staying late at ${setting}.

By eleven forty-five, the building had emptied. The janitorial staff had completed their rounds an hour prior, leaving behind only the antiseptic odor of bleach and the low, mechanical drone of ventilation shafts. ${protagonist} packed up their belongings, anxious to reach the warmth of home.

As they stepped into the main threshold, something caught their gaze.

There, positioned exactly in the center of the doorway, was ${object}.

It didn't belong to any colleague. It didn't belong to the building inventory. It looked as though it had been placed there deliberately, angled toward whoever would be the last person to exit.

${protagonist} hesitated. You never realize how loud your own footsteps are until you are completely alone.

Curiosity overruled caution. ${protagonist} leaned down to pick it up. The surface was impossibly frigid, sending an involuntary shiver straight up the spinal column.

And that was the precise moment ${catalyst}.

${sensoryDetail}

${protagonist} froze. The rational mind attempted to build a fortress of excuses: an old boiler, settling foundations, a stray draft through an unsealed gasket. But none of those explanations accounted for the distinct cadence of the sound.

It was rhythmic. Intentional.

"Is someone still here?" ${protagonist} called out.

The words bounced off the walls and died in the shadows. For five seconds, there was absolute stillness.

Then the lights began to die.

Not all at once. One by one, the overhead fixtures went black in sequence, marching steadily from the far end of ${setting} straight toward where ${protagonist} stood clutching ${object}.

Panic arrived not as a sudden jolt, but as ${toneAdjective}.

${protagonist} turned on their phone flashlight. The slender beam sliced through the rising dust, revealing nothing but empty floor. Yet ${threatLevel} remained oppressive.

${protagonist} began to walk toward the exit. Then they broke into a sprint.

Behind them, something accelerated to match their stride. It didn't sound like shoes on concrete. It sounded like bare, damp feet slapping against the tiles, accompanied by ${climaxAction}.

"Open up!" ${protagonist} slammed into the heavy exit doors, rattling the steel panic bar.

Locked. The electronic card reader was completely dead, its LED indicator dark.

Behind them, the footsteps stopped.

${protagonist} held their breath, pressing their spine flat against the steel door. Through the dark air, three feet away, came the soft click of ${object} vibrating in their pocket, even though they were certain they had dropped it ten seconds ago.

A wet hand pressed against the glass above their head, leaving a pale smear of moisture.

${protagonist} threw their entire body weight against the emergency latch one last time. With a screech of metal, the door burst outward into the cold night rain.

They didn't look back until they reached the crowded streets three avenues away.

The next morning, ${protagonist} returned with security. The cameras covering ${setting} had recorded the entire evening. The security guard watched the footage twice in complete silence before rewinding.

On the screen, ${protagonist} was visible running in absolute terror, slamming against doors and crying for help.

Except on the camera feed, the corridor was brightly lit.

And in their hands, there was no object at all—only empty air, clutched in white-knuckled desperation.

${protagonist} resigned that afternoon. And to this day, they refuse to be in any room where the door cannot be seen from every angle.`;
  }

  const words = storyBody.split(/\s+/).length;

  return {
    title,
    fearLevel: fear,
    wordCount: words,
    estimatedReadTime: is2Min ? "2 minutes" : "4 minutes",
    summary: `A chilling ${is2Min ? "2-minute" : "4-minute"} horror tale featuring ${protagonist} encountering ${object} in ${setting}.`,
    jumpScareTriggerParagraphIndex: is2Min ? 8 : 14,
    text: storyBody
  };
}

/**
 * PS 1.2: Haunted Study Buddy data
 */
export interface StudyQuiz {
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  ghostPraise: string;
  ghostChastise: string;
  explanation: string;
}

export const GHOST_STUDY_QUIZZES: StudyQuiz[] = [
  {
    subject: "Computer Science (OS)",
    question: "Which condition is NOT one of the four necessary Coffman conditions for a Deadlock to haunt an operating system?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
    correctIndex: 2,
    ghostPraise: "Splendid, mortal! You've banished the deadlock phantom! Preemption actually breaks the cursed loop!",
    ghostChastise: "Alas! The specter laughs in your face! 'No Preemption' is the curse that binds them, not 'Preemption Allowed'!",
    explanation: "The 4 Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait."
  },
  {
    subject: "Data Structures & Algorithms",
    question: "In the graveyard of Big-O notations, what is the worst-case time complexity of searching a standard Binary Search Tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctIndex: 2,
    ghostPraise: "Astute observation! When the tree degenerates into a linear spine of bones, O(n) strikes!",
    ghostChastise: "A fatal misstep! If the tree degenerates into an unholy straight line, you must search every tombstone: O(n)!",
    explanation: "While a balanced BST achieves O(log n), an unbalanced degenerate BST acts like a linked list with worst-case O(n)."
  },
  {
    subject: "Biology / Genetics",
    question: "During cellular respiration, in which eerie chamber of the cell does the Krebs cycle occur?",
    options: ["Mitochondrial Matrix", "Cytoplasm", "Endoplasmic Reticulum", "Golgi Apparatus"],
    correctIndex: 0,
    ghostPraise: "By the spirits of ATP! Correct! The mitochondrial matrix brews the chemical embers of life!",
    ghostChastise: "Wrong crypt! The Krebs cycle haunts the inner Mitochondrial Matrix, not the outer cytoplasm!",
    explanation: "Glycolysis occurs in the cytoplasm, while the Krebs (citric acid) cycle takes place inside the mitochondrial matrix."
  }
];

/**
 * PS 1.3: Campus Ghost FAQs
 */
export const CAMPUS_GHOST_FAQS = [
  {
    query: "What time does the library close?",
    response: "The iron gates clang shut at midnight sharp, fledgling scholar. Stay past 12:01 AM and you shall discover why the 4th-floor reference section smells of burnt tallow and wet cedar. The night librarian is not on the payroll, yet she files books nonetheless."
  },
  {
    query: "Where are the CS labs located?",
    response: "Descend into Turing Hall's sub-basement. Follow the flickering green phosphor lights. If you hear rhythmic mechanical typing from Lab B302 when the room is dark, do NOT disturb the phantom compiler. He is debugging a memory leak from 1984."
  },
  {
    query: "What is the mystery meat in the dining hall?",
    response: "Even as a spirit who died in 1892, I fear Thursday's Shepherd's Pie. The chef claims it is mutton, but my spectral senses detect ancient culinary necromancy. Stick to the sealed yogurt cups, mortal."
  },
  {
    query: "What are the dorm curfew rules?",
    response: "Curfew is 10:30 PM for outer dorm gates. After that, the courtyard gargoyles open their sandstone eyes. If you must sneak in, step only on the uncracked cobblestones, or my screech will alert the Resident Assistant."
  }
];

/**
 * PS 1.4: Costume Concierge Preset Database
 */
export interface CostumeRecipe {
  title: string;
  difficulty: "Easy (10 min)" | "Medium (20 min)" | "Masterpiece (35 min)";
  itemsNeeded: string[];
  instructions: string[];
}

export const COSTUME_RECIPES: CostumeRecipe[] = [
  {
    title: "The Ghostly Victorian Detective",
    difficulty: "Easy (10 min)",
    itemsNeeded: ["Old trenchcoat or blazer", "Umbrella or walking stick", "Baby powder or flour", "Notebook"],
    instructions: [
      "Dust your shoulders, collar, and hair with a light misting of baby powder for a 19th-century crypt patina.",
      "Turn your collar high up, hold an antique umbrella tucked under your arm.",
      "Carry a dog-eared notebook with 'UNSOLVED' scrawled in charcoal across the cover.",
      "Walk with slow, measured steps and periodically stare intently into shadows."
    ]
  },
  {
    title: "The Cursed Glitched NPC",
    difficulty: "Medium (20 min)",
    itemsNeeded: ["Normal clothes", "Cardboard label", "Safety pin", "Red marker"],
    instructions: [
      "Cut cardboard into a small floating dialogue icon (like a question mark or exclamation mark) and pin it slightly askew.",
      "Walk directly into walls, stop for 3 seconds, turn 90 degrees mechanically, and repeat the same greeting dialogue.",
      "Apply slight eyeliner 'tear lines' to look like you are trapped in a simulation loop."
    ]
  },
  {
    title: "Shadow Entity / Void Walker",
    difficulty: "Easy (10 min)",
    itemsNeeded: ["Black hoodie", "Dark sunglasses", "Black gloves", "Black face mask or cloth"],
    instructions: [
      "Layer all completely matte black garments, pulling the hoodie tight around the face mask.",
      "Keep hands tucked into sleeves until sudden dramatic reveals.",
      "Carry a small portable mini flashlight under your chin turned to lowest red light mode."
    ]
  }
];

/**
 * PS 1.6: Haunted House Text Adventure Game State
 */
export interface AdventureRoom {
  id: string;
  name: string;
  description: string;
  options: {
    text: string;
    targetRoomId: string;
    requiredItem?: string;
    itemFound?: string;
    sanityDelta: number;
    healthDelta: number;
    logMessage: string;
  }[];
}

export const HAUNTED_HOUSE_ROOMS: Record<string, AdventureRoom> = {
  foyer: {
    id: "foyer",
    name: "The Rotting Grand Foyer",
    description: "Cold rain slants through shattered stained glass. A grandfather clock ticks backward. Cobwebs veil a grand double staircase. A heavy oak door leads East into the Library, while West opens into the Conservatory.",
    options: [
      {
        text: "Explore the dusty Conservatory to the West",
        targetRoomId: "conservatory",
        sanityDelta: -5,
        healthDelta: 0,
        itemFound: "Iron Skeleton Key",
        logMessage: "You slip through the rusted iron conservatory doors, finding an ornate skeleton key nestled in dead thorns."
      },
      {
        text: "Enter the towering Library to the East",
        targetRoomId: "library",
        sanityDelta: -10,
        healthDelta: 0,
        logMessage: "The smell of ancient decay and leather binds you as whispers rustle among the high shelves."
      },
      {
        text: "Ascend the creaking staircase to the Upper Gallery",
        targetRoomId: "gallery",
        sanityDelta: -15,
        healthDelta: -5,
        logMessage: "A stair collapses beneath your heel! Something brushes past your ankles in the dark."
      }
    ]
  },
  conservatory: {
    id: "conservatory",
    name: "The Dead Glass Conservatory",
    description: "Twisted black vines choke cracked statues. In the center, a dried fountain holds a brass oil lantern.",
    options: [
      {
        text: "Take the Brass Lantern and return to Foyer",
        targetRoomId: "foyer",
        itemFound: "Brass Lantern",
        sanityDelta: +5,
        healthDelta: 0,
        logMessage: "You light the lantern! Warm yellow flame pushes back the encroaching shadows."
      },
      {
        text: "Inspect the stone sarcophagus beneath the vines",
        targetRoomId: "crypt_entry",
        sanityDelta: -20,
        healthDelta: -10,
        logMessage: "The sarcophagus lid slides open with a shriek! A cold skeletal hand grasps your sleeve!"
      }
    ]
  },
  library: {
    id: "library",
    name: "The Forbidden Archive",
    description: "Thousands of moldering books. A glowing ritual circle hums on the floorboards. At the back is a reinforced Iron Gate.",
    options: [
      {
        text: "Unlock the Iron Gate (Requires Iron Skeleton Key)",
        targetRoomId: "sanctum",
        requiredItem: "Iron Skeleton Key",
        sanityDelta: -10,
        healthDelta: 0,
        logMessage: "The skeleton key turns with a satisfying heavy thunk. The gate swings inward."
      },
      {
        text: "Read the open tome on the lectern",
        targetRoomId: "library",
        sanityDelta: -25,
        healthDelta: 0,
        itemFound: "Warding Amulet",
        logMessage: "You read the incantation! Eldritch symbols burn into your memory, but you gain a protective amulet."
      },
      {
        text: "Retreat to the Grand Foyer",
        targetRoomId: "foyer",
        sanityDelta: 0,
        healthDelta: 0,
        logMessage: "You step back into the foyer, heart pounding like a trapped bird."
      }
    ]
  },
  gallery: {
    id: "gallery",
    name: "The Portrait Gallery",
    description: "Portraits of the Blackwood lineage line the walls. Every pair of painted eyes tracks your movement.",
    options: [
      {
        text: "Shine Lantern on the largest portrait (Requires Brass Lantern)",
        targetRoomId: "sanctum",
        requiredItem: "Brass Lantern",
        sanityDelta: +10,
        healthDelta: 0,
        logMessage: "The lantern's flame reveals a hidden passage behind the patriarch's portrait!"
      },
      {
        text: "Run back down to the Foyer",
        targetRoomId: "foyer",
        sanityDelta: -5,
        healthDelta: 0,
        logMessage: "You scramble down the stairs as portrait frames rattle against the wallpaper."
      }
    ]
  },
  sanctum: {
    id: "sanctum",
    name: "The Altar of the Eclipse (WIN ROOM)",
    description: "A moonlit chamber overlooking the misty valley. An ancient bell hangs from silver chains. Ringing it will cleanse the manor!",
    options: [
      {
        text: "Ring the Silver Cleansing Bell and Escape!",
        targetRoomId: "escaped",
        sanityDelta: +50,
        healthDelta: +20,
        logMessage: "The pure chime of silver shatters the curse! Dawn breaks over the horizon. YOU SURVIVED!"
      }
    ]
  },
  crypt_entry: {
    id: "crypt_entry",
    name: "The Damp Sub-Crypt",
    description: "The floor is flooded with freezing black water. Rats scatter across crumbling bone piles.",
    options: [
      {
        text: "Climb desperately back up to the Conservatory",
        targetRoomId: "conservatory",
        sanityDelta: -10,
        healthDelta: -10,
        logMessage: "You haul yourself up through the brambles, gasping for breath."
      }
    ]
  },
  escaped: {
    id: "escaped",
    name: "Dawn Over Blackwood Manor",
    description: "Golden sunlight floods the misty grounds. The evil of the manor is banished. You have conquered the night!",
    options: [
      {
        text: "Play Again (Reset Manor)",
        targetRoomId: "foyer",
        sanityDelta: 100,
        healthDelta: 100,
        logMessage: "A new night falls..."
      }
    ]
  }
};

/**
 * PS 1.9: Monster Mentor database
 */
export const MONSTER_MENTOR_TOPICS = [
  {
    topic: "Operating Systems: Deadlock (The 4 Coffman Conditions)",
    monster: "Count Vlad & Countess Carmilla (The Vampire Blood Banquet)",
    analogy: `Imagine two arrogant vampires, Vlad and Carmilla. Vlad has the Golden Goblet but needs the Silver Chalice to drink. Carmilla has the Silver Chalice but needs the Golden Goblet.
1. Mutual Exclusion: Only one vampire can hold a goblet at a time.
2. Hold & Wait: Vlad holds his goblet while stubbornly waiting for Carmilla's.
3. No Preemption: Neither can slap the cup out of the other's claw.
4. Circular Wait: Vlad waits for Carmilla, Carmilla waits for Vlad.
Result: Both starve for centuries until dawn breaks! That is a CPU Deadlock!`,
    quiz: {
      question: "How would the vampire mentor solve this deadlock using 'Preemption'?",
      options: [
        "Force Vlad to release his goblet if Carmilla refuses to share",
        "Make them both hold 10 more cups",
        "Wait forever until the sun burns them",
        "Delete both vampires from memory"
      ],
      correctIndex: 0,
      feedback: "Splendid! Preemption means forcibly taking a resource away from a process to resolve the circular wait."
    }
  },
  {
    topic: "Databases: ACID Transactions (The Werewolf Pack Oath)",
    monster: "The Ironclaw Werewolf Pack",
    analogy: `When werewolves transfer prey between dens, they swear an unyielding sacred covenant called ACID:
- Atomicity: Either the whole hunt succeeds together, or the entire pack rolls back to the den (All-or-Nothing).
- Consistency: The pack's total food count must match before and after the full moon.
- Isolation: Pack Beta cannot raid the meat cellar while Pack Alpha is doing the inventory tally.
- Durability: Once carved onto the granite cave wall, not even a silver bullet can erase the ledger!`,
    quiz: {
      question: "Which ACID property guarantees that a crashed database still preserves committed writes?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correctIndex: 3,
      feedback: "Awoooo! Durability guarantees that once a transaction commits, it survives system crashes and power cuts!"
    }
  },
  {
    topic: "Machine Learning: Overfitting (Frankenstein's Tailored Suit)",
    monster: "Frankenstein's Monster & Dr. Frankenstein",
    analogy: `Dr. Frankenstein sews a suit tailored down to the exact microscopic millimeter of his monster's posture on Tuesday at 3:02 PM.
The suit fits the monster with 100% training accuracy.
However, the moment the monster lifts an arm or steps outside in the rain (unseen test data), the seams violently explode!
The suit was OVERFITTED to noise and quirks, failing completely to generalize to real life.`,
    quiz: {
      question: "How can Dr. Frankenstein prevent his suit from overfitting?",
      options: [
        "Use Regularization (looser, flexible stitches) and Cross-Validation",
        "Sew 500 more tight buttons onto the exact same sleeve",
        "Ignore all test data forever",
        "Increase model complexity to infinity"
      ],
      correctIndex: 0,
      feedback: "Brilliant! Regularization (L1/L2) penalizes excessive complexity, forcing the model to generalize smoothly!"
    }
  }
];

/**
 * PS 1.10: Multilingual Halloween Safety Tips
 */
export const HALLOWEEN_SAFETY_DATA = {
  en: {
    language: "English",
    title: "Trick-or-Treat Safety Commandment",
    subtitle: "Practical, age-appropriate safety checklist for kids and guardians",
    tips: [
      { category: "Visibility", text: "Fasten reflective tape to costumes or bags, and carry a flashlight with fresh batteries so motorists spot you from 500 feet away." },
      { category: "Costume Fit", text: "Ensure hems sit above shoe level to avoid tripping, and prefer non-toxic face paint over bulky plastic masks that obstruct peripheral vision." },
      { category: "Candy Inspection", text: "Never consume unwrapped or torn candy. Inspect all treats in good lighting at home before taking the first bite." },
      { category: "Pedestrian Rules", text: "Always cross streets at established crosswalks, make direct eye contact with drivers, and never cut across unlit backyards alone." }
    ],
    emergencyCard: {
      title: "Kid's Emergency Safety Card",
      rule: "Stay in well-lit public neighborhoods. If separated, seek a uniformed officer, store cashier, or home with a lit porch."
    }
  },
  kn: {
    language: "Kannada (ಕನ್ನಡ)",
    title: "ಹ್ಯಾಲೋವೀನ್ ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶಿ (Trick-or-Treat Safety)",
    subtitle: "ಮಕ್ಕಳು ಮತ್ತು ಪೋಷಕರಿಗೆ ಪ್ರಾಯೋಗಿಕ ಹಾಗೂ ವಯಸ್ಸಿಗೆ ತಕ್ಕ ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು",
    tips: [
      { category: "ಗೋಚರತೆ (Visibility)", text: "ಉಡುಪುಗಳು ಅಥವಾ ಚೀಲಗಳಿಗೆ ಹೊಳೆಯುವ ರಿಫ್ಲೆಕ್ಟಿವ್ ಟೇಪ್ ಅಂಟಿಸಿ, ವಾಹನ ಸವಾರರಿಗೆ ಕತ್ತಲಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಿಸಲು ಟಾರ್ಚ್ ಬಳಸಿ." },
      { category: "ಉಡುಪಿನ ಎಚ್ಚರಿಕೆ (Costume Fit)", text: "ಕಾಲು ಮುಗ್ಗರಿಸದಂತೆ ವಸ್ತ್ರಗಳನ್ನು ಸರಿಯಾದ ಅಳತೆಗೆ ಧರಿಸಿ. ದೃಷ್ಟಿ ಮರೆಯಾಗದಂತೆ ಪ್ಲಾಸ್ಟಿಕ್ ಮುಖವಾಡಗಳ ಬದಲು ಸುರಕ್ಷಿತ ಫೇಸ್ ಪೇಂಟ್ ಬಳಸಿ." },
      { category: "ಮಿಠಾಯಿ ತಪಾಸಣೆ (Candy Check)", text: "ಸೀಲ್ ಮುರಿದ ಅಥವಾ ತೆರೆದಿರುವ ಚಾಕೊಲೇಟ್‌ಗಳನ್ನು ತಿನ್ನಬೇಡಿ. ಮನೆಗೆ ಬಂದ ನಂತರ ಬೆಳಕಿನಲ್ಲಿ ಪೋಷಕರು ಪರಿಶೀಲಿಸಿದ ಮೇಲೆಯೇ ಸೇವಿಸಿ." },
      { category: "ರಸ್ತೆ ನಿಯಮಗಳು (Road Safety)", text: "ಯಾವಾಗಲೂ ಜೀಬ್ರಾ ಕ್ರಾಸಿಂಗ್‌ನಲ್ಲಿ ಮಾತ್ರ ರಸ್ತೆ ದಾಟಿ. ಕತ್ತಲೆಯಾದ ಹಿತ್ತಲು ಅಥವಾ ಪರಿಚಯವಿಲ್ಲದ ಮನೆಗಳ ಒಳಗೆ ಎಂದಿಗೂ ಒಬ್ಬರೇ ಹೋಗಬೇಡಿ." }
    ],
    emergencyCard: {
      title: "ಮಕ್ಕಳ ತುರ್ತು ಸಂಪರ್ಕ ನಿಯಮ",
      rule: "ಗುಂಪಿನಲ್ಲೇ ಇರಿ. ದಾರಿ ತಪ್ಪಿದರೆ ತಕ್ಷಣ ಅಂಗಡಿ ಮಾಲೀಕರು ಅಥವಾ ಸಮವಸ್ತ್ರ ಧರಿಸಿದ ಅಧಿಕಾರಿಗಳ ಸಹಾಯ ಪಡೆಯಿರಿ."
    }
  },
  hi: {
    language: "Hindi (हिन्दी)",
    title: "हैलोवीन सुरक्षा निर्देशिका (Trick-or-Treat Safety)",
    subtitle: "बच्चों और अभिभावकों के लिए सुरक्षित, व्यावहारिक एवं आयु-अनुकूल सावधानियां",
    tips: [
      { category: "दृश्यता (Visibility)", text: "पोशाक या बैग पर रिफ्लेक्टिव टेप लगाएं और टॉर्च साथ रखें ताकि 500 फीट दूर से भी वाहन चालक आपको देख सकें।" },
      { category: "पोशाक की फिटिंग (Costume Fit)", text: "कपड़े इतने लंबे न हों कि फिसल जाएं। भारी प्लास्टिक मास्क के बजाय सुरक्षित फेस पेंट चुनें जिससे देखने में बाधा न आए।" },
      { category: "कैंडी की जांच (Candy Inspection)", text: "फटे रैपर या बिना सील वाली मिठाई बिल्कुल न खाएं। घर आकर रोशनी में माता-पिता से जांच कराने के बाद ही खाएं।" },
      { category: "पैदल चलने के नियम (Pedestrian Safety)", text: "सड़क हमेशा जेब्रा क्रॉसिंग से पार करें। अकेले कभी किसी सुनसान गली या अंधेरे घर के पिछले हिस्से में न जाएं।" }
    ],
    emergencyCard: {
      title: "आपातकालीन सुरक्षा नियम",
      rule: "हमेशा रोशन सड़कों पर रहें। यदि समूह से बिछड़ जाएं, तो तुरंत किसी पुलिसकर्मी या दुकान के कैशियर से संपर्क करें।"
    }
  }
};
