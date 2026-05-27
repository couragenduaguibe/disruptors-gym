import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Dumbbell, Printer, Download } from "lucide-react";

// Generates a QR code that members scan to check in.
// The encoded value is a deep-link payload the app interprets as a check-in trigger.
export function CheckInPoster({ locationId = "main", locationName = "Main Entrance" }) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  // In a real deployment this would be a URL like https://yourgym.app/checkin/main
  // For the demo, we encode a payload the app can recognize.
  const payload = `DISRUPTORS:CHECKIN:${locationId}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, payload, {
      width: 320,
      margin: 1,
      color: { dark: "#1c1917", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).catch((e) => setError(e.message));
  }, [payload]);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `disruptors-checkin-${locationId}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  if (error) return <div className="text-rose-600 text-sm">QR error: {error}</div>;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden max-w-md mx-auto">
      {/* Printable poster area */}
      <div className="p-8 print:p-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <div className="font-display text-3xl font-semibold leading-none">Disruptors</div>
            <div className="text-xs text-stone-500 font-mono tracking-widest">GYM OS</div>
          </div>
        </div>

        <div className="text-xs font-mono tracking-widest text-stone-500 uppercase text-center mb-3">
          {locationName.toUpperCase()}
        </div>
        <h2 className="font-display text-2xl font-semibold text-center mb-6 leading-tight">
          Scan to check in
        </h2>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white border-4 border-stone-900 rounded-2xl">
            <canvas ref={canvasRef} />
          </div>
        </div>

        <ol className="text-sm text-stone-600 space-y-2 max-w-xs mx-auto">
          <li className="flex gap-2">
            <span className="font-mono font-semibold text-stone-900">1.</span>
            Open your phone camera
          </li>
          <li className="flex gap-2">
            <span className="font-mono font-semibold text-stone-900">2.</span>
            Point it at the code above
          </li>
          <li className="flex gap-2">
            <span className="font-mono font-semibold text-stone-900">3.</span>
            Confirm in the Disruptors app
          </li>
        </ol>

        <div className="mt-6 pt-6 border-t border-stone-200 text-center">
          <div className="text-[10px] font-mono tracking-widest text-stone-400">{payload}</div>
        </div>
      </div>

      {/* Controls (hidden when printing) */}
      <div className="bg-stone-50 border-t border-stone-200 p-4 flex gap-2 print:hidden">
        <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium border border-stone-200 rounded-lg hover:border-stone-900 transition bg-white">
          <Printer className="w-3.5 h-3.5" /> Print poster
        </button>
        <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium border border-stone-200 rounded-lg hover:border-stone-900 transition bg-white">
          <Download className="w-3.5 h-3.5" /> Download PNG
        </button>
      </div>
    </div>
  );
}
