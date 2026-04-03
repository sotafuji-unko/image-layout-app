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
      return {
        ...item,
        image: img,
      };
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

    if (imageElements.length === 0) {
      setLoadedImages([]);
    }
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

  return {
    width: imgWidth * ratio,
    height: imgHeight * ratio,
  };
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

const rotationSettingsPage1: Record<number, number> = {
  0: 90,
};

const rotationSettingsPage2: Record<number, number> = {
  10: 180,
  11: 180,
};

  const flipSettings: Record<number, boolean> = {
    7: true,
    8: true,
    10: true,
    11: true,
  };

  const orderPage7 = [0, 6, 3, 1, 4, 5, 2];

const rotationSettingsPage7: Record<number, number> = {
  0: 0,
  5: 180,
  6: 180,
};

const flipSettingsPage7: Record<number, boolean> = {
  5: true,
  6: true,
};


  // 3x3 の9枠
const slots9 = [
  { x: 310, y: 210 },
  { x: 700, y: 210 },
  { x: 1090, y: 210 },

  { x: 310, y: 490 },
  { x: 700, y: 490 },
  { x: 1090, y: 490 },

  { x: 310, y: 770 },
  { x: 700, y: 770 },
  { x: 1090, y: 770 },
];

  // 2x2 の4枠
const slots4 = [
  { x: 420, y: 300 },
  { x: 980, y: 300 },
  { x: 420, y: 700 },
  { x: 980, y: 700 },
];

const slots7 = [
  // 上段
  { x: 320, y: 210, width: 280, height: 340 }, // A
  { x: 700, y: 210, width: 380, height: 280 }, // B

  // 中段
  { x: 320, y: 500, width: 380, height: 280 }, // C
  { x: 700, y: 500, width: 380, height: 280 }, // D
  { x: 1080, y: 500, width: 380, height: 280 }, // E

  // 下段
  { x: 700, y: 800, width: 380, height: 280 }, // F
  { x: 1080, y: 800, width: 380, height: 280 }, // G
];



const handleChange13 = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files ?? []).slice(0, 13);

  const newImages: ImageItem[] = files.map((file, index) => ({
    id: `thirteen-${file.name}-${index}`,
    src: URL.createObjectURL(file),
    rotation: 0,
    flip: false,
  }));

  setImages13(newImages);
};



  const handleChange7 = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files ?? []).slice(0, 7);

  const newImages: ImageItem[] = files.map((file, index) => ({
    id: `seven-${file.name}-${index}`,
    src: URL.createObjectURL(file),
    rotation: 0,
    flip: false,
  }));

  setImages7(newImages);
};

  const handleDownload9 = () => {
    const uri = stageRef9.current?.toDataURL({
      pixelRatio: 2,
    });

    if (!uri) return;

    const link = document.createElement("a");
    link.download = "layout-9.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload4 = () => {
    const uri = stageRef4.current?.toDataURL({
      pixelRatio: 2,
    });

    if (!uri) return;

    const link = document.createElement("a");
    link.download = "layout-4.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload7 = () => {
  const uri = stageRef7.current?.toDataURL({
    pixelRatio: 2,
  });

  if (!uri) return;

  const link = document.createElement("a");
  link.download = "layout-7.png";
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div
      style={{
        padding: 40,
        color: "white",
        background: "black",
        minHeight: "100vh",
      }}
    >



<div style={{ textAlign: "center" }}>
  <img
    src="/new-rogo.jpg"
    alt="logo"
    style={{
      width: 200,
      marginBottom: 10,
    }}
  />

  <h1
    style={{
      fontSize: 36,
      fontWeight: "bold",
    }}
  >
    画像を勝手にレイアウトしてもらいまSHOW
  </h1>
</div>

<h2
  style={{
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
  }}
>
  大人用13枚アップロード↓
</h2>

<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleChange13}
  id="upload13"
  style={{ display: "none" }}
/>

