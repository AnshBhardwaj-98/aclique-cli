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
    <div className="min-h-screen  w-full flex items-center justify-center p-4 ">
      <div className=" w-full max-w-lg bg-gray-50 rounded-2xl shadow-xl py-14 px-4 border-2 border-purple-500 ">
        {/* Logo/Image */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to AClique-CLI
          </h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="grow border-t border-gray-300"></div>
          <span className="shrink mx-4 text-gray-500 text-sm">Aclique-CLI</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        {/* GitHub Login Button */}
        <Card className="border-2 border-dashed">
          <CardContent>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant={"outline"}
                  className="size-full"
                  type="button"
                  onClick={() =>
                    authClient.signIn.social({
                      provider: "github",
                      callbackURL: "http://localhost:3000",
                    })
                  }
                >
                  <Image
                    src={"/github.png"}
                    alt="Github"
                    height={32}
                    width={32}
                    className="size-8 rounded-full dark:invert"
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
