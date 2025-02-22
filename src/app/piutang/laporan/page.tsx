import { getPiutang } from "@/lib/getPiutang";

export default async function PiutangPage({ searchParams }: any) {
  console.log(searchParams);

  const res = await getPiutang();

  console.log(searchParams);

  return (
    <div>
      {/* <ClientPiutang piutangData={piutangData} /> */}
      tes
    </div>
  );
}
