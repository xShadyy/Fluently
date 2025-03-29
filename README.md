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
1. Make sure you have PostgreSQL installed - [Downloads page](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads))
   
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
- `prettier:write` – formats all files with Prettier


   
