import TableWithSearch from "@/app/components/TableWithSearch";

export default async function Dashboard() {
  return (
    <div>
      {/* <h1 className="m-3">รายการเอกสารในระบบ</h1> */}
      <TableWithSearch />
    </div>
  );
}
