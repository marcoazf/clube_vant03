# Documento de Contexto - Prototipo ABREF

## Objetivo do Produto
Construir um prototipo comercial de Cartao de Beneficios Digital (SPA + PWA) com foco em:
- fluidez em smartphone
- operacao offline
- sensacao de app nativo
- persistencia local com LocalStorage

## Escopo Implementado
- Fluxo de Intro -> Login/Cadastro -> Cartao
- Perfis de acesso: Desenvolvedor, Master Adm, Adm, Empresa e Colaborador
- Geracao de cartao virtual com ID unico de 7 digitos e validade de 1 ano
- Gestao local de sindicatos, comercios e categorias
- Area de beneficios com busca, filtros, destaque de maiores descontos e favoritos
- Perfil com edicao basica e upload de foto local
- Dashboard gerencial local com exportacao JSON/CSV/XML
- PWA com manifest, icones e Service Worker para cache basico

## Premissas de Arquitetura
- Sem banco de dados, sem APIs e sem autenticacao real neste ciclo
- Dados 100% locais, orientados para migracao futura (colecoes separadas)
- UX mobile-first com paleta dark premium e alto contraste

## Limites do Prototipo
- Recuperacao de senha simulada (mensagem local)
- Protecao anti-captura simulada visualmente (nao e seguranca real)
- Exportacao de dados em formato simplificado