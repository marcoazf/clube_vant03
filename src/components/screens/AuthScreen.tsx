import { FaEye, FaEyeSlash, FaGift, FaHome, FaStar, FaUser } from "react-icons/fa";
import { UF_LIST } from "@/constants/app";
import { AuthScreenProps } from "@/types/props";
import { maskCNPJ, maskCPF, maskWhatsapp } from "@/utils/app-formatters";

export function AuthScreen({
  viewport,
  authMode,
  setAuthMode,
  loginData,
  setLoginData,
  showLoginPassword,
  toggleLoginPassword,
  forgotValue,
  setForgotValue,
  registerRole,
  setRegisterRole,
  registerData,
  setRegisterData,
  showRegisterPassword,
  toggleRegisterPassword,
  sindicatos,
  toast,
  onLoginSubmit,
  onRegisterSubmit,
  onForgotPassword,
}: AuthScreenProps) {
  const isSpecialSyndicate = registerData.sindicatoId === "__socio_individual__" || registerData.sindicatoId === "__empresa_individual__";

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 px-5 pb-24 pt-6 text-slate-100 md:flex md:items-center md:justify-center md:pb-6 md:pt-6"
      style={viewport.width >= 768 ? { minHeight: viewport.height } : undefined}
    >
      <div className="mx-auto flex min-h-[calc(100vh-8.5rem)] w-full max-w-md flex-col justify-center space-y-7 md:max-w-2xl md:min-h-0">
        <div className="text-center">
          <img
            src="/header.png"
            alt="Header ABREF"
            className="mx-auto mb-3 h-auto w-full max-w-[280px] object-contain md:max-w-[378px] lg:max-w-[434px]"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
          <p className="mt-2 text-sm text-slate-400">Acesso rapido e seguro ao seu cartão digital.</p>
        </div>

        <div className="mx-auto flex w-full max-w-md rounded-xl bg-slate-800 p-1 text-sm">
          <button className={`w-1/2 rounded-lg py-2 ${authMode === "login" ? "bg-sky-500 text-white" : "text-slate-300"}`} onClick={() => setAuthMode("login")}>
            Login
          </button>
          <button className={`w-1/2 rounded-lg py-2 ${authMode === "cadastro" ? "bg-sky-500 text-white" : "text-slate-300"}`} onClick={() => setAuthMode("cadastro")}>
            Cadastrar
          </button>
        </div>

        {authMode === "login" ? (
          <form onSubmit={onLoginSubmit} className="mx-auto w-full max-w-md space-y-4">
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
              required
              placeholder="E-mail, WhatsApp ou Usuário"
              value={loginData.identifier}
              onChange={(e) => setLoginData((v) => ({ ...v, identifier: e.target.value }))}
            />
            <div className="relative">
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 pr-12"
                required
                type={showLoginPassword ? "text" : "password"}
                placeholder="Senha"
                value={loginData.senha}
                onChange={(e) => setLoginData((v) => ({ ...v, senha: e.target.value }))}
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={toggleLoginPassword}>
                {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button className="w-full rounded-xl bg-sky-500 py-3 font-semibold">Entrar</button>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="mb-2 text-xs text-slate-400">Esqueceu a senha? Simulação de envio por e-mail:</p>
              <div className="flex gap-2">
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm"
                  placeholder="E-mail cadastrado"
                  value={forgotValue}
                  onChange={(e) => setForgotValue(e.target.value)}
                />
                <button type="button" className="rounded-lg bg-indigo-500 px-3 text-xs" onClick={onForgotPassword}>
                  Enviar
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={onRegisterSubmit} className="mx-auto w-full max-w-md space-y-4 pb-8">
            <div className="flex gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" checked={registerRole === "empresa"} onChange={() => setRegisterRole("empresa")} />Empresa
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={registerRole === "colaborador"} onChange={() => setRegisterRole("colaborador")} />Colaborador
              </label>
            </div>

            <select
              required
              className={`w-full rounded-xl border border-slate-700 bg-slate-900 p-3 ${isSpecialSyndicate ? "text-emerald-300" : "text-slate-100"}`}
              value={registerData.sindicatoId}
              onChange={(e) => setRegisterData((v) => ({ ...v, sindicatoId: e.target.value }))}
            >
              <option value="">Selecione o sindicato</option>
              <option value="__socio_individual__">Socio Individual</option>
              <option value="__empresa_individual__">Empresa Individual</option>
              {sindicatos.map((s) => (
                <option key={s.id} value={s.id}>{`${s.nome} - ${s.cidade}/${s.estado}`}</option>
              ))}
            </select>
            {registerRole === "empresa" && (
              <input required className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" placeholder="Razao social" value={registerData.razaoSocial} onChange={(e) => setRegisterData((v) => ({ ...v, razaoSocial: e.target.value }))} />
            )}
            <input
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
              placeholder={registerRole === "empresa" ? "Nome responsavel" : "Nome de usuario"}
              value={registerData.nome}
              onChange={(e) => setRegisterData((v) => ({ ...v, nome: e.target.value }))}
            />
            <input required type="date" className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" value={registerData.dataNasc} onChange={(e) => setRegisterData((v) => ({ ...v, dataNasc: e.target.value }))} />
            {registerRole === "empresa" ? (
              <input required className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" placeholder="CNPJ" value={registerData.cnpj} onChange={(e) => setRegisterData((v) => ({ ...v, cnpj: maskCNPJ(e.target.value) }))} />
            ) : (
              <input required className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" placeholder="CPF" value={registerData.cpf} onChange={(e) => setRegisterData((v) => ({ ...v, cpf: maskCPF(e.target.value) }))} />
            )}
            <input required className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" placeholder="Cidade" value={registerData.cidade} onChange={(e) => setRegisterData((v) => ({ ...v, cidade: e.target.value }))} />
            <select required className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" value={registerData.estado} onChange={(e) => setRegisterData((v) => ({ ...v, estado: e.target.value }))}>
              <option value="">Estado</option>
              {UF_LIST.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
            <input required className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" placeholder="WhatsApp" value={registerData.whatsapp} onChange={(e) => setRegisterData((v) => ({ ...v, whatsapp: maskWhatsapp(e.target.value) }))} />
            <input required type="email" className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3" placeholder="E-mail" value={registerData.email} onChange={(e) => setRegisterData((v) => ({ ...v, email: e.target.value }))} />
            <div className="relative">
              <input
                required
                type={showRegisterPassword ? "text" : "password"}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 pr-12"
                minLength={5}
                maxLength={7}
                placeholder="Senha (5-7 caracteres, letras, numeros ou alfanumerico)"
                value={registerData.senha}
                onChange={(e) => setRegisterData((v) => ({ ...v, senha: e.target.value.slice(0, 7) }))}
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={toggleRegisterPassword}>
                {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button className="w-full rounded-xl bg-sky-500 py-3 font-semibold">Cadastrar</button>
          </form>
        )}
      </div>
      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95">
        <div className="mx-auto grid max-w-md grid-cols-4 text-center text-sm text-slate-500">
          {[
            { label: "Home", icon: <FaHome /> },
            { label: "Beneficios", icon: <FaGift /> },
            { label: "Exclusivo", icon: <FaStar /> },
            { label: "Perfil", icon: <FaUser /> },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 py-2">
              <div className="text-xl">{item.icon}</div>
              <p className="text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </nav>
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 rounded-lg bg-slate-100 px-4 py-2 text-xs text-slate-900">{toast}</div>}
    </div>
  );
}