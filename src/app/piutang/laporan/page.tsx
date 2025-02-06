"use client";
import {
  converDate,
  convertCustomDate,
  convertToRupiah,
} from "@/helper/convert";
import { IPiutang } from "@/interface/IPiutang";
import { IPiutangFilter } from "@/interface/IPiutangFilter";
import React, { useEffect, useState } from "react";
import { HiCheckBadge } from "react-icons/hi2";
import { IoCopy } from "react-icons/io5";
import { PiDotOutlineFill } from "react-icons/pi";

export default function Piutang() {
  const [isPiutang, setIsPiutang] = useState<IPiutang[]>();
  const [isFilter, setIsFilter] = useState<IPiutangFilter>({
    status: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  async function getPiutang() {
    await fetch("/api/piutang")
      .then((res) => res.json())
      .then((data) => {
        // Sort data by dueDate
        const sortedData = [...data].sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        const filteredData = sortedData.filter((item) => {
          // Jika status belum dipilih atau status = 0 (semua)
          if (!isFilter.status || isFilter.status === 0) {
            return true;
          }

          // Jika status = 1 (LUNAS)
          if (isFilter.status === 1) {
            return item.status === "LUNAS";
          }

          // Jika status = 2 (BELUM LUNAS)
          if (isFilter.status === 2) {
            return item.status !== "LUNAS";
          }

          return true;
        });

        setIsPiutang(filteredData);
      });
  }

  // Fungsi untuk menghasilkan teks yang akan di-copy
  const generateCopyText = () => {
    let copyText = "";

    groupedInvoices.forEach((invoices, date) => {
      copyText += `**Tgl ${converDate(date)}**\n`;
      (invoices as IPiutang[]).forEach((invoice) => {
        copyText += `Invoice : ${invoice.name}\n`;
        copyText += `${
          invoice.status === "LUNAS"
            ? "Rp. 0,-"
            : convertToRupiah(invoice.billRemaning)
        }\n`;
      });
      copyText += "\n";
    });

    return copyText;
  };

  // Fungsi untuk handle click copy
  const handleCopy = () => {
    const textToCopy = generateCopyText();
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Teks berhasil disalin!");
      })
      .catch((err) => {
        console.error("Gagal menyalin teks:", err);
        alert("Gagal menyalin teks");
      });
  };

  useEffect(() => {
    getPiutang();
  }, [isFilter]);

  const groupedInvoices = React.useMemo(() => {
    if (!isPiutang) return new Map();

    const groups = new Map();

    isPiutang.forEach((invoice) => {
      const date = new Date(`${invoice.dueDate}`).toISOString().split("T")[0];
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date).push(invoice);
    });

    return groups;
  }, [isPiutang]);

  console.log(groupedInvoices);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Piutang</h1>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <IoCopy />
          <span>Copy</span>
        </button>
      </div>
      <select
        value={isFilter.status}
        onChange={(e) =>
          setIsFilter({
            ...isFilter,
            status: Number(e.target.value) as 0 | 1 | 2,
          })
        }
        className="p-2 border rounded"
      >
        <option value={0}>Semua Status</option>
        <option value={1}>Lunas</option>
        <option value={2}>Belum Lunas</option>
      </select>

      <div className="p-10">
        <h1 className="text-xl font-bold mb-6">Piutang</h1>
        <div className="text-sm">
          {Array.from(groupedInvoices.entries()).map(([date, invoices]) => (
            <div key={date} className="bg-white mt-2">
              <h2 className="font-semibold border-b ">
                Tgl {converDate(date)}
              </h2>
              {(invoices as IPiutang[]).map((invoice, index) => (
                <div key={index} className="">
                  <p>Invoice : {invoice.name}</p>
                  <p>
                    {invoice.status === "LUNAS"
                      ? "Rp. 0,-"
                      : convertToRupiah(invoice.billRemaning)}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
