import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI SDK on server-side with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Story Generation Route
 */
app.post('/api/generate-story', async (req, res) => {
  try {
    const {
      protagonist = 'Jordan',
      setting = 'an unlit basement corridor',
      spookyObject = 'an antique ticking pocketwatch',
      catalyst = 'a whisper calling out their middle name',
      fearLevel = 8,
      storyDurationMinutes = 2,
    } = req.body;

    const fear = Math.max(1, Math.min(10, Number(fearLevel) || 8));
    const is2Min = Number(storyDurationMinutes) === 2;
    const targetWords = is2Min ? 350 : 750;

    // Check if Gemini API is available
    if (process.env.GEMINI_API_KEY) {
      const prompt = `Write a realistic, bone-chilling Halloween horror story with:
- Protagonist: ${protagonist}
- Setting: ${setting}
- Spooky Object/Detail: ${spookyObject}
- Catalyst Event: ${catalyst}
- Fear Level: ${fear}/10 (${fear >= 8 ? 'Visceral dread, psychological terror, high suspense, realistic grounded danger' : fear >= 5 ? 'Creeping paranoia, mysterious shadows, unexplained occurrences' : 'Mild spooky atmosphere, eerie suspense'})
- Target reading length: exactly ${is2Min ? '2 minutes (~350-400 words)' : '4 minutes (~750-850 words)'}.

Format instructions:
Lead directly with an ominous Title line, followed by double line breaks, then short punchy paragraphs that build tension with every sentence, similar to realistic Reddit nosleep / creepypasta pacing. Include a twist or lingering chilling detail at the end.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an acclaimed master of psychological horror fiction and realistic campfire scary tales. You craft grounded, deeply unsettling stories that evoke genuine chills.',
          temperature: 0.85,
        },
      });

      const text = response.text || '';
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      const title = lines[0]?.replace(/^#+\s*/, '').replace(/\*+/g, '') || `The Incident at ${setting}`;
      const storyBody = lines.slice(1).join('\n\n').trim() || text;
      const wordCount = storyBody.split(/\s+/).length;

      return res.json({
        success: true,
        title,
        fearLevel: fear,
        wordCount,
        estimatedReadTime: `${storyDurationMinutes} minutes`,
        story: storyBody,
        source: 'gemini-3.8-flash',
      });
    }

    // Local procedural fallback if API key is not present
    return res.json({
      success: true,
      useLocalEngine: true,
      message: 'Running local procedural story engine',
    });
  } catch (error: unknown) {
    console.error('Story generation error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown generation failure',
      useLocalEngine: true,
    });
  }
});

/**
 * Universal Spooky Tools Helper Route (Rewriter, Costume, Campus Ghost, Study Buddy)
 */
app.post('/api/spooky-tools', async (req, res) => {
  try {
    const { tool, input, context } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: true, useLocal: true });
    }

    let systemInstruction = 'You are a Halloween horror entity.';
    let prompt = input;

    if (tool === 'jumpscare-rewriter') {
      systemInstruction = 'You are a gothic horror author who rewrites mundane texts (emails, notes, messages) into sinister, Edgar Allan Poe-style dark psychological horror while preserving the original intent.';
      prompt = `Rewrite this normal text into gothic creeping horror:\n"${input}"`;
    } else if (tool === 'costume-concierge') {
      systemInstruction = 'You are an ingenious costume designer specializing in clever, DIY Halloween costumes made strictly from ordinary household items.';
      prompt = `Generate 2 creative DIY Halloween costume ideas using only these items or materials: "${input}". Provide step-by-step instructions.`;
    } else if (tool === 'campus-ghost') {
      systemInstruction = 'You are Sir Phineas, the 1890s resident campus ghost haunting Blackwood University. Answer student queries with Victorian spectral wit, ghost lore, and accurate helpful campus guidance.';
      prompt = `A student asks: "${input}"`;
    } else if (tool === 'nightmare-journal') {
      systemInstruction = 'You are a Jungian psychological dream analyst specializing in nightmares, shadow archetypes, and horror motifs.';
      prompt = `Analyze this nightmare fragment: "${input}". Provide: 1. Recurring Theme Summary, 2. Psychological Shadow Archetype, 3. Short Narrative Polishing.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { systemInstruction, temperature: 0.8 },
    });

    return res.json({
      success: true,
      result: response.text,
    });
  } catch (error: unknown) {
    console.error('Spooky tools error:', error);
    return res.json({ success: true, useLocal: true });
  }
});

/**
 * Music Generation Route using lyria-3-clip-preview
 */
app.post('/api/generate-music', async (req, res) => {
  try {
    const { prompt = 'Generate a 30-second atmospheric Halloween horror track with eerie pipe organ, distant church bell toll, and low cello drone.' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: false, fallback: true, message: 'API key not configured' });
    }

    const response = await ai.models.generateContentStream({
      model: 'lyria-3-clip-preview',
      contents: prompt,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (audioBase64) {
      return res.json({
        success: true,
        audioBase64,
        mimeType,
        lyrics,
        duration: '30s',
        model: 'lyria-3-clip-preview',
      });
    }

    return res.json({ success: false, fallback: true, message: 'No audio returned from Lyria model' });
  } catch (error: unknown) {
    console.error('Lyria music generation error:', error);
    return res.json({
      success: false,
      fallback: true,
      error: error instanceof Error ? error.message : 'Lyria model request error',
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🎃 Halloween Spooky Forge Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
