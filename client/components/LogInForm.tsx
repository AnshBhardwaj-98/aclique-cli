"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const LogInForm = () => {
  const router = useRouter();
  const [IsLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0B0B0D]">
      <div className="w-full max-w-lg bg-[#111114] rounded-2xl shadow-[0_0_25px_rgba(128,0,255,0.15)] py-14 px-6 border border-purple-600/20 backdrop-blur-xl relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-purple-700/30 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-blue-600/20 rounded-full blur-[130px]"></div>

        {/* Logo */}
        <div className="flex justify-center mb-8 relative">
          <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/40">
            <span className="text-white text-3xl font-bold">A</span>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-wide">
            Welcome to Aclique CLI
          </h1>
          <p className="text-gray-400">Sign in to continue securely</p>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6 text-gray-500">
          <div className="grow border-t border-gray-700"></div>
          <span className="px-4 text-gray-500 text-sm tracking-wide">
            Authentication
          </span>
          <div className="grow border-t border-gray-700"></div>
        </div>

        {/* GitHub Login Card */}
        <Card className="border border-purple-600/20 bg-[#141417]/50 backdrop-blur-xl shadow-inner">
          <CardContent>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="size-full border border-gray-700 hover:bg-gray-800 hover:text-white transition-all duration-200 font-medium text-gray-300 gap-3"
                  type="button"
                  onClick={() =>
                    authClient.signIn.social({
                      provider: "github",
                      callbackURL: "http://localhost:3000",
                    })
                  }
                >
                  <Image
                    src="/github.png"
                    alt="Github"
                    height={26}
                    width={26}
                    className="size-7 rounded-full dark:invert"
                  />
                  Continue with GitHub
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogInForm;
