// ============================================================
// tests/bugs-evidencias.spec.ts
// Registro de evidências de comportamentos incorretos (bugs)
// Sistema: FNR Controle de Vendas
//
// ⚠️  ATENÇÃO: Estes testes servem para gerar screenshots de bugs.
// Eles NÃO possuem expect() que quebrem o fluxo para não travar
// a execução. Eles apenas registram o estado da aplicação.
//
// Comando para executar as evidências de bugs:
//   npm run test:bugs
// ============================================================

import { test, expect, Page } from '@playwright/test'
import * as fs from 'fs'

// ─────────────────────────────────────────────────────────────
// FUNÇÕES AUXILIARES / AÇÕES ENCAPSULADAS
// ─────────────────────────────────────────────────────────────

/**
 * Faz login no sistema com credenciais corretas.
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
 * Navega para Clientes pela sidebar.
 */
async function acessarClientes(page: Page) {
  if (!page.url().endsWith('/clientes')) {
    await page.getByRole('listitem').filter({ hasText: 'Clientes' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible()
}

/**
 * Navega para Produtos pela sidebar.
 */
async function acessarProdutos(page: Page) {
  if (!page.url().endsWith('/produtos')) {
    await page.getByRole('listitem').filter({ hasText: 'Produtos' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible()
}

/**
 * Garante que existe pelo menos uma categoria antes de testar produtos.
 */
async function garantirCategoriaExistente(page: Page) {
  if (!page.url().endsWith('/categorias')) {
    await page.getByRole('listitem').filter({ hasText: 'Categorias' }).click()
  }
  await page.waitForTimeout(1500)

  const quantidade = await page.locator('tbody tr').count()

  if (quantidade === 0) {
    await page.getByRole('button', { name: /novo/i }).first().click()
    await page.waitForTimeout(500)

    const inputNome = page.getByRole('textbox').first()
    await inputNome.fill(`Categoria Bug Automatica`)
    await page.getByRole('button', { name: 'Salvar' }).click()
    await page.waitForTimeout(1500)
  }
}

/**
 * Preenche o formulário de Clientes usando seletores flexíveis.
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
 * Preenche o formulário de Produtos usando seletores flexíveis.
 */
async function preencherFormularioProduto(page: Page, dados: {
  tipo: string
  quantidade: string
  valorUnitario: string
  valorTotal: string
  unidadeMedida?: string
  selecionarCategoria?: boolean
}) {
  // Tipo
  const campoTipo = page.locator('xpath=(//label[contains(normalize-space(.), "Tipo")]/following::input)[1]')
  await expect(campoTipo).toBeVisible()
  await campoTipo.fill(dados.tipo)

  // Quantidade
  const campoQtd = page.locator('xpath=(//label[contains(normalize-space(.), "Quantidade")]/following::input)[1]')
  await expect(campoQtd).toBeVisible()
  await campoQtd.fill(dados.quantidade)

  // Valor Unitário
  const campoValUnit = page.locator('xpath=(//label[contains(normalize-space(.), "Valor Unit")]/following::input)[1]')
  await expect(campoValUnit).toBeVisible()
  await campoValUnit.fill(dados.valorUnitario)

  // Valor Total
  const campoValTotal = page.locator('xpath=(//label[contains(normalize-space(.), "Valor Total")]/following::input)[1]')
  await expect(campoValTotal).toBeVisible()
  await campoValTotal.fill(dados.valorTotal)

  // Unidade de Medida (opcional)
  if (dados.unidadeMedida) {
    const campoUnidade = page.locator('xpath=(//label[contains(normalize-space(.), "Unidade Medida")]/following::input)[1]')
    if (await campoUnidade.count() > 0) {
      await campoUnidade.fill(dados.unidadeMedida)
    }
  }

  // Categoria (opcional / condicional)
  if (dados.selecionarCategoria !== false) {
    const selectCategoria = page.locator('xpath=(//label[contains(normalize-space(.), "Categoria")]/following::select)[1]')
    await expect(selectCategoria).toBeVisible()
    await selectCategoria.selectOption({ index: 1 })
  }
}

/**
 * Garante que o diretório de evidências exista.
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
// SUÍTE DE BUGS E CENÁRIOS NEGATIVOS (RODA COM --grep "@bugs")
// ─────────────────────────────────────────────────────────────
test.describe('Evidências de Bugs - Cenários Negativos', () => {

  test('BUG01 @bugs - Cliente permite cadastrar CPF/CNPJ inválido', async ({ page }) => {
    const timestamp = Date.now()
    const nomeCliente = `Bug Cliente ${timestamp}`

    await acessarClientes(page)
    await page.getByRole('button', { name: '+ Novo Cliente' }).click()
    await expect(page.getByRole('heading', { name: 'Novo Cliente' })).toBeVisible()

    // Preenche com CPF inválido propositalmente (ex: texto 'TESTE')
    await preencherFormularioCliente(page, {
      nome: nomeCliente,
      cpfCnpj: 'TESTE',
      responsavel: 'Responsavel Bug',
      telefone: '(11) 99999-9999',
      email: `bug${timestamp}@teste.com`
    })

    // Tenta salvar
    await page.getByRole('button', { name: 'Salvar' }).click()
    await page.waitForTimeout(2000)

    // Tira print para registrar se salvou ou se barrou
    await page.screenshot({ path: 'evidencias/BUG01-cpf-cnpj-invalido.png', fullPage: true })
  })

  test('BUG02 @bugs - Produto permite cadastrar quantidade inválida', async ({ page }) => {
    const timestamp = Date.now()
    const tipoProduto = `Bug Produto Qtd ${timestamp}`

    await garantirCategoriaExistente(page)
    await acessarProdutos(page)
    await page.getByRole('button', { name: '+ Novo Produto' }).click()
    await expect(page.getByRole('heading', { name: 'Novo Produto' })).toBeVisible()

    // Preenche com quantidade negativa (-5) propositalmente
    await preencherFormularioProduto(page, {
      tipo: tipoProduto,
      quantidade: '-5',
      valorUnitario: '10.00',
      valorTotal: '50.00',
      unidadeMedida: 'UN',
      selecionarCategoria: true
    })

    // Tenta salvar
    await page.getByRole('button', { name: 'Salvar' }).click()
    await page.waitForTimeout(2000)

    // Tira print da evidência
    await page.screenshot({ path: 'evidencias/BUG02-quantidade-invalida.png', fullPage: true })
  })

  test('BUG03 @bugs - Produto permite cadastrar valor unitário inválido', async ({ page }) => {
    const timestamp = Date.now()
    const tipoProduto = `Bug Produto Preco ${timestamp}`

    await garantirCategoriaExistente(page)
    await acessarProdutos(page)
    await page.getByRole('button', { name: '+ Novo Produto' }).click()
    await expect(page.getByRole('heading', { name: 'Novo Produto' })).toBeVisible()

    // Preenche com valor unitário negativo (-10) e total negativo (-50)
    await preencherFormularioProduto(page, {
      tipo: tipoProduto,
      quantidade: '5',
      valorUnitario: '-10.00',
      valorTotal: '-50.00',
      unidadeMedida: 'UN',
      selecionarCategoria: true
    })

    // Tenta salvar
    await page.getByRole('button', { name: 'Salvar' }).click()
    await page.waitForTimeout(2000)

    // Tira print da evidência
    await page.screenshot({ path: 'evidencias/BUG03-valor-unitario-invalido.png', fullPage: true })
  })

  test('BUG04 @bugs - Produto permite salvar sem categoria', async ({ page }) => {
    const timestamp = Date.now()
    const tipoProduto = `Bug Produto Sem Cat ${timestamp}`

    await acessarProdutos(page)
    await page.getByRole('button', { name: '+ Novo Produto' }).click()
    await expect(page.getByRole('heading', { name: 'Novo Produto' })).toBeVisible()

    // Preenche campos deixando Categoria em "Selecione..." (não seleciona)
    await preencherFormularioProduto(page, {
      tipo: tipoProduto,
      quantidade: '3',
      valorUnitario: '15.00',
      valorTotal: '45.00',
      unidadeMedida: 'UN',
      selecionarCategoria: false
    })

    // Tenta salvar
    await page.getByRole('button', { name: 'Salvar' }).click()
    await page.waitForTimeout(2000)

    // Tira print da evidência
    await page.screenshot({ path: 'evidencias/BUG04-produto-sem-categoria.png', fullPage: true })
  })

})
