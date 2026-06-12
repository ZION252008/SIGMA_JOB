import { QUIZ_QUESTION_COUNT, type QuizQuestion } from '../constants/quiz';
import type { Skill } from '../data/mockData';
import { generateLocalSkillQuiz } from './quizFallback';

export type { QuizQuestion };

export interface BatchRelevanceResult {
  skillName: string;
  relevance: string;
}

async function callGemini(prompt: string): Promise<{ ok: true; text: string } | { ok: false; status: number }> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    return { ok: false, status: response.status };
  }
  const data = await response.json();
  return { ok: true, text: data.text as string };
}

function parseJSON(text: string): unknown {
  // Strip markdown fences if the model wraps output despite instructions
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

function normalizeQuizQuestions(raw: unknown): QuizQuestion[] {
  if (!Array.isArray(raw) || raw.length !== QUIZ_QUESTION_COUNT) {
    throw new Error(
      `Expected ${QUIZ_QUESTION_COUNT} questions, got ${Array.isArray(raw) ? raw.length : 'non-array'}`
    );
  }
  return raw.map((item, i) => {
    if (!item || typeof item !== 'object') throw new Error(`Bad question at index ${i}`);
    const q = item as Record<string, unknown>;
    if (typeof q.question !== 'string' || !q.question.trim()) throw new Error(`Missing question text at index ${i}`);
    if (!Array.isArray(q.options) || q.options.length !== 4 || !q.options.every(o => typeof o === 'string'))
      throw new Error(`Question ${i + 1} must have exactly 4 string options`);
    if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3)
      throw new Error(`Invalid correctIndex at question ${i + 1}`);
    return { question: q.question, options: q.options as string[], correctIndex: q.correctIndex as number };
  });
}

export async function generateSkillQuiz(skill: Skill): Promise<QuizQuestion[]> {
  const prompt = `Generate a ${QUIZ_QUESTION_COUNT}-question multiple choice quiz testing proficiency in "${skill.name}". Description: ${typeof skill.description === 'string' ? skill.description : JSON.stringify(skill.description)}. Rules: exactly ${QUIZ_QUESTION_COUNT} questions, each with exactly 4 options. Return ONLY a raw JSON array -- no markdown, no code fences, no explanation. Each element: { "question": string, "options": [string, string, string, string], "correctIndex": 0|1|2|3 }.`;

  try {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const result = await callGemini(prompt);
      if (!result.ok) {
        return generateLocalSkillQuiz(skill);
      }
      try {
        return normalizeQuizQuestions(parseJSON(result.text));
      } catch {
        if (attempt === 2) return generateLocalSkillQuiz(skill);
        await new Promise((r) => setTimeout(r, 800));
      }
    }
    return generateLocalSkillQuiz(skill);
  } catch {
    return generateLocalSkillQuiz(skill);
  }
}

export async function generateBatchSkillRelevance(
  jobTitle: string,
  skillNames: string[]
): Promise<BatchRelevanceResult[]> {
  const prompt = `For the role "${jobTitle}", explain why each of these skills matters: ${skillNames.join(', ')}. Return ONLY a raw JSON array -- no markdown, no code fences. Each element: { "skillName": string (must exactly match the input name), "relevance": string (one paragraph) }.`;

  const result = await callGemini(prompt);
  if (!result.ok) {
    throw new Error(`Gemini proxy error: ${result.status}`);
  }
  return parseJSON(result.text) as BatchRelevanceResult[];
}
