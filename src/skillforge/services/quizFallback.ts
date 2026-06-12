import { QUIZ_QUESTION_COUNT, type QuizQuestion } from '../constants/quiz';
import type { Skill } from '../data/mockData';

function skillDescription(skill: Skill): string {
  return typeof skill.description === 'string' ? skill.description : JSON.stringify(skill.description);
}

/** Deterministic local quiz when Gemini is unavailable (rate limit, errors, bad JSON). */
export function generateLocalSkillQuiz(skill: Skill): QuizQuestion[] {
  const name = skill.name;
  const category = skill.category;
  const desc = skillDescription(skill);
  const descSnippet = desc.length > 72 ? `${desc.slice(0, 69)}...` : desc;

  const templates: Omit<QuizQuestion, 'correctIndex'>[] = [
    {
      question: `What is the primary focus of "${name}" in a professional setting?`,
      options: [
        `Applying ${name} to achieve outcomes described in the skill definition`,
        `Avoiding any use of ${name} in daily work`,
        `Replacing all other ${category} skills with unrelated tasks`,
        `Using ${name} only for personal hobbies, not work`,
      ],
    },
    {
      question: `When is "${name}" most appropriately applied at work?`,
      options: [
        `When tasks require capabilities aligned with: ${descSnippet}`,
        `Only when no other skill in ${category} exists`,
        `Whenever speed matters more than quality or ethics`,
        `Only after every prerequisite skill is formally certified`,
      ],
    },
    {
      question: `Which outcome best reflects proficiency in "${name}"?`,
      options: [
        `Consistently delivering work that matches the skill's stated purpose`,
        `Memorizing terminology without applying it on real tasks`,
        `Delegating all ${category} responsibilities to others`,
        `Skipping documentation because the skill feels intuitive`,
      ],
    },
    {
      question: `Which practice is LEAST aligned with strong "${name}" performance?`,
      options: [
        `Ignoring feedback and repeating the same mistakes`,
        `Practicing the skill on realistic workplace scenarios`,
        `Seeking clarification when requirements are unclear`,
        `Reviewing results against expected standards for ${name}`,
      ],
    },
    {
      question: `How does "${name}" typically fit within the "${category}" domain?`,
      options: [
        `As a building block that supports other related professional capabilities`,
        `As a skill unrelated to any ${category} career path`,
        `As a one-time checkbox with no ongoing development`,
        `As a substitute for communication, ethics, and teamwork`,
      ],
    },
  ];

  return templates.slice(0, QUIZ_QUESTION_COUNT).map((t) => ({
    ...t,
    correctIndex: 0,
  }));
}
