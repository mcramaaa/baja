"use client";

import { AppDatePickerRange } from "@/components/ui/appDatePicker";
import { converDateWIB, convertToRupiah } from "@/helper/convert";
import { IPiutang } from "@/interface/IPiutang";
import React from "react";
import useRepPiutang from "./useRepPiutang";
import { Doughnut } from "react-chartjs-2";
import { FaRegCopy } from "react-icons/fa6";
import { BsPatchCheckFill } from "react-icons/bs";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Registrasi komponen agar bisa digunakan
Chart.register(ArcElement, Tooltip, Legend);

export default function Piutang() {
  const {
    isPiutang,
    isSumData,
    isFilter,
    groupedInvoices,
    sumInvoice,
    setIsFilter,
    handleCopy,
    handleDateRangeChange,
  } = useRepPiutang();
  const chartData = {
    labels: ["Piutang Terbayar", "Piutang Belum Terbayar"],
    datasets: [
      {
        data: [isSumData?.GrandTotalPaid, isSumData?.GrandTotalRemaning], // Data dalam rupiah (bisa disesuaikan)
        backgroundColor: ["#00aaff", "#ff7b00"], // Warna setiap bagian chart
        hoverBackgroundColor: ["#00bbff", "#ff8400"], // Warna saat hover
      },
    ],
  };

  console.log(groupedInvoices);
  return (
    <div className="">
      <div className="grid grid-cols-5 gap-5">
        <div className="flex bg-slate-50 p-4 text-sm rounded-lg gap-4 flex-col mb-6 h-fit">
          <h2 className="border-b-2 border-brand-core2 pb-2 text-center font-bold text-lg">
            Filter
          </h2>
          <div>
            <p>date range</p>
            <AppDatePickerRange
              onChange={(e) => {
                console.log(e);
                handleDateRangeChange(e);
              }}
            />
          </div>
          <div>
            <p>Status</p>
            <select
              value={isFilter.status}
              onChange={(e) =>
                setIsFilter({
                  ...isFilter,
                  status: Number(e.target.value) as 0 | 1 | 2,
                })
              }
              className="p-2 border w-full rounded"
            >
              <option value={0}>Semua Status</option>
              <option value={1}>Lunas</option>
              <option value={2}>Belum Lunas</option>
            </select>
          </div>
          <div></div>
        </div>

        <div className="col-span-3 text-xs bg-slate-50 rounded-lg p-4 ">
          <div className="flex items-center justify-between text-sm border-b-2 pb-2">
            <div>
              <p>Menampilkan {isPiutang?.length} data piutang</p>
              <p>
                Total Piutang : {convertToRupiah(isSumData?.GrandTotalBill)},-
              </p>
            </div>
            <button onClick={handleCopy} className="flex items-center gap-2">
              <FaRegCopy />
              <span>Copy</span>
            </button>
          </div>

          <div className="grid gap-2 text-center bg-slate-800 rounded-lg text-white grid-cols-6 p-2 text-sm font-bold">
            <p className="col-span-2 ">No PO</p>
            <p className="">Tgl PO</p>
            <p className="">Tagihan</p>
            <p className="">Pembayaran</p>
            <p className="">Sisa Tagihan</p>
          </div>
          <div className="text-xs mt-2 h-[76vh] overflow-y-scroll scrollbar-thumb-rounded-full">
            {Array.from(groupedInvoices.entries()).map(
              ([date, invoices], i) => (
                <div key={date} className={`${i !== 0 && "mt-5"}`}>
                  <h2 className="font-bold text-sm border-b">
                    Tgl {converDateWIB(date)}
                  </h2>
                  <div className="flex flex-col gap-2 mt-1">
                    {(invoices as IPiutang[]).map((invoice, index) => (
                      <div
                        key={index}
                        className="bg-white drop-shadow p-3 rounded-lg text-slate-900"
                      >
                        <p className="font-bold pb-1">{invoice.name}</p>
                        <div className="grid grid-cols-6 justify-center text-center gap-2">
                          <p className="col-span-2 text-start ">
                            {invoice.po}
                            {invoice.sub && `-${invoice.sub}`}
                          </p>
                          <p className="">
                            {converDateWIB(invoice.poDate)}{" "}
                            <span className="font-bold">
                              {+(invoice.rangeDay ?? 0) === 0
                                ? "(CASH)"
                                : `(${invoice.rangeDay} Hari)`}
                            </span>
                          </p>
                          <p className="">{convertToRupiah(invoice.bill)}</p>
                          <p className="">
                            {invoice.payment === 0
                              ? "Rp 0"
                              : convertToRupiah(invoice.payment)}
                          </p>
                          <div className="flex items-center gap-2 justify-between text-center">
                            <div className="w-full">
                              <p className="">
                                {invoice.status === "LUNAS"
                                  ? "Rp. 0,-"
                                  : `${convertToRupiah(
                                      invoice.billRemaning
                                    )},-`}
                              </p>
                            </div>
                            <BsPatchCheckFill
                              className={`${
                                invoice.status === "LUNAS"
                                  ? "text-green-600"
                                  : "text-slate-400"
                              } text-lg`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
            <p></p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg text-xs p-4">
          <div className="px-5 pb-5">
            <Doughnut data={chartData} />
          </div>
          <div className="grid grid-cols-2 gap-2 ">
            <p className="font-bold">Grand Total Piutang</p>
            <p className="text-end">
              {convertToRupiah(isSumData?.GrandTotalBill)},-
            </p>
            <p className="font-bold">Piutang Terbayar</p>
            <p className="text-end">
              {convertToRupiah(isSumData?.GrandTotalPaid)},-
            </p>
            <p className="font-bold">Piutang Belum Terbayar</p>
            <p className="text-end">
              {convertToRupiah(isSumData?.GrandTotalRemaning)},-
            </p>
          </div>
          <div className="my-2 bg-slate-400 w-full h-[1.5px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
