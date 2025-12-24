"use client";

import { useState } from "react";

type GalleryItem = {
  id: string;
  originalSrc: string;
  resultSrc: string;
  maskSrc: string;
};

type HoverClickGalleryProps = {
  items: GalleryItem[];
  className?: string;
};

function GalleryItemComponent({ item }: { item: GalleryItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showResult, setShowResult] = useState(false); // Mặc định hiện ảnh gốc

  // Toggle giữa Original và Result khi click
  const handleClick = () => {
    setShowResult(!showResult);
  };

  return (
    <div
      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100 shadow-md hover:shadow-xl transition-shadow group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* KỸ THUẬT STACKING: 
         Load tất cả ảnh cùng lúc, dùng opacity để ẩn hiện.
         Giúp chuyển đổi MƯỢT TỨC THÌ, không cần tải lại ảnh.
      */}

      {/* 1. LAYER DƯỚI CÙNG: ẢNH GỐC */}
      <img
        src={item.originalSrc}
        alt="Original"
        className="absolute inset-0 w-full h-full object-cover select-none"
        style={{ zIndex: 10 }} 
      />

      {/* 2. LAYER GIỮA: ẢNH KẾT QUẢ (Đè lên ảnh gốc) */}
      <img
        src={item.resultSrc}
        alt="Result"
        className="absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-300"
        // Chỉ hiện khi showResult = true
        style={{ 
          opacity: showResult ? 1 : 0, 
          zIndex: 20 
        }}
      />

      {/* 3. LAYER TRÊN CÙNG: MASK (HIỆU ỨNG MÀU CYAN) */}
      {/* Chỉ hiện khi Hover và chưa bật chế độ xem kết quả */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{ 
          opacity: isHovered && !showResult ? 1 : 0, 
          zIndex: 30 
        }}
      >
        <svg width="100%" height="100%">
          <defs>
            <mask id={`mask-${item.id}`} maskUnits="userSpaceOnUse">
              <image
                href={item.maskSrc}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(34, 211, 238, 0.6)" // Màu Cyan
            mask={`url(#mask-${item.id})`}
          />
        </svg>
      </div>

      {/* TOOLTIP HƯỚNG DẪN */}
      <div 
        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/80 text-white text-sm font-medium whitespace-nowrap transition-opacity duration-200 pointer-events-none"
        style={{ 
            opacity: isHovered ? 1 : 0,
            zIndex: 40
        }}
      >
        {showResult ? "Result (Click to revert)" : "Click to see result"}
      </div>
    </div>
  );
}

export default function HoverClickGallery({ items, className }: HoverClickGalleryProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className ?? ""}`}>
      {items.map((item) => (
        <GalleryItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
}