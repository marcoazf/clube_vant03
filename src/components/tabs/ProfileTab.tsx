import { useEffect, useRef, useState } from "react";
import { FaFolderOpen, FaIdCard, FaTrash } from "react-icons/fa";
import { ProfileTabProps } from "@/types/props";
import { maskWhatsapp } from "@/utils/app-formatters";

export function ProfileTab({ sessionUser, currentSyndicate, fileInputRef, updatePhoto, setCurrentUser, logsCount, setToast }: ProfileTabProps) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (!cameraOpen) {
      stopCamera();
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setCameraError("Nao foi possivel acessar a camera neste dispositivo.");
        setToast("Falha ao abrir camera. Use o upload de foto como fallback.");
      }
    };

    void startCamera();
  }, [cameraOpen, setToast]);

  const openCamera = () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setToast("Camera nao suportada neste navegador. Use o upload de foto.");
      return;
    }
    setCameraError("");
    setCameraOpen(true);
  };

  const captureSelfie = () => {
    if (!videoRef.current) return;
    const width = videoRef.current.videoWidth || 640;
    const height = videoRef.current.videoHeight || 480;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, width, height);
    const imageData = canvas.toDataURL("image/jpeg", 0.92);
    setCurrentUser((u) => ({ ...u, foto: imageData }));
    setToast("Selfie capturada com sucesso.");
    setCameraOpen(false);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <FaIdCard />
        Perfil
      </h2>
      <p className="text-xs text-slate-400">
        Sindicato vinculado: {currentSyndicate?.nome ?? "Nao definido"} - {currentSyndicate?.cidade ?? "-"}/{currentSyndicate?.estado ?? "-"}
      </p>
      <input className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" value={sessionUser.nome} onChange={(e) => setCurrentUser((u) => ({ ...u, nome: e.target.value }))} />
      <input className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" value={sessionUser.email} onChange={(e) => setCurrentUser((u) => ({ ...u, email: e.target.value }))} />
      <input className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" value={sessionUser.whatsapp} onChange={(e) => setCurrentUser((u) => ({ ...u, whatsapp: maskWhatsapp(e.target.value) }))} />
      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={updatePhoto} />
      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300" onClick={() => fileInputRef.current?.click()}>
        <FaFolderOpen /> Adicione sua foto
      </button>
      <button className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300" onClick={openCamera}>
        Tirar selfie
      </button>

      {cameraOpen && (
        <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-950/80 p-3">
          <video ref={videoRef} autoPlay playsInline muted className="h-44 w-full rounded-lg object-cover" />
          {cameraError && <p className="text-xs text-rose-300">{cameraError}</p>}
          <div className="flex gap-2">
            <button className="w-full rounded-lg bg-emerald-600 py-2 text-xs" onClick={captureSelfie}>
              Capturar selfie
            </button>
            <button
              className="w-full rounded-lg bg-slate-700 py-2 text-xs"
              onClick={() => {
                setCameraOpen(false);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {sessionUser.foto && (
        <div className="relative overflow-hidden rounded-xl border border-slate-700">
          <img src={sessionUser.foto} alt="Preview da foto" className="h-40 w-full object-cover" />
          <button className="absolute right-2 top-2 rounded-lg bg-rose-600/90 p-2" onClick={() => setCurrentUser((u) => ({ ...u, foto: "" }))}>
            <FaTrash />
          </button>
        </div>
      )}
      <button className="w-full rounded-xl bg-sky-600 py-2" onClick={() => setToast("Perfil atualizado localmente.")}>
        Salvar alteracoes
      </button>
      <p className="text-xs text-slate-400">Historico local: {logsCount} acoes</p>
    </div>
  );
}