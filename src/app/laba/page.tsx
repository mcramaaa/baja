"use client";

import React from "react";
import useRepLaba from "./useRepLaba";
import { converDateWIB, convertToRupiah } from "@/helper/convert";

export default function page() {
  const { isData } = useRepLaba();
  console.log(isData);
  return (
    <div>
      {isData.map((item, i) => (
        <div key={i} className="grid grid-cols-9 gap-2">
          <p>{item.po}</p>
          <p>{converDateWIB(item.supDate)}</p>
          <p>{item.supName}</p>
          <p>{convertToRupiah(item.buy)}</p>
          <p>{converDateWIB(item.cusDate)}</p>
          <p>{item.cusName}</p>
          <p>{convertToRupiah(item.sell)}</p>
          <p>{item.profit}</p>
          <p>{item.percentage}</p>
        </div>
      ))}
    </div>
  );
}
