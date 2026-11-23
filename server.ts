import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  analyzeCompetitor,
  generateContentIdeas,
  generateHashtags,
  generatePostCarouselSeo,
  generateProfileSeo,
  generateReelsSeo,
  generateUniversalSeo,
  optimizeCaption,
  type CreatorContextPayload,
} from './server/geminiSeo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

function validateProfile(raw: unknown): CreatorContextPayload {
  if (!raw || typeof raw !== 'object') {
    const err = new Error('Creator profile payload is required.');
    (err as Error & { status?: number }).status = 400;
    throw err;
  }
  const p = raw as Record<string, unknown>;
  const topic = String(p.topic ?? '').trim();
  const niche = String(p.niche ?? '').trim();

  if (!niche && !topic) {
    const err = new Error('Please provide at least an Instagram Niche or Content Topic.');
    (err as Error & { status?: number }).status = 400;
    throw err;
  }

  return {
    creatorMode: String(p.creatorMode ?? 'educational_creators'),
    creatorType: String(p.creatorType ?? 'Content Creator'),
    niche: niche || 'General Creator',
    topic: topic || niche || 'Creator Growth & Content Strategy',
    targetAudience: String(p.targetAudience ?? 'Instagram users interested in this niche'),
    targetCountry: String(p.targetCountry ?? 'Global'),
    language: String(p.language ?? 'English'),
    accountType: String(p.accountType ?? 'Creator'),
    contentGoals: String(p.contentGoals ?? 'Discovery, Saves & Engagement'),
    brandVoice: String(p.brandVoice ?? 'Clear, authentic, and helpful'),
  };
}

function sendApiError(res: express.Response, err: unknown) {
  const status =
    typeof err === 'object' && err !== null && 'status' in err && typeof (err as { status: unknown }).status === 'number'
      ? (err as { status: number }).status
      : 500;
  const rawMessage = err instanceof Error ? err.message : 'Unexpected server error while generating SEO results.';

  let friendlyMessage = rawMessage;
  let code = 'GENERATION_ERROR';

  if (rawMessage.includes('API_KEY_INVALID') || rawMessage.includes('PERMISSION_DENIED') || status === 401 || status === 403) {
    code = 'API_KEY_ERROR';
    friendlyMessage = 'Gemini API key is missing or invalid. Please verify your GEMINI_API_KEY in Settings > Secrets.';
  } else if (rawMessage.includes('RESOURCE_EXHAUSTED') || status === 429) {
    code = 'RATE_LIMIT';
    friendlyMessage = 'Gemini API rate limit or quota reached. Please wait a moment and try again.';
  } else if (rawMessage.includes('NOT_FOUND') || status === 404) {
    code = 'MODEL_NOT_FOUND';
    friendlyMessage = 'Configured Gemini model was unavailable. Please verify model access.';
  }

  res.status(status >= 400 && status < 600 ? status : 500).json({
    error: friendlyMessage,
    code,
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'INSTarank AI Studio' });
});

app.post('/api/seo/universal', async (req, res) => {
  try {
    const profile = validateProfile(req.body?.profile);
    const data = await generateUniversalSeo(profile);
    res.json({ module: 'universal', data });
  } catch (err) {
    sendApiError(res, err);
  }
});

app.post('/api/seo/reels', async (req, res) => {
  try {
    const profile = validateProfile(req.body?.profile);
    const reelLength = typeof req.body?.reelLength === 'string' ? req.body.reelLength : undefined;
    const data = await generateReelsSeo(profile, reelLength);
    res.json({ module: 'reels', data });
  } catch (err) {
    sendApiError(res, err);
  }
});

app.post('/api/seo/post-carousel', async (req, res) => {
  try {
    const profile = validateProfile(req.body?.profile);
    const rawCount = Number(req.body?.slideCount);
    const slideCount = Number.isFinite(rawCount) ? Math.min(10, Math.max(3, Math.round(rawCount))) : 7;
    const data = await generatePostCarouselSeo(profile, slideCount);
    res.json({ module: 'post_carousel', data });
  } catch (err) {
    sendApiError(res, err);
  }
});

app.post('/api/seo/profile', async (req, res) => {
  try {
    const profile = validateProfile(req.body?.profile);
    const currentHandle = typeof req.body?.currentHandle === 'string' ? req.body.currentHandle.trim() : undefined;
    const currentBio = typeof req.body?.currentBio === 'string' ? req.body.currentBio.trim() : undefined;
    const data = await generateProfileSeo(profile, currentHandle, currentBio);
    res.json({ module: 'profile', data });
  } catch (err) {
    sendApiError(res, err);
  }
});

app.post('/api/seo/caption-optimizer', async (req, res) => {
  try {
    const profile = validateProfile(req.body?.profile);
    const existingCaption = typeof req.body?.existingCaption === 'string' ? req.body.existingCaption.trim() : '';
    if (!existingCaption) {
      res.status(400).json({ error: 'Please paste an existing caption to analyze and optimize.', code: 'VALIDATION_ERROR' });
      return;
    }
    const existingHashtags = typeof req.body?.existingHashtags === 'string' ? req.body.existingHashtags.trim() : undefined;
    const data = await optimizeCaption(profile, existingCaption, existingHashtags);
    res.json({ module: 'caption_optimizer', data });
  } catch (err) {
    sendApiError(res, err);
  }
});

app.post('/api/seo/hashtags', async (req, res) => {
  try {
    const profile = validateProfile(req.body?.profile);
    const data = await generateHashtags(profile);
    res.json({ module: 'hashtags', data });
  } catch (err) {
    sendApiError(res, err);
  }
});

app.post('/api/seo/content-ideas', async (req, res) => {
  try {
    const profile = validateProfile(req.body?.profile);
    const data = await generateContentIdeas(profile);
    res.json({ module: 'content_ideas', data });
  } catch (err) {
    sendApiError(res, err);
  }
});

app.post('/api/seo/competitor', async (req, res) => {
  try {
    const profile = validateProfile(req.body?.profile);
    const competitorUsername = typeof req.body?.competitorUsername === 'string' ? req.body.competitorUsername.trim() : '';
    const publicNotes = typeof req.body?.publicNotes === 'string' ? req.body.publicNotes.trim() : '';

    if (!competitorUsername && !publicNotes) {
      res.status(400).json({
        error: 'Enter a public competitor username or paste publicly available bio/captions to analyze.',
        code: 'VALIDATION_ERROR',
      });
      return;
    }

    const effectiveNotes =
      publicNotes ||
      `Public handle reference: ${competitorUsername}. User did not paste raw captions; evaluate competitive positioning and content opportunities in the ${profile.niche} niche for ${profile.creatorType} creators.`;

    const data = await analyzeCompetitor(profile, competitorUsername, effectiveNotes);
    res.json({ module: 'competitor', data });
  } catch (err) {
    sendApiError(res, err);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`INSTarank AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
