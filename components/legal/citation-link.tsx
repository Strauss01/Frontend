import Link from "next/link";

export function CitationLink({ citation }: any) {
  return (
    <Link href={citation.url || "#"} className="text-blue-400 underline">
      {citation.citation}
    </Link>
  );
}