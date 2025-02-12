"use client";

import Navbar from "@/components/layout/Navbar";
import React, { ReactNode, useEffect } from "react";
import { Spinner } from "@heroui/spinner";
import { useLayout } from "@/hooks/useLayout";
import { toast, Toaster } from "react-hot-toast";

export function Provider({ children }: { children: ReactNode }) {
  const { isLoading, isMessage, isErr, isSuccess, setIsErr, setIsSuccess } =
    useLayout();

  useEffect(() => {
    if (isSuccess && isMessage) {
      toast.success(isMessage);
      setIsSuccess(false, "");
    }
    if (isErr && isMessage) {
      toast.error(isMessage);
      setIsErr(false, "");
    }
  }, [isErr, isSuccess]);

  return (
    <>
      <Toaster />

      <div className="bg-gray-200 text-slate-800 min-h-screen relative h-full">
        {isLoading && (
          <div className="h-screen w-screen grid place-items-center bg-black/20 fixed z-50">
            <div className="bg-white/90 rounded-xl flex items-center gap-5 px-10 py-4">
              <Spinner color="warning" />
              <p>{isMessage}</p>
            </div>
          </div>
        )}
        <Navbar />
        <div className="px-5">{children}</div>
      </div>
    </>
  );
}
