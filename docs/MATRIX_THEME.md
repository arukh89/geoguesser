# Matrix Theme (Global UI)

Catatan: Jangan pakai gambar/logo resmi Matrix (hindari pelanggaran IP). Gunakan estetika generik: hijau‑neon, monospace, digital‑rain, glitch/scanline. Implementasi disarankan sebagai theme "matrix" via CSS variables + Tailwind utility classes.

## Fondasi Design System (CSS Variables + Font)

Tambahkan variables di global stylesheet (mis. `src/app/globals.css`) dan bungkus semua gaya di `[data-theme="matrix"]` agar bisa toggle.

Palet warna (sesuaikan jika terlalu menyala di layar terang):
```
--bg: #000000
--bg-alt: #0a0a0a
--panel: #0b0f0b
--grid: #0d0d0d
--text: #d7ffd7
--muted: #9fffb1
--accent: #00ff41
--accent-2: #00b33c
--ring: #00ff41
--error: #ff3d3d
--warning: #ccff00
--shadow: 0 0 24px rgba(0,255,65,0.25)
```

Typography:
- Gunakan `next/font/google` untuk font monospace “Share Tech Mono” atau “VT323”, fallback “JetBrains Mono”.
- Heading tetap monospace, sedikit letter‑spacing, smallcaps opsional.

Global base:
- `html[data-theme="matrix"] body`: bg #000, text warna var(--text)
- selection: background rgba(0,255,65,0.25), color var(--accent)
- scrollbar: tipis, thumb var(--accent) dengan opacity rendah

## Mapping Tailwind (tanpa utak‑atik config besar)

Gunakan arbitrary values:
- background: `bg-[var(--bg)]`, `bg-[var(--panel)]`
- text: `text-[var(--text)]`, `text-[var(--accent)]`
- border/ring: `border-[var(--accent)]/10`, `ring-[var(--ring)]`
- shadow: `shadow-[var(--shadow)]`

Tips:
- State hover/active gunakan overlay: `hover:bg-[color:rgba(0,255,65,0.06)]`
- Divider: `border-t border-[color:rgba(0,255,65,0.15)]`

## Tema Global Layout

