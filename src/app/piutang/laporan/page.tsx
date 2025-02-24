import ClientPiutang from "./ClientPiutang";

export default async function PiutangPage() {
  let resData = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/piutang`);
    resData = await res.json();
  } catch (error) {}

  return (
    <div>
      <ClientPiutang data={resData} />
    </div>
  );
}
