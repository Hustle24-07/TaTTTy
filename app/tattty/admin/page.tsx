import { DataTable, schema } from "@/components/data-table";

export default function Page() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<DataTable data={[]} />
		</div>
	);
}
