export function convertToNumber(value: string) {
  const format = Number(
    value
      .replace(/\s*Rp\s*/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
  );
  return format;
}

export function convertToRupiah(value: number | undefined | 0) {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  if (value) return formatter.format(value);
  return null;
}

export function converDate(value?: string) {
  if (value) {
    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
}

export function convertCustomDate(value?: string) {
  console.log(value);
  const monthMap: { [key: string]: string } = {
    Jan: "Jan",
    Feb: "Feb",
    Mar: "Mar",
    Apr: "Apr",
    Mei: "May",
    Jun: "Jun",
    Jul: "Jul",
    Agu: "Aug",
    Sep: "Sep",
    Okt: "Oct",
    Nov: "Nov",
    Des: "Dec",
  };

  if (value) {
    const [day, month, year] = value.split(" ");

    const validMonth = monthMap[month] || "";

    const validDateString = `${day} ${validMonth} ${year}`;

    return new Date(validDateString);
  }
}
