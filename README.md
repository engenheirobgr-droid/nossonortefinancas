# Nosso Norte Finanças

Migração em andamento do app financeiro de HTML único para uma SPA React organizada com Vite.

## Scripts

- `npm run dev`: inicia o app localmente.
- `npm run build`: compila o app para produção.
- `npm run test:smoke`: abre o app no navegador, valida a tela inicial e completa o login do Bruno.

## Estrutura

- `src/App.jsx`: app migrado do HTML legado, ainda concentrando a maior parte da lógica para evitar regressões.
- `src/main.jsx`: bootstrap React.
- `src/services/firebase.js`: inicialização Firebase compat.
- `src/styles.css`: estilos extraídos do HTML legado.
- `public/`: assets servidos pelo Vite.
- `legacy/index.legacy.html`: cópia intacta do `index.html` original usado como referência de comportamento.

## Estratégia de Migração

O objetivo é reduzir risco em etapas pequenas. Primeiro o app precisa compilar e passar em smoke tests; depois a lógica financeira será extraída em módulos com testes de cenário antes de qualquer alteração comportamental.
