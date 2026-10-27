#!/usr/bin/env python3
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
from typing import Dict, Any, List

# ANSI Spooky Color Palettes
RESET = "\033[0m"
BOLD = "\033[1m"
ORANGE = "\033[38;5;208m"
BLOOD_RED = "\033[38;5;196m"
GHOST_PURPLE = "\033[38;5;141m"
ECTO_GREEN = "\033[38;5;82m"
DIM_GRAY = "\033[90m"

# Featured realistic 4-minute template provided in specification
RIDESHARE_HORROR_TEMPLATE = """I don't use rideshare apps very often, but about two years ago I had no other choice.

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

It's whether the door will open."""


class SpookyStoryForge:
    """
    Local Story Generator engine calibrating narrative tension,
    sensory imagery, and pacing based on keywords and fear levels.
    """

    def __init__(self):
        self.preset_templates: Dict[str, str] = {
            "rideshare": RIDESHARE_HORROR_TEMPLATE
        }

    def generate(
        self,
        protagonist: str = "Jordan",
        setting: str = "an unlit basement corridor",
        spooky_object: str = "an antique pocket watch",
        catalyst: str = "a whisper calling out their middle name",
        fear_level: int = 8,
        duration_minutes: int = 2
    ) -> Dict[str, Any]:
        """
        Generate a localized scary tale using keyword synthesis and fear-level weighting.
        """
        # Clamp fear level between 1 and 10
        fear = max(1, min(10, int(fear_level)))

        # Tone and sensory calibration based on Fear Level
        if fear >= 8:
            tone = "suffocating, paralyzing terror"
            sensory = "The stench of ozone and damp grave earth filled the lungs until breathing felt like swallowing needles."
            threat = "an inescapable predatory presence"
            climax = "a pale, elongated silhouette pressed against the frosted glass from INSIDE the sealed chamber"
        elif fear >= 5:
            tone = "creeping dread"
            sensory = "Every hair on the back of the neck stood rigid as the fluorescent fixture flickered and buzzed in agony."
            threat = "a sinister realization that someone had been silently watching"
            climax = "heavy footsteps dragging across the bare floorboards directly above"
        else:
            tone = "an eerie, unsettling chill"
            sensory = "A sudden draft rose from the floorboards, spinning dust into ghost-like spirals."
            threat = "an odd trick of the failing light"
            climax = "the door clicking shut on its own brass latch"

        if duration_minutes == 2:
            body = (
                f"It was supposed to be an ordinary evening for {protagonist}.\n\n"
                f"There was no forecast of trouble, no warning omen—just the mundane reality of arriving at {setting}. "
                f"The silence there was neither peaceful nor empty; it had weight, like cold water pressing against an eardrum.\n\n"
                f"That was when {protagonist} first noticed {spooky_object}.\n\n"
                f"It wasn't where it belonged. It rested on an uneven surface, untouched by dust, cold to the touch despite "
                f"the humid air. When {protagonist} reached down to inspect it, the ambient noise of the outside world abruptly died. "
                f"No distant traffic. No wind. Nothing.\n\n"
                f"Then came {catalyst}.\n\n"
                f"{sensory}\n\n"
                f"At first, {protagonist} tried to rationalize it. The rational mind is an expert at manufacturing polite excuses "
                f"for impossible terrors. It was just acoustics. It was just exhaustion.\n\n"
                f"'Hello?' {protagonist} called out. The voice sounded hollow, swallowed whole by the corners of {setting}.\n\n"
                f"No human voice replied. Instead, {climax}.\n\n"
                f"The realization struck with {tone}: whatever had brought {spooky_object} here had not departed. "
                f"It was waiting for {protagonist} to turn around.\n\n"
                f"{protagonist} took two steps backward, keeping eyes fixed on the empty corridor. The exit door was only twelve paces away. "
                f"But when {protagonist}'s hand struck the metal handle, the latch refused to budge. A heavy deadbolt turned from the outside "
                f"with a slow, deliberate click.\n\n"
                f"And in the darkness that followed, a freezing breath brushed against the right ear.\n\n"
                f"'You're late,' the voice rasped.\n\n"
                f"{protagonist} has never spoken of that night to anyone since. But whenever {setting} is mentioned, "
                f"their hands shake so violently they cannot hold a glass of water."
            )
            title = f"The Incident at {setting.title()[:25]} (Fear Level {fear}/10)"
            est_time = "2 minutes"
        else:
            # 4-minute deep dive
            body = RIDESHARE_HORROR_TEMPLATE if setting.lower() == "rideshare" else (
                f"Nobody deliberately walks into a nightmare. It usually starts with a simple, practical choice.\n\n"
                f"For {protagonist}, that choice was staying late at {setting}.\n\n"
                f"By midnight, the building had emptied. The staff had left an hour prior, leaving behind only the antiseptic odor "
                f"of bleach and the low mechanical drone of ventilation shafts. {protagonist} packed up their belongings, anxious to reach home.\n\n"
                f"As they stepped into the main threshold, something caught their gaze.\n\n"
                f"There, positioned directly in the center of the walkway, was {spooky_object}.\n\n"
                f"It didn't belong to any colleague. It looked as though it had been placed there deliberately, angled toward whoever "
                f"would be the last person to exit.\n\n"
                f"{protagonist} hesitated. You never realize how loud your own footsteps are until you are completely alone.\n\n"
                f"Curiosity overruled caution. {protagonist} leaned down to pick it up. The surface was impossibly frigid, sending an involuntary "
                f"shiver straight up the spinal column.\n\n"
                f"And that was the precise moment {catalyst}.\n\n"
                f"{sensory}\n\n"
                f"{protagonist} froze. The rational mind attempted to build a fortress of excuses. But none accounted for the distinct cadence of the sound.\n\n"
                f"It was rhythmic. Intentional.\n\n"
                f"'Is someone still here?' {protagonist} called out.\n\n"
                f"The words bounced off the walls and died in the shadows. For five seconds, there was absolute stillness.\n\n"
                f"Then the lights began to die. One by one, the overhead fixtures went black in sequence, marching steadily from the far end of {setting} "
                f"straight toward where {protagonist} stood clutching {spooky_object}.\n\n"
                f"Panic arrived not as a sudden jolt, but as {tone}.\n\n"
                f"{protagonist} sprinted toward the glass double doors. Behind them, something accelerated to match their stride. "
                f"It didn't sound like shoes on concrete. It was accompanied by {climax}.\n\n"
                f"'Open up!' {protagonist} slammed into the heavy exit doors. Locked.\n\n"
                f"Behind them, the footsteps stopped. A cold hand pressed against the glass above their head.\n\n"
                f"With a scream of adrenaline, {protagonist} threw their shoulder against the emergency release bar. It gave way with a screech of rusted iron.\n\n"
                f"They burst out into the storm and never returned."
            )
            title = f"The Haunting of {setting.title()[:25]} (Fear Level {fear}/10)"
            est_time = "4 minutes"

        words = len(body.split())
        return {
            "title": title,
            "fear_level": fear,
            "duration": est_time,
            "word_count": words,
            "story": body
        }


