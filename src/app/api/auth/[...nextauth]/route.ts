/**
 * src/app/api/auth/[...nextauth]/route.ts
 * Route handler para o NextAuth v5
 */
import { handlers } from "@/auth";

export const dynamic = "force-dynamic";
export const { GET, POST } = handlers;