Di `layout.tsx`:
- Tambahkan `data-theme="matrix"` pada `<html>`.
- Set meta `theme-color: #000000`.
- Body background layers: pure black + radial‑gradient halus (#001b08 → transparent) + noise/grain tipis (PNG 2–4% opacity). Opsional: grid halus (linear‑gradient 1px) opacity 4–6%.

Header/Footer:
- Border bottom/top 1px rgba(0,255,65,0.2), shadow var(--shadow)
- Title beri efek “glow” kecil dan glitch saat hover

## Animasi Khas Matrix

Digital Rain (pilih satu):
- Canvas/JS `<MatrixRain />` (kolom karakter jatuh acak, tail fade)
- CSS‑only (pseudo elements + keyframes translateY, multi‑layer)

Glitch Text:
- Keyframes offset text‑shadow + clip‑path + skew/translate kecil (1.2–1.6s linear, ulang acak; bisa dibantu framer‑motion)

Scanline & CRT:
- Overlay repeating‑linear‑gradient(transparent 0 1px, rgba(0,255,65,0.02) 1px 2px)
- Animasi scanline vertical lambat (translateY loop)

## Tipografi

Gunakan font monospace untuk semua teks.

Heading:
- `text-[var(--accent)]`, `tracking-wide`, uppercase opsional, text‑shadow hijau tipis

Body:
- `text-[var(--text)]`, `leading-relaxed`

Link:
- `text-[var(--accent)] hover:underline underline-offset-4 decoration-[var(--accent)]`

## Komponen Inti

Button (primary/ghost/icon):
- Base: `inline-flex items-center gap-2 rounded border border-[rgba(0,255,65,0.3)] text-[var(--accent)] bg-transparent px-4 py-2`
- Hover: `bg-[rgba(0,255,65,0.06)] shadow-[var(--shadow)]`
- Active: `translate-y-[1px] ring-1 ring-[var(--ring)]`
- “Glitch”: pseudo `::before/::after` offset hijau + blending saat hover

Input / Textarea / Select:
- `bg-transparent border-[rgba(0,255,65,0.25)] caret-[var(--accent)]`
- `placeholder:text-[color:rgba(151,255,151,0.6)]`
- `focus:ring-2 ring-[var(--ring)] outline-none`

Tabs:
- Container: `border-b border-[rgba(0,255,65,0.2)]`
- Tab: `text-[var(--muted)] hover:text-[var(--accent)]`
- Active indicator: bottom bar 2px var(--accent) + glow

Card/Panel:
- `bg-[var(--panel)]/90 border border-[rgba(0,255,65,0.18)] rounded-lg shadow-[var(--shadow)]`
- Header dengan subtle grid overlay

Modal/Drawer:
- Backdrop `bg-black/70` dengan noise
- Panel: seperti Card, `ring-1 ring-[rgba(0,255,65,0.3)]`

Tooltip/Popover:
- `bg-[var(--panel)] text-[var(--text)] border-[rgba(0,255,65,0.25)]`

Toast:
- Success: border/text var(--accent)
- Error: border/text var(--error)

Icons (lucide):
- `stroke-[var(--accent)]/80 hover:stroke-[var(--accent)]`

## Gambar, Ilustrasi, dan Asset

- Ganti ilustrasi hero dengan pola abstrak “code rain” (SVG/PNG generatif)
- Terapkan tint hijau (filter `hue-rotate/saturate`)
- Placeholder img: grid/noise hijau

## Loading & Skeleton States

Loader `<MatrixLoader />`:
- Mini digital rain + teks seperti “Initializing nodes…”, “Decrypting…”.

Skeleton:
- `bg-[color:rgba(0,255,65,0.06)] animate-pulse` (matikan pada reduced‑motion)

Page transitions:
- Framer Motion: fade in + slight y translate (200–250ms)

## Halaman Spesifik Proyek

Home:
- Hero title glitch subtle, CTA Button gaya Matrix, background overlay digital rain ringan

Game Screen (Panorama + Map):
- Panorama overlay: gradient transparan → hijau lembut + scanline
- HUD panel: Card/Panel Matrix
- Map: gunakan tile gelap (misal Carto Dark Matter atau Stadia Alidade Smooth Dark; sertakan attribution)
- Marker: tebak = lingkaran kontur var(--accent); jawaban = solid var(--accent-2)
- Polyline hasil: stroke var(--accent) opacity 0.75 + glow

Results/Final:
- Kartu skor dengan border neon; bar/label hijau; tombol “Play again” bergaya glitch

Leaderboard:
- Tabel zebra: `hover:bg-[rgba(0,255,65,0.05)]`; angka rata kanan; header uppercase monospace

Tabs/Navigation:
- Active tab: garis bawah neon + `text-[var(--accent)]`

## Kolom/Grids/Layout

- Gunakan grid/columns Tailwind; vertical divider tipis: `after:content-[''] after:w-px after:bg-[rgba(0,255,65,0.15)]`
- Section headers: `border-l-2 border-[var(--accent)] pl-4`

## States & Feedback

- Focus-visible: `ring-2 ring-[var(--ring)] offset-2`
- Error: `text-[#ff3d3d] border-[#ff3d3d]/40`
- Warning: `text-[#ccff00] border-[#ccff00]/40`
- Disabled: `opacity-60 cursor-not-allowed` tanpa animasi

## Preferensi Reduced Motion & A11y

- `@media (prefers-reduced-motion: reduce)`: matikan glitch/scanline/rain → fallback fade sederhana
- Kontras minimal 4.5:1 untuk teks utama
- Hit area tombol ≥ 40px

## Kinerja

- Digital rain: limit FPS, kolom sesuai lebar; gunakan `will-change: transform`
- Lazy‑load komponen animasi di bawah fold
- Hindari `backdrop-filter` berat; pakai overlay gradient + noise

## Toggle & Arsitektur Tema

- Simpan tema di `data-theme` pada `<html>`: "matrix"
- Sediakan toggle runtime untuk menonaktifkan efek berat (rain/glitch)
- Struktur opsional: `MatrixProvider` untuk `intensity`, `density`, `glitchProbability`

## Urutan Implementasi (praktis)

1. Pasang font monospace via next/font + inject `data-theme="matrix"` + set CSS variables
2. Terapkan base body/bg, selection, scrollbar
3. Update Button, Input, Tabs, Card (komponen paling sering)
4. Tambahkan `MatrixLoader` dan ganti semua loading state
5. Tambahkan `MatrixRain` ringan di Home dan background Game
6. Map dark tiles + marker neon + polyline glow
7. Panorama overlay (scanline + gradient)
8. Poles halaman Results/Leaderboard
9. A11y + prefers-reduced-motion + test snapshot
10. Fine‑tune warna/kontras berdasarkan review

## Contoh Kelas Util (copy‑paste cepat)

- Button: `inline-flex items-center gap-2 rounded border border-[rgba(0,255,65,0.3)] px-4 py-2 text-[var(--accent)] hover:bg-[rgba(0,255,65,0.06)] ring-1 ring-transparent hover:ring-[var(--ring)] shadow-[var(--shadow)] transition`
- Input: `bg-transparent text-[var(--text)] placeholder:text-[rgba(151,255,151,0.6)] border border-[rgba(0,255,65,0.25)] focus:outline-none focus:ring-2 ring-[var(--ring)] px-3 py-2 rounded`
- Card: `bg-[var(--panel)]/90 border border-[rgba(0,255,65,0.18)] rounded-lg shadow-[var(--shadow)]`
- Tabs active indicator: `after:content-[''] after:absolute after:-bottom-px after:left-0 after:h-[2px] after:w-full after:bg-[var(--accent)] after:shadow-[0_0_10px_#00ff41]`

## Testing & Review

- Update visual snapshot tests setelah tema diterapkan
- Periksa kontras dan readability (khusus angka kecil di map/results)
- Minta feedback intensitas glow/animasi (kadang terlalu kuat)
