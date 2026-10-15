export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  weight: number;
}

export interface QuizTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  questions: Question[];
}

export const quizTopics: QuizTopic[] = [
  {
    id: "csharp",
    title: "C#",
    description:
      "Test your knowledge of C# fundamentals, OOP concepts, LINQ, and the .NET ecosystem.",
    icon: "csharp",
    color: "#68217a",
    questionCount: 10,
    difficulty: "Intermediate",
    questions: [
      { question: "Which keyword is used to define a class in C#?", options: ["class", "struct", "define", "object"], correctAnswer: 0, weight: 1 },
      { question: "What does the 'var' keyword do in C#?", options: ["Declares a dynamic variable", "Declares an implicitly typed variable", "Declares a constant", "Declares a static variable"], correctAnswer: 1, weight: 1 },
      { question: "Which collection type uses key-value pairs in C#?", options: ["List", "Array", "Dictionary", "Queue"], correctAnswer: 2, weight: 1 },
      { question: "What is the base class for all types in C#?", options: ["System.Type", "System.Base", "System.Object", "System.Class"], correctAnswer: 2, weight: 1 },
      { question: "Which LINQ method filters a collection?", options: ["Select()", "Where()", "OrderBy()", "GroupBy()"], correctAnswer: 1, weight: 2 },
      { question: "What is an interface in C#?", options: ["A class with all methods implemented", "A contract that defines method signatures", "A type of struct", "A sealed class"], correctAnswer: 1, weight: 2 },
      { question: "Which access modifier makes a member visible only within its class?", options: ["public", "internal", "protected", "private"], correctAnswer: 3, weight: 1 },
      { question: "What is the purpose of the 'async' keyword?", options: ["Makes a method run faster", "Marks a method as asynchronous", "Creates a new thread", "Locks a method"], correctAnswer: 1, weight: 2 },
      { question: "What does the 'using' statement do?", options: ["Imports a library", "Ensures disposal of resources", "Creates an alias", "All of the above"], correctAnswer: 3, weight: 2 },
      { question: "Which pattern does C# use for event handling?", options: ["Observer pattern", "Singleton pattern", "Factory pattern", "Delegate/Event pattern"], correctAnswer: 3, weight: 2 },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript",
    description:
      "Test your knowledge of JavaScript fundamentals, ES6+ features, and browser APIs.",
    icon: "javascript",
    color: "#f0db4f",
    questionCount: 10,
    difficulty: "Intermediate",
    questions: [
      { question: "Which keyword is used to declare a constant in JavaScript?", options: ["var", "let", "const", "define"], correctAnswer: 2, weight: 1 },
      { question: "What does the '===' operator check?", options: ["Value only", "Type only", "Value and type", "Reference equality"], correctAnswer: 2, weight: 1 },
      { question: "Which method is used to add an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 0, weight: 1 },
      { question: "What is the output of typeof null?", options: ["\"null\"", "\"undefined\"", "\"object\"", "\"boolean\""], correctAnswer: 2, weight: 1 },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["Symbol", "BigInt", "Float", "Boolean"], correctAnswer: 2, weight: 1 },
      { question: "What does the 'this' keyword refer to in an arrow function?", options: ["The function itself", "The global object", "The enclosing lexical context", "undefined"], correctAnswer: 2, weight: 2 },
      { question: "Which built-in method returns the calling string value converted to lower case?", options: ["toLower()", "toLowerCase()", "changeCase()", "lowerCase()"], correctAnswer: 1, weight: 1 },
      { question: "What is a closure in JavaScript?", options: ["A way to close the browser", "A function with access to its outer scope", "A method to end a loop", "A type of error handling"], correctAnswer: 1, weight: 2 },
      { question: "Which statement is used to handle exceptions in JavaScript?", options: ["try...catch", "if...else", "for...in", "do...while"], correctAnswer: 0, weight: 1 },
      { question: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java Standard Object Notation", "JavaScript Online Notation", "Java Syntax Object Naming"], correctAnswer: 0, weight: 1 },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript",
    description:
      "Challenge yourself on TypeScript types, interfaces, generics, and advanced type system features.",
    icon: "typescript",
    color: "#3178c6",
    questionCount: 10,
    difficulty: "Advanced",
    questions: [
      { question: "What is the primary benefit of TypeScript over JavaScript?", options: ["Faster runtime", "Static type checking", "Smaller bundle size", "Better DOM access"], correctAnswer: 1, weight: 1 },
      { question: "Which keyword is used to define an interface?", options: ["type", "interface", "class", "struct"], correctAnswer: 1, weight: 1 },
      { question: "What is a generic type in TypeScript?", options: ["A type that works with any data type", "A type that is always string", "A type alias", "A runtime type check"], correctAnswer: 0, weight: 2 },
      { question: "What does the 'readonly' modifier do?", options: ["Makes a property required", "Prevents reassignment after initialization", "Makes a property optional", "Hides a property"], correctAnswer: 1, weight: 1 },
      { question: "Which utility type makes all properties optional?", options: ["Required<T>", "Partial<T>", "Pick<T>", "Omit<T>"], correctAnswer: 1, weight: 2 },
      { question: "What is a union type?", options: ["A type that combines two objects", "A type that can be one of several types", "A type for arrays only", "A numeric type"], correctAnswer: 1, weight: 1 },
      { question: "What does 'never' type represent?", options: ["A null value", "An undefined value", "A value that never occurs", "Any value"], correctAnswer: 2, weight: 2 },
      { question: "How do you type a function that returns nothing?", options: ["null", "undefined", "void", "never"], correctAnswer: 2, weight: 1 },
      { question: "What is type narrowing?", options: ["Making types smaller", "Reducing a union type to a specific type", "Removing type annotations", "Converting types"], correctAnswer: 1, weight: 2 },
      { question: "What is a tuple in TypeScript?", options: ["A fixed-length typed array", "A key-value pair", "A set of unique values", "A dynamic array"], correctAnswer: 0, weight: 2 },
    ],
  },
  {
    id: "sql",
    title: "SQL",
    description:
      "Test your SQL skills with questions on queries, joins, indexes, and database design.",
    icon: "database",
    color: "#336791",
    questionCount: 10,
    difficulty: "Intermediate",
    questions: [
      { question: "Which SQL statement is used to extract data from a database?", options: ["GET", "EXTRACT", "SELECT", "PULL"], correctAnswer: 2, weight: 1 },
      { question: "Which clause is used to filter records in a SELECT statement?", options: ["FILTER", "WHERE", "HAVING", "CONDITION"], correctAnswer: 1, weight: 1 },
      { question: "What does the JOIN clause do?", options: ["Creates a new table", "Combines rows from two or more tables", "Deletes duplicate rows", "Sorts the results"], correctAnswer: 1, weight: 1 },
      { question: "Which SQL keyword is used to sort the result-set?", options: ["SORT BY", "ORDER BY", "GROUP BY", "ARRANGE BY"], correctAnswer: 1, weight: 1 },
      { question: "What is a PRIMARY KEY?", options: ["A unique identifier for each record", "The first column in a table", "A type of index", "A foreign reference"], correctAnswer: 0, weight: 1 },
      { question: "Which function returns the number of rows?", options: ["SUM()", "COUNT()", "TOTAL()", "NUM()"], correctAnswer: 1, weight: 1 },
      { question: "What does the DISTINCT keyword do?", options: ["Selects all records", "Returns only unique values", "Creates a new column", "Filters null values"], correctAnswer: 1, weight: 1 },
      { question: "Which type of JOIN returns all records from both tables?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correctAnswer: 3, weight: 2 },
      { question: "What is normalization in databases?", options: ["Making data look normal", "Organizing data to reduce redundancy", "Encrypting data", "Backing up data"], correctAnswer: 1, weight: 2 },
      { question: "Which statement is used to update data in a table?", options: ["MODIFY", "CHANGE", "UPDATE", "ALTER"], correctAnswer: 2, weight: 1 },
    ],
  },
  {
    id: "dotnet",
    title: ".NET",
    description:
      "Explore your understanding of the .NET framework, ASP.NET Core, Entity Framework, and middleware.",
    icon: "dotnet",
    color: "#512bd4",
    questionCount: 10,
    difficulty: "Advanced",
    questions: [
      { question: "What is .NET?", options: ["A programming language", "A cross-platform development framework", "A database system", "An operating system"], correctAnswer: 1, weight: 1 },
      { question: "What is ASP.NET Core used for?", options: ["Desktop apps", "Web applications and APIs", "Mobile apps only", "Game development"], correctAnswer: 1, weight: 1 },
      { question: "What is Entity Framework Core?", options: ["A testing framework", "An ORM for database access", "A logging library", "A UI framework"], correctAnswer: 1, weight: 1 },
      { question: "What is middleware in ASP.NET Core?", options: ["A database layer", "Software in the request pipeline", "A type of controller", "A view engine"], correctAnswer: 1, weight: 2 },
      { question: "Which file configures services in ASP.NET Core?", options: ["Startup.cs / Program.cs", "Global.asax", "Web.config", "App.config"], correctAnswer: 0, weight: 1 },
      { question: "What is dependency injection?", options: ["Injecting SQL into a database", "A design pattern for providing dependencies", "A testing technique", "A deployment method"], correctAnswer: 1, weight: 2 },
      { question: "What does the [Authorize] attribute do?", options: ["Creates a new user", "Restricts access to authenticated users", "Logs user activity", "Encrypts data"], correctAnswer: 1, weight: 1 },
      { question: "Which package is used for JWT authentication in .NET?", options: ["Newtonsoft.Json", "Microsoft.AspNetCore.Authentication.JwtBearer", "AutoMapper", "Serilog"], correctAnswer: 1, weight: 2 },
      { question: "What is a DbContext in EF Core?", options: ["A database backup", "A session with the database", "A migration file", "A connection string"], correctAnswer: 1, weight: 2 },
      { question: "What command creates a new migration in EF Core?", options: ["dotnet ef add migration", "dotnet ef migrations add", "dotnet migrate create", "ef core migrate"], correctAnswer: 1, weight: 2 },
    ],
  },
  {
    id: "react",
    title: "React",
    description:
      "Challenge yourself on React concepts, hooks, state management, and best practices.",
    icon: "react",
    color: "#61dafb",
    questionCount: 10,
    difficulty: "Intermediate",
    questions: [
      { question: "What is JSX in React?", options: ["A JavaScript library", "A syntax extension for JavaScript", "A CSS framework", "A testing tool"], correctAnswer: 1, weight: 1 },
      { question: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useContext", "useReducer"], correctAnswer: 1, weight: 1 },
      { question: "What is the virtual DOM?", options: ["A real DOM copy", "A lightweight JavaScript representation of the DOM", "A browser feature", "A CSS rendering engine"], correctAnswer: 1, weight: 1 },
      { question: "How do you pass data from parent to child in React?", options: ["Using state", "Using props", "Using context", "Using refs"], correctAnswer: 1, weight: 1 },
      { question: "What does useState return?", options: ["A single value", "An object", "An array with value and setter", "A function"], correctAnswer: 2, weight: 1 },
      { question: "What is the purpose of keys in React lists?", options: ["Styling elements", "Helping React identify which items changed", "Creating unique IDs", "Sorting elements"], correctAnswer: 1, weight: 1 },
      { question: "Which lifecycle method is equivalent to useEffect with an empty dependency array?", options: ["componentDidMount", "componentWillUnmount", "componentDidUpdate", "shouldComponentUpdate"], correctAnswer: 0, weight: 2 },
      { question: "What is React.memo used for?", options: ["Memoizing function results", "Preventing unnecessary re-renders", "Creating memos in the app", "Managing state"], correctAnswer: 1, weight: 2 },
      { question: "What is the Context API used for?", options: ["Routing", "State management across components", "API calls", "Styling"], correctAnswer: 1, weight: 1 },
      { question: "Which hook would you use for complex state logic?", options: ["useState", "useEffect", "useReducer", "useMemo"], correctAnswer: 2, weight: 2 },
    ],
  },
  {
    id: "english",
    title: "English Grammar",
    description:
      "Test your understanding of English grammar rules, tenses, parts of speech, and sentence structure.",
    icon: "language",
    color: "#e44d26",
    questionCount: 10,
    difficulty: "Beginner",
    questions: [
      { question: "Which is the correct plural of 'child'?", options: ["childs", "childes", "children", "childrens"], correctAnswer: 2, weight: 1 },
      { question: "What type of word is 'quickly'?", options: ["Noun", "Adjective", "Adverb", "Verb"], correctAnswer: 2, weight: 1 },
      { question: "Which sentence is in the past tense?", options: ["I run every day", "I am running now", "I ran yesterday", "I will run tomorrow"], correctAnswer: 2, weight: 1 },
      { question: "What is a synonym?", options: ["A word with the opposite meaning", "A word with a similar meaning", "A word that rhymes", "A word from another language"], correctAnswer: 1, weight: 1 },
      { question: "Which punctuation mark ends a question?", options: ["Period (.)", "Exclamation mark (!)", "Question mark (?)", "Comma (,)"], correctAnswer: 2, weight: 1 },
      { question: "What is the subject in: 'The cat sat on the mat'?", options: ["sat", "on", "mat", "cat"], correctAnswer: 3, weight: 1 },
      { question: "Which is correct?", options: ["Their going home", "They're going home", "There going home", "Theyre going home"], correctAnswer: 1, weight: 1 },
      { question: "What is a compound sentence?", options: ["A sentence with one clause", "Two independent clauses joined by a conjunction", "A sentence with only a subject", "A fragment"], correctAnswer: 1, weight: 2 },
      { question: "Which word is a preposition?", options: ["Run", "Beautiful", "Under", "Quickly"], correctAnswer: 2, weight: 1 },
      { question: "What tense is: 'She has been working all day'?", options: ["Present simple", "Past simple", "Present perfect continuous", "Future perfect"], correctAnswer: 2, weight: 2 },
    ],
  },
];
