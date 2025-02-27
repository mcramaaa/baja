import { useLayout } from "@/hooks/useLayout";
import { IHutang } from "@/interface/IHutang";
import { IDataLaba } from "@/interface/ILaba";
import { IPiutang } from "@/interface/IPiutang";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { converDateWIB } from "@/helper/convert";

interface IFilter {
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
}

const useRepLaba = () => {
  const { setIsLoading, setIsErr, setIsSuccess } = useLayout();
  const [isFilter, setIsFilter] = useState<IFilter>();
  const [isData, setIsData] = useState<IDataLaba[]>([]);

  /**
   * API
   */

  async function fetchData() {
    try {
      setIsLoading(true, "Mengambil Data");

      // Fetch hutang dan piutang secara paralel
      const [hutangRes, piutangRes] = await Promise.all([
        fetch("/api/hutang").then((res) => res.json()),
        fetch("/api/piutang").then((res) => res.json()),
      ]);

      // Gabungkan data menjadi map dengan `po` sebagai key
      const combinedMap = new Map<string, IDataLaba>();

      // Proses data hutang terlebih dahulu
      hutangRes.forEach((hutang: IHutang) => {
        if (hutang.po) {
          combinedMap.set(hutang.po, {
            po: hutang.po,
            subPo: hutang.sub,
            supDate: hutang.poDate,
            supName: hutang.name,
            buy: hutang.totBill,
            cusDate: undefined,
            cusName: undefined,
            sell: 0,
            profit: 0,
            percentage: 0,
          });
        }
      });

      console.log(piutangRes);
      // Gabungkan data piutang berdasarkan `po`
      piutangRes.forEach((piutang: IPiutang) => {
        if (piutang.po && piutang.totBill) {
          if (combinedMap.has(piutang.po)) {
            const existing = combinedMap.get(piutang.po)!;
            existing.subPoCust = piutang.sub;
            existing.cusDate = piutang.poDate;
            existing.cusName = piutang.name;
            existing.sell = piutang.totBill;
            existing.profit = piutang.totBill - (existing.buy || 0);
            existing.percentage =
              piutang.totBill > 0
                ? parseFloat(
                    ((existing.profit / piutang.totBill) * 100).toFixed(2)
                  )
                : 0;

            combinedMap.set(piutang.po, existing);
          } else {
            // Jika tidak ada di hutang, tambahkan dari piutang
            combinedMap.set(piutang.po, {
              po: piutang.po,
              subPo: piutang.sub,
              supDate: undefined,
              supName: undefined,
              buy: 0,
              poCust: piutang.po,

              cusDate: piutang.poDate,
              cusName: piutang.name,
              sell: piutang.bill,
              profit: piutang.bill,
              percentage: 100,
            });
          }
        }
      });

      // Konversi Map ke Array
      const mergedData = Array.from(combinedMap.values());
      console.log(mergedData);

      setIsData(mergedData);
      setIsSuccess(true, "Data berhasil diambil");
    } catch (error) {
      setIsErr(true, "Gagal mengambil data");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * FUNCTION ETC
   */

  // Filter data
  const filteredData = React.useMemo(() => {
    // Filter berdasarkan rentang tanggal cusDate
    let filteredData = isData.filter((item) => {
      if (isFilter?.startDate && isFilter.endDate) {
        const cusDate = item.cusDate ? new Date(item.cusDate).getTime() : null;
        const startDate = new Date(isFilter.startDate).getTime();
        const endDate =
          new Date(isFilter.endDate).getTime() + 23 * 60 * 60 * 1000;

        if (cusDate && cusDate >= startDate && cusDate <= endDate) {
          return true;
        }
        return false;
      }
      return true;
    });

    // Sorting berdasarkan sortBy
    if (isFilter?.sortBy === "cusDate") {
      filteredData = filteredData.sort((a, b) => {
        const dateA = a.cusDate ? new Date(a.cusDate).getTime() : 0;
        const dateB = b.cusDate ? new Date(b.cusDate).getTime() : 0;
        return dateA - dateB;
      });
    } else if (isFilter?.sortBy === "po") {
      filteredData = filteredData.sort((a, b) => {
        const poA = a.po || "";
        const poB = b.po || "";
        return poA.localeCompare(poB);
      });
    }

    return filteredData;
  }, [isFilter, isData]);

  console.log(filteredData);

  // SUM DATA
  const sumData = React.useMemo(() => {
    // Hitung total buy, sell, profit, dan percentage
    let buyTotal = 0;
    let sellTotal = 0;
    let profitTotal = 0;
    let percentageTotal = 0;
    console.log(filteredData);

    filteredData.forEach((item) => {
      buyTotal += item.buy || 0;
      sellTotal += item.sell || 0;
      profitTotal += item.profit || 0;
      percentageTotal = parseFloat(
        ((profitTotal / sellTotal) * 100).toFixed(2)
      );
    });

    return {
      buyTotal,
      sellTotal,
      profitTotal,
      percentageTotal,
    };
  }, [isFilter, isData]);

  // Export To Excel
  const exportToExcel = (data: IDataLaba[]) => {
    // Hitung total buy, sell, dan profit
    // const totalBuy = data.reduce((sum, item) => sum + (item.buy || 0), 0);
    // const totalSell = data.reduce((sum, item) => sum + (item.sell || 0), 0);
    // const totalProfit = data.reduce((sum, item) => sum + (item.profit || 0), 0);

    // Konversi data menjadi array untuk ditampilkan di Excel
    // const formattedData = data.map((item) => ({
    //   PO: item.po,
    //   "Supplier Date": item.supDate
    //     ? new Date(item.supDate).toLocaleDateString()
    //     : "",
    //   "Supplier Name": item.supName,
    //   Buy: item.buy,
    //   "Customer Date": item.cusDate
    //     ? new Date(item.cusDate).toLocaleDateString()
    //     : "",
    //   "Customer Name": item.cusName,
    //   Sell: item.sell,
    //   Profit: item.profit,
    //   Percentage: item.percentage + "%",
    // }));

    const formattedData = data.map((item) => [
      item.po,
      item.supDate ? new Date(item.supDate).toLocaleDateString() : "",
      item.supName,
      item.buy,
      item.cusDate ? new Date(item.cusDate).toLocaleDateString() : "",
      item.cusName,
      item.sell,
      item.profit,
      `${item.percentage}%`,
    ]);

    // Tentukan indeks baris terakhir (mulai dari 2 karena Excel pakai 1-based index)
    const lastRow = formattedData.length + 1; // Tambah 1 untuk header

    // Tambahkan baris total menggunakan rumus SUM
    formattedData.push([
      "TOTAL",
      "",
      "",
      { f: `SUM(D2:D${lastRow})` } as any,
      "",
      "",
      { f: `SUM(G2:G${lastRow})` },
      { f: `SUM(H2:H${lastRow})` },
      { f: `(SUM(H2:H${lastRow})/SUM(G2:G${lastRow}))*100%` },
    ]);

    // Buat header tabel
    const headers = [
      "PO",
      "Supplier Date",
      "Supplier Name",
      "Buy",
      "Customer Date",
      "Customer Name",
      "Sell",
      "Profit",
      "Percentage",
    ];

    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...formattedData]);

    // Buat workbook dan tambahkan worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Simpan file Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(
      dataBlob,
      `EXPORT LABA ${
        isFilter?.startDate && converDateWIB(isFilter?.startDate)
      } ${isFilter?.endDate && `sd ${converDateWIB(isFilter?.endDate)}`}.xlsx`
    );
  };

  /**
   * HANDLE CHANGE ETC
   */

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
    setIsLoading(true, "Mengambil Data");
    fetchData();
  }, []);

  return {
    filteredData,
    isData,
    isFilter,
    sumData,
    setIsFilter,
    handleDateRangeChange,
    exportToExcel,
  };
};

export default useRepLaba;
