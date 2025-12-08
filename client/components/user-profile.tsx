"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}

interface UserInfoProps {
  user: User;
}

export default function UserInfoPage({ user }: UserInfoProps) {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute -top-40 -left-32 w-[450px] h-[450px] bg-purple-700/40 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute -bottom-40 -right-32 w-[450px] h-[450px] bg-blue-600/30 rounded-full blur-[150px] animate-pulse"></div>

      {/* Animated Header Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-purple-500 via-pink-500 to-blue-500 animate-[gradientMove_4s_linear_infinite]"></div>

      <style>
        {`
      @keyframes gradientMove {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}
      </style>

      <div
        className="relative bg-[#16161a]/60 px-10 py-12 rounded-3xl backdrop-blur-xl 
               border border-purple-600/30 shadow-[0_0_40px_rgba(128,0,255,0.3)]
               w-full max-w-xl animate-fadeIn"
      >
        {/* TOP SECTION */}
        <div className="flex flex-col items-center">
          {/* Avatar Glow Ring */}
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-purple-500 to-blue-500 blur-xl opacity-50 group-hover:opacity-70 transition"></div>

            <div className="relative">
              <Image
                src={user.image || "/default-avatar.png"}
                width={120}
                height={120}
                alt="avatar"
                className="rounded-full border-2 border-purple-400 shadow-lg shadow-purple-700/40"
              />
            </div>
          </div>

          {/* Name + Email */}
          <h1 className="mt-6 text-3xl font-bold tracking-wide">{user.name}</h1>
          <p className="text-gray-400">{user.email}</p>

          {/* Status Badge */}
          <div className="mt-3 px-4 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/40">
            ● Authenticated via GitHub
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="my-10 h-px w-full bg-linear-to-r from-transparent via-purple-500/40 to-transparent"></div>

        {/* USER METADATA */}
        <div className="space-y-4 text-sm text-gray-200">
          <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-purple-600/20 hover:bg-white/10 transition">
            <span className="text-gray-500 text-xs">User ID</span>
            <span className="font-mono text-purple-300 text-xs break-all">
              {user.id}
            </span>
          </div>

          <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-blue-600/20 hover:bg-white/10 transition">
            <span className="text-gray-500 text-xs">Created</span>
            <span className="text-purple-200">
              {new Date(user.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="my-10 h-px w-full bg-linear-to-r from-transparent via-purple-500/40 to-transparent"></div>

        {/* ACTION BUTTONS */}
        <div className="mt-10 flex justify-center gap-4">
          <Button
            className="px-6 py-2 rounded-xl border border-gray-600  transition"
            onClick={() => {
              authClient.signOut();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
