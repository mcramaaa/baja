import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

export default async function handler({ req, res }: any) {
  console.log(res);
  const serviceAuth = new JWT({
    email: process.env.CLIENT_EMAIL,
    key: process.env.PRIVATE_KEY, // Pastikan PRIVATE_KEY diproses dengan benar
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  try {
    const doc = new GoogleSpreadsheet(
      "1pxAHMxfqHWePa682WKzCOfEf9HRB0NKO6gTc8UlZVOE",
      serviceAuth
    );

    await doc.loadInfo(); // Memuat metadata spreadsheet
    const sheet = doc.sheetsByIndex[0]; // Akses sheet pertama
    const rows = await sheet.getRows(); // Ambil semua baris data

    res.status(200).json({ rows });
  } catch (error) {
    console.error("Error accessing spreadsheet:", error);
    res.status(500).json({ error: "Failed to fetch spreadsheet data" });
  }
}
