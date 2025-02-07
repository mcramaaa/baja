import { converDateWIB, convertToRupiah } from "@/helper/convert";
import { IPiutang } from "@/interface/IPiutang";
import { IPiutangFilter } from "@/interface/IPiutangFilter";
import React, { useEffect, useState } from "react";

const useRepPiutang = () => {
  const [isPiutang, setIsPiutang] = useState<IPiutang[]>();
  const [isFilter, setIsFilter] = useState<IPiutangFilter>({
    status: undefined,
    startDate: undefined,
    endDate: undefined,
  });

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

  /**
   * API
   */
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
          // Filter by date range
          if (isFilter.startDate && isFilter.endDate) {
            const startDate = isFilter.startDate.toISOString();
            const endDate = isFilter.endDate.toISOString();
            const dueDate = new Date(item.dueDate).toISOString();
            console.log(startDate, endDate);
            console.log(dueDate);
            if (dueDate <= startDate || dueDate >= endDate) return false;
          }

          // Filter by status
          if (!isFilter.status || isFilter.status === 0) {
            return true;
          }
          if (isFilter.status === 1) {
            return item.status === "LUNAS";
          }
          if (isFilter.status === 2) {
            return item.status !== "LUNAS";
          }

          console.log("first");
          return true;
        });

        setIsPiutang(filteredData);
      });
  }

  /**
   * Funtion ETC
   */

  const generateCopyText = () => {
    if (!isPiutang) return "";

    let copyText = "";
    let grandTotal = 0;

    const dates = Array.from(groupedInvoices.keys());
    if (dates.length === 0) return "";

    // Ambil rentang tanggal awal dan akhir
    const startDate = converDateWIB(isFilter.startDate);
    const endDate = converDateWIB(isFilter.endDate);

    copyText += `_*List Piutang Jatuh Tempo ${converDateWIB(
      startDate
    )} sd ${converDateWIB(endDate)}*_\n\n`;

    groupedInvoices.forEach((invoices, date) => {
      copyText += `tgl ${converDateWIB(new Date(date))}\n`;
      (invoices as IPiutang[]).forEach((invoice) => {
        const amount = invoice.status === "LUNAS" ? 0 : invoice.billRemaning;
        grandTotal += amount ? amount : 0;
        copyText += `invoice : ${invoice.name}\n`;
        copyText += `${convertToRupiah(amount)},-\n`;
      });
      copyText += `\n`;
    });

    copyText += `_*Grand Total Hutang ${converDateWIB(
      startDate
    )} s/d ${converDateWIB(endDate)} ${convertToRupiah(grandTotal)}*_`;

    return copyText;
  };

  /**
   * HANDLE SUBMIT ETC
   */

  // Fungsi untuk handle click copy
  function handleCopy() {
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
  }

  function handleDateRangeChange(dateRange: {
    startDate?: Date;
    endDate?: Date;
  }) {
    setIsFilter((prev) => ({
      ...prev,
      startDate: dateRange?.startDate,
      endDate: dateRange?.endDate,
    }));
  }

  useEffect(() => {
    getPiutang();
  }, [isFilter]);

  return {
    isPiutang,
    isFilter,
    groupedInvoices,
    setIsFilter,
    handleCopy,
    handleDateRangeChange,
  };
};

export default useRepPiutang;
