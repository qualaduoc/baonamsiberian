"use client";

export default function FloatingZalo() {
  return (
    <a
      href="https://zalo.me/0899686683"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Liên hệ tư vấn qua Zalo"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#0068FF] animate-ping opacity-20"></span>
      
      {/* Main button */}
      <div className="relative flex items-center gap-3 bg-[#0068FF] text-white pl-5 pr-6 py-3.5 rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
        {/* Zalo icon SVG */}
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
          <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" fill="white"/>
          <path d="M33.2 16.8H14.8c-.994 0-1.8.806-1.8 1.8v10.8c0 .994.806 1.8 1.8 1.8h5.4l3.8 3.8 3.8-3.8h5.4c.994 0 1.8-.806 1.8-1.8V18.6c0-.994-.806-1.8-1.8-1.8z" fill="#0068FF"/>
          <text x="17.5" y="28" fill="white" fontSize="9" fontWeight="900" fontFamily="Arial">ZL</text>
        </svg>
        <span className="font-bold text-sm tracking-wide">Tư Vấn Ngay</span>
      </div>
    </a>
  );
}
