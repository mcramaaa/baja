"use client";

// pages/terbilang.js
import { useState } from "react";

export default function TerbilangPage() {
  const [angka, setAngka] = useState("");
  const [terbilang, setTerbilang] = useState("");
  const [copied, setCopied] = useState(false);

  const angkaToTerbilang = (n: any) => {
    const satuan = [
      "",
      "Satu",
      "Dua",
      "Tiga",
      "Empat",
      "Lima",
      "Enam",
      "Tujuh",
      "Delapan",
      "Sembilan",
      "Sepuluh",
      "Sebelas",
    ];

    const konversi = (angka: any): string => {
      angka = parseInt(angka);
      if (isNaN(angka)) return "";
      if (angka < 12) return satuan[angka];
      else if (angka < 20) return konversi(angka - 10) + " Belas";
      else if (angka < 100)
        return (
          konversi(Math.floor(angka / 10)) + " Puluh " + konversi(angka % 10)
        );
      else if (angka < 200) return "Seratus " + konversi(angka - 100);
      else if (angka < 1000)
        return (
          konversi(Math.floor(angka / 100)) + " Ratus " + konversi(angka % 100)
        );
      else if (angka < 2000) return "Seribu " + konversi(angka - 1000);
      else if (angka < 1000000)
        return (
          konversi(Math.floor(angka / 1000)) + " Ribu " + konversi(angka % 1000)
        );
      else if (angka < 1000000000)
        return (
          konversi(Math.floor(angka / 1000000)) +
          " Juta " +
          konversi(angka % 1000000)
        );
      else return "Angka terlalu besar";
    };

    return konversi(n).replace(/\s+/g, " ").trim() + " Rupiah";
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setTerbilang(angkaToTerbilang(angka.replace(/\./g, "")));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(terbilang);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Gagal menyalin teks!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Konversi Angka ke Terbilang</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Masukkan angka (contoh: 29.225.000)"
          value={angka}
          onChange={(e) => setAngka(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Konversi
        </button>
      </form>
      {terbilang && (
        <div className="mt-6 text-center">
          <p className="text-gray-700 font-semibold">Hasil:</p>
          <p className="mt-1 text-lg italic">{terbilang}</p>
          <button
            onClick={handleCopy}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {copied ? "✅ Disalin!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
