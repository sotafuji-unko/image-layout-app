"use client";

import { useMemo, useRef, useState } from "react";
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
        if (loadedCount === imageElements.length) {
          setLoadedImages([...imageElements]);
        }
      } else {
        item.image.onload = () => {
          loadedCount += 1;
          if (loadedCount === imageElements.length) {
            setLoadedImages([...imageElements]);
          }
        };
      }
    });

    if (imageElements.length === 0) setLoadedImages([]);
  }, [items]);

  return loadedImages;
}

function fitImage(
  imgWidth: number,
  imgHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
  return { width: imgWidth * ratio, height: imgHeight * ratio };
}

function UploadButton({
  id,
  onChange,
  count,
  max,
  label,
}: {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  count: number;
  max: number;
  label: string;
}) {
  return (
    <div className="upload-zone rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer"
      onClick={() => document.getElementById(id)?.click()}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        id={id}
        style={{ display: "none" }}
      />
      <div style={{ fontSize: 36 }}>📁</div>
      <p style={{ color: "#aaa", fontSize: 14 }}>
        クリックして画像を選択（最大 {max} 枚）
      </p>
      <div className="badge" style={{
        background: count > 0 ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.06)",
        color: count > 0 ? "#60a5fa" : "#888",
        border: `1px solid ${count > 0 ? "#2563eb" : "#333"}`,
      }}>
        {count > 0 ? `${count} 枚選択中` : "未選択"}
      </div>
      <p style={{ fontSize: 12, color: "#555" }}>{label}</p>
    </div>
  );
}

function DownloadButton({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`${className} text-white font-semibold rounded-xl cursor-pointer flex items-center gap-2`}
      style={{ padding: "12px 24px", fontSize: 15, border: "none" }}
    >
      <span>⬇</span>
      {label}
    </button>
  );
}

function SectionHeader({
  number,
  title,
  color,
}: {
  number: string;
  title: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: "bold", margin: 0 }}>{title}</h2>
    </div>
  );
}

