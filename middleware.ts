import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/words",
    "/dashboard/profile",
    "/dashboard/materials",
    "/dashboard/translator",
    "/dashboard/advanced-words-quiz",
    "/dashboard/intermediate-words-quiz",
    "/dashboard/beginner-words-quiz",
  ],
};
