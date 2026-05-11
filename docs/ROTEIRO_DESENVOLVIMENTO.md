# Roteiro de Desenvolvimento

## Fase 1 - Fundacao
1. Estruturar SPA em React com estado local centralizado.
2. Definir modelos de dados locais para usuarios, sindicatos, comercios e logs.
3. Seed inicial dos usuarios administrativos.

## Fase 2 - Jornada Principal
1. Implementar intro animada de abertura.
2. Implementar autenticacao local e tela de cadastro empresa/colaborador.
3. Implementar tela principal de cartao com geracao unica por usuario.

## Fase 3 - Funcionalidades de Negocio
1. Implementar area de beneficios com busca inteligente e filtros.
2. Implementar favoritos por usuario.
3. Implementar configuracoes por nivel de acesso.

## Fase 4 - Governanca e Operacao
1. Implementar dashboard basico para Master Adm/Desenvolvedor.
2. Implementar exportacoes locais JSON, CSV e XML.
3. Implementar trilha de logs de acoes.

## Fase 5 - PWA e Performance
1. Adicionar manifest web.
2. Adicionar Service Worker para cache de shell.
3. Habilitar prompt de instalacao e ajustes mobile.

## Fase 6 - Proximos Passos Recomendados
1. Migrar persistencia para backend (API + banco).
2. Trocar autenticacao local por fluxo seguro (JWT + refresh + hash de senha).
3. Adicionar testes unitarios e de fluxo (Playwright/Cypress).