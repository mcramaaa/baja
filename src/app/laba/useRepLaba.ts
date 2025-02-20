import { useLayout } from "@/hooks/useLayout";
import { IHutang } from "@/interface/IHutang";
import { IDataLaba, IPenjualan } from "@/interface/ILaba";
import { IPiutang } from "@/interface/IPiutang";
import React, { useEffect, useState } from "react";

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
      const [penjualan, hutangRes] = await Promise.all([
        fetch("api/read-database/penjualan").then((res) => res.json()),
        fetch("/api/hutang").then((res) => res.json()),
      ]);

      // Gabungkan data menjadi map dengan `po` sebagai key
      const combinedMap = new Map<string, IDataLaba>();

      // Proses data hutang terlebih dahulu
      hutangRes.forEach((hutang: IHutang) => {
        if (hutang.po) {
          combinedMap.set(hutang.po, {
            po: hutang.po,
            subPo: hutang.sub,
            supDate: hutang.poDate ? new Date(hutang.poDate) : undefined,
            supName: hutang.name,
            buy: hutang.totBill,
            custDate: undefined,
            custName: undefined,
            sell: 0,
            profit: 0,
            percentage: 0,
          });
        }
      });

      // Gabungkan data piutang berdasarkan `po`
      penjualan.forEach((sell: IPenjualan) => {
        if (sell.po && sell.totBill) {
          if (combinedMap.has(sell.po)) {
            const existing = combinedMap.get(sell.po)!;
            existing.poCust = sell.sub;
            existing.custDate = sell.invDate;
            existing.custName = sell.name;
            existing.sell = sell.totBill;
            existing.profit = sell.totBill - (existing.buy || 0);
            existing.percentage =
              sell.totBill > 0
                ? parseFloat(
                    ((existing.profit / sell.totBill) * 100).toFixed(2)
                  )
                : 0;

            combinedMap.set(sell.po, existing);
          } else {
            // Jika tidak ada di hutang, tambahkan dari sell
            combinedMap.set(sell.po, {
              po: sell.po,
              subPo: sell.sub,
              supDate: undefined,
              supName: undefined,
              buy: 0,
              poCust: sell.po,
              custDate: sell.poDate,
              custName: sell.name,
              sell: sell.bill,
              profit: sell.bill,
              percentage: 100,
            });
          }
        }
      });

      // Konversi Map ke Array
      const mergedData = Array.from(combinedMap.values());

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

  const filteredData = React.useMemo(() => {
    // Filter berdasarkan rentang tanggal cusDate
    let filteredData = isData.filter((item) => {
      if (isFilter?.startDate && isFilter.endDate) {
        const cusDate = item.custDate
          ? new Date(item.custDate).getTime()
          : null;
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
        const dateA = a.custDate ? new Date(a.custDate).getTime() : 0;
        const dateB = b.custDate ? new Date(b.custDate).getTime() : 0;
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

  const sumData = React.useMemo(() => {
    // Hitung total buy, sell, profit, dan percentage
    let buyTotal = 0;
    let sellTotal = 0;
    let profitTotal = 0;
    let percentageTotal = 0;

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
  };
};

export default useRepLaba;
