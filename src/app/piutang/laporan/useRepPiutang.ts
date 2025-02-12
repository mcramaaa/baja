import { converDateWIB, convertToRupiah } from "@/helper/convert";
import { useLayout } from "@/hooks/useLayout";
import { IPiutang } from "@/interface/IPiutang";
import { IPiutangFilter } from "@/interface/IPiutangFilter";
import React, { useEffect, useState } from "react";

interface ISumData {
  GrandTotalBill?: number;
  GrandTotalRemaning?: number;
  GrandTotalPaid?: number;
}

const useRepPiutang = () => {
  const { setIsLoading, setIsErr, setIsSuccess } = useLayout();
  const [isPiutang, setIsPiutang] = useState<IPiutang[]>();
  const [isSumData, setIsSumData] = useState<ISumData>();
  const [isFilter, setIsFilter] = useState<IPiutangFilter>({
    status: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  /**
   * API
   */
  async function getPiutang() {
    setIsLoading(true, "Mengambil data");
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
        console.log("hete");
        setIsLoading(false);
      });
  }

  /**
   * Funtion ETC
   */
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

  const sumInvoice = React.useMemo(() => {
    let total = 0;
    let paid = 0;
    let remaning = 0;
    groupedInvoices.forEach((date) => {
      date.forEach((invoice: any) => {
        total += invoice.bill;
        paid += invoice.payment;
        remaning += invoice.billRemaning;
      });
    });
    setIsSumData((prev) => ({
      ...prev,
      GrandTotalBill: total,
      GrandTotalPaid: paid,
      GrandTotalRemaning: remaning,
    }));
  }, [isPiutang]);

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

    copyText += `_*Grand Total Piutang ${converDateWIB(
      startDate
    )} s/d ${converDateWIB(endDate)} ${convertToRupiah(grandTotal)},-*_`;

    return copyText;
  };

  /**
   * HANDLE SUBMIT ETC
   */

  // Fungsi untuk handle click copy
  function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(generateCopyText())
        .then(() => {
          setIsSuccess(true, "Berhasil Copy Data");
        })
        .catch((err) => {
          setIsErr(true, "Gagal copy data");
          console.error("Gagal menyalin teks:", err);
        });
    } else {
      console.warn("Clipboard API tidak didukung di lingkungan ini.");
      setIsErr(true, "Clipboard API tidak didukung di lingkungan ini.");
    }

    // const textToCopy = generateCopyText();
    // navigator.clipboard
    //   .writeText(textToCopy)
    //   .then(() => {
    //     setIsSuccess(true, "Berhasil Copy Data");
    //     console.log("first");
    //   })
    //   .catch((err) => {
    //     console.error("Gagal menyalin teks:", err);
    //     setIsErr(true, "Gagal Copy Data");
    //   });
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
    sumInvoice,
    isSumData,
    setIsFilter,
    handleCopy,
    handleDateRangeChange,
  };
};

export default useRepPiutang;
