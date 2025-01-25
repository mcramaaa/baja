"use client";

import { useEffect, useState } from "react";

export default function Piutang() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSpreadsheet() {
      try {
        const response = await fetch("/api/spreadsheet");
        console.log(response);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setData(result.rows);
      } catch (error: any) {
        setError(error.message);
      }
    }

    fetchSpreadsheet();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {data.map((row, index) => (
            <li key={index}>{JSON.stringify(row)}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
