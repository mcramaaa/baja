import { convertCustomDate, convertToNumber } from "@/helper/convert";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./key.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

async function readHutang() {
  const spreadsheetId = "1frEsU9GKhi0CGJng_K0Wf5wZW-4GvMDWz2T8cCULVes";
  const rangeAtoZ = "HUTANG BY ORDER!A3:AA";
  // const rangeAD = "HUTANG BY ORDER!AD3:AD";

  try {
    const resAtoZ = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: rangeAtoZ,
    });
    // const resAD = await sheets.spreadsheets.values.get({
    //   spreadsheetId,
    //   range: rangeAD,
    // });

    const dataAtoZ = resAtoZ.data.values || [];
    // const dataAD = resAD.data.values || [];
    const data = dataAtoZ
      .filter((data) => data[2] !== "")
      .map((data, i) => ({
        id: i + 1,
        po: data[2],
        sub: data[3],
        poDate: convertCustomDate(data[4]),
        name: data[5],
        inv: data[8],
        invDate: convertCustomDate(data[9]),
        rangeDay: +data[11],
        dueDate: convertCustomDate(data[12]),
        overDue: data[18],
        bill: convertToNumber(data[18]),
        totBill: convertToNumber(data[19]),
        payment: convertToNumber(data[20]),
        totPayment: convertToNumber(data[21]),
        paymentDate: convertCustomDate(data[13]),
        billRemaning:
          convertToNumber(data[18]) - convertToNumber(data[20]) <= 1
            ? 0
            : convertToNumber(data[18]) - convertToNumber(data[20]),
        status: data[24],
        // billingStatus: dataAD[i]?.at(0),
      }));
    return data;
  } catch (err) {
    throw err;
  }
}

export default readHutang;
