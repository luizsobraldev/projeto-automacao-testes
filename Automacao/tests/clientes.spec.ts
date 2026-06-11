// ============================================================
// tests/clientes.spec.ts
// Testes automatizados da tela de Clientes (N2 - Testes de Software)
// Sistema: FNR Controle de Vendas
//
// ⚠️  TODOS OS TESTES SÃO 100% INDEPENDENTES (CADA UM CRIA SEU DADO)
// ============================================================

import { test, expect, Page } from '@playwright/test'
import * as fs from 'fs'

// ─────────────────────────────────────────────────────────────
// FUNÇÕES AUXILIARES / AÇÕES ENCAPSULADAS
// ─────────────────────────────────────────────────────────────

/**
 * Faz login no sistema com email e senha corretos do seed.
 */
async function fazerLogin(page: Page) {
  await page.goto('/')
  await expect(page.getByPlaceholder('seu@email.com')).toBeVisible()
  await page.getByPlaceholder('seu@email.com').fill('admin@vendas.com')
  await page.getByPlaceholder('••••••••').fill('admin123')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 })
}

/**
 * Navega para a tela de Clientes clicando na Sidebar.
 * Evita o bug de redirect assíncrono do React ao recarregar a URL diretamente.
 */
async function acessarClientes(page: Page) {
  if (!page.url().endsWith('/clientes')) {
    await page.getByRole('listitem').filter({ hasText: 'Clientes' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible()
}

/**
 * Preenche o formulário de Clientes usando seletores flexíveis baseados em normalize-space.
 */
async function preencherFormularioCliente(page: Page, dados: { nome: string; cpfCnpj: string; responsavel: string; telefone?: string; email?: string }) {
  // Nome
  const campoNome = page.locator('xpath=(//label[contains(normalize-space(.), "Nome")]/following::input)[1]')
  await expect(campoNome).toBeVisible()
  await campoNome.fill(dados.nome)

  // CPF/CNPJ
  const campoCpfCnpj = page.locator('xpath=(//label[contains(normalize-space(.), "CPF") or contains(normalize-space(.), "CNPJ")]/following::input)[1]')
  await expect(campoCpfCnpj).toBeVisible()
  await campoCpfCnpj.fill(dados.cpfCnpj)

  // Responsável
  const campoResponsavel = page.locator('xpath=(//label[contains(normalize-space(.), "Responsável")]/following::input)[1]')
  await expect(campoResponsavel).toBeVisible()
  await campoResponsavel.fill(dados.responsavel)

  // Telefone (opcional)
  if (dados.telefone) {
    const campoTelefone = page.locator('xpath=(//label[contains(normalize-space(.), "Telefone")]/following::input)[1]')
    if (await campoTelefone.count() > 0) {
      await campoTelefone.fill(dados.telefone)
    }
  }

  // Email (opcional)
  if (dados.email) {
    const campoEmail = page.locator('xpath=(//label[contains(normalize-space(.), "Email")]/following::input)[1]')
    if (await campoEmail.count() > 0) {
      await campoEmail.fill(dados.email)
    }
  }
}

/**
 * Cadastra um novo cliente com dados válidos e únicos.
 */
async function criarCliente(page: Page, nomeCliente: string) {
  const timestamp = Date.now()
  const cpfCnpj = `${timestamp}`.slice(-11)
  const responsavel = `Responsavel CT`

  // Clica no botão de novo cadastro
  await page.getByRole('button', { name: '+ Novo Cliente' }).click()
  await expect(page.getByRole('heading', { name: 'Novo Cliente' })).toBeVisible()

  // Preenche usando a função auxiliar com os seletores flexíveis
  await preencherFormularioCliente(page, {
    nome: nomeCliente,
    cpfCnpj: cpfCnpj,
    responsavel: responsavel,
    telefone: '(11) 99999-1234',
    email: `cliente${timestamp}@teste.com`
  })

  // Salva e aguarda fechar
  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByRole('heading', { name: 'Novo Cliente' })).not.toBeVisible({ timeout: 10_000 })
  await page.waitForTimeout(1000)
}

/**
 * Filtra a listagem usando o campo de busca.
 */
async function buscarClientePorNome(page: Page, nomeCliente: string) {
  const campoBusca = page.getByPlaceholder('Buscar por nome...')
  await campoBusca.fill('')
  await campoBusca.fill(nomeCliente)
  await page.waitForTimeout(1500) // Aguarda a busca assíncrona do front
}

/**
 * Edita o nome de um cliente existente.
 */
async function editarCliente(page: Page, nomeAtual: string, nomeNovo: string) {
  await buscarClientePorNome(page, nomeAtual)
  
  // Clica em editar na linha correspondente
  const linha = page.locator('tr', { hasText: nomeAtual })
  await linha.getByRole('button', { name: 'Editar' }).click()
  await expect(page.getByRole('heading', { name: 'Editar Cliente' })).toBeVisible()

  // Limpa e atualiza o nome usando seletor flexível
  const campoNome = page.locator('xpath=(//label[contains(normalize-space(.), "Nome")]/following::input)[1]')
  await campoNome.fill('')
  await campoNome.fill(nomeNovo)

  // Salva e aguarda fechar
  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByRole('heading', { name: 'Editar Cliente' })).not.toBeVisible({ timeout: 10_000 })
  await page.waitForTimeout(1000)
}

/**
 * Inativa um cliente ativo da listagem.
 */
async function inativarCliente(page: Page, nomeCliente: string) {
  await buscarClientePorNome(page, nomeCliente)
  
  // Clica no botão Inativar do cliente
  const linha = page.locator('tr', { hasText: nomeCliente })
  await linha.getByRole('button', { name: 'Inativar' }).click()
  await page.waitForTimeout(1500)
}

/**
 * Marca a opção de mostrar clientes inativos na tabela.
 */
async function marcarMostrarInativos(page: Page) {
  await page.getByLabel('Mostrar inativos').check()
  await page.waitForTimeout(1500)
}

/**
 * Reativa um cliente inativo.
 */
async function reativarCliente(page: Page, nomeCliente: string) {
  await buscarClientePorNome(page, nomeCliente)

  // Clica no botão Reativar do cliente
  const linha = page.locator('tr', { hasText: nomeCliente })
  await linha.getByRole('button', { name: 'Reativar' }).click()
  await page.waitForTimeout(1500)
}

/**
 * Garante a existência do diretório de evidências.
 */
function garantirPastaEvidencias() {
  if (!fs.existsSync('evidencias')) {
    fs.mkdirSync('evidencias', { recursive: true })
  }
}

// ─────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────
test.beforeEach(async ({ page }) => {
  garantirPastaEvidencias()
  await fazerLogin(page)
})

// ─────────────────────────────────────────────────────────────
// ESTRUTURA DOS TESTES (CT01 A CT06)
// ─────────────────────────────────────────────────────────────

test('CT01 - Cadastrar cliente com dados válidos', async ({ page }) => {
  const timestamp = Date.now()
  const nomeCliente = `Cliente CT01 ${timestamp}`

  await acessarClientes(page)
  await criarCliente(page, nomeCliente)

  // Validação: Cliente deve aparecer na listagem
  await buscarClientePorNome(page, nomeCliente)
  await expect(page.getByText(nomeCliente)).toBeVisible()

  await page.screenshot({ path: 'evidencias/CT01-cadastro-cliente-valido.png', fullPage: true })
})

test('CT02 - Buscar cliente pelo nome', async ({ page }) => {
  const timestamp = Date.now()
  const nomeCliente = `Cliente CT02 ${timestamp}`

  await acessarClientes(page)
  await criarCliente(page, nomeCliente)

  // Realiza a busca pelo cliente recém-criado
  await buscarClientePorNome(page, nomeCliente)

  // Validação: Somente o cliente buscado deve aparecer
  await expect(page.getByText(nomeCliente)).toBeVisible()

  await page.screenshot({ path: 'evidencias/CT02-busca-cliente-nome.png', fullPage: true })
})

test('CT03 - Editar cliente', async ({ page }) => {
  const timestamp = Date.now()
  const nomeCliente = `Cliente CT03 ${timestamp}`
  const nomeNovo = `Cliente CT03 Editado ${timestamp}`

  await acessarClientes(page)
  await criarCliente(page, nomeCliente)

  // Edita os dados do cliente criado
  await editarCliente(page, nomeCliente, nomeNovo)

  // Validação: Confirma que as novas alterações estão refletidas
  await buscarClientePorNome(page, nomeNovo)
  await expect(page.getByText(nomeNovo)).toBeVisible()

  await page.screenshot({ path: 'evidencias/CT03-editar-cliente.png', fullPage: true })
})

test('CT04 - Inativar cliente', async ({ page }) => {
  const timestamp = Date.now()
  const nomeCliente = `Cliente CT04 ${timestamp}`

  await acessarClientes(page)
  await criarCliente(page, nomeCliente)

  // Inativa o cliente
  await inativarCliente(page, nomeCliente)

  // Validação: O cliente não deve mais constar na listagem de ativos
  await buscarClientePorNome(page, nomeCliente)
  await expect(page.getByText(nomeCliente)).not.toBeVisible()

  await page.screenshot({ path: 'evidencias/CT04-inativar-cliente.png', fullPage: true })
})

test('CT05 - Exibir clientes inativos', async ({ page }) => {
  const timestamp = Date.now()
  const nomeCliente = `Cliente CT05 ${timestamp}`

  await acessarClientes(page)
  await criarCliente(page, nomeCliente)
  await inativarCliente(page, nomeCliente)

  // Ativa a exibição dos clientes inativos
  await marcarMostrarInativos(page)

  // Validação: O cliente inativo deve aparecer na listagem
  await buscarClientePorNome(page, nomeCliente)
  await expect(page.getByText(nomeCliente)).toBeVisible()

  await page.screenshot({ path: 'evidencias/CT05-exibir-clientes-inativos.png', fullPage: true })
})

test('CT06 - Reativar cliente', async ({ page }) => {
  const timestamp = Date.now()
  const nomeCliente = `Cliente CT06 ${timestamp}`

  await acessarClientes(page)
  await criarCliente(page, nomeCliente)
  await inativarCliente(page, nomeCliente)

  // Mostra inativos, reativa o cliente e oculta os inativos de novo
  await marcarMostrarInativos(page)
  await reativarCliente(page, nomeCliente)

  await page.getByLabel('Mostrar inativos').uncheck()
  await page.waitForTimeout(1000)

  // Validação: O cliente deve reaparecer na listagem normal (ativos)
  await buscarClientePorNome(page, nomeCliente)
  await expect(page.getByText(nomeCliente)).toBeVisible()

  await page.screenshot({ path: 'evidencias/CT06-reativar-cliente.png', fullPage: true })
})
