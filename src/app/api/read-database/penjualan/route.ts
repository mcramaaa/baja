// app/api/piutang/route.ts
import readPenjualan from "@/lib/readPenjualan";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Logika untuk mengambil data piutang
    const data = await readPenjualan();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data piutang" },
      { status: 500 }
    );
  }
}
