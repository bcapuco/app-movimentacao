const { chromium } = require('playwright');

async function loginComPlaywright(username, senha) {
  console.log('🚀 Iniciando navegador real...');

  const browser = await chromium.launch({
    headless: true // se quiser ver o navegador, coloque false
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🌐 Acessando página de login...');
await page.goto('https://athenas.defensoria.ro.def.br/athenas/ExtLogin/', {
  waitUntil: 'domcontentloaded'
});

console.log(await page.content());

    console.log('✍️ Preenchendo credenciais...');

    await page.fill('input[name="login"]', username);
    await page.fill('input[name="passwd"]', senha);

    await Promise.all([
      page.click('button[type="submit"], input[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle' })
    ]);

    console.log('🔍 Verificando login...');

    const urlAtual = page.url();

    if (urlAtual.includes('ExtLogin')) {
      throw new Error('Login falhou - permaneceu na tela de login');
    }

    console.log('✅ Login realizado com sucesso!');

    const cookies = await context.cookies();

    await browser.close();

    return cookies;

  } catch (err) {
    await browser.close();
    console.error('❌ Erro no login Playwright:', err.message);
    return null;
  }
}

module.exports = { loginComPlaywright };