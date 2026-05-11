# Contrato de Regras para Evolucao Sem Regressao

## Regras de Compatibilidade
1. Nao remover campos existentes do LocalStorage sem migracao.
2. Nao alterar IDs primarios ja emitidos para usuarios, sindicatos e comercios.
3. Nao quebrar o fluxo principal: Intro -> Login -> Cartao.

## Regras de Dados
1. Toda nova versao deve suportar leitura de dados antigos.
2. Toda senha deve continuar validada contra duplicidade no ambiente local.
3. Toda escrita relevante deve registrar log de acao.

## Regras de UX
1. Priorizar mobile-first e manter navegacao por rodape.
2. Evitar blocos visuais redundantes no primeiro viewport.
3. Preservar feedback imediato em operacoes de cadastro, edicao e exportacao.

## Regras de Seguranca (Prototipo)
1. Manter aviso explicito de seguranca simulada.
2. Nao comunicar seguranca real quando for apenas comportamento visual.
3. Preparar pontos de extensao para autenticacao e criptografia futuras.

## Regras de Entrega
1. Toda nova funcionalidade deve vir com criterio de aceite.
2. Toda alteracao deve registrar impacto esperado em documento de release.
3. Toda evolucao deve preservar build verde no pipeline.