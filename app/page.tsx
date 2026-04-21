"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";

type ImageItem = {
  id: string;
  src: string;
  rotation: number;
  flip: boolean;
};

function useHtmlImages(items: ImageItem[]) {
  const [loadedImages, setLoadedImages] = useState<
    (ImageItem & { image: HTMLImageElement })[]
  >([]);

  useMemo(() => {
    const imageElements = items.map((item) => {
      const img = new window.Image();
      img.src = item.src;
      return { ...item, image: img };
    });

    let loadedCount = 0;

    imageElements.forEach((item) => {
      if (item.image.complete) {
        loadedCount += 1;
        if (loadedCount === imageElements.length) setLoadedImages([...imageElements]);
      } else {
        item.image.onload = () => {
          loadedCount += 1;
          if (loadedCount === imageElements.length) setLoadedImages([...imageElements]);
        };
      }
    });

    if (imageElements.length === 0) setLoadedImages([]);
  }, [items]);

  return loadedImages;
}

function fitImage(iw: number, ih: number, mw: number, mh: number) {
  const r = Math.min(mw / iw, mh / ih);
  return { width: iw * r, height: ih * r };
}

/* ── Upload Zone ─────────────────────────────────────────────── */
function UploadZone({
  id,
  onChange,
  count,
  max,
  accentColor,
  accentDim,
  note,
}: {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  count: number;
  max: number;
  accentColor: string;
  accentDim: string;
  note: string;
}) {
  const pct = Math.round((count / max) * 100);

  return (
    <div
      className="upload-zone"
      onClick={() => document.getElementById(id)?.click()}
      style={count > 0 ? { borderColor: accentColor, background: accentDim } : {}}
    >
      <input type="file" accept="image/*" multiple onChange={onChange} id={id} style={{ display: "none" }} />

      <div style={{ fontSize: 32, marginBottom: 8 }}>
        {count > 0 ? "✅" : "📂"}
      </div>

      <p style={{ margin: 0, fontSize: 14, color: count > 0 ? "var(--text-sub)" : "var(--muted)" }}>
        {count > 0
          ? `${count} 枚の画像が選択されています`
          : `クリックして画像を選択（最大 ${max} 枚）`}
      </p>

      {count > 0 && (
        <>
          <div className="progress-track" style={{ width: "100%", maxWidth: 260, margin: "10px auto 0" }}>
            <div
              className="progress-fill"
              style={{ width: `${pct}%`, background: accentColor }}
            />
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--muted)" }}>
            {count} / {max} 枚
          </p>
        </>
      )}

      <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--muted)" }}>{note}</p>
    </div>
  );
}

