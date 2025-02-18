import { convertCustomDate, convertToNumber } from "@/helper/convert";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./key.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

async function readPiutang() {
  const spreadsheetId = "1Q3HDxCv8U1SjR4Ro-Xt6WAlOIeq7Z1E-FoCf_6APOP4";
  const rangeAtoZ = "PENJUALAN2!A2:Z";
  // const rangeAD = "PIUTANG!AD3:AD";

  try {
    const resAtoZ = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: rangeAtoZ,
    });
    // const resAD = await sheets.spreadsheets.values.get({
    //   spreadsheetId,
    //   // range: rangeAD,
    // });

    const dataAtoZ = resAtoZ.data.values || [];
    // const dataAD = resAD.data.values || [];
    const data = dataAtoZ
      .filter((data) => data[2] !== "")
      .map((data, i) => ({
        id: i + 2,
        po: data[1],
        sub: data[2],
        poCust: data[4],
        poDate: convertCustomDate(data[5]),
        name: data[6],
        sj: data[8],
        sjDate: convertCustomDate(data[9]),
        inv: data[10],
        invDate: convertCustomDate(data[12]),
        rangeDay: +data[13],
        dueDate: convertCustomDate(data[14]),
        overDue: data[19],
        bill: convertToNumber(data[22]),
        totBill: convertToNumber(data[23]),
        payment: convertToNumber(data[24]),
        totPayment: convertToNumber(data[25]),
        billRemaning: convertToNumber(data[22]) - convertToNumber(data[24]),
        // billRemaning:
        //   convertToNumber(data[21]) - convertToNumber(data[23]) <= 1
        //     ? 0
        //     : convertToNumber(data[21]) - convertToNumber(data[23]),
        status: data[27],
        // billingStatus: dataAD[i]?.at(0),
      }));
    return data;
  } catch (err) {
    throw err;
  }
}

export default readPiutang;
