# Nosso Norte Financas

Migracao em andamento do app financeiro de HTML unico para uma SPA React organizada com Vite, agora com empacotamento mobile via Capacitor.

## Ambiente

1. Copie `.env.example` para `.env`.
2. Preencha as variaveis `VITE_FIREBASE_*`.
3. Defina `VITE_BRAPI_TOKEN`.
4. `VITE_GEMINI_API_KEY` e opcional. Se ficar vazio, a chave pode continuar sendo informada pela tela de configuracoes.

## Scripts

- `npm run dev`: inicia o app web localmente.
- `npm run build`: compila o app para producao.
- `npm run test`: roda testes unitarios e smoke test.
- `npm run mobile:sync`: gera o build web e sincroniza o projeto Android.
- `npm run mobile:open:android`: abre o projeto Android no Android Studio.

## Estrutura

- `src/App.jsx`: orquestracao principal do app.
- `src/components/`: telas, modais e blocos extraidos do legado.
- `src/domain/finance/`: calculos financeiros protegidos por testes.
- `src/services/firebase.js`: inicializacao Firebase via `import.meta.env`.
- `src/config/`: dados estaticos e configuracoes de runtime.
- `legacy/index.legacy.html`: copia intacta do HTML original.
- `android/`: shell mobile Android gerado por Capacitor.

## Mobile

O app mobile usa o mesmo build web do Vite dentro do container Android do Capacitor.

Fluxo basico:

1. `npm install`
2. `npm run mobile:sync`
3. `npm run mobile:open:android`

## Estrategia de migracao

O objetivo segue o mesmo: reduzir risco em etapas pequenas, preservar comportamento e so melhorar arquitetura quando a equivalencia estiver validada por build e testes.
