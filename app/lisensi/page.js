import Link from 'next/link';
import { BOLEH, LISENSI, SITE, rp } from '@/lib/template';

export const metadata = {
  title: 'Lisensi & Harga',
  description: 'Tiga lisensi template SanzyHub: pakai sendiri, disesuaikan, atau disesuaikan sekaligus dipasang dengan domain dan hosting setahun. Satu harga per usaha, tanpa langganan.',
  alternates: { canonical: `${SITE}/lisensi` },
};

export default function Lisensi() {
  return (
    <main className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-6xl">
        <p className="panel-label text-signal-up">Lisensi & harga</p>
        <h1 className="mt-4 max-w-3xl text-[2.7rem] leading-[1.02] font-extrabold text-indigo-deep md:text-6xl">Bayar sekali per usaha</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed">Setiap lisensi berlaku untuk satu usaha atau satu klien. Pembaruan keamanan Next.js untuk template yang sama gratis selama setahun.</p>

        <div className="relative mt-12 overflow-x-auto rounded-2xl bg-white ring-1 ring-indigo-deep/8" tabIndex={0} role="region" aria-label="Tabel perbandingan lisensi">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">Perbandingan tiga lisensi template SanzyHub</caption>
            <thead>
              <tr className="border-b border-indigo-deep/10">
                <td className="p-6" />
                {LISENSI.map((l) => (
                  <th key={l.nama} scope="col" className={`p-6 align-top ${l.unggul ? 'bg-indigo-deep text-white' : 'text-indigo-deep'}`}>
                    <span className="block text-lg font-bold">{l.nama}</span>
                    <span className="metric mt-2 block text-3xl">{rp(l.harga)}</span>
                    <span className={`mt-2 block text-sm font-normal leading-relaxed ${l.unggul ? 'text-white/75' : 'text-steel'}`}>{l.ket}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LISENSI[0].isi.map(([k], i) => (
                <tr key={k} className="border-b border-indigo-deep/8 last:border-0">
                  <th scope="row" className="p-5 text-sm font-semibold text-indigo-deep">{k}</th>
                  {LISENSI.map((l) => (
                    <td key={l.nama} className={`p-5 text-center ${l.unggul ? 'bg-indigo-deep/4' : ''}`}>
                      {l.isi[i][1] ? <span className="font-bold text-signal-up">✓<span className="sr-only"> termasuk</span></span> : <span className="text-steel">—<span className="sr-only"> tidak termasuk</span></span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {BOLEH.map(([j, isi], i) => (
            <section key={j} aria-labelledby={`b-${i}`} className="rounded-2xl bg-white p-7 ring-1 ring-indigo-deep/8">
              <h2 id={`b-${i}`} className={`text-2xl font-bold ${i ? 'text-[#a3281f]' : 'text-[#1f6b45]'}`}>{j}</h2>
              <ul className="mt-4 space-y-3">
                {isi.map((x) => <li key={x} className="flex gap-3"><span aria-hidden="true" className={`font-bold ${i ? 'text-[#a3281f]' : 'text-[#1f6b45]'}`}>{i ? '×' : '✓'}</span>{x}</li>)}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl bg-indigo-deep p-8 text-white sm:flex-row sm:items-center">
          <p className="max-w-xl text-lg leading-relaxed">Belum yakin template mana? Semua demo live dan bisa dicoba tanpa daftar.</p>
          <Link href="/#template" className="shrink-0 rounded-lg bg-white px-6 py-3.5 font-semibold text-indigo-deep hover:bg-mist-2">Lihat katalog</Link>
        </div>
        <p className="mt-6 text-sm">SanzyHub adalah toko fiktif; harga di halaman ini contoh purwarupa desain dan tidak ada transaksi yang bisa dilakukan.</p>
      </div>
    </main>
  );
}
