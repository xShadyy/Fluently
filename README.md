![fluently](fluently.png)
<br>
<div align="center"> 

 ![WEB Project](https://img.shields.io/badge/WEB-PROJECT-white.svg?style=flat-square)
[![license](https://img.shields.io/badge/LICENSE-MIT-white)](LICENSE)
<br><br>
![typescript](https://img.shields.io/badge/TYPESCRIPT-5.7.3-white?logo=typescript)
![react](https://img.shields.io/badge/REACT-19.0.0-white?logo=react)
![nextjs](https://img.shields.io/badge/NEXTJS-15.1.5-white?logo=nextdotjs)

The [Fluently](https://www.youtube.com/watch?v=dQw4w9WgXcQ) is an app for students to **study** world faster🚀.  
Embrace power of learning and broaden your horizons 

</div>

***

## Why Fluently?

 - We empower learners to master foreign languages with engaging resources and interactive tools.
 - Focuse on practical language skills for real-life conversations.
 - Our main goal is to make language learning accessible and enjoyable for everyone.
 - Through personalized learning paths, Fluently adapts to each user's unique style and pace.

## Features

- **Personalized Learning Paths**: Adapts to each user's unique style and pace.
- **Interactive Tools**: Includes games, quizzes, and exercises to make learning fun.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Modern UI**: Sleek and intuitive interface for a seamless user experience.
- **Database Integration**: Powered by PostgreSQL and Prisma for efficient data management.

## Quick Start
```shell
npm install
npm run dev
```
## Setting up backend
1. Make sure you have PostgreSQL installed - [Downloads page](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
   
2. Create server and database called:
```shell 
fluently 
```

3. Inside the **backend** folder run: 
```shell
npx prisma generate
npx prisma migrate dev --name init
```

4. Create .env file inside the **backend** folder - look inside **.env.example** for exact instructions

5. From the **backend** folder run:
```shell
npm run seed
```
 
6. You should be good to go, although it's highly recommended to create new user for best experience:
```shell
localhost:3000/register
```

## npm scripts

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `prettier:check` – checks files with Prettier
- `prettier:write` – formats files
- `test` – runs `prettier:check`, `typecheck` and `vitest` scripts
- `vitest` – runs only vitest tests 

### Other scripts
- `seed` – inserts fixtures to DB

***
## Database structure

![prismaerd](prismaerd.svg)

   # Fluently Application Schema Documentation

The schema is designed for a PostgreSQL database and utilizes the Prisma Client. It defines the core entities, enumerations, and relationships necessary to model users, sessions, games, and various types of questions.

---

## Table of Contents

- [Overview](#overview)
- [Datasource](#datasource)
- [Enumerations](#enumerations)
- [Models](#models)
  - [User](#user)
  - [Session](#session)
  - [Game](#game)
  - [Question](#question)
  - [Option](#option)
  - [CorrectAnswer](#correctanswer)
  - [WordsQuestion](#wordsquestion)
  - [WordsOption](#wordsoption)
  - [WordsCorrectAnswer](#wordscorrectanswer)
  - [QuizCompletion](#quizcompletion)

---

## Overview

This Prisma schema defines the relational database structure for the Fluently application, supporting user management, game sessions, quiz tracking, and various question types (generic and word-based). It ensures data integrity through unique constraints and cascaded deletes, and it captures users' proficiency quiz completions.

---

## Datasource

- **Provider:** `postgresql`
- **URL:** Configured via environment variable (`DATABASE_URL`)

---

## Enumerations

- **Difficulty:** Levels for word-based questions and quiz completions.
  - `BEGINNER`
  - `INTERMEDIATE`
  - `ADVANCED`

- **GameType:** Available game categories.
  - `WORDS`
  - `ENGLISH_GRAMMAR_TEST`

---

## Models

### User

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `username`: Unique string.
  - `email`: Unique email address.
  - `password`: User's password.
  - `createdAt`: Timestamp of account creation (defaults to now).
  - `hasCompletedProficiencyQuiz`: Boolean flag indicating if the user finished the initial proficiency quiz (defaults to `false`).

- **Relationships:**
  - `Session?`: Optional one-to-one relation with `Session` (cascade on delete).
  - `quizCompletions`: One-to-many relation with `QuizCompletion` (records user scores by difficulty).

### Session

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `userId`: Unique reference to a `User`.
  - `createdAt`: Session creation timestamp (defaults to now).
  - `expiresAt`: Expiration timestamp.

- **Relationships:**
  - `user`: One-to-one relation to `User` with `onDelete: Cascade`.

### Game

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `name`: Game name.
  - `type`: Uses `GameType` enum (defaults to `WORDS`).

- **Relationships:**
  - `questions`: One-to-many with `Question`.
  - `wordsQuestions`: One-to-many with `WordsQuestion`.

### Question

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `text`: Question content.
  - `gameId`: Foreign key to `Game`.

- **Relationships:**
  - `game`: Belongs to `Game` (cascade on delete).
  - `options`: One-to-many with `Option`.
  - `correctAnswer?`: Optional one-to-one with `CorrectAnswer`.

### Option

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `text`: Option text.
  - `questionId`: Foreign key to `Question`.

- **Relationships:**
  - `question`: Belongs to `Question` (cascade on delete).
  - `correctAnswer?`: Optional one-to-one with `CorrectAnswer`.

### CorrectAnswer

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `questionId`: Unique foreign key to `Question`.
  - `optionId`: Unique foreign key to `Option`.

- **Relationships:**
  - `question`: One-to-one back to `Question` (cascade on delete).
  - `option`: One-to-one back to `Option` (cascade on delete).

### WordsQuestion

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `text`: Question content.
  - `difficulty`: Uses `Difficulty` enum.
  - `gameId`: Foreign key to `Game`.

- **Relationships:**
  - `game`: Belongs to `Game` (cascade on delete).
  - `options`: One-to-many with `WordsOption`.
  - `correctAnswer?`: Optional one-to-one with `WordsCorrectAnswer`.

### WordsOption

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `text`: Option text.
  - `wordsQuestionId`: Foreign key to `WordsQuestion`.

- **Relationships:**
  - `wordsQuestion`: Belongs to `WordsQuestion` (cascade on delete).
  - `correctAnswer?`: Optional one-to-one with `WordsCorrectAnswer`.

### WordsCorrectAnswer

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `wordsQuestionId`: Unique foreign key to `WordsQuestion`.
  - `wordsOptionId`: Unique foreign key to `WordsOption`.

- **Relationships:**
  - `wordsQuestion`: One-to-one back to `WordsQuestion` (cascade on delete).
  - `wordsOption`: One-to-one back to `WordsOption` (cascade on delete).

### QuizCompletion

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `userId`: Foreign key to `User`.
  - `difficulty`: Difficulty level completed (uses `Difficulty` enum).
  - `completedAt`: Timestamp of completion (defaults to now).
  - `score`: Optional integer score.

- **Relationships:**
  - `user`: Belongs to `User` (cascade on delete).

- **Constraints:**
  - Unique composite index on `[userId, difficulty]` to ensure one record per user per difficulty.

---

# Fluently Application Testing Documentation

## Overview
This document summarizes the unit tests executed on both the backend and frontend of the application using the **Vitest** testing framework. The primary goal of these tests was to validate the functionality and stability of the system. All tests executed successfully without any issues.

## Test Execution Process

1. **Environment Setup**
   - Installed and configured **Vitest** as the testing framework.
   - Set up the test environments for both backend and frontend components.
   - Integrated the **Mantine Provider** into the frontend testing setup as required by the project.

2. **Test Implementation**
   - Developed a comprehensive suite of unit tests covering the key functionalities of both the backend and frontend.
   - Included tests for both positive scenarios and edge cases to ensure robust validation.

3. **Test Execution**
   - Ran the tests using the command `npm run vitest`.
   - All tests passed successfully, confirming that both backend and frontend components are functioning correctly.

## Results
- **Backend**: All unit tests confirmed that the server-side functionalities are implemented correctly.
- **Frontend**: The tests validated the user interface, with the Mantine Provider ensuring consistent and reliable theming.