<label
  htmlFor="upload13"
  style={{
    color: "red",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  ファイルを選択
</label>

<p style={{ marginTop: 12 }}>13枚までアップロードできます</p>

      <div
        style={{
          border: "1px solid #666",
          width: 1400,
          height: 980,
          background: "#111",
          marginTop: 20,
        }}
      >
        <Stage ref={stageRef9} width={1400} height={980}>
          <Layer>
            <Rect x={0} y={0} width={1400} height={980} fill="white" />

{orderPage1.map((imageIndex, slotIndex) => {
  const item = loadedImages13[imageIndex];
  const slot = slots9[slotIndex];
  if (!item || !slot) return null;

const naturalWidth = item.image.naturalWidth || item.image.width || 1;
const naturalHeight = item.image.naturalHeight || item.image.height || 1;

  const fitted = fitImage(naturalWidth, naturalHeight, 360, 270);

  return (
    <KonvaImage
      key={`page1-${item.id}`}
      image={item.image}
      x={slot.x}
      y={slot.y}
      width={fitted.width}
      height={fitted.height}
      offsetX={fitted.width / 2}
      offsetY={fitted.height / 2}
      rotation={rotationSettingsPage1[imageIndex] ?? 0}
      scaleX={flipSettings[imageIndex] ? -1 : 1}
      scaleY={1}
    />
  );
})}
          </Layer>
        </Stage>
      </div>

      <button
        onClick={handleDownload9}
        style={{
          marginTop: 20,
          padding: "10px 16px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        9枚レイアウトをダウンロード
      </button>

      <div
        style={{
          border: "1px solid #666",
          width: 1400,
          height: 980,
          background: "#111",
          marginTop: 20,
        }}
      >
        <Stage ref={stageRef4} width={1400} height={980}>
          <Layer>
            <Rect x={0} y={0} width={1400} height={980} fill="white" />

{orderPage2.map((imageIndex, slotIndex) => {
  const item = loadedImages13[imageIndex];
  const slot = slots4[slotIndex];
  if (!item || !slot) return null;

const naturalWidth = item.image.naturalWidth || item.image.width || 1;
const naturalHeight = item.image.naturalHeight || item.image.height || 1;

  const fitted = fitImage(naturalWidth, naturalHeight, 520, 390);

  return (
    <KonvaImage
      key={`page2-${item.id}`}
      image={item.image}
      x={slot.x}
      y={slot.y}
      width={fitted.width}
      height={fitted.height}
      offsetX={fitted.width / 2}
      offsetY={fitted.height / 2}
      rotation={rotationSettingsPage2[imageIndex] ?? 0}
      scaleX={flipSettings[imageIndex] ? -1 : 1}
      scaleY={1}
    />
  );
})}
          </Layer>
        </Stage>
      </div>

      <button
        onClick={handleDownload4}
        style={{
          marginTop: 20,
          padding: "10px 16px",
          backgroundColor: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        4枚レイアウトをダウンロード
      </button>

      <h2
  style={{
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
  }}
>
  子供用7枚レイアウト↓
</h2>
<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleChange7}
  id="upload7"
  style={{ display: "none" }}
/>

<label
  htmlFor="upload7"
  style={{
    color: "red",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  ファイルを選択
</label>
<p style={{ marginTop: 12 }}>7枚までアップロードできます</p>

<div
  style={{
    border: "1px solid #666",
    width: 1400,
    height: 980,
    background: "#111",
    marginTop: 20,
  }}
>
  <Stage ref={stageRef7} width={1400} height={980}>
    <Layer>
      <Rect x={0} y={0} width={1400} height={980} fill="white" />

{orderPage7.map((imageIndex, slotIndex) => {
  const item = loadedImages7[imageIndex];
  const slot = slots7[slotIndex];
  if (!item || !slot) return null;

const naturalWidth = item.image.naturalWidth || item.image.width || 1;
const naturalHeight = item.image.naturalHeight || item.image.height || 1;

const fitted = fitImage(naturalWidth, naturalHeight, slot.width, slot.height);

  return (
    <KonvaImage
      key={`page7-${item.id}`}
      image={item.image}
      x={slot.x}
      y={slot.y}
width={fitted.width}
height={fitted.height}
offsetX={fitted.width / 2}
offsetY={fitted.height / 2}
      rotation={rotationSettingsPage7[imageIndex] ?? 0}
      scaleX={flipSettingsPage7[imageIndex] ? -1 : 1}
      scaleY={1}
    />
  );
})}
    </Layer>
  </Stage>
</div>

<button
  onClick={handleDownload7}
  style={{
    marginTop: 20,
    padding: "10px 16px",
    backgroundColor: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
  }}
>
  7枚レイアウトをダウンロード
</button>
    </div>
  );

}