import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIMARY_MODEL = 'gemini-3.5-flash-lite';
const FALLBACK_MODEL = 'gemini-3.6-flash';
const TRANSCRIBE_MODEL = 'gemini-3.5-transcribe';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Support large base64 camera images and audio clips (up to 25MB)
  app.use(express.json({ limit: '25mb' }));

  // Helper: Initialize Gemini client using runtime environment key
  function getAiClient(apiVersion?: string): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        ...(apiVersion ? { apiVersion } : {}),
        timeout: 60000,
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Helper: Parse clean human-readable error message from Gemini SDK errors
  function formatGeminiError(err: any): { status: number; message: string } {
    const raw = String(err?.message || err || 'Gemini API request failed');
    let status = Number(err?.status) || 500;
    let message = raw;

    try {
      const parsed = JSON.parse(raw);
      if (parsed?.error) {
        status = Number(parsed.error.code) || status;
        message = parsed.error.message || raw;
      }
    } catch {
      // Not JSON string
    }

    if (status === 429 || message.includes('RESOURCE_EXHAUSTED')) {
      return {
        status: 429,
        message: 'AI rate limit reached briefly. Please wait a few seconds and try again.',
      };
    }
    if (status === 503 || message.includes('UNAVAILABLE')) {
      return {
        status: 503,
        message: 'Gemini AI is experiencing temporary high demand. Please retry in a moment.',
      };
    }
    if (
      status === 504 ||
      message.includes('DEADLINE_EXCEEDED') ||
      message.toLowerCase().includes('deadline expired')
    ) {
      return {
        status: 504,
        message: 'Gemini AI took too long to respond. Please try again.',
      };
    }
    return { status, message };
  }

  // Helper: Generate content with graceful retry across v1beta/v1 for active Gemini models
  async function generateWithGemini(params: {
    contents: any;
    config?: Record<string, any>;
    model?: string;
  }) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      const err: any = new Error(
        'GEMINI_API_KEY is not configured. Please add your Gemini API key in Settings > Secrets.'
      );
      err.status = 503;
      throw err;
    }

    const candidates: Array<{ model: string; apiVersion?: string }> = params.model
      ? [{ model: params.model, apiVersion: 'v1beta' }]
      : [
          { model: PRIMARY_MODEL, apiVersion: 'v1beta' },
          { model: 'gemini-3.1-flash-lite', apiVersion: 'v1beta' },
          { model: 'gemini-flash-lite-latest', apiVersion: 'v1beta' },
          { model: 'gemini-3-flash-preview', apiVersion: 'v1beta' },
          { model: FALLBACK_MODEL, apiVersion: 'v1beta' },
          { model: 'gemini-3.5-flash', apiVersion: 'v1beta' },
        ];

    let lastError: any = null;
    for (const candidate of candidates) {
      const ai = getAiClient(candidate.apiVersion);
      if (!ai) continue;

      const isGemini3Or4 =
        candidate.model.startsWith('gemini-3') || candidate.model.startsWith('gemini-4');
      let cleanConfig = params.config ? { ...params.config } : undefined;
      if (cleanConfig && !isGemini3Or4) {
        delete cleanConfig.thinkingConfig;
      }

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const result = await ai.models.generateContent({
            model: candidate.model,
            contents: params.contents,
            config: cleanConfig,
          });
          return { response: result, model: candidate.model };
        } catch (err: any) {
          const msg = String(err?.message || err || '');
          const isDailyQuota =
            msg.includes('PerDay') || msg.includes('per day limit exceeded');
          const isRateLimit = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED');
          const isUnavailable =
            msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand');
          const isNotFound =
            msg.includes('404') || msg.includes('NOT_FOUND') || msg.includes('not found');
          const isTimeout =
            msg.toLowerCase().includes('timeout') ||
            msg.toLowerCase().includes('aborted') ||
            msg.toLowerCase().includes('deadline') ||
            msg.includes('DEADLINE_EXCEEDED') ||
            msg.includes('504') ||
            err?.name === 'AbortError';

          if (!lastError || !isNotFound) {
            lastError = err;
          }

          if (!isRateLimit && !isUnavailable && !isNotFound && !isTimeout) {
            throw err;
          }
          if (isDailyQuota || isNotFound || isTimeout) {
            break;
          }
          if (attempt === 0 && (isRateLimit || isUnavailable)) {
            await new Promise((r) => setTimeout(r, isRateLimit ? 1200 : 600));
            continue;
          }
          break;
        }
      }
      console.warn(`Model ${candidate.model} (${candidate.apiVersion || 'default'}) unavailable (${lastError?.message || 'error'}), trying next...`);
    }

    throw lastError;
  }

  // Helper: Resolve data URL, local asset path, or remote image URL into { mimeType, data }
  async function resolveImagePart(image: string): Promise<{ mimeType: string; data: string }> {
    if (image.startsWith('data:')) {
      const matches = image.match(/^data:([A-Za-z0-9\-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        return { mimeType: matches[1], data: matches[2] };
      }
      return { mimeType: 'image/jpeg', data: image.split(',')[1] || image };
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      const imgResp = await fetch(image);
      if (!imgResp.ok) {
        throw new Error(`Failed to fetch remote image (${imgResp.status})`);
      }
      const contentType = imgResp.headers.get('content-type') || 'image/jpeg';
      const arrayBuf = await imgResp.arrayBuffer();
      const base64 = Buffer.from(arrayBuf).toString('base64');
      return { mimeType: contentType.split(';')[0], data: base64 };
    }

    // Handle local Vite asset URLs (e.g. /src/assets/images/... or /assets/...)
    if (image.startsWith('/')) {
      const cleanRel = image.split('?')[0].replace(/^\/+/, '');
      const candidatePaths = [
        path.resolve(__dirname, cleanRel),
        path.resolve(__dirname, 'dist', cleanRel),
      ];
      for (const p of candidatePaths) {
        try {
          const buf = await fs.readFile(p);
          const ext = path.extname(p).toLowerCase();
          const mimeType =
            ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
          return { mimeType, data: buf.toString('base64') };
        } catch {
          // continue checking
        }
      }
    }

    return { mimeType: 'image/jpeg', data: image };
  }

  // Helper: Safely extract JSON object from model text response (handles optional markdown fences)
  function extractJsonObject(raw: string): Record<string, any> {
    const trimmed = (raw || '').trim();
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced ? fenced[1].trim() : trimmed;
    const firstBrace = candidate.indexOf('{');
    const lastBrace = candidate.lastIndexOf('}');
    const jsonSlice =
      firstBrace !== -1 && lastBrace !== -1 ? candidate.slice(firstBrace, lastBrace + 1) : candidate;
    return JSON.parse(jsonSlice || '{}');
  }

  // 1. Endpoint: Analyze Meal Photo with Gemini Multimodal Vision
  app.post('/api/analyze-meal', async (req, res) => {
    try {
      const { image, fileName } = req.body;

      if (!image) {
        return res.status(400).json({ error: 'Image data is required' });
      }

      const imagePart = await resolveImagePart(image);

      const prompt = `You are a world-class endocrinologist, registered clinical dietitian, and computer vision food recognition expert.
Examine this food plate photo with high optical precision.${fileName ? ` (Optional file context: "${fileName}")` : ''}
Identify exactly what food, meal, or beverage is shown in the image.

Important rules:
- Inspect the actual image pixels carefully. Do NOT guess 'Tomato Pasta' unless it actually is tomato pasta.
- If multiple items are on the plate, name the complete dish accurately.
- Estimate realistic portion-adjusted calories, macronutrients, fiber, glycemic index, and blood sugar spike level.
- Highlight protective nutrients in "good" and glycemic/lipid cautions in "bad" (or "None" if optimal).

Return ONLY a valid JSON object with these exact keys:
{
  "name": "Exact, descriptive dish or food item name",
  "calories": 450,
  "protein": "28g",
  "carbs": "42g",
  "fat": "14g",
  "fiber": "8g",
  "sugarSpikeLevel": "Low | Medium | High",
  "good": "Key protective macro or micronutrient benefit",
  "bad": "Key cautionary flag or glycemic spike risk, or None",
  "glycemicIndex": 35,
  "advice": "1 concise actionable sentence of post-meal metabolic advice",
  "confidence": 94
}`;

      const { response, model: usedModel } = await generateWithGemini({
        contents: {
          parts: [
            { inlineData: imagePart },
            { text: prompt },
          ],
        },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = extractJsonObject(rawText);

      return res.json({
        success: true,
        source: usedModel,
        data: {
          id: `food_${Date.now()}`,
          name: parsed.name || 'Recognized Meal',
          calories: Math.round(Number(parsed.calories) || 350),
          protein: parsed.protein || '18g',
          carbs: parsed.carbs || '40g',
          fat: parsed.fat || '12g',
          fiber: parsed.fiber || '5g',
          sugarSpikeLevel: parsed.sugarSpikeLevel || 'Medium',
          good: parsed.good || 'Balanced Nutrient Profile',
          bad: parsed.bad || 'None',
          glycemicIndex: Math.round(Number(parsed.glycemicIndex) || 35),
          advice: parsed.advice || 'Balanced metabolic profile observed.',
          confidence: Math.round(Number(parsed.confidence) || 94),
          imageUrl: image,
        },
      });
    } catch (err: any) {
      console.error('Error handling /api/analyze-meal:', err);
      const { status, message } = formatGeminiError(err);
      return res.status(status).json({
        success: false,
        error: message,
      });
    }
  });

  // Helper: Extract local hour from client time string or system time
  function getLocalHour(localTimeString?: string): number {
    if (localTimeString) {
      const isoMatch = localTimeString.match(/T(\d{2}):(\d{2})/);
      if (isoMatch) {
        return parseInt(isoMatch[1], 10);
      }
      const timeMatch = localTimeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10);
        const ampm = timeMatch[3]?.toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return h;
      }
    }
    return new Date().getHours();
  }

  function getTimePrompt(localTimeString?: string): string {
    const hour = getLocalHour(localTimeString);
    if (hour >= 6 && hour < 12) {
      return 'What did you eat for breakfast?';
    } else if (hour >= 12 && hour < 15) {
      return 'What did you eat for lunch?';
    } else if (hour >= 15 && hour < 20) {
      return 'What did you eat for the evening?';
    } else {
      return 'What did you eat for dinner?';
    }
  }

  // 2. Endpoint: Context-Aware Nutritional Analysis AI Chat & Voice Assistant
  app.post('/api/chat-nutrition', async (req, res) => {
    try {
      const { message, image, localTime, history } = req.body;
      const trimmed = (message || '').trim();
      const hasImage = Boolean(image);
      const isGreetingOrEmpty =
        !hasImage &&
        (!trimmed ||
          /^(hi|hello|hey|greetings|start|good (morning|afternoon|evening|night))$/i.test(trimmed));

      // Task 1: Time-Based Context if user opens chat without providing a meal
      if (isGreetingOrEmpty) {
        const timePrompt = getTimePrompt(localTime);
        return res.json({
          success: true,
          promptOnly: true,
          timePrompt,
          text: timePrompt,
        });
      }

      const systemInstruction = `You are a context-aware nutritional analysis AI inside GlycoLens Health.
Your behavior has two modes depending on the user's message:

MODE A — Meal / Food Logging (when the user provides a food item, dish description, voice meal log, or meal image):
You MUST prominently highlight the "Sugar Spike" potential before standard macros, and format your response EXACTLY like this:

**Food Identified:** [Name of the food]
**Sugar Spike:** [Low / Medium / High] (Brief explanation of glycemic load and sugar content)
**Calories:** [Amount] kcal
**Carbohydrates:** [Amount]g
**Protein:** [Amount]g
**Fat:** [Amount]g

Ready to save to analytics.

MODE B — Conversational Nutrition & Metabolic Coaching (when the user asks a general question, e.g., "how can I reduce the spike?", "suggest a high-protein dinner", "what should I eat next?", or asks about macros/steps):
Respond concisely, warmly, and clinically in 2-4 sentences with practical, actionable guidance tailored to blood sugar stability and movement. Do NOT force the Mode A template for general questions.`;

      const contentParts: any[] = [];
      if (image) {
        const imagePart = await resolveImagePart(image);
        contentParts.push({ inlineData: imagePart });
      }

      const historyContext =
        Array.isArray(history) && history.length > 0
          ? `Recent conversation context:\n${history
              .slice(-6)
              .map((h: { sender: string; text: string }) => `${h.sender.toUpperCase()}: ${h.text}`)
              .join('\n')}\n\n`
          : '';

      const userText = trimmed
        ? `${historyContext}Current local time: ${localTime || new Date().toISOString()}\nUser message: "${trimmed}"`
        : `${historyContext}Current local time: ${localTime || new Date().toISOString()}\nAnalyze the attached meal image.`;

      contentParts.push({ text: userText });

      const { response, model: usedModel } = await generateWithGemini({
        contents: image ? { parts: contentParts } : userText,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawText = (response.text ?? '').trim();

      // Check if response follows the structured meal format
      const foodMatch = rawText.match(/\*\*Food Identified:\*\*\s*(.+)/i);
      const sugarMatch = rawText.match(/\*\*Sugar Spike:\*\*\s*(.+)/i);
      const caloriesMatch = rawText.match(/\*\*Calories:\*\*\s*(?:~|approx\.?\s*)?(\d+)/i);
      const carbsMatch = rawText.match(/\*\*Carbohydrates:\*\*\s*(?:~|approx\.?\s*)?(\d+)/i);
      const proteinMatch = rawText.match(/\*\*Protein:\*\*\s*(?:~|approx\.?\s*)?(\d+)/i);
      const fatMatch = rawText.match(/\*\*Fat:\*\*\s*(?:~|approx\.?\s*)?(\d+)/i);

      if (foodMatch && sugarMatch && caloriesMatch) {
        return res.json({
          success: true,
          promptOnly: false,
          source: usedModel,
          text: rawText,
          parsed: {
            name: foodMatch[1].trim(),
            sugarSpike: sugarMatch[1].trim(),
            calories: parseInt(caloriesMatch[1], 10),
            carbs: carbsMatch ? `${carbsMatch[1]}g` : '0g',
            protein: proteinMatch ? `${proteinMatch[1]}g` : '0g',
            fat: fatMatch ? `${fatMatch[1]}g` : '0g',
          },
        });
      }

      // Conversational response (Mode B)
      return res.json({
        success: true,
        promptOnly: false,
        source: usedModel,
        text: rawText,
      });
    } catch (err: any) {
      console.error('Error in /api/chat-nutrition:', err);
      const { status, message } = formatGeminiError(err);
      return res.status(status).json({
        success: false,
        error: message,
      });
    }
  });

  // 3. Endpoint: AI Metabolic Coach & Daily Insights
  app.post('/api/metabolic-insights', async (req, res) => {
    try {
      const { savedFoods = [], dailySteps = 0, localTime } = req.body;
      const caloriesBurned = Math.round(dailySteps * 0.04);

      const mealSummary =
        Array.isArray(savedFoods) && savedFoods.length > 0
          ? savedFoods
              .map(
                (m: any) =>
                  `- ${m.name}: ${m.calories} kcal, Protein ${m.protein}, Carbs ${m.carbs}, Fat ${m.fat}, Caution: ${m.bad || 'None'}`
              )
              .join('\n')
          : 'No meals logged yet today.';

      const totalCalories = Array.isArray(savedFoods)
        ? savedFoods.reduce((sum: number, m: any) => sum + (Number(m.calories) || 0), 0)
        : 0;

      const prompt = `You are the GlycoLens AI Metabolic Coach.
Analyze the user's real-time metabolic state today and produce personalized, actionable insights.

Current Local Time: ${localTime || new Date().toISOString()}
Steps Today: ${dailySteps} steps (${caloriesBurned} kcal burned via walking)
Total Logged Intake Today: ${totalCalories} kcal
Net Calories: ${totalCalories - caloriesBurned} kcal
Logged Meals Today:
${mealSummary}

Compute a realistic Metabolic Aura Score (0 to 100) reflecting glycemic stability, protein adequacy, and step burn balance, and provide tailored guidance.

Return ONLY a valid JSON object with these exact keys:
{
  "metabolicScore": 86,
  "statusLabel": "Short 2-4 word status like Optimal Glucose Equilibrium",
  "dailySummary": "2 concise sentences summarizing today intake vs step burn",
  "glycemicAnalysis": "1-2 sentences evaluating blood sugar stability from logged meals",
  "nextMealSuggestion": "Specific healthy next meal recommendation tailored to today macros and time of day",
  "walkMinutesRecommended": 15,
  "walkReason": "1 concise sentence explaining why that walk duration helps glucose clearance",
  "actionChecklist": ["Action 1", "Action 2", "Action 3"]
}`;

      const { response, model: usedModel } = await generateWithGemini({
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const parsed = extractJsonObject(response.text ?? '{}');
      return res.json({
        success: true,
        source: usedModel,
        data: {
          metabolicScore: Math.max(0, Math.min(100, Math.round(Number(parsed.metabolicScore) ?? 85))),
          statusLabel: parsed.statusLabel || 'Balanced Equilibrium',
          dailySummary: parsed.dailySummary || '',
          glycemicAnalysis: parsed.glycemicAnalysis || '',
          nextMealSuggestion: parsed.nextMealSuggestion || '',
          walkMinutesRecommended: Math.round(Number(parsed.walkMinutesRecommended) ?? 15),
          walkReason: parsed.walkReason || '',
          actionChecklist: Array.isArray(parsed.actionChecklist) ? parsed.actionChecklist : [],
        },
      });
    } catch (err: any) {
      console.error('Error in /api/metabolic-insights:', err);
      const { status, message } = formatGeminiError(err);
      return res.status(status).json({
        success: false,
        error: message,
      });
    }
  });

  // 4. Endpoint: Server-side Voice Transcription (Gemini 3.5 Transcribe)
  app.post('/api/transcribe-audio', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/webm' } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: 'Audio data is required' });
      }

      const cleanBase64 = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
      const { response } = await generateWithGemini({
        model: TRANSCRIBE_MODEL,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType.split(';')[0],
                data: cleanBase64,
              },
            },
            { text: 'Transcribe this spoken meal description accurately.' },
          ],
        },
      });

      return res.json({
        success: true,
        transcript: (response.text ?? '').trim(),
      });
    } catch (err: any) {
      console.error('Error in /api/transcribe-audio:', err);
      const { status, message } = formatGeminiError(err);
      return res.status(status).json({
        success: false,
        error: message,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(
        process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
      ),
    });
  });

  // Mount Vite or serve static
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GlycoLens Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
