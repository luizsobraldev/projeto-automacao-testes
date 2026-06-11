# 🧪 Testes Automatizados — FNR Controle de Vendas

## 1. Objetivo do Projeto

Este projeto contém os **testes automatizados de software** desenvolvidos como atividade acadêmica (N2) para a avaliação da disciplina de Testes de Software.

O objetivo é validar o funcionamento correto das telas de **Clientes** e **Produtos** do sistema FNR Controle de Vendas, garantindo que os fluxos principais funcionem conforme esperado e documentando cenários com comportamentos incorretos (bugs).

---

## 2. Sistema Testado

**FNR Controle de Vendas**
- Repositório original: https://github.com/JakesDourado/fnr_controle_de_vendas
- Frontend: http://localhost:5173
- Backend: http://localhost:3333

---

## 3. Telas Testadas

| Tela      | Rota        | Testes         |
|-----------|-------------|----------------|
| Clientes  | `/clientes` | CT01 ao CT06   |
| Produtos  | `/produtos` | CT07 ao CT10   |

---

## 4. Tecnologias Utilizadas

| Tecnologia       | Versão     | Uso                          |
|-----------------|------------|------------------------------|
| Node.js          | >= 18.x    | Ambiente de execução          |
| TypeScript       | ^5.0       | Linguagem dos testes          |
| Playwright       | ^1.44      | Framework de automação        |
| Chromium         | (automático)| Navegador usado nos testes   |

---

## 5. Como Instalar as Dependências

> ⚠️ **Pré-requisito**: O sistema FNR deve estar rodando localmente antes de executar os testes.
> - Frontend: `http://localhost:5173`
> - Backend: `http://localhost:3333`

### Passo 1 — Instalar pacotes Node.js
```bash
npm install
```

### Passo 2 — Instalar os navegadores do Playwright
```bash
npx playwright install
```

---

## 6. Como Executar os Testes

### A. Rodar os 10 testes principais (Cenários Positivos / Fluxos Felizes)
Estes são os testes que rodam de forma 100% estável e independente (preparam e isolam seus próprios dados). Execute com:

```bash
npx playwright test tests/clientes.spec.ts tests/produtos.spec.ts --headed --slow-mo=500
```

### B. Rodar as evidências de Bugs (Cenários Negativos)
Estes testes documentam os comportamentos incorretos identificados manualmente. Eles não possuem asserções que validem o erro como falha do teste, de modo que servem apenas para simular o comportamento inadequado e registrar as imagens como evidência. Execute com:

```bash
npx playwright test tests/bugs-evidencias.spec.ts --grep "@bugs" --headed --slow-mo=500
```

---

## 7. Como Visualizar o Relatório HTML

Após executar qualquer um dos comandos de testes, você pode abrir o relatório interativo com:

```bash
npx playwright show-report
```

---

## 8. Onde Ficam as Evidências (Screenshots)

Os prints de evidências são salvos de forma automatizada no final de cada teste na pasta:

```
evidencias/
```

### Prints da Suíte Principal (10 Testes Felizes):
* `evidencias/CT01-cadastro-cliente-valido.png`
* `evidencias/CT02-busca-cliente-nome.png`
* `evidencias/CT03-editar-cliente.png`
* `evidencias/CT04-inativar-cliente.png`
* `evidencias/CT05-exibir-clientes-inativos.png`
* `evidencias/CT06-reativar-cliente.png`
* `evidencias/CT07-cadastro-produto-valido.png`
* `evidencias/CT08-editar-produto.png`
* `evidencias/CT09-inativar-produto.png`
* `evidencias/CT10-reativar-produto.png`

### Prints dos Cenários Negativos (Bugs Documentados):
* `evidencias/BUG01-cpf-cnpj-invalido.png`
* `evidencias/BUG02-quantidade-invalida.png`
* `evidencias/BUG03-valor-unitario-invalido.png`
* `evidencias/BUG04-produto-sem-categoria.png`

---

## 9. Lista dos 10 Testes Principais

### 🧾 Tela de Clientes

| ID   | Nome do Teste                   | Fluxo / Validação                                   |
|------|---------------------------------|------------------------------------------------------|
| CT01 | Cadastrar cliente com dados válidos | Cadastra um novo cliente e valida sua presença na tabela |
| CT02 | Buscar cliente pelo nome        | Cadastra um cliente e valida se o filtro localiza o registro |
| CT03 | Editar cliente                  | Cadastra um cliente, edita o nome e valida a alteração na tabela |
| CT04 | Inativar cliente                | Cadastra um cliente, inativa-o e valida se ele sumiu da lista ativa |
| CT05 | Exibir clientes inativos        | Cadastra, inativa, marca checkbox e valida se ele aparece como inativo |
| CT06 | Reativar cliente                | Cadastra, inativa, ativa inativos, reativa, e valida se voltou para ativos |

### 📦 Tela de Produtos

| ID   | Nome do Teste                   | Fluxo / Validação                                   |
|------|---------------------------------|------------------------------------------------------|
| CT07 | Cadastrar produto com dados válidos | Cadastra um produto e valida se ele aparece na listagem |
| CT08 | Editar produto                  | Cadastra um produto, altera tipo/qtd e valida as novas informações |
| CT09 | Inativar produto                | Cadastra um produto, inativa-o e valida sua saída dos ativos |
| CT10 | Reativar produto                | Cadastra, inativa, reativa e valida se retornou à listagem padrão |

---

## 10. Estrutura do Projeto

```
fnr-testes-playwright/
├── tests/
│   ├── clientes.spec.ts        # CT01 ao CT06 (Suíte principal de Clientes)
│   ├── produtos.spec.ts        # CT07 ao CT10 (Suíte principal de Produtos)
│   └── bugs-evidencias.spec.ts  # Cenários negativos de bugs (@bugs)
├── evidencias/                 # Screenshots gerados pelos testes
├── playwright-report/          # Relatório HTML (gerado após execução)
├── playwright.config.ts        # Configuração do Playwright
├── package.json                # Dependências e scripts
├── tsconfig.json               # Configuração do TypeScript
└── README.md                   # Este arquivo
```

---

## 11. Credenciais de Teste Utilizadas

Os testes utilizam as credenciais padrão geradas pelo script de *seed* do backend:
- **Email**: `admin@vendas.com`
- **Senha**: `admin123`

---

*Projeto desenvolvido para fins acadêmicos — Avaliação N2 da disciplina de Testes de Software*
