export interface QuizOption {
  id: number;
  text: string;
  weight: number;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    text: '1. What’s your mood right now?',
    options: [
      { id: 1, text: 'Happy', weight: 3 },
      { id: 2, text: 'Tired', weight: 5 },
      { id: 3, text: 'Calm', weight: 1 },
      { id: 4, text: 'Stressed', weight: 2 },
      { id: 5, text: 'Excited', weight: 4 },
    ],
  },
  {
    id: 2,
    text: '2. How much energy do you need?',
    options: [
      { id: 1, text: 'A strong boost!', weight: 5 },
      { id: 2, text: 'Just a little pick-me-up', weight: 3 },
      { id: 3, text: 'I’m fine as I am', weight: 1 },
    ],
  },
  {
    id: 3,
    text: '3. How social do you feel today?',
    options: [
      { id: 1, text: 'I want to talk and laugh', weight: 3 },
      { id: 2, text: 'I’d rather stay quiet and chill', weight: 2 },
      { id: 3, text: 'Just me and my coffee, please', weight: 5 },
    ],
  },
  {
    id: 4,
    text: '4. Do you want something sweet?',
    options: [
      { id: 1, text: 'Yes, make it sugary!', weight: 3 },
      { id: 2, text: 'A little sweet is fine', weight: 2 },
      { id: 3, text: 'No, I like it strong and pure', weight: 5 },
    ],
  },
  {
    id: 5,
    text: '5. What flavor do you feel like?',
    options: [
      { id: 1, text: 'Creamy and smooth', weight: 4 },
      { id: 2, text: 'Fruity and fresh', weight: 2 },
      { id: 3, text: 'Bitter and rich', weight: 5 },
      { id: 4, text: 'Spicy and warm', weight: 3 },
    ],
  },
  {
    id: 6,
    text: '6. How adventurous are you today?',
    options: [
      { id: 1, text: 'I want to try something new!', weight: 4 },
      { id: 2, text: 'Maybe something slightly different', weight: 3 },
      { id: 3, text: 'Stick with the classic', weight: 2 },
    ],
  },
  {
    id: 7,
    text: '7. Do you prefer a hot or cold drink today?',
    options: [
      { id: 1, text: 'Hot', weight: 3 },
      { id: 2, text: 'Iced', weight: 4 },
      { id: 3, text: 'Doesn’t matter', weight: 2 },
    ],
  },
  {
    id: 8,
    text: '8. What kind of aroma do you enjoy most?',
    options: [
      { id: 1, text: 'Chocolate or caramel', weight: 5 },
      { id: 2, text: 'Citrus or fruity', weight: 2 },
      { id: 3, text: 'Floral or herbal', weight: 1 },
      { id: 4, text: 'Nutty and warm', weight: 4 },
    ],
  },
  {
    id: 9,
    text: '9. Do you prefer coffee or tea?',
    options: [
      { id: 1, text: 'Coffee', weight: 5 },
      { id: 2, text: 'Tea', weight: 1 },
    ],
  },
];
