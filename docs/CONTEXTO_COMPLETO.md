CONTEXTO COMPLETO DO PROTOTIPO - CLUBE DE VANTAGENS ABREF

1. VISAO GERAL
Nome do aplicativo: Clube de VANTAGENS - ABREF
Slogan: Mais economia e muito mais beneficios para voce!!!
Tipo: Aplicacao Web SPA instalavel com comportamento PWA
Objetivo: Demonstrar um cartao de beneficios digital com experiencia mobile, fluida e offline, sem depender de banco de dados ou APIs neste primeiro ciclo.

2. TECNOLOGIAS UTILIZADAS
- React + Vite
- TypeScript
- Tailwind CSS v4
- Framer Motion (animacoes)
- React Icons (icones estilo app)
- Service Worker customizado (cache offline basico)
- Web App Manifest (instalacao PWA)
- LocalStorage (persistencia local de dados)

Observacao:
Apesar do pedido inicial citar HTML5, CSS3 e JavaScript Vanilla, a implementacao foi entregue sobre a base React/Vite existente do projeto, mantendo todos os principios de performance e UX mobile-first.

3. ARQUITETURA DA APLICACAO
3.1 Frontend
- SPA com renderizacao por estado
- Fluxo de telas controlado por estados: intro -> auth -> gate -> app
- Navegacao principal em barra inferior (tabs)

3.2 Persistencia
- Estrutura de dados local em LocalStorage
- Chaves principais:
  - DB_KEY: abref_proto_db_v1
  - SESSION_KEY: abref_proto_session

3.3 Modelos locais
- users: usuarios e perfis
- sindicatos: sindicatos por cidade/estado
- comercios: rede de beneficios
- categorias: categorias dinamicas
- logs: trilha de acoes locais

4. REQUISITOS FUNCIONAIS IMPLEMENTADOS
4.1 Intro
- Tela inicial com micro animacao
- Exibe nome, slogan, versao e desenvolvedor
- Usa logo local em /logo.png

4.2 Login e Cadastro
- Login por email, whatsapp ou nome do perfil/role
- Perfis administrativos seed:
  - desenvolvedor / dev1357
  - masteradm / madm135
  - adm / adm12345
- Cadastro para Empresa e Colaborador
- Campos obrigatorios
- Validacao de senha unica (nao repetir senha ja usada por outro usuario)
- Senha fixada em exatamente 5 caracteres no cadastro
- Recuperacao de senha simulada por mensagem local

4.3 Cartao Digital
- Geracao unica por usuario (botao Gerar Cartao)
- ID dinamico de 7 digitos
- Exibicao do ID no cartao
- Validade de 1 ano a partir da geracao
- Tema visual por papel:
  - Empresa: tons dourados
  - Colaborador: tons azuis
  - Perfis administrativos: temas distintos
- Sindicato exibido dinamicamente conforme vinculo do usuario

4.4 Beneficios
- Lista de comercios e vantagens
- Busca dinamica por termo
- Filtros por ordenacao, cidade e categoria
- Favoritar e desfavoritar comercio
- Destaque para maiores descontos
- Contador de comercios exibido
- Topo de busca/filtros fixo com rolagem suave da lista

4.5 Exclusivo
- Sessao promocional enriquecida
- Banner ilustrativo local
- Conteudos atrativos de campanhas e vantagens

4.6 Perfil
- Edicao basica de dados do perfil
- Upload de foto local
- Preview da foto
- Acao para descartar foto (icone lixeira)
- Exibicao de historico local de acoes
- Exibicao do sindicato vinculado

4.7 Configuracoes por nivel
- Adm:
  - Cadastro/edicao/exclusao de sindicatos
  - Cadastro/edicao/exclusao de comercios
- Master Adm:
  - Recursos de Adm
  - Dashboard local
  - Exportacao JSON/CSV/XML
  - Gestao de usuarios (com limites)
- Desenvolvedor:
  - Recursos de Master Adm
  - Controle ampliado de senhas administrativas

4.8 Dashboard e Operacao
- Indicadores locais:
  - total de usuarios
  - total de sindicatos
  - total de cidades
  - total de comercios
- Lista de aniversariantes do mes
- Exportacoes de dados em JSON/CSV/XML

5. PWA E OFFLINE
- Manifest em public/manifest.webmanifest
- Service worker em public/service-worker.js
- Registro do SW no bootstrap da aplicacao
- Cache de shell para navegacao basica offline
- Prompt de instalacao quando suportado

6. UX/UI E DESIGN
- Tema dark mode principal
- Alto contraste e leitura mobile
- Barra inferior fixa com alinhamento dinamico para 4 ou 5 itens
- Rotulos sob icones, centralizados
- Relogio em tempo real no cabecalho
- Transicoes suaves e animacoes intencionais (Framer Motion)
- Cursor tipo maozinha para elementos interativos no desktop

7. SEGURANCA NO CONTEXTO DE PROTOTIPO
- Sem seguranca real de producao (conforme escopo)
- Protecao visual simulada anti-captura para demonstracao
- Confirmacao de logout e confirmacoes de exclusao em acoes criticas

8. ROTEIRO DE DESENVOLVIMENTO (PASSO A PASSO)
Fase 1 - Fundacao
1) Estruturar estados globais e modelos locais
2) Criar seed inicial de usuarios administrativos
3) Configurar persistencia local

Fase 2 - Jornada principal
1) Implementar intro animada
2) Implementar login/cadastro
3) Implementar gate de acesso por perfil
4) Implementar tela principal do cartao

Fase 3 - Modulos de negocio
1) Implementar beneficios com busca/filtros/favoritos
2) Implementar modulo exclusivo
3) Implementar perfil com foto e preview

Fase 4 - Administracao
1) Implementar cadastro de sindicatos
2) Implementar cadastro de comercios
3) Implementar dashboard e logs
4) Implementar exportacoes

Fase 5 - PWA
1) Manifest
2) Service worker
3) Instalacao e testes offline

Fase 6 - Evolucao futura
1) Migracao para API + banco de dados
2) Autenticacao real e hash de senhas
3) Testes automatizados (unitario e e2e)

9. CONTRATO DE EVOLUCAO SEM REGRESSAO
1) Nao remover campos persistidos sem migracao de dados
2) Nao alterar fluxo principal: Intro -> Auth -> Cartao
3) Nao quebrar regras de perfil e permissao
4) Manter senha com validacoes previstas para o contexto atual
5) Toda nova feature deve passar por build de validacao

10. ESTRUTURA DE ARQUIVOS RELEVANTES
- src/App.tsx
- src/main.tsx
- src/index.css
- index.html
- public/manifest.webmanifest
- public/service-worker.js
- public/icon-192.png
- public/icon-512.png
- public/exclusive-banner.png
- docs/CONTEXTO.md
- docs/ROTEIRO_DESENVOLVIMENTO.md
- docs/CONTRATO_EVOLUCAO.md

11. COMO EXECUTAR O PROJETO
1) Abrir terminal na raiz (onde esta package.json)
2) Executar: npm install
3) Executar: npm run dev
4) Abrir URL exibida (exemplo: http://localhost:5173)

Para build de producao:
1) npm run build
2) npm run preview

12. OBSERVACOES FINAIS
- Este prototipo prioriza demonstracao comercial, clareza e fluidez.
- A base esta pronta para evolucoes cirurgicas sem ruptura funcional.
- O comportamento offline e de autenticacao e apropriado para prototipo, nao para ambiente regulado de producao.