import { useState } from "react";

import { loadImage, readFile, readMessage, writeMessage } from "./utilts";

const MODES = ["encode", "decode"] as const;
type Mode = (typeof MODES)[number];

export default function App() {
  const [mode, setMode] = useState<Mode>("encode");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File>();

  const handleReset = () => {
    setMessage("");
    setFile(undefined);
  };

  const handleAction = () => {
    if (!file) return;
    const dataPromise = readFile(file).then(loadImage);

    if (mode === "encode") {
      if (!message) return;
      dataPromise.then(writeMessage(message, file.name)).catch(console.error);
    } else {
      dataPromise.then(readMessage).then(setMessage).catch(console.error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-950 p-6 text-slate-100 antialiased selection:bg-amber-500 selection:text-black sm:p-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <header className="flex items-center justify-between">
          <span className="text-sm font-bold tracking-widest text-slate-400">stegno.</span>

          <div className="flex space-x-1 rounded-lg bg-slate-900 p-1 text-xs">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  handleReset();
                }}
                className={`rounded-md px-5 py-1.5 font-medium transition-all ${mode === m ? "bg-slate-800 font-bold text-amber-400" : "text-slate-400 hover:text-slate-200"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </header>

        <main className="space-y-4">
          <label className="group flex h-32 cursor-pointer items-center justify-center rounded-2xl border border-slate-900 bg-slate-900/30 p-4 text-center transition-all hover:border-amber-500/30">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0])}
              accept="image/*"
            />

            {file ? (
              <div className="space-y-1">
                <span className="block text-xs font-medium text-amber-400">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleReset();
                  }}
                  className="mx-auto block pt-1 text-[11px] text-slate-500 underline transition-colors hover:text-red-400"
                >
                  clear
                </button>
              </div>
            ) : (
              <span className="py-2 text-xs text-slate-400 transition-colors group-hover:text-slate-200">
                {mode === "encode" ? "drop source image" : "drop secret image"}
              </span>
            )}
          </label>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={mode === "encode" ? "secret message..." : "upload file..."}
            disabled={mode === "decode"}
            className="w-full rounded-xl border border-slate-900 bg-slate-900/30 p-4 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-500/30 focus:outline-none"
          />

          <button
            onClick={handleAction}
            disabled={!file || (mode === "encode" && !message)}
            className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold tracking-wider text-slate-950 uppercase shadow-[0_0_20px_rgba(245,158,11,0.05)] transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-900 disabled:text-slate-600"
          >
            {mode}
          </button>
        </main>
      </div>
    </div>
  );
}
