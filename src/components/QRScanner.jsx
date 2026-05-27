import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, AlertCircle, CheckCircle2 } from "lucide-react";

// Member opens this to scan the gym's check-in QR code.
// Validates the payload format (DISRUPTORS:CHECKIN:<locationId>) before triggering check-in.
export function MemberQRScanner({ onCheckIn, onClose }) {
  const [error, setError] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedLocation, setScannedLocation] = useState(null);
  const html5QrCodeRef = useRef(null);
  const SCANNER_ID = "member-qr-scanner";

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(SCANNER_ID);
    html5QrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices || devices.length === 0) {
          setError("No camera detected on this device.");
          return;
        }
        const backCam = devices.find((d) => /back|rear|environment/i.test(d.label)) || devices[devices.length - 1];

        html5QrCode
          .start(
            backCam.id,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => handleDecoded(decodedText),
            () => { /* per-frame failure; ignore */ }
          )
          .catch((err) => setError("Could not start the camera: " + (err?.message || err)));
      })
      .catch(() => setError("Camera access was denied. Please allow camera access in your browser settings."));

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().then(() => html5QrCodeRef.current.clear()).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecoded = (text) => {
    if (scanned) return;

    // Expected format: DISRUPTORS:CHECKIN:<locationId>
    const match = /^DISRUPTORS:CHECKIN:(.+)$/.exec(text?.trim() || "");
    if (!match) {
      // Wrong QR — let user try again, don't error permanently
      return;
    }

    const locationId = match[1];
    setScanned(true);
    setScannedLocation(locationId);

    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().catch(() => {});
    }
    setTimeout(() => onCheckIn(locationId), 1200);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden fade-up">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-stone-700" />
            <h3 className="font-display text-xl font-semibold">Check In</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative bg-stone-900 aspect-square">
          <div id={SCANNER_ID} className="w-full h-full" />

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
              <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
              <p className="text-sm font-medium mb-1">Camera unavailable</p>
              <p className="text-xs text-stone-300">{error}</p>
            </div>
          )}

          {scanned && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500 text-white fade-up">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-red-400 rounded-full pulse-ring" />
                <div className="relative w-20 h-20 rounded-full bg-stone-900 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-red-400" strokeWidth={2.5} />
                </div>
              </div>
              <p className="font-display text-2xl font-semibold">Checked in!</p>
              <p className="text-sm font-mono mt-1 opacity-70">{scannedLocation}</p>
            </div>
          )}

          {!error && !scanned && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 relative">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-red-400 rounded-tl-2xl" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-red-400 rounded-tr-2xl" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-red-400 rounded-bl-2xl" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-red-400 rounded-br-2xl" />
              </div>
            </div>
          )}
        </div>

        {!scanned && (
          <div className="p-5 bg-stone-50 text-center">
            <p className="text-xs text-stone-500">
              Point your camera at the QR code at the front desk.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
