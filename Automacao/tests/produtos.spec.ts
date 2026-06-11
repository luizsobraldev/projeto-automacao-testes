// ============================================================
// tests/produtos.spec.ts
// Testes automatizados da tela de Produtos (N2 - Testes de Software)
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
 * Navega para a tela de Produtos clicando na Sidebar.
 */
async function acessarProdutos(page: Page) {
  if (!page.url().endsWith('/produtos')) {
    await page.getByRole('listitem').filter({ hasText: 'Produtos' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible()
}

/**
 * Garante que exista pelo menos uma categoria no banco de dados.
 * Se não houver, navega para /categorias e cria uma. Retorna o nome.
 */
async function garantirCategoriaExistente(page: Page): Promise<string> {
  // Acessa Categorias via Sidebar
  if (!page.url().endsWith('/categorias')) {
    await page.getByRole('listitem').filter({ hasText: 'Categorias' }).click()
  }
  await page.waitForTimeout(1500)

  // Conta a quantidade de linhas para saber se já tem categorias
  const quantidade = await page.locator('tbody tr').count()

  if (quantidade === 0) {
    // Cria categoria padrão
    await page.getByRole('button', { name: /novo/i }).first().click()
    await page.waitForTimeout(500)

    const inputNome = page.getByRole('textbox').first()
    await inputNome.fill(`Categoria Automatica`)
    await page.getByRole('button', { name: 'Salvar' }).click()
    await page.waitForTimeout(1500)
  }

  const primeiraCategoria = page.locator('tbody tr td').first()
  const nomeCategoria = await primeiraCategoria.textContent()
  return nomeCategoria?.trim() || 'Outros'
}

/**
 * Cadastra um novo produto associado a uma categoria.
 */
async function criarProduto(page: Page, tipoProduto: string) {
  await page.getByRole('button', { name: '+ Novo Produto' }).click()
  await expect(page.getByRole('heading', { name: 'Novo Produto' })).toBeVisible()

  // Preenchimento de inputs via XPath devido à ausência de htmlFor/id nas labels no HTML do FNR
  await page.locator('xpath=//label[text()="Tipo *"]/../input').fill(tipoProduto)
  await page.locator('xpath=//label[text()="Quantidade *"]/../input').fill('10')
  await page.locator('xpath=//label[text()="Valor Unit. *"]/../input').fill('25.50')
  await page.locator('xpath=//label[text()="Valor Total *"]/../input').fill('255.00')
  await page.locator('xpath=//label[text()="Unidade Medida"]/../input').fill('UN')

  // Categoria select
  const selectCategoria = page.locator('xpath=//label[text()="Categoria"]/../select')
  await selectCategoria.selectOption({ index: 1 }) // Seleciona a primeira categoria disponível

  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByRole('heading', { name: 'Novo Produto' })).not.toBeVisible({ timeout: 10_000 })
  await page.waitForTimeout(1000)
}

/**
 * Localiza a linha da tabela que contém as informações do produto.
 */
function buscarProduto(page: Page, tipoProduto: string) {
  return page.locator('tr', { hasText: tipoProduto })
}

/**
 * Edita o tipo (nome) e a quantidade de um produto.
 */
async function editarProduto(page: Page, tipoAtual: string, tipoNovo: string) {
  const linha = buscarProduto(page, tipoAtual)
  await expect(linha).toBeVisible()

  await linha.getByRole('button', { name: 'Editar' }).click()
  await expect(page.getByRole('heading', { name: 'Editar Produto' })).toBeVisible()

  // Altera campos
  const campoTipo = page.locator('xpath=//label[text()="Tipo *"]/../input')
  await campoTipo.fill('')
  await campoTipo.fill(tipoNovo)

  const campoQtd = page.locator('xpath=//label[text()="Quantidade *"]/../input')
  await campoQtd.fill('')
  await campoQtd.fill('20')

  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByRole('heading', { name: 'Editar Produto' })).not.toBeVisible({ timeout: 10_000 })
  await page.waitForTimeout(1000)
}

/**
 * Inativa um produto na listagem.
 */
async function inativarProduto(page: Page, tipoProduto: string) {
  const linha = buscarProduto(page, tipoProduto)
  await expect(linha).toBeVisible()

  await linha.getByRole('button', { name: 'Inativar' }).click()
  await page.waitForTimeout(1500)
}

/**
 * Ativa a exibição de inativos.
 */
async function marcarMostrarInativos(page: Page) {
  await page.getByLabel('Mostrar inativos').check()
  await page.waitForTimeout(1500)
}

/**
 * Reativa um produto inativo.
 */
async function reativarProduto(page: Page, tipoProduto: string) {
  const linha = buscarProduto(page, tipoProduto)
  await expect(linha).toBeVisible()

  await linha.getByRole('button', { name: 'Reativar' }).click()
  await page.waitForTimeout(1500)
}

/**
 * Garante que a pasta de evidências exista.
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
// ESTRUTURA DOS TESTES (CT07 A CT10)
// ─────────────────────────────────────────────────────────────

test('CT07 - Cadastrar produto com dados válidos', async ({ page }) => {
  const timestamp = Date.now()
  const tipoProduto = `Produto CT07 ${timestamp}`

  await garantirCategoriaExistente(page)
  await acessarProdutos(page)
  await criarProduto(page, tipoProduto)

  // Validação: Produto deve constar na tabela
  const linha = buscarProduto(page, tipoProduto)
  await expect(linha).toBeVisible()

  await page.screenshot({ path: 'evidencias/CT07-cadastro-produto-valido.png', fullPage: true })
})

test('CT08 - Editar produto', async ({ page }) => {
  const timestamp = Date.now()
  const tipoProduto = `Produto CT08 ${timestamp}`
  const tipoNovo = `Produto CT08 Editado ${timestamp}`

  await garantirCategoriaExistente(page)
  await acessarProdutos(page)
  await criarProduto(page, tipoProduto)

  // Realiza a edição
  await editarProduto(page, tipoProduto, tipoNovo)

  // Validação: Confirma que o novo tipo editado está listado
  const linhaEditada = buscarProduto(page, tipoNovo)
  await expect(linhaEditada).toBeVisible()

  await page.screenshot({ path: 'evidencias/CT08-editar-produto.png', fullPage: true })
})

test('CT09 - Inativar produto', async ({ page }) => {
  const timestamp = Date.now()
  const tipoProduto = `Produto CT09 ${timestamp}`

  await garantirCategoriaExistente(page)
  await acessarProdutos(page)
  await criarProduto(page, tipoProduto)

  // Inativa o produto
  await inativarProduto(page, tipoProduto)

  // Validação: Produto não deve mais constar nos ativos
  const linha = buscarProduto(page, tipoProduto)
  await expect(linha).not.toBeVisible()

  await page.screenshot({ path: 'evidencias/CT09-inativar-produto.png', fullPage: true })
})

test('CT10 - Reativar produto', async ({ page }) => {
  const timestamp = Date.now()
  const tipoProduto = `Produto CT10 ${timestamp}`

  await garantirCategoriaExistente(page)
  await acessarProdutos(page)
  await criarProduto(page, tipoProduto)

  // Inativa o produto recém-criado
  await inativarProduto(page, tipoProduto)

  // Mostra inativos, reativa o produto e oculta os inativos de novo
  await marcarMostrarInativos(page)
  await reativarProduto(page, tipoProduto)

  await page.getByLabel('Mostrar inativos').uncheck()
  await page.waitForTimeout(1000)

  // Validação: Produto voltou à lista padrão (ativos)
  const linha = buscarProduto(page, tipoProduto)
  await expect(linha).toBeVisible()

  await page.screenshot({ path: 'evidencias/CT10-reativar-produto.png', fullPage: true })
})
