import { convertCustomDate, convertToNumber } from "@/helper/convert";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./key.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

async function readPenjualan() {
  const spreadsheetId = "1Q3HDxCv8U1SjR4Ro-Xt6WAlOIeq7Z1E-FoCf_6APOP4";
  const rangeAtoZ = "PENJUALAN2!A2:Z";

  try {
    const resAtoZ = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: rangeAtoZ,
    });

    const dataAtoZ = resAtoZ.data.values || [];
    const rawData = dataAtoZ
      .filter(
        (data) =>
          Array.isArray(data) && data.length > 0 && data[0]?.trim() !== ""
      )
      .map((data, i) => {
        return {
          id: i + 2,
          po: data[0],
          sub: data[1],
          poCust: data[5],
          poDate: convertCustomDate(data[4]),
          name: data[6],
          inv: data[23],
          invDate: convertCustomDate(data[24]),
          bill: convertToNumber(data[14]),
          totBill: convertToNumber(data[16]),
        };
      });

    // Grouping data by po and sub
    const groupedData: Record<string, any> = {};

    rawData.forEach((item) => {
      const key = `${item.po}-${item.sub}`;

      if (!groupedData[key]) {
        groupedData[key] = { ...item };
      } else {
        groupedData[key].bill += item.bill;
      }
    });

    // Ubah objek hasil pengelompokan menjadi array
    const groupedArray = Object.values(groupedData);

    console.log(groupedArray);
    return groupedArray;
  } catch (err) {
    throw err;
  }
}

export default readPenjualan;
