import { converDateWIB, convertToRupiah } from "@/helper/convert";
import { useLayout } from "@/hooks/useLayout";
import { IPiutang, IPiutangFilter } from "@/interface/IPiutang";
import React, { useEffect, useState } from "react";

interface ISumData {
  GrandTotalBill?: number;
  GrandTotalRemaning?: number;
  GrandTotalPaid?: number;
}

interface IOptions {
  status: { label: string; value: string }[];
  company: { label: string; value: string }[];
}

const useRepPiutang = (data: IPiutang[]) => {
  const { setIsLoading, setIsErr, setIsSuccess } = useLayout();
  const [isPiutang, setIsPiutang] = useState<IPiutang[]>();
  const [isSelected, setIsSelected] = useState<IPiutang[]>();
  const [isSumData, setIsSumData] = useState<ISumData>();
  const [isOptions, setIsOptions] = useState<IOptions>({
    status: [
      { label: "Semua", value: "0" },
      { label: "Lunas", value: "1" },
      { label: "Belum Lunas", value: "2" },
    ],
    company: [],
  });
  const [isFilter, setIsFilter] = useState<IPiutangFilter>({
    sortBy: "dueDate",
  });
  const [isModalSelect, setIsModalSelect] = useState(false);

  /**
   * API
   */
  async function manageData(data: IPiutang[]) {
    const uniqueCustomers = Array.from(
      new Map(
        data
          .filter((item) => item.name)
          .map((item) => [
            item.name as string,
            { label: item.name as string, value: item.name as string },
          ])
      ).values()
    );

    setIsPiutang(data);
    setIsOptions((prev) => ({
      ...prev,
      company: uniqueCustomers as { label: string; value: string }[],
    }));
    setIsLoading(false);
  }

  const handleSubmitPay = async () => {
    // e.preventDefault();

    // const payload = [
    //   {
    //     id: 3,
    //     billing: "Selesai",
    //     paymentMethod: "TF a/n Perorangan ke BAJA",
    //     installments: [
    //       { amount: 561086792, date: "06 Feb 2025" },
    //       // { amount: 36587800, date: "07 Feb 2025" },
    //     ],
    //   },
    //   // {
    //   //   id: 4,
    //   //   billing: "Belum Lunas",
    //   //   paymentMethod: "CEK ke BAJA",
    //   //   installments: [{ amount: 15000000, date: "10 Mar 2025" }],
    //   // },
    // ];
    const payload = [
      {
        id: 343,
        billing: "Selesai",
        paymentMethod: "TF a/n Perorangan ke BAJA",
        installments: [{ amount: 9926000, date: "15 Feb 2025" }],
      },
      {
        id: 344,
        billing: "Selesai",
        paymentMethod: "CEK ke BAJA",
        installments: [{ amount: 7951000, date: "10 Mar 2025" }],
      },
    ];

    try {
      const response = await fetch("/api/pay-piutang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert("Data berhasil diperbarui!");
      } else {
        alert("Gagal: " + result.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  /**
   * Funtion ETC
   */

  // Memproses data
  const groupedInvoices = React.useMemo(() => {
    // Mengurutkan data
    const sortedData = [...(isPiutang ?? [])].sort((a, b) => {
      if (isFilter?.sortBy === "po") {
        const aSub = a.sub ? a.po + a.sub : a.po;
        const bSub = b.sub ? b.po + b.sub : b.po;
        return (aSub || "").localeCompare(bSub || "");
      } else {
        return (
          new Date(a.dueDate || "").getTime() -
          new Date(b.dueDate || "").getTime()
        );
      }
    });

    // Filter data
    const filteredData = sortedData.filter((item) => {
      let isValid = true;

      // Filter by date range
      if (isFilter) {
        if (isFilter.startDate && isFilter.endDate) {
          const startDate = isFilter.startDate.getTime();
          const endDate = isFilter.endDate.getTime() + 23 * 60 * 60 * 1000;
          const dueDate = new Date(item.dueDate || "").getTime();

          if (!isNaN(dueDate) && (dueDate <= startDate || dueDate > endDate)) {
            isValid = false;
          }
        }

        // Filter by customer name
        if (isFilter.custName && isFilter.custName.length > 0) {
          if (item.name && !isFilter.custName.includes(item.name)) {
            isValid = false;
          }
        }

        // Filter by status
        if (isFilter.status === 1 && item.status !== "LUNAS") {
          isValid = false;
        }
        if (isFilter.status === 2 && item.status === "LUNAS") {
          isValid = false;
        }
      }

      return isValid;
    });

    if (filteredData.length === 0) return new Map();

    // Mengkelompokan data berdasarkan tanggal jatuh tempo / no po
    const groups = new Map();
    filteredData.forEach((invoice) => {
      let groupKey = "";

      if (isFilter?.sortBy !== "po") {
        groupKey = invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split("T")[0]
          : "Unknown Date";
      } else {
        groupKey = invoice.sub
          ? `${invoice.po}-${invoice.sub}`
          : invoice.po || "Unknown PO";
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey).push(invoice);
    });

    return groups;
  }, [isPiutang, isFilter]);

  // Menghitung total tagihan, total bayar, dan total sisa tagihan
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
  }, [isPiutang, isFilter]);

  // Generate Tagihan text
  const generateBillText = () => {
    if (!isPiutang) return "";

    let copyText = "";
    let grandTotal = 0;

    const dates = Array.from(groupedInvoices.keys());
    if (dates.length === 0) return "";

    copyText += `_*List Tagihan Jatuh Tempo*_\n\n`;

    groupedInvoices.forEach((invoices, date) => {
      (invoices as IPiutang[]).forEach((invoice) => {
        const amount = invoice.status === "LUNAS" ? 0 : invoice.billRemaning;
        grandTotal += amount ?? 0;
        copyText += `- *Nama : ${invoice.name?.replace(/\n/g, " ")}*\n`;
        copyText += `- No. PO : ${invoice.poCust}\n`;
        copyText += `- Invoice : ${invoice.inv}\n`;
        copyText += `- Tgl. Inv : ${converDateWIB(invoice.invDate)}\n`;
        copyText += `- Tagihan : ${convertToRupiah(invoice.bill)},-\n`;
        copyText += `- Tgl. JT : *${converDateWIB(invoice.dueDate)}*,-\n\n`;
      });
    });

    copyText += `_*Grand Total Tagihan ${convertToRupiah(grandTotal)},-*_\n\n`;

    copyText += `===========================\n`;
    copyText += `*Mohon segera melakukan pembayaran*\n`;
    copyText += `- Pembayaran Tagihan :\n`;
    copyText += `- BCA\n`;
    copyText += `- A/n PT. BERKAT AGUNG JASA ANDALAN\n`;
    copyText += `- A/c 469.888.8588\n\n`;

    copyText += `- Pembayaran Ongkir :\n`;
    copyText += `- BCA\n`;
    copyText += `- A/n THE SANTOSO TEDJO\n`;
    copyText += `- A/c 187.061.9703\n\n`;

    copyText += `*NB: Transfer Harap Mencantumkan No. Inv*`;
    return copyText;
  };

  // Generate laporan data
  const generateCopyText = () => {
    if (!isPiutang) return "";

    let copyText = "";
    let grandTotal = 0;

    const dates = Array.from(groupedInvoices.keys());
    if (dates.length === 0) return "";

    const startDate = converDateWIB(isFilter?.startDate);
    const endDate = converDateWIB(isFilter?.endDate);

    copyText += `_*List Piutang Jatuh Tempo ${converDateWIB(
      startDate
    )} s/d ${converDateWIB(endDate)}*_\n\n`;

    groupedInvoices.forEach((invoices, date) => {
      copyText += `Tgl ${converDateWIB(new Date(date))}\n`;
      (invoices as IPiutang[]).forEach((invoice) => {
        const amount = invoice.status === "LUNAS" ? 0 : invoice.billRemaning;
        grandTotal += amount ? amount : 0;
        copyText += `Invoice : ${invoice.name}\n`;
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
   * HANDLE CHANGE ETC
   */

  function handleChangeSelect(e: boolean, item: IPiutang) {
    if (e) {
      setIsSelected((prev) => [...(prev ?? []), item]);
    } else {
      setIsSelected((prev) => prev?.filter((i) => i !== item));
    }
  }

  /**
   * HANDLE SUBMIT ETC
   */

  // Fungsi handle click copy laporan
  function handleCopyBill() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(generateBillText())
        .then(() => {
          setIsSuccess(true, "Berhasil Copy Data");
        })
        .catch((err) => {
          setIsErr(true, "Gagal copy data");
        });
    } else {
      setIsErr(true, "Clipboard API tidak didukung di lingkungan ini.");
    }
  }
  function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(generateCopyText())
        .then(() => {
          setIsSuccess(true, "Berhasil Copy Data");
        })
        .catch((err) => {
          setIsErr(true, "Gagal copy data");
        });
    } else {
      setIsErr(true, "Clipboard API tidak didukung di lingkungan ini.");
    }
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
    setIsLoading(true, "Mengambil data");
    manageData(data);
  }, [data]);

  useEffect(() => {
    groupedInvoices;
  }, [isFilter]);

  return {
    isPiutang,
    isFilter,
    isOptions,
    isSumData,
    isSelected,
    isModalSelect,
    groupedInvoices,
    sumInvoice,
    setIsModalSelect,
    handleChangeSelect,
    setIsFilter,
    handleSubmitPay,
    handleCopyBill,
    handleCopy,
    handleDateRangeChange,
  };
};

export default useRepPiutang;
