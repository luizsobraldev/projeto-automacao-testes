// ============================================================
// playwright.config.ts
// Arquivo de configuração central do Playwright
// ============================================================
// Este arquivo diz ao Playwright:
//   - Onde está o frontend (baseURL)
//   - Qual navegador usar
//   - Onde salvar o relatório HTML
//   - Timeout padrão para as ações

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Pasta onde ficam os arquivos de teste
  testDir: './tests',

  // Número máximo de tentativas em caso de falha (0 = sem retry)
  retries: 0,

  // Rodar os testes um por um (em sequência), para evitar conflitos de dados
  workers: 1,

  // Timeout padrão para cada teste (em milissegundos): 60 segundos
  timeout: 60_000,

  // Timeout para cada asserção (expect): 10 segundos
  expect: {
    timeout: 10_000,
  },

  // Configuração do relatório HTML
  // Após rodar os testes, abra com: npx playwright show-report
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'], // também mostra no terminal linha a linha
  ],

  // Configuração que se aplica a todos os testes
  use: {
    // URL base do frontend rodando localmente
    baseURL: 'http://localhost:5173',

    // Captura screenshot somente quando o teste falha
    screenshot: 'only-on-failure',

    // Gravar vídeo somente quando o teste falha
    video: 'retain-on-failure',

    // Mostrar o navegador? false = modo headless (sem janela visível)
    headless: true,

    // Aceitar erros de SSL (não se aplica aqui, mas é boa prática)
    ignoreHTTPSErrors: true,
  },

  // Projetos: quais navegadores testar
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
