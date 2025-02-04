import { convertToNumber } from "@/helper/convert";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./key.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

async function readPiutang() {
  const spreadsheetId = "1pxAHMxfqHWePa682WKzCOfEf9HRB0NKO6gTc8UlZVOE";
  const rangeAtoZ = "PIUTANG!A2:AA";
  const rangeAD = "PIUTANG!AD2:AD";

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
        id: i + 1,
        po: data[2],
        sub: data[3],
        poDate: data[4],
        name: data[5],
        sj: data[7],
        sjDate: data[8],
        inv: data[9],
        invDate: data[11],
        rangeDay: +data[12],
        dueDate: data[13],
        overDue: data[18],
        bill: convertToNumber(data[21]),
        payment: convertToNumber(data[23]),
        billRemaning: convertToNumber(data[21]) - convertToNumber(data[23]),
        status: data[26],
        billingStatus: dataAD[i]?.at(0),
      }));
    console.log(data);
    return data;
  } catch (err) {
    console.error("The API returned an error:", err);
    throw err;
  }
}

export default readPiutang;

// id: i + 1,
// po: data[2],
// sub: data[3],
// poDate: data[4],
// name: data[5],
// sj: data[7],
// sjDate: data[8],
// inv: data[9],
// invDate: data[11],
// rangeDay: +data[12],
// dueDate: data[13],
// overDue: data[18],
// bill: convertToNumber(data[21]),
// payment: convertToNumber(data[23]),
// billRemaning: convertToNumber(data[21]) - convertToNumber(data[23]),
// status: data[26],
// billingStatus: dataAD[i]?.at(0),

//  const resAtoZ = await sheets.spreadsheets.values.get({
//    spreadsheetId,
//    range: rangeAtoZ,
//  });
//  const resAD = await sheets.spreadsheets.values.get({
//    spreadsheetId,
//    range: rangeAD,
//  });

//  const dataAtoZ = resAtoZ.data.values || [];
//  const dataAD = resAD.data.values || [];
//  const combinedData = dataAtoZ.map((row, i) => {
//    const adValue = dataAD[i] ? dataAD[i][0] : null;
//    return [...row, adValue];
//  });
