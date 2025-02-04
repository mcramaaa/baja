"use client";
import React, { useEffect } from "react";

export default function Piutang() {
  async function getPiutang() {
    await fetch("/api/piutang")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
      });
  }

  useEffect(() => {
    getPiutang();
  }, []);

  return <div>Piutang</div>;
}
