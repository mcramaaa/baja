"use client";

import { AppDatePickerRange } from "@/components/ui/appDatePicker";
import { converDateWIB, convertToRupiah } from "@/helper/convert";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { FaRegCopy } from "react-icons/fa6";
import { BsPatchCheckFill } from "react-icons/bs";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import AntItemSelect from "@/components/dropdown/AntItemSelect";
import RadioBtn from "@/components/button/RadioBtn";
import DueDateBadge from "@/components/DueDateBadge";
import { IHutang } from "@/interface/IHutang";
import useRepPiutang from "./useRepPiutang";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdLiveHelp } from "react-icons/md";
import { Checkbox } from "antd";

Chart.register(ArcElement, Tooltip, Legend);

export default function Piutang() {
  const {
    isPiutang,
    isSumData,
    isOptions,
    isFilter,
    isSelected,
    groupedInvoices,
    setIsFilter,
    handleCopyBill,
    handleCopy,
    handleDateRangeChange,
    handleChangeSelect,
    handleSubmitPay,
  } = useRepPiutang();

  const chartData = {
    labels: ["Piutang Terbayar", "Piutang Belum Terbayar"],
    datasets: [
      {
        data: [isSumData?.GrandTotalPaid, isSumData?.GrandTotalRemaning],
        backgroundColor: ["#00aaff", "#ff7b00"],
        hoverBackgroundColor: ["#00bbff", "#ff8400"],
      },
    ],
  };

  const radioBtn = [
    {
      label: "Jatuh Tempo",
      value: "dueDate",
    },
    {
      label: "Nomor PO",
      value: "po",
    },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-5 gap-5">
        <div className="flex bg-slate-50 p-4 text-sm rounded-lg gap-4 flex-col mb-6 h-fit">
          <h2 className="border-b-2 border-brand-core2 pb-2 text-center font-bold text-lg">
            Filter
          </h2>
          <RadioBtn
            label="Sort By"
            options={radioBtn}
            onChange={(e) => {
              setIsFilter({
                ...isFilter,
                sortBy: e,
              });
            }}
          />
          <div>
            <p className="font-bold">Date Range</p>
            <AppDatePickerRange
              onChange={(e) => {
                handleDateRangeChange(e);
              }}
              className="pb-5"
            />
          </div>
          <AntItemSelect
            labelName="Status"
            option={isOptions.status}
            onChange={(e) => {
              setIsFilter({
                ...isFilter,
                status: Number(e),
              });
            }}
          />
          <AntItemSelect
            labelName="Nama Customer"
            option={isOptions.company}
            mode="multiple"
            onChange={(e) => {
              setIsFilter({
                ...isFilter,
                custName: e as string[],
              });
            }}
          />
        </div>

        <div className="col-span-3 text-xs bg-slate-50 rounded-lg p-4 ">
          <div className="flex items-center justify-between text-sm border-b-2 pb-2">
            <div>
              <p>
                Menampilkan{" "}
                <span className="font-bold">
                  {Array.from(groupedInvoices.values()).reduce(
                    (total, inv) => total + inv.length,
                    0
                  )}
                </span>{" "}
                dari <span className="font-bold">{isPiutang?.length}</span> data
                Piutang
              </p>
              <p>
                Total Piutang : {convertToRupiah(isSumData?.GrandTotalBill)},-
              </p>
            </div>
            {isSelected && (
              <div>
                <p>{isSelected?.length} Dipilih</p>
              </div>
            )}
            <div className="flex gap-5">
              {/* <SelectModalPiutang /> */}
              {/* <button
                onClick={handleSubmitPay}
                className="flex items-center gap-2"
              >
                <span>Bayar</span>
              </button> */}
              <button
                onClick={handleCopyBill}
                className="flex items-center gap-2"
              >
                <FaRegCopy />
                <span>Copy Tagihan</span>
              </button>
              <button onClick={handleCopy} className="flex items-center gap-2">
                <FaRegCopy />
                <span>Copy Laporan</span>
              </button>
            </div>
          </div>

          <div className="grid gap-2 text-center bg-slate-800 rounded-lg text-white grid-cols-6 p-2 text-sm font-bold">
            <p className="col-span-2 ">No PO</p>
            <p className="">Tgl Inv</p>
            <p className="">Tagihan</p>
            <p className="">Pembayaran</p>
            <p className="">Sisa Tagihan</p>
          </div>
          <div className="text-xs mt-2 h-[76vh] overflow-y-scroll scrollbar-thumb-rounded-full">
            {Array.from(groupedInvoices.entries()).map(
              ([date, invoices], i) => (
                <div key={date} className={`${i !== 0 && "mt-5"}`}>
                  <div className="text-sm flex items-center justify-between gap-5 border-b">
                    <div className="flex items-center gap-5">
                      <p className="font-bold">
                        Tgl{" "}
                        {isFilter?.sortBy === "dueDate"
                          ? converDateWIB(date)
                          : converDateWIB(invoices[0].dueDate)}
                      </p>
                      <DueDateBadge
                        dueDate={
                          isFilter.sortBy === "dueDate"
                            ? date
                            : invoices[0].dueDate
                        }
                      />
                    </div>

                    <Popover>
                      <PopoverTrigger className="hover:scale-125 rounded-full text-lg mr-3">
                        <MdLiveHelp />
                      </PopoverTrigger>
                      <PopoverContent className="z-50 p-2 text-xs grid grid-cols-2 gap-x-5 w-full">
                        <span>Tot Tagihan</span>{" "}
                        <p className="font-bold">
                          {convertToRupiah(
                            invoices.reduce(
                              (total: number, inv: IHutang) =>
                                total + (inv.bill ?? 0),
                              0
                            )
                          )}
                        </p>
                        <span>Tot Pembayaran</span>{" "}
                        <p className="font-bold">
                          {convertToRupiah(
                            invoices.reduce(
                              (total: number, inv: IHutang) =>
                                total + (inv.payment ?? 0),
                              0
                            )
                          )}
                        </p>
                        <span>Tot Sisa Tagihan</span>{" "}
                        <p className="font-bold">
                          {convertToRupiah(
                            invoices.reduce(
                              (total: number, inv: IHutang) =>
                                total + (inv.billRemaning ?? 0),
                              0
                            )
                          )}
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-2 mt-1">
                    {(invoices as IHutang[]).map((invoice, index) => (
                      <div
                        key={index}
                        className="bg-white flex items-center gap-3 drop-shadow p-3 rounded-lg text-slate-900"
                      >
                        <div>
                          <Checkbox
                            onChange={(e) => {
                              console.log(e.target.checked);
                              handleChangeSelect(e.target.checked, invoice);
                            }}
                          />
                          {invoice.id}
                        </div>
                        <div className="w-full">
                          <p className="font-bold pb-1">{invoice.name}</p>
                          <div className="grid grid-cols-6 justify-center text-center gap-2">
                            <p className="col-span-2 text-start ">
                              {invoice.po}
                              {invoice.sub && `-${invoice.sub}`}
                            </p>
                            <p className="">
                              {converDateWIB(invoice.invDate)}{" "}
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
                                    ? "Rp. 0"
                                    : `${convertToRupiah(
                                        invoice.billRemaning
                                      )}`}
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
                      </div>
                    ))}
                  </div>
                  {/* <div className="grid text-center bg-white grid-cols-6 gap-2 pt-3">
                    <div></div>
                    <div></div>
                    <div></div>
                    <p className="">
                      {convertToRupiah(
                        invoices.reduce(
                          (total: number, inv: IHutang) =>
                            total + (inv.bill ?? 0),
                          0
                        )
                      )}
                    </p>
                    <p className="">
                      {convertToRupiah(
                        invoices.reduce(
                          (total: number, inv: IHutang) =>
                            total + (inv.payment ?? 0),
                          0
                        )
                      )}
                    </p>
                    <p className="">
                      {convertToRupiah(
                        invoices.reduce(
                          (total: number, inv: IHutang) =>
                            total + (inv.billRemaning ?? 0),
                          0
                        )
                      )}
                    </p>
                  </div> */}
                </div>
              )
            )}
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
