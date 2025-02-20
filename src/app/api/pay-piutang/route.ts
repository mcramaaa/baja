import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const auth = new google.auth.GoogleAuth({
      keyFile: "./key.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1pxAHMxfqHWePa682WKzCOfEf9HRB0NKO6gTc8UlZVOE";

    //  Siapkan data untuk update
    const updateRequests = [];

    for (const item of payload) {
      const { id, billing, paymentMethod, installments } = item;

      const valuesToUpdate = [
        billing, // AE - Status Penagihan
        paymentMethod, // AF - Metode Pembayaran
        installments[0]?.amount || "", // AH - Nominal Bayar 1
        installments[0]?.date || "", // AI - Tanggal Bayar 1
        installments[1]?.amount || "", // AJ - Nominal Bayar 2
        installments[1]?.date || "", // AK - Tanggal Bayar 2
        installments[2]?.amount || "", // AL - Nominal Bayar 3
        installments[2]?.date || "", // AM - Tanggal Bayar 3
      ];

      // Tambahkan ke batch update
      updateRequests.push({
        range: `PIUTANG2!AE${id}:AM${id}`,
        values: [valuesToUpdate],
      });
    }

    // Kirim batch update jika ada data
    if (updateRequests.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: "RAW",
          data: updateRequests,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil diperbarui!",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Terjadi kesalahan saat mengupdate data.",
    });
  }
}
