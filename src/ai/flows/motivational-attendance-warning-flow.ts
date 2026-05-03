'use server';
/**
 * @fileOverview A Genkit flow for generating dynamic, personalized motivational messages or warnings based on a student's attendance status.
 *
 * - getMotivationalAttendanceWarning - A function that handles the generation of attendance warnings.
 * - MotivationalAttendanceWarningInput - The input type for the getMotivationalAttendanceWarning function.
 * - MotivationalAttendanceWarningOutput - The return type for the getMotivationalAttendanceWarning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalAttendanceWarningInputSchema = z.object({
  currentAttendancePercentage: z
    .number()
    .describe('The student\'s current attendance percentage.'),
  targetAttendancePercentage: z
    .number()
    .describe('The target attendance percentage (e.g., 75, 85).'),
  classesToRecover: z
    .number()
    .optional()
    .describe(
      'The number of classes that must be attended to recover attendance, if applicable.'
    ),
  classesToBunkSafely: z
    .number()
    .optional()
    .describe(
      'The number of classes that can be bunked safely without dropping below target, if applicable.'
    ),
});
export type MotivationalAttendanceWarningInput = z.infer<
  typeof MotivationalAttendanceWarningInputSchema
>;

const MotivationalAttendanceWarningOutputSchema = z.object({
  message: z.string().describe('A motivational message or warning.'),
});
export type MotivationalAttendanceWarningOutput = z.infer<
  typeof MotivationalAttendanceWarningOutputSchema
>;

export async function getMotivationalAttendanceWarning(
  input: MotivationalAttendanceWarningInput
): Promise<MotivationalAttendanceWarningOutput> {
  return motivationalAttendanceWarningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalAttendanceWarningPrompt',
  input: {schema: MotivationalAttendanceWarningInputSchema},
  output: {schema: MotivationalAttendanceWarningOutputSchema},
  prompt: `You are an encouraging and supportive attendance coach. Your goal is to provide a motivational message or a gentle warning to a student based on their attendance.

The student's current attendance is {{currentAttendancePercentage}}%.
The target attendance is {{targetAttendancePercentage}}%.

{{#if (gt currentAttendancePercentage targetAttendancePercentage)}}
  {{#if (gt currentAttendancePercentage 90)}}
    Great job! Your attendance is excellent. Keep up the fantastic work! Remember, every class counts.
  {{else if (gt currentAttendancePercentage 85)}}
    Fantastic! You're consistently hitting your attendance goals. Keep that momentum going!
  {{else}}
    You're doing well, staying above your target! Keep focused to maintain this strong performance.
  {{/if}}
  {{#if classesToBunkSafely}}
    You can safely miss up to {{classesToBunkSafely}} classes without falling below your target. Use them wisely!
  {{/if}}
{{else if (gte currentAttendancePercentage (subtract targetAttendancePercentage 5))}}
  You are very close to your target attendance of {{targetAttendancePercentage}}%. A little extra effort can make a big difference!
  {{#if classesToRecover}}
    Attending just {{classesToRecover}} more classes will bring you back on track. You've got this!
  {{/if}}
{{else}}
  Your attendance is currently below the target of {{targetAttendancePercentage}}%. It's important to focus on attending upcoming classes.
  {{#if classesToRecover}}
    You need to attend at least {{classesToRecover}} more classes to reach your target. Every class from now on is crucial!
  {{else}}
    Let's make a plan to improve your attendance. Every class from now on is crucial!
  {{/if}}
{{/if}}

Provide a concise and impactful message (2-3 sentences max) based on the above.
`,
});

const motivationalAttendanceWarningFlow = ai.defineFlow(
  {
    name: 'motivationalAttendanceWarningFlow',
    inputSchema: MotivationalAttendanceWarningInputSchema,
    outputSchema: MotivationalAttendanceWarningOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
