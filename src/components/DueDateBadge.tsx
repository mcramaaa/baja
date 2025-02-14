import { Tag } from "antd";
import React from "react";

interface IProps {
  dueDate: string;
}

export default function DueDateBadge(props: IProps) {
  const { dueDate } = props;

  function calculation(dueDate: string) {
    if (!dueDate) return "Tanggal Tidak Valid";

    const now = new Date();
    const nowConvert = new Date(now.getTime() - 23 * 60 * 60 * 1000);
    const due = new Date(dueDate);

    const diffTime = nowConvert.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 23));

    return diffDays;
  }

  function coloring(value: number) {
    if (value <= -7) {
      return "blue";
    }
    if (value >= -7 && value < 0) {
      return "warning";
    }
    if (value == 0) {
      return "green";
    }
    if (value > 0) {
      return "error";
    }
  }
  return (
    <Tag
      className="px-3 font-bold rounded-full"
      color={coloring(+calculation(dueDate))}
    >
      {+calculation(dueDate) > 0 ? `Lewat ${calculation(dueDate)} hari` : null}
      {+calculation(dueDate) == 0 ? `Hari ini` : null}
      {+calculation(dueDate) < 0
        ? `${Math.abs(+calculation(dueDate))} Hari lagi`
        : null}
    </Tag>
  );
}
