export function CitationStatusBadge({ status }: any) {
  const map: any = {
    overruled: "bg-red-500/20 text-red-300",
    distinguished: "bg-yellow-500/20 text-yellow-300",
    good_law: "bg-green-500/20 text-green-300",
    unknown: "bg-gray-500/20 text-gray-300",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${map[status]}`}>
      {status}
    </span>
  );
}