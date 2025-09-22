export interface JournalPrompt {
  id: string;
  title: string;
  story: string;
  questions?: string[];
  question?: string;
  values: string[];
  category?: 'personal' | 'social' | 'ethical' | 'cultural';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  ageGroup?: '11-12' | '13-14' | '15+';
  region?: 'north' | 'south' | 'east' | 'west' | 'central' | string;
  festival?: string;
  language?: 'hindi' | 'english' | 'regional';
  estimatedTime?: number;
  culturalContext?: string;
  aiGenerated?: boolean;
  adaptiveLevel?: number;
}

export const journalPrompts: JournalPrompt[] = [
  {
    id: 'kindness-01',
    title: "छोटी सी मदद (Small Acts of Help)",
    story: "रितिका ने देखा कि उसकी दादी जी सब्जी का बोझ लेकर परेशान हो रही थीं। वह तुरंत दौड़कर गई और उनकी मदद की। दादी जी ने प्यार से कहा - 'बेटा, छोटी सी मदद भी बड़ा काम करती है।'",
    questions: [
      "आपने आज किसकी छोटी सी मदद की है?",
      "जब कोई आपकी मदद करता है तो आपको कैसा लगता है?"
    ],
    values: ["Kindness", "Seva", "Family Values"],
    category: 'social',
    difficulty: 'beginner',
    ageGroup: '11-12',
    region: 'north',
    language: 'hindi'
  },
  {
    id: 'honesty-01',
    title: "The Truth Teller's Dilemma",
    story: "Arjun found his best friend's answer sheet on the floor before the exam. He could easily copy the answers, but he remembered his grandfather's words: 'Satya hi shakti hai (Truth is strength).' He returned the paper without looking at it.",
    questions: [
      "When is it hardest to tell the truth?",
      "How does being honest make you feel about yourself?"
    ],
    values: ["Honesty", "Integrity", "Self-Respect"],
    category: 'ethical',
    difficulty: 'intermediate',
    ageGroup: '13-14'
  },
  {
    id: 'perseverance-01',
    title: "The Tabla Master's Journey",
    story: "Kavya wanted to learn tabla like her favorite musician Zakir Hussain. Every day she practiced, even when her fingers hurt. Her guru said, 'Riyaz mein hi kamyabi hai (Success lies in practice).' After months of dedication, she performed beautifully at the school function.",
    questions: [
      "What skill are you working hard to learn?",
      "How do you stay motivated when things get difficult?"
    ],
    values: ["Perseverance", "Dedication", "Cultural Pride"],
    category: 'personal',
    difficulty: 'intermediate',
    ageGroup: '13-14',
    region: 'central'
  },
  {
    id: 'empathy-01',
    title: "Festival of Understanding",
    story: "During Diwali, Meera noticed her Muslim friend Fatima looked sad. Instead of just celebrating, Meera spent time understanding that Fatima felt left out. Together, they created a 'Festival of Lights and Love' celebrating both Diwali and the beauty of friendship across cultures.",
    questions: [
      "How do you include friends who celebrate different festivals?",
      "What have you learned from friends of different backgrounds?"
    ],
    values: ["Empathy", "Inclusion", "Secular Values"],
    category: 'cultural',
    difficulty: 'advanced',
    ageGroup: '13-14',
    festival: 'diwali'
  },
  {
    id: 'courage-01',
    title: "Standing Up for What's Right",
    story: "In the school corridor, Rohan saw some older students making fun of a junior student's accent. Even though he was scared, he remembered the words 'Ahimsa paramo dharma' (Non-violence is the highest virtue) and politely asked them to stop, then helped the younger student.",
    questions: [
      "When did you show courage to help someone?",
      "What gives you strength to do the right thing?"
    ],
    values: ["Courage", "Non-violence", "Protection of Others"],
    category: 'social',
    difficulty: 'advanced',
    ageGroup: '13-14'
  },
  {
    id: 'gratitude-01',
    title: "Everyday Heroes",
    story: "Priya realized she never thanked the school cleaner uncle who always smiled at her. One day, she brought him a glass of water and said 'Thank you for keeping our school clean.' His eyes lit up with joy. Her teacher said, 'Gratitude makes everyone's day brighter.'",
    questions: [
      "Who are the everyday heroes in your life?",
      "How do you show appreciation to people who help you?"
    ],
    values: ["Gratitude", "Respect", "Social Awareness"],
    category: 'social',
    difficulty: 'beginner',
    ageGroup: '11-12'
  },
  {
    id: 'responsibility-01',
    title: "The Environmental Guardian",
    story: "When Rajesh saw plastic bottles in the school garden, he didn't just walk by. He remembered the motto 'Vasudhaiva Kutumbakam' (The world is one family) and organized a cleanup drive. His small action inspired the whole class to keep their environment clean.",
    questions: [
      "How do you take care of your environment?",
      "What responsibility do you feel towards your school and community?"
    ],
    values: ["Responsibility", "Environmental Care", "Leadership"],
    category: 'social',
    difficulty: 'intermediate',
    ageGroup: '13-14'
  },
  {
    id: 'friendship-01',
    title: "True Friendship Test",
    story: "During group project selection, everyone wanted to be with the smartest student. But Kiran chose to partner with the new student who seemed lonely. Together, they created an amazing project about India's diversity, and gained a lifelong friendship.",
    questions: [
      "What makes a good friend?",
      "How do you help someone feel included?"
    ],
    values: ["Friendship", "Loyalty", "Inclusion"],
    category: 'social',
    difficulty: 'beginner',
    ageGroup: '11-12'
  }
];

export function getPromptForDay(dayIndex: number): JournalPrompt {
  return journalPrompts[dayIndex % journalPrompts.length];
}

export function getPromptsByCategory(category: JournalPrompt['category']): JournalPrompt[] {
  return journalPrompts.filter(prompt => prompt.category === category);
}

export function getPromptsByValues(values: string[]): JournalPrompt[] {
  return journalPrompts.filter(prompt => 
    prompt.values.some(value => values.includes(value))
  );
}