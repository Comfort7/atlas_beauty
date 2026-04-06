import Link from "next/link";

type Props = {
  backHref: string;
  backLabel: string;
};

export default function AdminStorefrontBar({ backHref, backLabel }: Props) {
  return (
    <div className="fixed left-0 right-0 top-[4.5rem] z-40 flex items-center justify-between gap-4 border-b border-primary/30 bg-primary px-6 py-2.5 text-on-primary shadow-md">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-90"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        {backLabel}
      </Link>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">Admin preview</span>
    </div>
  );
}
