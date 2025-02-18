"use client";

import React from "react";
import useRepLaba from "./useRepLaba";
import { converDateWIB, convertToRupiah } from "@/helper/convert";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import RadioBtn from "@/components/button/RadioBtn";
import { AppDatePickerRange } from "@/components/ui/appDatePicker";

Chart.register(ArcElement, Tooltip, Legend);

export default function page() {
  const {
    sumData,
    isFilter,
    filteredData,
    setIsFilter,
    handleDateRangeChange,
  } = useRepLaba();
  const chartData = {
    labels: ["Total Beli", "Total Jual", "Profit"],
    datasets: [
      {
        data: [sumData?.buyTotal, sumData?.sellTotal, sumData.profitTotal],
        backgroundColor: ["#ff7b00", "#00aaff", "#00bbff"],
        hoverBackgroundColor: ["#ff8400", "#00bbff", "#02a3de"],
      },
    ],
  };

  const radioBtn = [
    {
      label: "Nomor PO",
      value: "po",
    },
    {
      label: "Tanggal Inv",
      value: "dueDate",
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
          {/* <AntItemSelect
            labelName="Status"
            option={isOptions.status}
            onChange={(e) => {
              setIsFilter({
                ...isFilter,
                status: Number(e),
              });
            }}
          /> */}
          {/* <AntItemSelect
            labelName="Nama Customer"
            option={isOptions.company}
            mode="multiple"
            onChange={(e) => {
              setIsFilter({
                ...isFilter,
                custName: e as string[],
              });
            }}
          /> */}
        </div>

        <div className="col-span-3 text-xs bg-slate-100 rounded-lg p-2 ">
          <div className="flex items-center justify-between text-sm border-b-2 pb-2">
            {/* {isSelected && (
              <div>
                <p>{isSelected?.length} Dipilih</p>
              </div>
            )} */}
            <div className="flex gap-5">
              {/* <SelectModalPiutang /> */}
              {/* <button
                onClick={handleSubmitPay}
                className="flex items-center gap-2"
              >
                <span>Bayar</span>
              </button> */}
              {/* <button
                onClick={handleCopyBill}
                className="flex items-center gap-2"
              >
                <FaRegCopy />
                <span>Copy Tagihan</span>
              </button>
              <button onClick={handleCopy} className="flex items-center gap-2">
                <FaRegCopy />
                <span>Copy Laporan</span>
              </button> */}
            </div>
          </div>

          <div className="grid gap-2 text-center bg-slate-800 rounded-lg text-white grid-cols-5 p-2 text-sm font-bold">
            <p className="col-span-2 ">Buy</p>
            <p className="col-span-2 ">Sell</p>
            <p className="">Profit</p>
          </div>
          <div className="text-xs mt-2 h-[76vh] overflow-y-scroll flex flex-col  gap-y-4 scrollbar-thumb-rounded-full">
            {filteredData.map((item, i) => (
              <div
                key={i}
                className=" text-xs bg-white drop-shadow-sm w-full p-2 rounded-lg"
              >
                <div className="flex gap-5 pb-2">
                  <p className="font-bold">
                    {item.po}
                    {item.subPo &&
                      item.subPo !== "OA" &&
                      item.subPo !== "OP" &&
                      `-${item.subPo}`}
                  </p>
                  <p>{converDateWIB(item.supDate)}</p>
                  <p>{converDateWIB(item.cusDate)}</p>
                </div>
                <div className="grid grid-cols-5">
                  <div className="col-span-2 grid grid-cols-2">
                    <p className="">{item.supName}</p>
                    <p>{convertToRupiah(item.buy)}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-2">
                    <p className=""> {item.cusName}</p>
                    <p>{convertToRupiah(item.sell)}</p>
                  </div>
                  <p className="grid grid-cols-2">
                    {convertToRupiah(item.profit)}{" "}
                    <span className="font-bold">{item.percentage} %</span>{" "}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg text-xs p-4">
          <div className="px-5 pb-5">
            <Doughnut data={chartData} />
          </div>
          <div className="grid grid-cols-2 gap-2 ">
            <p className="font-bold">Total Beli</p>
            <p className="text-end">{convertToRupiah(sumData?.buyTotal)},-</p>
            <p className="font-bold">Total Jual</p>
            <p className="text-end">{convertToRupiah(sumData?.sellTotal)},-</p>
            <p className="font-bold">Profit</p>
            <p className="text-end">
              {convertToRupiah(sumData?.profitTotal)},-
            </p>
            <p className="font-bold">Persentase</p>
            <p className="font-bold text-end">{sumData.percentageTotal}%</p>
          </div>
          <div className="my-2 bg-slate-400 w-full h-[1.5px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="flex flex-col gap-5 ">
      {isData.map((item, i) => (
        <div
          key={i}
          className="grid text-xs grid-cols-10 bg-white p-2 rounded-lg gap-2"
        >
          <p>{item.po}</p>
          <p>{converDateWIB(item.supDate)}</p>
          <p>{item.supName}</p>
          <p>{convertToRupiah(item.buy)}</p>
          <p>{item.poCus}</p>
          <p>{converDateWIB(item.cusDate)}</p>
          <p>{item.cusName}</p>
          <p>{convertToRupiah(item.sell)}</p>
          <p>{convertToRupiah(item.profit)}</p>
          <p>{item.percentage}</p>
        </div>
      ))}
    </div> */
}
