import { useLayout } from "@/hooks/useLayout";
import { IHutang } from "@/interface/IHutang";
import { IDataLaba } from "@/interface/ILaba";
import { IPiutang } from "@/interface/IPiutang";
import { useEffect, useState } from "react";

const useRepLaba = () => {
  const { setIsLoading, setIsErr, setIsSuccess } = useLayout();
  const [isData, setIsData] = useState<IDataLaba[]>([]);

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
            supDate: hutang.poDate,
            supName: hutang.name,
            buy: hutang.bill,
            cusDate: undefined,
            cusName: undefined,
            sell: 0,
            profit: 0,
            percentage: 0,
          });
        }
      });

      // Gabungkan data piutang berdasarkan `po`
      piutangRes.forEach((piutang: IPiutang) => {
        if (piutang.po && piutang.bill) {
          if (combinedMap.has(piutang.po)) {
            const existing = combinedMap.get(piutang.po)!;
            existing.cusDate = piutang.poDate;
            existing.cusName = piutang.name;
            existing.sell = piutang.bill;
            existing.profit = piutang.bill - (existing.buy || 0);
            existing.percentage =
              piutang.bill > 0 ? (existing.profit / piutang.bill) * 100 : 0;
            combinedMap.set(piutang.po, existing);
          } else {
            // Jika tidak ada di hutang, tambahkan dari piutang
            combinedMap.set(piutang.po, {
              po: piutang.po,
              supDate: undefined,
              supName: undefined,
              buy: 0,
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

      setIsData(mergedData);
      setIsSuccess(true, "Data berhasil diambil");
    } catch (error) {
      setIsErr(true, "Gagal mengambil data");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true, "Mengambil Data");
    fetchData();
  }, []);

  return { isData };
};

export default useRepLaba;
