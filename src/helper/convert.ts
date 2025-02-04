export function convertToNumber(value: string) {
  const format = Number(
    value
      .replace(/\s*Rp\s*/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
  );
  return format;
}

export function convertToRupiah(value: number) {
  return `Rp. ${value.toLocaleString("id-ID")},-`;
}
