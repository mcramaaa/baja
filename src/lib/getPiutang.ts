export async function getPiutang() {
  await fetch("http://localhost:3000/api/piutang")
    .then((res) => res.json())
    .then((data) => {
      const uniqueCustomers = Array.from(
        new Map(
          data.map((item: { name: string }) => [
            item.name,
            { label: item.name, value: item.name },
          ])
        ).values()
      );
      console.log(uniqueCustomers);
    });
}

//   setIsLoading(true, "Mengambil data");
// setIsPiutang(data);
// setIsOptions((prev) => ({
//   ...prev,
//   company: uniqueCustomers as { label: string; value: string }[],
// }));
// setIsLoading(false);
