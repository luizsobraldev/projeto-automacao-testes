# Projeto de Automação de Testes — FNR Controle de Vendas

## Objetivo

Este repositório contém os artefatos desenvolvidos para a avaliação N2 da disciplina de Testes de Software. O objetivo do projeto é aplicar testes manuais e automatizados em uma aplicação real, validando funcionalidades das telas de Clientes e Produtos do sistema FNR Controle de Vendas.

## Sistema Testado

* **Sistema:** FNR Controle de Vendas
* **Repositório original:** https://github.com/JakesDourado/fnr_controle_de_vendas
* **Frontend local:** http://localhost:5173
* **Backend local:** http://localhost:3333

---

## Estrutura do Repositório

```txt
projeto-automacao-testes/
├── Automacao/                  # Pasta com os testes automatizados (Playwright)
│   ├── tests/                  # Cenários de teste (.spec.ts)
│   ├── evidencias/             # Capturas de tela de cada execução (screenshots)
│   ├── playwright.config.ts    # Configuração global do Playwright
│   ├── package.json            # Scripts e dependências do Node.js para os testes
│   └── README.md               # Documentação interna dos testes
├── Projeto/                    # Pasta com o sistema base e documentação
│   ├── back/                   # API / Backend da aplicação (Express + SQLite)
│   ├── front/                  # Client / Frontend da aplicação (React + Vite)
│   ├── Plano de Teste.pdf      # Documento do Plano de Testes (N2)
│   ├── Projeto de Teste.pdf    # Documento do Projeto de Testes (N2)
│   └── README.md               # Documentação interna do sistema base
└── README.md                   # Documentação principal na raiz
```

---

## Documentação

A pasta `Projeto` contém os documentos exigidos na atividade:

* **Plano de Teste** — Planejamento geral das atividades e cenários a testar.
* **Projeto de Teste** — Casos de teste detalhados.

---

## Automação

A pasta `Automacao` contém os testes automatizados desenvolvidos com **Playwright** e **TypeScript**.

---

## Tecnologias Utilizadas

### Sistema Base (FNR Controle de Vendas)
* **Frontend:** React 19, TypeScript 5.8, Vite 6, Material UI 7, Chart.js, React Router DOM 7, Axios.
* **Backend:** Node.js v20+, TypeScript 5.3, Express 4.18, Prisma ORM 5.7, JWT (jsonwebtoken), bcryptjs.
* **Banco de Dados:** SQLite (`dev.db`).

### Suíte de Automação
* Node.js
* TypeScript
* Playwright
* Chromium
* Git & GitHub

---

## Como Executar o Sistema Base

Antes de rodar os testes automatizados, certifique-se de que a aplicação base está em execução localmente.

### 1. Iniciar o Backend
Acesse a pasta do backend:
```bash
cd Projeto/back
```

Instale as dependências:
```bash
npm install
```

Crie o arquivo de variáveis de ambiente:
* No Windows (PowerShell):
  ```powershell
  Copy-Item .env.example .env
  ```
* No Linux/macOS ou Git Bash:
  ```bash
  cp .env.example .env
  ```

Execute as migrations do banco de dados SQLite:
```bash
npx prisma migrate dev
```

Inicie o servidor:
```bash
npm start
```
*O backend estará rodando em: `http://localhost:3333`*

### 2. Iniciar o Frontend
Em um novo terminal, acesse a pasta do frontend:
```bash
cd Projeto/front
```

Instale as dependências:
```bash
npm install
```

Inicie o servidor de desenvolvimento:
```bash
npm start
```
*O frontend estará rodando em: `http://localhost:5173`*

---

## Como Executar os Testes

Após garantir que o sistema FNR Controle de Vendas está rodando nas portas padrão, abra outro terminal e siga as instruções a seguir:

Acesse a pasta de automação:
```bash
cd Automacao
```

Instale as dependências:
```bash
npm install
```

Instale os navegadores necessários para o Playwright:
```bash
npx playwright install
```

### Comandos de Execução dos Testes

* **Executar os 10 testes principais (Cenários Positivos / Fluxos Felizes):**
  ```bash
  npm run test:headed
  ```
  *(Ou use a flag `--slow-mo=500` rodando diretamente: `npx playwright test tests/clientes.spec.ts tests/produtos.spec.ts --headed --slow-mo=500`)*