/* ── Canvas Block ────────────────────────────────────────────── */
function CanvasBlock({
  title,
  dlLabel,
  dlClass,
  onDownload,
  width,
  height,
  children,
}: {
  title: string;
  dlLabel: string;
  dlClass: string;
  onDownload: () => void;
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  return (
    <div className="canvas-block">
      <div className="canvas-titlebar">
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-sub)" }}>{title}</span>
        <button className={`dl-btn ${dlClass}`} onClick={onDownload}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {dlLabel}
        </button>
      </div>
      <div className="canvas-scroll">
        <div style={{ width, lineHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Section Header ──────────────────────────────────────────── */
function SectionHeader({
  letter,
  title,
  color,
  dimColor,
}: {
  letter: string;
  title: string;
  color: string;
  dimColor: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
      <div className="section-dot" style={{ background: dimColor, color }}>
        {letter}
      </div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{title}</h2>
    </div>
  );
}

/* ── Theme Toggle ────────────────────────────────────────────── */
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label="テーマ切替">
      <span style={{ fontSize: 16, lineHeight: 1 }}>{dark ? "☀️" : "🌙"}</span>
      {dark ? "ライトモード" : "ダークモード"}
    </button>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function Home() {
  const [dark, setDark] = useState(true);
  const [images13, setImages13] = useState<ImageItem[]>([]);
  const [images7, setImages7] = useState<ImageItem[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const stageRef9 = useRef<any>(null);
  const stageRef4 = useRef<any>(null);
  const stageRef7 = useRef<any>(null);

  const loadedImages13 = useHtmlImages(images13);
  const loadedImages7 = useHtmlImages(images7);

  // ── layout config (unchanged logic) ──────────────────────────
  const orderPage1 = [7, 2, 8, 4, 12, 6, 3, 9, 5];
  const orderPage2 = [11, 0, 10, 1];
  const rotP1: Record<number, number> = { 0: 90 };
  const rotP2: Record<number, number> = { 10: 180, 11: 180 };
  const flipP12: Record<number, boolean> = { 7: true, 8: true, 10: true, 11: true };

  const orderPage7 = [0, 6, 3, 1, 4, 5, 2];
  const rotP7: Record<number, number> = { 0: 0, 5: 180, 6: 180 };
  const flipP7: Record<number, boolean> = { 5: true, 6: true };

  const slots9 = [
    { x: 310, y: 210 }, { x: 700, y: 210 }, { x: 1090, y: 210 },
    { x: 310, y: 490 }, { x: 700, y: 490 }, { x: 1090, y: 490 },
    { x: 310, y: 770 }, { x: 700, y: 770 }, { x: 1090, y: 770 },
  ];
  const slots4 = [
    { x: 420, y: 300 }, { x: 980, y: 300 },
    { x: 420, y: 700 }, { x: 980, y: 700 },
  ];
  const slots7 = [
    { x: 320, y: 210, width: 280, height: 340 },
    { x: 700, y: 210, width: 380, height: 280 },
    { x: 320, y: 500, width: 380, height: 280 },
    { x: 700, y: 500, width: 380, height: 280 },
    { x: 1080, y: 500, width: 380, height: 280 },
    { x: 700, y: 800, width: 380, height: 280 },
    { x: 1080, y: 800, width: 380, height: 280 },
  ];

  const handleChange13 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 13);
    setImages13(files.map((f, i) => ({
      id: `13-${f.name}-${i}`, src: URL.createObjectURL(f), rotation: 0, flip: false,
    })));
  };
  const handleChange7 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 7);
    setImages7(files.map((f, i) => ({
      id: `7-${f.name}-${i}`, src: URL.createObjectURL(f), rotation: 0, flip: false,
    })));
  };

  const dl = (ref: React.RefObject<any>, filename: string) => () => {
    const uri = ref.current?.toDataURL({ pixelRatio: 2, mimeType: "image/jpeg" });
    if (!uri) return;
    const a = document.createElement("a");
    a.download = filename; a.href = uri;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: 80 }}>

      {/* ── Header ── */}
      <header style={{
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--border)",
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        gap: 18,
        transition: "background 0.25s, border-color 0.25s",
      }}>
        <img
          src="/new-rogo.jpg"
          alt="logo"
          style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", border: "1px solid var(--border)" }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>
            画像を勝手にレイアウトしてもらいまSHOW
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--muted)" }}>
            画像をアップロード → 自動でレイアウト → JPEG でダウンロード
          </p>
        </div>
        <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} />
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1500, margin: "0 auto", padding: "40px 32px", display: "flex", flexDirection: "column", gap: 40 }}>

        {/* Section A */}
        <div className="section-card">
          <SectionHeader letter="A" title="大人用レイアウト（13枚）" color="var(--blue)" dimColor="var(--blue-dim)" />

          <UploadZone
            id="upload13"
            onChange={handleChange13}
            count={images13.length}
            max={13}
            accentColor="var(--blue)"
            accentDim="var(--blue-dim)"
            note="9枚レイアウト＋4枚レイアウトの2種類を生成します"
          />

          <CanvasBlock
            title="3×3 グリッド（9枚）"
            dlLabel="9枚版をダウンロード"
            dlClass="dl-btn-blue"
            onDownload={dl(stageRef9, "layout-9.jpg")}
            width={1400}
            height={980}
          >
            <Stage ref={stageRef9} width={1400} height={980}>
              <Layer>
                <Rect x={0} y={0} width={1400} height={980} fill="white" />
                {orderPage1.map((idx, si) => {
                  const item = loadedImages13[idx];
                  const slot = slots9[si];
                  if (!item || !slot) return null;
                  const nw = item.image.naturalWidth || item.image.width || 1;
                  const nh = item.image.naturalHeight || item.image.height || 1;
                  const f = fitImage(nw, nh, 360, 270);
                  return (
                    <KonvaImage key={`p1-${item.id}`} image={item.image}
                      x={slot.x} y={slot.y} width={f.width} height={f.height}
                      offsetX={f.width / 2} offsetY={f.height / 2}
                      rotation={rotP1[idx] ?? 0} scaleX={flipP12[idx] ? -1 : 1} scaleY={1} />
                  );
                })}
              </Layer>
            </Stage>
          </CanvasBlock>

          <CanvasBlock
            title="2×2 グリッド（4枚）"
            dlLabel="4枚版をダウンロード"
            dlClass="dl-btn-green"
            onDownload={dl(stageRef4, "layout-4.jpg")}
            width={1400}
            height={980}
          >
            <Stage ref={stageRef4} width={1400} height={980}>
              <Layer>
                <Rect x={0} y={0} width={1400} height={980} fill="white" />
                {orderPage2.map((idx, si) => {
                  const item = loadedImages13[idx];
                  const slot = slots4[si];
                  if (!item || !slot) return null;
                  const nw = item.image.naturalWidth || item.image.width || 1;
                  const nh = item.image.naturalHeight || item.image.height || 1;
                  const f = fitImage(nw, nh, 520, 390);
                  return (
                    <KonvaImage key={`p2-${item.id}`} image={item.image}
                      x={slot.x} y={slot.y} width={f.width} height={f.height}
                      offsetX={f.width / 2} offsetY={f.height / 2}
                      rotation={rotP2[idx] ?? 0} scaleX={flipP12[idx] ? -1 : 1} scaleY={1} />
                  );
                })}
              </Layer>
            </Stage>
          </CanvasBlock>
        </div>

        {/* Section B */}
        <div className="section-card">
          <SectionHeader letter="B" title="子供用レイアウト（7枚）" color="var(--purple)" dimColor="var(--purple-dim)" />

          <UploadZone
            id="upload7"
            onChange={handleChange7}
            count={images7.length}
            max={7}
            accentColor="var(--purple)"
            accentDim="var(--purple-dim)"
            note="7枚の非対称レイアウトを生成します"
          />

          <CanvasBlock
            title="非対称レイアウト（7枚）"
            dlLabel="7枚版をダウンロード"
            dlClass="dl-btn-purple"
            onDownload={dl(stageRef7, "layout-7.jpg")}
            width={1400}
            height={980}
          >
            <Stage ref={stageRef7} width={1400} height={980}>
              <Layer>
                <Rect x={0} y={0} width={1400} height={980} fill="white" />
                {orderPage7.map((idx, si) => {
                  const item = loadedImages7[idx];
                  const slot = slots7[si];
                  if (!item || !slot) return null;
                  const nw = item.image.naturalWidth || item.image.width || 1;
                  const nh = item.image.naturalHeight || item.image.height || 1;
                  const f = fitImage(nw, nh, slot.width, slot.height);
                  return (
                    <KonvaImage key={`p7-${item.id}`} image={item.image}
                      x={slot.x} y={slot.y} width={f.width} height={f.height}
                      offsetX={f.width / 2} offsetY={f.height / 2}
                      rotation={rotP7[idx] ?? 0} scaleX={flipP7[idx] ? -1 : 1} scaleY={1} />
                  );
                })}
              </Layer>
            </Stage>
          </CanvasBlock>
        </div>

      </main>
    </div>
  );
}
