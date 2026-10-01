import Link from "next/link";

export const metadata = { title: "Halaman tidak ditemukan" };

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center px-6 pt-24">
      <div className="mx-auto w-full max-w-lg rounded-2xl bg-indigo-deep p-8 text-white">
        <p className="panel-label text-white/70">Ringkasan halaman</p>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/6 p-4"><dt className="text-xs text-white/70">Status</dt><dd className="metric mt-1 text-4xl">404</dd></div>
          <div className="rounded-xl bg-white/6 p-4"><dt className="text-xs text-white/70">Ditemukan</dt><dd className="metric mt-1 text-4xl">0</dd></div>
        </dl>
        <h1 className="mt-6 text-2xl font-extrabold text-white">Halaman ini tidak ada di katalog</h1>
        <p className="mt-2 leading-relaxed text-white/75">Mungkin alamatnya salah ketik, atau templatenya sudah berganti nama.</p>
        <Link href="/#template" className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 font-semibold text-indigo-deep hover:bg-mist-2">Ke katalog</Link>
      </div>
    </main>
  );
}
