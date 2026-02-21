/**
 * src/app/perfil/page.tsx
 *
 * Página de Perfil do Usuário — Portal das Quatro Nações
 * Mostra dados do usuário, elemento espiritual e pontuações.
 */
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserStats } from "@/lib/actions/user";
import ProfileClient from "./ProfileClient";

export default async function PerfilPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/perfil");
    }

    const profile = await getUserStats();

    if (!profile) {
        redirect("/login?callbackUrl=/perfil");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <ProfileClient profile={profile as any} />;
}
