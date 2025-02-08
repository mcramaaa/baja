"use client";
import { AppDatePickerRange } from "@/components/ui/appDatePicker";
import { converDateWIB, convertToRupiah } from "@/helper/convert";
import { IPiutang } from "@/interface/IPiutang";
import React from "react";
import { IoCopy } from "react-icons/io5";
import useRepPiutang from "./useRepPiutang";

export default function Piutang() {
  const {
    isFilter,
    groupedInvoices,
    setIsFilter,
    handleCopy,
    handleDateRangeChange,
  } = useRepPiutang();

  return (
    <div className="p m-5">
      <h1 className="text-xl font-bold">Piutang</h1>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <IoCopy />
          <span>Copy</span>
        </button>

        <AppDatePickerRange
          onChange={(e) => {
            console.log(e);
            handleDateRangeChange(e);
          }}
        />
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
      </div>

      <div className="p-10">
        <div className="text-sm">
          {Array.from(groupedInvoices.entries()).map(([date, invoices]) => (
            <div key={date} className="bg-white mt-2">
              <h2 className="font-semibold border-b ">
                Tgl {converDateWIB(date)}
              </h2>
              {(invoices as IPiutang[]).map((invoice, index) => (
                <div key={index} className="">
                  <p>Invoice : {invoice.name}</p>
                  {/* <p>
                    Invoice : {invoice.name}
                    {invoice.sub && `-${invoice.sub}`}
                  </p> */}
                  <p>
                    {invoice.status === "LUNAS"
                      ? "Rp. 0,-"
                      : `${convertToRupiah(invoice.billRemaning)},-`}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
