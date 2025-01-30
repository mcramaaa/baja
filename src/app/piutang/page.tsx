"use client";

import { google } from "googleapis";
import { useEffect, useState } from "react";
import { getPiutang } from "../api/apiSpreadsheet";

export default async function Piutang() {
  useEffect(() => {
    fetch("/api/piutang")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
