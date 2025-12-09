"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import UserInfoPage from "@/components/user-profile";
import HomePage from "@/components/homepage";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function RootPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  // 1. Loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-400">
        <Spinner height={28} width={28} />
      </div>
    );
  }

  // 2. If not logged in → show HomePage and don't redirect forcibly
  if (!data?.session || !data?.user) {
    return <HomePage />;
  }

  // 3. User IS logged in → show user info page
  return <UserInfoPage user={data.user} />;
}
