import { TrioMark } from "@/components/ui/mark";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-32" role="status" aria-label="Chargement">
      <TrioMark className="h-6 w-9 animate-pulse text-brass" />
    </div>
  );
}
