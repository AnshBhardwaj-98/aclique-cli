"use client";

import { authClient } from "@/lib/auth-client";
import {
  KeyRound,
  ShieldCheck,
  TerminalSquareIcon,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyDevicePage() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("user_code") || "";

  const [user_code, setUser_code] = useState<string>(initialCode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user_code.trim()) {
      setError("Device code is required.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Format the code: remove dashes and convert to uppercase
      const formattedCode = user_code.trim().replace(/-/g, "").toUpperCase();
      // Check if the code is valid using GET /device endpoint
      const response = await authClient.device({
        query: { user_code: formattedCode },
      });

      if (response.data) {
        // Redirect to approval page
        router.push(`/approve?user_code=${formattedCode}`);
      }
    } catch (err) {
      setError("Invalid or expired code");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700">
        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <TerminalSquareIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Authorize <span className="text-green-500">Aclique-cli</span>
          </h1>
        </div>

        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 text-center">
          Match the device code shown in your terminal to continue.
        </p>
        <p className="mt-3 text-sm text-red-500 dark:text-red-400 text-center">
          or, enter the code manually.
        </p>

        {/* Form */}
        <form className="mt-10 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Device Code
          </label>

          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />

            <input
              type="text"
              value={user_code}
              onChange={(e) => setUser_code(e.target.value)}
              placeholder="XXXX-XXXX"
              disabled={isLoading}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 
                bg-neutral-100 dark:bg-neutral-700 text-lg text-neutral-900 dark:text-neutral-100 
                tracking-widest text-center font-mono placeholder-neutral-400 dark:placeholder-neutral-500 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 
                disabled:opacity-60 disabled:cursor-not-allowed transition"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg 
              flex items-center justify-center gap-2 dark:bg-green-500 dark:hover:bg-green-400 
              disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Verify this matches the code shown in your CLI.</span>
        </div>
      </div>
    </main>
  );
}
