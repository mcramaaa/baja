"use client";
import { convertToRupiah } from "@/helper/convert";
import { IPiutang } from "@/interface/IPiutang";
import React, { useEffect, useState } from "react";

export default function Piutang() {
  const [isPiutang, setIsPiutang] = useState<IPiutang[]>();
  async function getPiutang() {
    await fetch("/api/piutang")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setIsPiutang(data);
      });
  }

  useEffect(() => {
    getPiutang();
  }, []);

  return (
    <div className="p-10">
      Piutang
      <div className="flex flex-col gap-3">
        {isPiutang
          ?.filter((data) => data.status !== "LUNAS")
          .map((data, i) => (
            <div key={i} className="w-fit bg-yellow-100">
              <p>{data.po}</p>
              <p>Tgl {data.dueDate}</p>
              <p>Invoice : {data.name}</p>
              {data.bill && <p>{convertToRupiah(data.bill)}</p>}
            </div>
          ))}

        <p>
          _*List Piutang jatuh tempo tanggal {"1 Feb 2025"} - {"15 Feb 2025"}*_
        </p>
      </div>
    </div>
  );
}
