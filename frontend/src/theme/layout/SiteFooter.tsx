import type { SiteFooterProps } from "@/lib/theme-contract";

/** Pie de Voxel3D: acero perforado con la línea de acento arriba. */
export function SiteFooter({ storeName, demoNotice }: SiteFooterProps) {
  const [label, ...rest] = demoNotice.split(":");
  return (
    <footer className="decor-perforated decor-line-top">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-6 gap-y-2.5 px-4 py-4.5 font-label font-medium tracking-[1px] text-on-header uppercase">
        <p>© {storeName} · Impreso en 3D</p>
        <p>
          {rest.length > 0 ? (
            <>
              <strong className="font-bold text-accent-text">{label}:</strong>
              {rest.join(":")}
            </>
          ) : (
            demoNotice
          )}
        </p>
      </div>
    </footer>
  );
}
