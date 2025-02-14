// app/api/piutang/route.ts
import readHutang from "@/lib/readHutang";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Logika untuk mengambil data piutang
    const data = await readHutang();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data piutang" },
      { status: 500 }
    );
  }
}