export default function Home() {
  const [images13, setImages13] = useState<ImageItem[]>([]);
  const [images7, setImages7] = useState<ImageItem[]>([]);

  const stageRef9 = useRef<any>(null);
  const stageRef4 = useRef<any>(null);
  const stageRef7 = useRef<any>(null);

  const loadedImages13 = useHtmlImages(images13);
  const loadedImages7 = useHtmlImages(images7);

  const orderPage1 = [7, 2, 8, 4, 12, 6, 3, 9, 5];
  const orderPage2 = [11, 0, 10, 1];

  const rotationSettingsPage1: Record<number, number> = { 0: 90 };
  const rotationSettingsPage2: Record<number, number> = { 10: 180, 11: 180 };
  const flipSettings: Record<number, boolean> = { 7: true, 8: true, 10: true, 11: true };

  const orderPage7 = [0, 6, 3, 1, 4, 5, 2];
  const rotationSettingsPage7: Record<number, number> = { 0: 0, 5: 180, 6: 180 };
  const flipSettingsPage7: Record<number, boolean> = { 5: true, 6: true };

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
    setImages13(files.map((file, index) => ({
      id: `thirteen-${file.name}-${index}`,
      src: URL.createObjectURL(file),
      rotation: 0,
      flip: false,
    })));
  };

  const handleChange7 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 7);
    setImages7(files.map((file, index) => ({
      id: `seven-${file.name}-${index}`,
      src: URL.createObjectURL(file),
      rotation: 0,
      flip: false,
    })));
  };

  const makeDownloadHandler = (ref: React.RefObject<any>, filename: string) => () => {
    const uri = ref.current?.toDataURL({ pixelRatio: 2, mimeType: "image/jpeg" });
    if (!uri) return;
    const link = document.createElement("a");
    link.download = filename;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", padding: "0 0 80px" }}>

      {/* Header */}
      <header style={{
        background: "linear-gradient(180deg, #111 0%, #0d0d0d 100%)",
        borderBottom: "1px solid #222",
        padding: "24px 40px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginBottom: 48,
      }}>
        <img src="/new-rogo.jpg" alt="logo" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover" }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: "bold", margin: 0, color: "#f0f0f0" }}>
            画像を勝手にレイアウトしてもらいまSHOW
          </h1>
          <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0" }}>
            画像をアップロードして自動レイアウト → JPEG でダウンロード
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "0 40px", display: "flex", flexDirection: "column", gap: 48 }}>

        {/* Section A: 大人用 13 枚 */}
        <div className="section-card">
          <SectionHeader number="A" title="大人用レイアウト（13枚）" color="#2563eb" />

          <UploadButton
            id="upload13"
            onChange={handleChange13}
            count={images13.length}
            max={13}
            label="9枚レイアウト + 4枚レイアウトの2種類を生成します"
          />

          {/* 9-grid layout */}
          <div style={{ marginTop: 36 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: "600", color: "#aaa", margin: 0 }}>
                3×3 グリッド（9枚）
              </h3>
              <DownloadButton
                onClick={makeDownloadHandler(stageRef9, "layout-9.jpg")}
                label="ダウンロード"
                className="btn-primary"
              />
            </div>
            <div className="canvas-wrapper" style={{ background: "#111", width: "fit-content" }}>
              <Stage ref={stageRef9} width={1400} height={980}>
                <Layer>
                  <Rect x={0} y={0} width={1400} height={980} fill="white" />
                  {orderPage1.map((imageIndex, slotIndex) => {
                    const item = loadedImages13[imageIndex];
                    const slot = slots9[slotIndex];
                    if (!item || !slot) return null;
                    const nw = item.image.naturalWidth || item.image.width || 1;
                    const nh = item.image.naturalHeight || item.image.height || 1;
                    const fitted = fitImage(nw, nh, 360, 270);
                    return (
                      <KonvaImage
                        key={`page1-${item.id}`}
                        image={item.image}
                        x={slot.x} y={slot.y}
                        width={fitted.width} height={fitted.height}
                        offsetX={fitted.width / 2} offsetY={fitted.height / 2}
                        rotation={rotationSettingsPage1[imageIndex] ?? 0}
                        scaleX={flipSettings[imageIndex] ? -1 : 1}
                        scaleY={1}
                      />
                    );
                  })}
                </Layer>
              </Stage>
            </div>
          </div>

          {/* 4-grid layout */}
          <div style={{ marginTop: 36 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: "600", color: "#aaa", margin: 0 }}>
                2×2 グリッド（4枚）
              </h3>
              <DownloadButton
                onClick={makeDownloadHandler(stageRef4, "layout-4.jpg")}
                label="ダウンロード"
                className="btn-success"
              />
            </div>
            <div className="canvas-wrapper" style={{ background: "#111", width: "fit-content" }}>
              <Stage ref={stageRef4} width={1400} height={980}>
                <Layer>
                  <Rect x={0} y={0} width={1400} height={980} fill="white" />
                  {orderPage2.map((imageIndex, slotIndex) => {
                    const item = loadedImages13[imageIndex];
                    const slot = slots4[slotIndex];
                    if (!item || !slot) return null;
                    const nw = item.image.naturalWidth || item.image.width || 1;
                    const nh = item.image.naturalHeight || item.image.height || 1;
                    const fitted = fitImage(nw, nh, 520, 390);
                    return (
                      <KonvaImage
                        key={`page2-${item.id}`}
                        image={item.image}
                        x={slot.x} y={slot.y}
                        width={fitted.width} height={fitted.height}
                        offsetX={fitted.width / 2} offsetY={fitted.height / 2}
                        rotation={rotationSettingsPage2[imageIndex] ?? 0}
                        scaleX={flipSettings[imageIndex] ? -1 : 1}
                        scaleY={1}
                      />
                    );
                  })}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #222" }} />

        {/* Section B: 子供用 7 枚 */}
        <div className="section-card">
          <SectionHeader number="B" title="子供用レイアウト（7枚）" color="#9333ea" />

          <UploadButton
            id="upload7"
            onChange={handleChange7}
            count={images7.length}
            max={7}
            label="7枚の非対称レイアウトを生成します"
          />

          <div style={{ marginTop: 36 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: "600", color: "#aaa", margin: 0 }}>
                非対称レイアウト（7枚）
              </h3>
              <DownloadButton
                onClick={makeDownloadHandler(stageRef7, "layout-7.jpg")}
                label="ダウンロード"
                className="btn-purple"
              />
            </div>
            <div className="canvas-wrapper" style={{ background: "#111", width: "fit-content" }}>
              <Stage ref={stageRef7} width={1400} height={980}>
                <Layer>
                  <Rect x={0} y={0} width={1400} height={980} fill="white" />
                  {orderPage7.map((imageIndex, slotIndex) => {
                    const item = loadedImages7[imageIndex];
                    const slot = slots7[slotIndex];
                    if (!item || !slot) return null;
                    const nw = item.image.naturalWidth || item.image.width || 1;
                    const nh = item.image.naturalHeight || item.image.height || 1;
                    const fitted = fitImage(nw, nh, slot.width, slot.height);
                    return (
                      <KonvaImage
                        key={`page7-${item.id}`}
                        image={item.image}
                        x={slot.x} y={slot.y}
                        width={fitted.width} height={fitted.height}
                        offsetX={fitted.width / 2} offsetY={fitted.height / 2}
                        rotation={rotationSettingsPage7[imageIndex] ?? 0}
                        scaleX={flipSettingsPage7[imageIndex] ? -1 : 1}
                        scaleY={1}
                      />
                    );
                  })}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
