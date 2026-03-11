export const BIBLICAL_BOOKS = {
  OldTestament: [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
    "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
    "Zephaniah", "Haggai", "Zechariah", "Malachi"
  ],
  NewTestament: [
    "Matthew", "Mark", "Luke", "John", "Acts",
    "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
    "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
    "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
    "Jude", "Revelation"
  ]
};

export const TOPICS_MAP: Record<string, { book: string; chapter: string; verse: string }> = {
  Faith: { book: "Hebrews", chapter: "11", verse: "1" },
  Hope: { book: "Jeremiah", chapter: "29", verse: "11" },
  Prayer: { book: "Philippians", chapter: "4", verse: "6" },
  Healing: { book: "Jeremiah", chapter: "17", verse: "14" },
  Encouragement: { book: "Joshua", chapter: "1", verse: "9" },
  Strength: { book: "Isaiah", chapter: "41", verse: "10" },
  Wisdom: { book: "James", chapter: "1", verse: "5" },
  Love: { book: "1 Corinthians", chapter: "13", verse: "4" },
  Salvation: { book: "Romans", chapter: "10", verse: "9" }
};

export const BUILT_IN_BACKGROUNDS = [
  // Gradients
  { id: "grad-1", url: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", category: "Gradient Blue" },
  { id: "grad-2", url: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)", category: "Gradient Sunset" },
  { id: "grad-3", url: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)", category: "Gradient Purple" },
  { id: "grad-4", url: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)", category: "Gradient Orange" },
  { id: "grad-5", url: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", category: "Gradient Green" },
  { id: "grad-6", url: "linear-gradient(135deg, #232526 0%, #414345 100%)", category: "Gradient Dark" },

  // Nature
  { id: "nature-1", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1080&auto=format&fit=crop", category: "Nature" },
  { id: "nature-2", url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1080&auto=format&fit=crop", category: "Nature" },
  { id: "nature-3", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1080&auto=format&fit=crop", category: "Nature" },
  
  // Mountains
  { id: "mountains-1", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1080&auto=format&fit=crop", category: "Mountains" },
  { id: "mountains-2", url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1080&auto=format&fit=crop", category: "Mountains" },
  
  // Sunrise
  { id: "sunrise-1", url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1080&auto=format&fit=crop", category: "Sunrise" },
  { id: "sunrise-2", url: "https://images.unsplash.com/photo-1494548162494-384bba4ab999?q=80&w=1080&auto=format&fit=crop", category: "Sunrise" },
  
  // Sky
  { id: "sky-1", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080&auto=format&fit=crop", category: "Sky" },
  { id: "sky-2", url: "https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=1080&auto=format&fit=crop", category: "Sky" },
  
  // Cross
  { id: "cross-1", url: "https://images.unsplash.com/photo-1543828753-33bc87e59f47?q=80&w=1080&auto=format&fit=crop", category: "Cross" },
  { id: "cross-2", url: "https://images.unsplash.com/photo-1501683917845-a1c1d0fef3fe?q=80&w=1080&auto=format&fit=crop", category: "Cross" },
  
  // Church
  { id: "church-1", url: "https://images.unsplash.com/photo-1438032005730-c779502fac39?q=80&w=1080&auto=format&fit=crop", category: "Church" },
  { id: "church-2", url: "https://images.unsplash.com/photo-1548625361-24fbcefc4cc4?q=80&w=1080&auto=format&fit=crop", category: "Church" },
  
  // Light
  { id: "light-1", url: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1080&auto=format&fit=crop", category: "Light" },
  { id: "light-2", url: "https://images.unsplash.com/photo-1550186934-d421696ea88f?q=80&w=1080&auto=format&fit=crop", category: "Light" }
];
