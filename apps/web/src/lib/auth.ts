import { redirect } from "next/navigation";

export interface Session {
  user: {
    name: string;
    email: string;
    role: "admin";
  };
}

export async function getSession(): Promise<Session | null> {
  return {
    user: {
      name: "Administrateur",
      email: "admin@tribunesport.fr",
      role: "admin",
    },
  };
}

export async function requireAdmin(): Promise<Session> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}