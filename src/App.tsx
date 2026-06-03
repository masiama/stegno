import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [message, setMessage] = useState("");
  const [fileUploaded, setFileUploaded] = useState<File>();
  const [result, setResult] = useState<string>();

  const handleReset = () => {
    setMessage("");
    setFileUploaded(undefined);
    setResult(undefined);
  };

  const handleAction = () => {
    if (mode === "encode") {
      alert("Image downloaded!");
    } else {
      setResult("Meet at the usual spot at 9 PM.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-950 p-6 text-slate-100 antialiased selection:bg-amber-500 selection:text-black sm:p-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <header className="flex items-center justify-between">
          <span className="text-sm font-bold tracking-widest text-slate-400">stegno.</span>

          <div className="flex space-x-1 rounded-lg bg-slate-900 p-1 text-xs">
            <button
              onClick={() => {
                setMode("encode");
                handleReset();
              }}
              className={`rounded-md px-5 py-1.5 font-medium transition-all ${mode === "encode" ? "bg-slate-800 font-bold text-amber-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              hide
            </button>
            <button
              onClick={() => {
                setMode("decode");
                handleReset();
              }}
              className={`rounded-md px-5 py-1.5 font-medium transition-all ${mode === "decode" ? "bg-slate-800 font-bold text-amber-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              read
            </button>
          </div>
        </header>

        <main className="space-y-4">
          <div className="group relative flex h-32 cursor-pointer items-center justify-center rounded-2xl border border-slate-900 bg-slate-900/30 p-4 text-center transition-all hover:border-amber-500/30">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => setFileUploaded(e.target.files?.[0])}
              accept="image/*"
            />

            <label htmlFor="file-upload" className="block cursor-pointer">
              {fileUploaded ? (
                <div className="space-y-1">
                  <span className="block text-xs font-medium text-amber-400">
                    {fileUploaded.name}
                  </span>
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
                <span className="block py-2 text-xs text-slate-400 transition-colors group-hover:text-slate-200">
                  {mode === "encode" ? "drop source image" : "drop secret image"}
                </span>
              )}
            </label>
          </div>

          <div className="relative h-14 w-full">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="secret message..."
              disabled={mode === "decode"}
              className={`absolute inset-0 w-full rounded-xl border border-slate-900 bg-slate-900/30 p-4 text-xs text-slate-100 placeholder-slate-600 transition-all duration-200 focus:border-amber-500/30 focus:outline-none ${
                mode === "encode"
                  ? "pointer-events-auto scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              }`}
            />
          </div>

          <button
            onClick={handleAction}
            disabled={!fileUploaded || (mode === "encode" && !message)}
            className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold tracking-wider text-slate-950 uppercase shadow-[0_0_20px_rgba(245,158,11,0.05)] transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-900 disabled:text-slate-600"
          >
            {mode === "encode" ? "compile" : "decode"}
          </button>

          {result && (
            <div className="animate-in fade-in rounded-xl border border-slate-900 bg-slate-900/50 p-4 duration-200">
              <p className="text-xs leading-relaxed font-medium text-slate-300">{result}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
