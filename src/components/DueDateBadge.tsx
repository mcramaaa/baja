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
    const due = new Date(dueDate);

    const diffTime = now.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;

    //  if (diffDays > 0) {
    //    return diffDays;
    //  } else {
    //    if (diffDays === 0) {
    //      return "Hari ini";
    //    } else {
    //      return `Lewat ${Math.abs(diffDays)} Hari `;
    //    }
    //  }
  }

  function coloring(value: number) {
    // const date = Math.abs(value);
    if (value <= 7) {
      return "warning";
    }
    if (value <= 3) {
      return "volcano";
    }
    if ((value = 0)) {
      return "blue";
    }
    if (value >= 7) {
      return "error";
    }
  }
  return (
    <Tag
      className="px-3 font-bold rounded-full"
      color={coloring(+calculation(dueDate))}
    >
      {/* {calculation(dueDate)} */}
      {+calculation(dueDate) > 0 ? `Lewat ${calculation(dueDate)} hari` : null}
      {+calculation(dueDate) == 0 ? `Hari ini` : null}
      {+calculation(dueDate) < 0
        ? `${Math.abs(+calculation(dueDate))} Hari lagi`
        : null}
    </Tag>
  );
}
