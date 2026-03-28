export const QUESTIONS = [
  // === Math (Difficulty 1) ===
  { id: 'm01', category: 'math', difficulty: 1, question: 'What is 7 x 8?', answers: ['54', '56', '58', '64'], correctIndex: 1 },
  { id: 'm02', category: 'math', difficulty: 1, question: 'What is 12 + 15?', answers: ['25', '26', '27', '28'], correctIndex: 2 },
  { id: 'm03', category: 'math', difficulty: 1, question: 'What is 100 - 37?', answers: ['53', '63', '67', '73'], correctIndex: 1 },
  { id: 'm04', category: 'math', difficulty: 1, question: 'What is 9 x 6?', answers: ['48', '52', '54', '56'], correctIndex: 2 },
  { id: 'm05', category: 'math', difficulty: 1, question: 'What is 45 + 28?', answers: ['63', '73', '83', '68'], correctIndex: 1 },
  { id: 'm06', category: 'math', difficulty: 1, question: 'What is 81 / 9?', answers: ['7', '8', '9', '10'], correctIndex: 2 },

  // === Math (Difficulty 2) ===
  { id: 'm07', category: 'math', difficulty: 2, question: 'What is 13 x 12?', answers: ['144', '156', '168', '132'], correctIndex: 1 },
  { id: 'm08', category: 'math', difficulty: 2, question: 'What is 256 / 16?', answers: ['14', '15', '16', '18'], correctIndex: 2 },
  { id: 'm09', category: 'math', difficulty: 2, question: 'What is the square root of 144?', answers: ['10', '11', '12', '14'], correctIndex: 2 },
  { id: 'm10', category: 'math', difficulty: 2, question: 'What is 15% of 200?', answers: ['20', '25', '30', '35'], correctIndex: 2 },
  { id: 'm11', category: 'math', difficulty: 2, question: 'What is 3^4?', answers: ['64', '81', '27', '108'], correctIndex: 1 },

  // === Math (Difficulty 3) ===
  { id: 'm12', category: 'math', difficulty: 3, question: 'What is 17 x 23?', answers: ['381', '391', '401', '371'], correctIndex: 1 },
  { id: 'm13', category: 'math', difficulty: 3, question: 'What is the square root of 289?', answers: ['15', '16', '17', '18'], correctIndex: 2 },
  { id: 'm14', category: 'math', difficulty: 3, question: 'If x + 5 = 12, what is x?', answers: ['5', '6', '7', '8'], correctIndex: 2 },

  // === Science (Difficulty 1) ===
  { id: 's01', category: 'science', difficulty: 1, question: 'What planet is closest to the Sun?', answers: ['Venus', 'Mercury', 'Mars', 'Earth'], correctIndex: 1 },
  { id: 's02', category: 'science', difficulty: 1, question: 'What gas do plants absorb from the air?', answers: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctIndex: 2 },
  { id: 's03', category: 'science', difficulty: 1, question: 'How many legs does a spider have?', answers: ['6', '8', '10', '12'], correctIndex: 1 },
  { id: 's04', category: 'science', difficulty: 1, question: 'What is the boiling point of water in Celsius?', answers: ['90', '95', '100', '110'], correctIndex: 2 },
  { id: 's05', category: 'science', difficulty: 1, question: 'What organ pumps blood through your body?', answers: ['Brain', 'Lungs', 'Heart', 'Liver'], correctIndex: 2 },
  { id: 's06', category: 'science', difficulty: 1, question: 'What is the largest planet in our solar system?', answers: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], correctIndex: 1 },

  // === Science (Difficulty 2) ===
  { id: 's07', category: 'science', difficulty: 2, question: 'What is the chemical symbol for gold?', answers: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2 },
  { id: 's08', category: 'science', difficulty: 2, question: 'How many bones are in the adult human body?', answers: ['186', '196', '206', '216'], correctIndex: 2 },
  { id: 's09', category: 'science', difficulty: 2, question: 'What type of rock is formed from cooled lava?', answers: ['Sedimentary', 'Igneous', 'Metamorphic', 'Mineral'], correctIndex: 1 },
  { id: 's10', category: 'science', difficulty: 2, question: 'What is the powerhouse of the cell?', answers: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Body'], correctIndex: 1 },
  { id: 's11', category: 'science', difficulty: 2, question: 'What planet is known as the Red Planet?', answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1 },

  // === Science (Difficulty 3) ===
  { id: 's12', category: 'science', difficulty: 3, question: 'What is the speed of light in km/s (approx)?', answers: ['200,000', '250,000', '300,000', '350,000'], correctIndex: 2 },
  { id: 's13', category: 'science', difficulty: 3, question: 'What element has the atomic number 6?', answers: ['Nitrogen', 'Carbon', 'Oxygen', 'Boron'], correctIndex: 1 },

  // === ELA (Difficulty 1) ===
  { id: 'e01', category: 'ela', difficulty: 1, question: 'What is a synonym for "happy"?', answers: ['Sad', 'Angry', 'Joyful', 'Tired'], correctIndex: 2 },
  { id: 'e02', category: 'ela', difficulty: 1, question: 'What is the plural of "child"?', answers: ['Childs', 'Children', 'Childes', 'Childern'], correctIndex: 1 },
  { id: 'e03', category: 'ela', difficulty: 1, question: 'Which word is a noun?', answers: ['Run', 'Beautiful', 'Quickly', 'Dog'], correctIndex: 3 },
  { id: 'e04', category: 'ela', difficulty: 1, question: 'What is the opposite of "ancient"?', answers: ['Old', 'Modern', 'Broken', 'Large'], correctIndex: 1 },
  { id: 'e05', category: 'ela', difficulty: 1, question: 'Which sentence is correct?', answers: ['They is here.', 'They are here.', 'They am here.', 'They be here.'], correctIndex: 1 },
  { id: 'e06', category: 'ela', difficulty: 1, question: 'What punctuation ends a question?', answers: ['Period', 'Question mark', 'Comma', 'Exclamation'], correctIndex: 1 },

  // === ELA (Difficulty 2) ===
  { id: 'e07', category: 'ela', difficulty: 2, question: 'What is a metaphor?', answers: ['A comparison using "like"', 'A direct comparison', 'An exaggeration', 'A repeated sound'], correctIndex: 1 },
  { id: 'e08', category: 'ela', difficulty: 2, question: 'Which word is an adverb?', answers: ['Bright', 'Brightly', 'Brightness', 'Brighten'], correctIndex: 1 },
  { id: 'e09', category: 'ela', difficulty: 2, question: '"She sells seashells" is an example of:', answers: ['Metaphor', 'Simile', 'Alliteration', 'Hyperbole'], correctIndex: 2 },
  { id: 'e10', category: 'ela', difficulty: 2, question: 'What does "prefix" mean?', answers: ['After a word', 'Before a word', 'A whole word', 'A root word'], correctIndex: 1 },
  { id: 'e11', category: 'ela', difficulty: 2, question: 'Which is a compound sentence?', answers: ['I ran fast.', 'I ran and she walked.', 'Running fast now.', 'The fast runner.'], correctIndex: 1 },

  // === ELA (Difficulty 3) ===
  { id: 'e12', category: 'ela', difficulty: 3, question: 'What point of view uses "I" and "me"?', answers: ['Second person', 'First person', 'Third person', 'Omniscient'], correctIndex: 1 },
  { id: 'e13', category: 'ela', difficulty: 3, question: 'What is the main idea of a paragraph called?', answers: ['Detail', 'Topic sentence', 'Conclusion', 'Summary'], correctIndex: 1 },
  { id: 'e14', category: 'ela', difficulty: 3, question: 'Which is an example of irony?', answers: ['A fire station burns down', 'A dog barks loudly', 'Rain falls in spring', 'A student reads a book'], correctIndex: 0 }
];

export const TOPIC_CATEGORIES = [
  { id: 'math', name: 'Math', icon: '\u{1F522}', color: '#ff6b35' },
  { id: 'science', name: 'Science', icon: '\u{1F52C}', color: '#00b4d8' },
  { id: 'ela', name: 'ELA', icon: '\u{1F4DA}', color: '#b8c0ff' }
];
