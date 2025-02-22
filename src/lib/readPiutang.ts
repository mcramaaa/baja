import { convertCustomDate, convertToNumber } from "@/helper/convert";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./key.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

async function readPiutang() {
  const spreadsheetId = "1pxAHMxfqHWePa682WKzCOfEf9HRB0NKO6gTc8UlZVOE";
  const rangeAtoZ = "PIUTANG!A3:AB";
  const rangeAD = "PIUTANG!AD3:AD";

  try {
    const resAtoZ = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: rangeAtoZ,
    });
    const resAD = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: rangeAD,
    });

    const dataAtoZ = resAtoZ.data.values || [];
    const dataAD = resAD.data.values || [];
    const data = dataAtoZ
      .filter((data) => data[2] !== "")
      .map((data, i) => ({
        id: i + 3,
        po: data[2],
        sub: data[3],
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
        billingStatus: dataAD[i]?.at(0),
      }));
    return data;
  } catch (err) {
    throw err;
  }
}

export default readPiutang;