* **Executar os cenários de bugs / negativos:**
  ```bash
  npm run test:bugs
  ```
  *(Este comando executa especificamente os testes com a tag `@bugs` em modo visível)*

* **Abrir o relatório interativo HTML do Playwright:**
  ```bash
  npm run report
  ```

---

## Testes Automatizados Principais

| ID   | Tela     | Cenário | Descrição / Validação |
| ---- | -------- | ------- | --------------------- |
| **CT01** | Clientes | Cadastrar cliente com dados válidos | Cadastra um novo cliente e valida sua presença na tabela |
| **CT02** | Clientes | Buscar cliente pelo nome | Cadastra um cliente e valida se o filtro localiza o registro |
| **CT03** | Clientes | Editar cliente | Cadastra um cliente, edita o nome e valida a alteração na tabela |
| **CT04** | Clientes | Inativar cliente | Cadastra um cliente, inativa-o e valida se ele sumiu da lista ativa |
| **CT05** | Clientes | Exibir clientes inativos | Cadastra, inativa, marca checkbox e valida se ele aparece como inativo |
| **CT06** | Clientes | Reativar cliente | Cadastra, inativa, ativa inativos, reativa, e valida se voltou para ativos |
| **CT07** | Produtos | Cadastrar produto com dados válidos | Cadastra um produto e valida se ele aparece na listagem |
| **CT08** | Produtos | Editar produto | Cadastra um produto, altera tipo/qtd e valida as novas informações |
| **CT09** | Produtos | Inativar produto | Cadastra um produto, inativa-o e valida sua saída dos ativos |
| **CT10** | Produtos | Reativar produto | Cadastra, inativa, reativa e valida se retornou à listagem padrão |

---

## Bugs Documentados

A tabela abaixo lista os comportamentos inconsistentes mapeados e testados com Playwright:

| ID    | Tela     | Bug | Comportamento Inadequado Encontrado |
| ----- | -------- | --- | ----------------------------------- |
| **BUG01** | Clientes | CPF/CNPJ Inválido | Sistema permite cadastrar CPF/CNPJ inválido (ex: números sequenciais). |
| **BUG02** | Produtos | Quantidade Inválida | Sistema permite cadastrar produto com quantidade zerada ou negativa. |
| **BUG03** | Produtos | Valor Unitário Inválido | Sistema permite cadastrar produto com valor unitário de zero ou negativo. |
| **BUG04** | Produtos | Categoria em Branco | Sistema permite salvar produto sem selecionar nenhuma categoria. |

---

## Evidências

Os prints das execuções dos testes são tirados automaticamente no final de cada cenário e salvos no diretório:
```txt
Automacao/evidencias/
```

### Imagens Geradas por Cenário

* **Suíte Principal (Fluxo Feliz):**
  * `Automacao/evidencias/CT01-cadastro-cliente-valido.png`
  * `Automacao/evidencias/CT02-busca-cliente-nome.png`
  * `Automacao/evidencias/CT03-editar-cliente.png`
  * `Automacao/evidencias/CT04-inativar-cliente.png`
  * `Automacao/evidencias/CT05-exibir-clientes-inativos.png`
  * `Automacao/evidencias/CT06-reativar-cliente.png`
  * `Automacao/evidencias/CT07-cadastro-produto-valido.png`
  * `Automacao/evidencias/CT08-editar-produto.png`
  * `Automacao/evidencias/CT09-inativar-produto.png`
  * `Automacao/evidencias/CT10-reativar-produto.png`

* **Suíte de Bugs (Cenários Negativos):**
  * `Automacao/evidencias/BUG01-cpf-cnpj-invalido.png`
  * `Automacao/evidencias/BUG02-quantidade-invalida.png`
  * `Automacao/evidencias/BUG03-valor-unitario-invalido.png`
  * `Automacao/evidencias/BUG04-produto-sem-categoria.png`

---

## Credenciais de Teste Utilizadas

Os testes utilizam o usuário gerado no banco de dados através da seed original:
* **E-mail:** `admin@vendas.com`
* **Senha:** `admin123`

---

## Resultado dos Testes

A suíte principal foi executada localmente obtendo aprovação integral de todos os cenários felizes:
```txt
10 testes executados
10 testes aprovados
0 testes reprovados
```

---

## Autor

**Luiz Eduardo Sobral**
