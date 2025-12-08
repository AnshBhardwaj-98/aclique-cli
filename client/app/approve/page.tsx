"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { ShieldCheck, ShieldX, TerminalSquare, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const approvalPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user_code = searchParams.get("user_code");

  const { data, isPending } = authClient.useSession();

  const [isProcessing, setIsProcessing] = useState({
    approve: false,
    deny: false,
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center bg-background h-screen">
        <Spinner />
      </div>
    );
  }

  if (!data?.session || !data?.user) {
    router.push("/signIn");
  }

  const handleApprove = async () => {
    setIsProcessing({ ...isProcessing, approve: true });
    try {
      toast.loading("Approving Device", { id: "loading" });
      await authClient.device.approve({
        userCode: user_code!,
      });
      // Show success message
      toast.dismiss("loading");
      toast.success("Device approved successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to approve device");
    }
    setIsProcessing({ ...isProcessing, approve: false });
  };

  const handleDeny = async () => {
    setIsProcessing({ ...isProcessing, deny: true });
    try {
      toast.loading("Approving Device");
      await authClient.device.deny({
        userCode: user_code!,
      });
      toast.dismiss("loading");
      toast.error("Device denied");
    } catch (error) {
      toast.error("Failed to deny device");
    }
    setIsProcessing({ ...isProcessing, deny: false });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#161b22] rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <TerminalSquare className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Authorize <span className="text-indigo-500">aclique-cli</span>
          </h1>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#0d1117] mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {/* Replace with real avatar */}
            <Avatar className="h-12 w-12">
              <AvatarImage src={data?.user.image || ""} alt="User avatar" />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
          </div>

          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {data!.user.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Signed in with GitHub
            </p>
          </div>
        </div>

        {/* Request Info Box (GitHub style) */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 mb-6">
          <p className="text-gray-700 dark:text-gray-200 font-medium">
            <span className="text-indigo-500 font-semibold">aclique-cli</span>{" "}
            is requesting permission to access your account.
          </p>

          <ul className="mt-3 text-sm text-gray-600 dark:text-gray-400 list-disc ml-5 space-y-1">
            <li>Read your GitHub profile</li>
            <li>Get your user email</li>
            <li>Confirm your identity for device authentication</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="w-full py-3 rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
            onClick={handleApprove}
          >
            <ShieldCheck className="h-5 w-5" />
            Approve
          </button>

          <button
            className="w-full py-3 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
            onClick={handleDeny}
          >
            <ShieldX className="h-5 w-5" />
            Deny
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          You will be redirected back to your CLI after approving this request.
        </p>
      </div>
    </main>
  );
};

export default approvalPage;
