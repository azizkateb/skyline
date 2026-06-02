import { Navbar } from "@/components/navbar";

const samples = [
  { label: "text-hero (72–96px, 700)", cls: "text-hero" },
  { label: "text-section (48–64px, 600)", cls: "text-section" },
  { label: "text-subtitle (18–22px, 400)", cls: "text-subtitle" },
  { label: "text-body (16px, 400)", cls: "text-body" },
  { label: "text-label (12–14px, 500)", cls: "text-label uppercase tracking-widest" },
  { label: "text-nav (15px, 500)", cls: "text-nav" },
  { label: "text-button (15px, 600)", cls: "text-button" },
]

export default function Demo() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <Navbar />
      <div className="flex flex-col gap-6 pt-20">
        <h2 className="text-section">Type Scale — Glide Orwate</h2>
        <p className="text-subtitle text-gray-500">
          Every line below renders in <strong>Aligarh Arabic</strong> (bold, single-weight face).
          The weights shown are the declared CSS weights; the font has a single face, so the browser
          approximates where needed.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {samples.map((s) => (
            <div key={s.cls} className="flex flex-col gap-1">
              <span className="text-label text-gray-400">{s.label}</span>
              <span className={`${s.cls} text-gray-900`}>
                The quick brown fox jumps over the lazy dog.
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
