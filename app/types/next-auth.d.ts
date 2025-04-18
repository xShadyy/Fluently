import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    username: string;
    hasCompletedProficiencyQuiz: boolean;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    hasCompletedProficiencyQuiz: boolean;
  }
} 