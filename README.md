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

- Personalized User Experience
- Student friendly interface
- Sleek and modern design

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
npx prisma migrate dev --name init
```

4. Create .env file inside the **backend** folder - look inside **.env.example** for exact instructions

5. From the **root** of the project run:
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
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check` and `typecheck` scripts

### Other scripts
- `seed` – inserts fixtures to DB

***

## Database structure

![prisma-erd](prisma-erd.svg)

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

---

## Overview

This Prisma schema represents a relational database structure for a Fluently application. It defines several entities and their relationships, enabling functionalities such as user management, game sessions, and handling different types of questions (generic and word-based). The schema emphasizes data integrity with unique constraints and cascading delete operations where necessary.

---

## Datasource

- **Datasource:**
  - **Provider:** `postgresql`
  - **URL:** Configured using an environment variable (`DATABASE_URL`)

---

## Enumerations

- **Difficulty:**  
  Represents the difficulty levels for word-based questions.
  - `BEGINNER`
  - `INTERMEDIATE`
  - `ADVANCED`

- **GameType:**  
  Specifies the types of games available in the application.
  - `WORDS`
  - `ENGLISH_GRAMMAR_TEST`

---

## Models

### User

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `username`: Unique string identifier.
  - `email`: Unique email address.
  - `password`: User's password.
  - `createdAt`: Date and time when the account was created (defaults to current time).
- **Relationships:**
  - Optional one-to-one relationship with the `Session` model.

---

### Session

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `userId`: Unique reference to a `User`.
  - `createdAt`: Timestamp of session creation (defaults to current time).
  - `expiresAt`: Timestamp when the session expires.
- **Relationships:**
  - One-to-one relation with the `User` model (with cascade on delete).

---

### Game

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `name`: Name of the game.
  - `type`: Game type, using the `GameType` enum (defaults to `WORDS`).
- **Relationships:**
  - One-to-many relationship with the `Question` model.
  - One-to-many relationship with the `WordsQuestion` model.

---

### Question

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `text`: Content of the question.
  - `gameId`: Foreign key reference to the associated `Game`.
- **Relationships:**
  - Belongs to a `Game`.
  - One-to-many relationship with the `Option` model.
  - Optional one-to-one relationship with the `CorrectAnswer` model.

---

### Option

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `text`: Text for the option.
  - `questionId`: Foreign key reference to the associated `Question`.
- **Relationships:**
  - Belongs to a `Question`.
  - Optional one-to-one relationship with the `CorrectAnswer` model.

---

### CorrectAnswer

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `questionId`: Unique foreign key reference to the associated `Question`.
  - `optionId`: Unique foreign key reference to the associated `Option`.
- **Relationships:**
  - Establishes a one-to-one mapping back to a `Question` and an `Option`.

---

### WordsQuestion

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `text`: Content of the word-based question.
  - `difficulty`: Difficulty level, using the `Difficulty` enum.
  - `gameId`: Foreign key reference to the associated `Game`.
- **Relationships:**
  - Belongs to a `Game`.
  - One-to-many relationship with the `WordsOption` model.
  - Optional one-to-one relationship with the `WordsCorrectAnswer` model.

---

### WordsOption

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `text`: Text for the word option.
  - `wordsQuestionId`: Foreign key reference to the associated `WordsQuestion`.
- **Relationships:**
  - Belongs to a `WordsQuestion`.
  - Optional one-to-one relationship with the `WordsCorrectAnswer` model.

---

### WordsCorrectAnswer

- **Fields:**
  - `id`: UUID, primary key, auto-generated.
  - `wordsQuestionId`: Unique foreign key reference to the associated `WordsQuestion`.
  - `wordsOptionId`: Unique foreign key reference to the associated `WordsOption`.
- **Relationships:**
  - Establishes a one-to-one mapping back to a `WordsQuestion` and a `WordsOption`.

---

