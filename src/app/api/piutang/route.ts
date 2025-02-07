// app/api/piutang/route.ts
import readPiutang from "@/lib/readPiutang";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Logika untuk mengambil data piutang
    const data = await readPiutang();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data piutang" },
      { status: 500 }
    );
  }
}
