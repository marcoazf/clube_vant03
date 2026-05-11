import { Dispatch, FormEvent, SetStateAction } from "react";
import { AppDB, Role, User } from "@/types/app";
import { AuthMode, LoginData, RegisterData, RegisterRole, Stage } from "@/types/forms";
import { uid } from "@/utils/app-formatters";

interface UseAuthActionsParams {
  db: AppDB;
  setDb: Dispatch<SetStateAction<AppDB>>;
  loginData: LoginData;
  setLoginData: Dispatch<SetStateAction<LoginData>>;
  forgotValue: string;
  registerRole: RegisterRole;
  registerData: RegisterData;
  setRegisterData: Dispatch<SetStateAction<RegisterData>>;
  setToast: Dispatch<SetStateAction<string>>;
  setSessionUserId: Dispatch<SetStateAction<string | null>>;
  setStage: Dispatch<SetStateAction<Stage>>;
  setAuthMode: Dispatch<SetStateAction<AuthMode>>;
  addLog: (actor: string, role: Role, action: string) => void;
  passwordInUse: (senha: string, ignoreId?: string) => boolean;
  showElegantPopup: (message: string, durationMs: number) => void;
}

export function useAuthActions({
  db,
  setDb,
  loginData,
  setLoginData,
  forgotValue,
  registerRole,
  registerData,
  setRegisterData,
  setToast,
  setSessionUserId,
  setStage,
  setAuthMode,
  addLog,
  passwordInUse,
  showElegantPopup,
}: UseAuthActionsParams) {
  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    const match = db.users.find((user) => {
      const values = [user.email.toLowerCase(), user.whatsapp, user.nome.toLowerCase(), user.accessLabel.toLowerCase(), user.role.toLowerCase()];
      return values.includes(loginData.identifier.toLowerCase()) && user.senha === loginData.senha;
    });

    if (!match) {
      setToast("Credenciais invalidas.");
      return;
    }

    if (match.status === "inativo") {
      setToast("Usuario inativo. Procure o administrador.");
      return;
    }

    setSessionUserId(match.id);
    addLog(match.nome, match.role, "Login efetuado");
    if (["desenvolvedor", "masteradm", "adm"].includes(match.role)) {
      setStage("gate");
      setTimeout(() => setStage("app"), 3000);
    } else {
      setStage("app");
    }
    setLoginData({ identifier: "", senha: "" });
  };

  const handleForgot = () => {
    const user = db.users.find((item) => item.email.toLowerCase() === forgotValue.toLowerCase());
    if (!user) {
      setToast("E-mail nao localizado.");
      return;
    }
    setToast(`Senha enviada para ${user.email}. Senha atual: ${user.senha}`);
  };

  const handleRegister = (event: FormEvent) => {
    event.preventDefault();
    if (registerData.senha.length < 5 || registerData.senha.length > 7) {
      setToast("A senha deve ter entre 5 e 7 caracteres.");
      return;
    }
    if (passwordInUse(registerData.senha)) {
      setToast("Senha ja utilizada por outro usuario. Escolha outra.");
      return;
    }
    if (db.users.some((user) => user.email.toLowerCase() === registerData.email.toLowerCase())) {
      setToast("Email ja cadastrado.");
      showElegantPopup("E-mail ja existe. O cadastro sera permitido.", 3000);
    }

    const newUser: User = {
      id: uid(),
      role: registerRole,
      accessLabel: registerRole === "empresa" ? "Empresa" : "Colaborador",
      nome: registerData.nome,
      email: registerData.email,
      whatsapp: registerData.whatsapp,
      senha: registerData.senha,
      dataNasc: registerData.dataNasc,
      cidade: registerData.cidade,
      estado: registerData.estado,
      sindicatoId: registerData.sindicatoId,
      razaoSocial: registerRole === "empresa" ? registerData.razaoSocial : undefined,
      cnpj: registerRole === "empresa" ? registerData.cnpj : undefined,
      cpf: registerRole === "colaborador" ? registerData.cpf : undefined,
      cardGenerated: false,
      createdAt: new Date().toISOString(),
      favoritos: [],
      status: "ativo",
      readNotices: [],
    };

    setDb((prev) => ({ ...prev, users: [...prev.users, newUser] }));
    addLog("Sistema", registerRole, `Cadastro ${registerRole} criado para ${newUser.nome}`);
    setToast("Cadastro realizado. Entre para gerar o cartao.");
    showElegantPopup("Usuario cadastrado com sucesso!!!", 4000);
    setAuthMode("login");
    setRegisterData({
      sindicatoId: "",
      razaoSocial: "",
      nome: "",
      dataNasc: "",
      cnpj: "",
      cpf: "",
      cidade: "",
      estado: "",
      whatsapp: "",
      email: "",
      senha: "",
    });
  };

  return { handleLogin, handleForgot, handleRegister };
}