def typewriter_print(text: str, delay: float = 0.015):
    """Prints text with a typewriter effect to build spooky suspense."""
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()


def main():
    parser = argparse.ArgumentParser(
        description="Spooky Story Forge - Python 3 Local Horror Engine"
    )
    parser.add_argument("--protagonist", default="Jordan", help="Name of the main character")
    parser.add_argument("--setting", default="an abandoned subway station", help="The eerie location")
    parser.add_argument("--object", default="a vintage cassette recorder", help="Spooky object discovered")
    parser.add_argument("--catalyst", default="a raspy voice whispering backwards", help="The event that sparks terror")
    parser.add_argument("--fear", type=int, default=8, help="Fear Level slider (1 to 10)")
    parser.add_argument("--duration", type=int, choices=[2, 4], default=2, help="Story duration in minutes")
    parser.add_argument("--preset", choices=["rideshare", "custom"], default="custom", help="Use preset template like rideshare")
    parser.add_argument("--typewriter", action="store_true", help="Enable atmospheric typewriter effect")

    args = parser.parse_args()

    forge = SpookyStoryForge()

    print(f"\n{ORANGE}{BOLD}======================================================{RESET}")
    print(f"{ORANGE}{BOLD}  🎃 SPOOKY STORY FORGE · HALLOWEEN PYTHON ENGINE 🎃 {RESET}")
    print(f"{ORANGE}{BOLD}======================================================{RESET}\n")

    if args.preset == "rideshare":
        print(f"{BLOOD_RED}{BOLD}Loading Preset Template: Rideshare Horror (Fear Level 8/10){RESET}")
        result = {
            "title": "Rideshare Horror (Fear Level 8/10)",
            "fear_level": 8,
            "duration": "4 minutes",
            "word_count": len(RIDESHARE_HORROR_TEMPLATE.split()),
            "story": RIDESHARE_HORROR_TEMPLATE
        }
    else:
        result = forge.generate(
            protagonist=args.protagonist,
            setting=args.setting,
            spooky_object=args.object,
            catalyst=args.catalyst,
            fear_level=args.fear,
            duration_minutes=args.duration
        )

    print(f"{GHOST_PURPLE}Title:{RESET} {result['title']}")
    print(f"{BLOOD_RED}Fear Level:{RESET} [{result['fear_level']}/10] {'💀' * (result['fear_level'] // 2)}")
    print(f"{ECTO_GREEN}Target Duration:{RESET} {result['duration']} (~{result['word_count']} words)")
    print(f"{DIM_GRAY}{'-' * 54}{RESET}\n")

    if args.typewriter:
        typewriter_print(result["story"], delay=0.012)
    else:
        print(result["story"])

    print(f"\n{ORANGE}{BOLD}======================================================{RESET}")
    print(f"{DIM_GRAY}Audio cue trigger: \a [Bell Toll / Heartbeat Thump]{RESET}\n")


if __name__ == "__main__":
    main()
