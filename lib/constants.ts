// Supported programming languages for the interview tool
export const PROGRAMMING_LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'csharp', name: 'C#' },
];

// Interview difficulty levels
export const DIFFICULTY_LEVELS = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

// Mock interview questions by language (would typically come from an API)
export const MOCK_QUESTIONS = {
  python: [
    "Explain Python's GIL (Global Interpreter Lock) and its implications.",
    "What are Python decorators and how do they work?",
    "Describe the difference between lists and tuples in Python.",
    "How does memory management work in Python?",
  ],
  java: [
    "Explain the difference between Abstract classes and Interfaces in Java.",
    "What is the Java Memory Model and how does Garbage Collection work?",
    "Describe Java's lambda expressions and functional interfaces.",
    "How would you handle exceptions in Java?",
  ],
  javascript: [
    "Explain closures in JavaScript.",
    "What is the event loop in JavaScript?",
    "Describe the difference between let, const, and var.",
    "How does prototypal inheritance work?",
  ],
  csharp: [
    "What are the differences between value types and reference types in C#?",
    "Explain async/await pattern in C#.",
    "What are extension methods and how do they work?",
    "Describe the difference between IEnumerable and IQueryable.",
  ],
};

// Sample coding challenges
export const CODING_CHALLENGES = {
  python: [
    {
      title: "FizzBuzz",
      description: "Write a function that prints numbers from 1 to n. For multiples of 3, print 'Fizz' instead of the number. For multiples of 5, print 'Buzz'. For multiples of both 3 and 5, print 'FizzBuzz'.",
      difficulty: "beginner"
    },
    {
      title: "Palindrome Checker",
      description: "Write a function that checks if a given string is a palindrome (reads the same backward as forward).",
      difficulty: "beginner"
    },
    {
      title: "Binary Search Tree Implementation",
      description: "Implement a binary search tree with methods for insertion, deletion, and traversal.",
      difficulty: "intermediate"
    },
  ],
  java: [
    {
      title: "Reverse a Linked List",
      description: "Write a method to reverse a linked list.",
      difficulty: "intermediate"
    },
    {
      title: "Thread-Safe Singleton",
      description: "Implement a thread-safe singleton pattern in Java.",
      difficulty: "advanced"
    },
    {
      title: "Generic Max Method",
      description: "Write a generic method to find the maximum element in an array.",
      difficulty: "beginner"
    },
  ],
  javascript: [
    {
      title: "Implement Promise.all",
      description: "Write your own implementation of Promise.all.",
      difficulty: "intermediate"
    },
    {
      title: "Deep Clone Object",
      description: "Write a function that creates a deep clone of an object without using JSON.parse/stringify.",
      difficulty: "intermediate"
    },
    {
      title: "Throttle Function",
      description: "Implement a throttle function that limits the frequency of function calls.",
      difficulty: "advanced"
    },
  ],
  csharp: [
    {
      title: "LINQ Query",
      description: "Write a LINQ query to find all duplicate elements in a list.",
      difficulty: "intermediate"
    },
    {
      title: "Generic Repository",
      description: "Implement a generic repository pattern with Entity Framework.",
      difficulty: "advanced"
    },
    {
      title: "Event Handling",
      description: "Create a class that demonstrates proper event handling in C#.",
      difficulty: "intermediate"
    },
  ]
};