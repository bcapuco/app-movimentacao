require('dotenv').config();
const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

// Simulação do sessionStore caso você não tenha o arquivo importado
const sessionStore = {
    salvarSessao: async (u, s) => console.log(`💾 Sessão salva para ${u}`),
    carregarSessao: async (u) => null, // Ajuste conforme seu arquivo real
    limparSessoesExpiradas: async () => {}
};

const sessions = new Map();

/* ============================================================
   CRIAR CLIENTE COM SESSÃO (CONFIGURAÇÃO DE HEADERS PADRÃO)
============================================================ */
function criarClienteComSessao(username, session = null) {
    const jar = session?.jar || new CookieJar();
    
    // Se vier de uma sessão salva (string), reconstrói o Jar
    if (session?.cookies && !session.jar) {
        const cookies = session.cookies.split('; ');
        cookies.forEach(c => {
            try { jar.setCookieSync(c, 'https://athenas.defensoria.ro.def.br'); } catch(e){}
        });
    }

    return wrapper(
        axios.create({
            baseURL: 'https://athenas.defensoria.ro.def.br/athenas',
            jar: jar,
            withCredentials: true,
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'pt-BR,pt;q=0.9',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': 'https://athenas.defensoria.ro.def.br',
                'Referer': 'https://athenas.defensoria.ro.def.br/athenas/'
            }
        })
    );
}

/* ============================================================
   LOGIN ATHENAS (FLUXO COMPLETO)
============================================================ */
async function loginAthenas(username, senha) {
  try {

    console.log(`\n🔐 Iniciando autenticação: ${username}`);

    const jar = new CookieJar();
    const client = criarClienteComSessao(username, { jar });

    /* =========================
       PASSO 1 - CARREGAR HOME
    ========================= */

    console.log("🌐 Abrindo página inicial...");
    await client.get('/');

    /* =========================
       PASSO 2 - ABRIR TELA LOGIN
    ========================= */

    console.log("📄 Abrindo ExtLogin...");
    await client.get('/ExtLogin/');

    /* =========================
       PASSO 3 - LOGIN
    ========================= */

    console.log("📤 Enviando credenciais...");

    const loginParams = new URLSearchParams({
      login: username,
      passwd: senha,
      theme: '0'
    });

    const loginRes = await client.post(
      '/ExtLogin/connect/',
      loginParams.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://athenas.defensoria.ro.def.br/athenas/ExtLogin/'
        }
      }
    );

    console.log("📦 RESPOSTA LOGIN:");
    console.log(loginRes.data);

    /* =========================
       DEBUG COOKIES
    ========================= */

    const cookies = await jar.getCookies(
      'https://athenas.defensoria.ro.def.br'
    );

    console.log("\n🍪 COOKIES RECEBIDOS:");

    cookies.forEach(c => {
      console.log(`${c.key} = ${c.value}`);
    });

    if (!cookies.length) {
      console.log("❌ Nenhum cookie retornado");
      return false;
    }

    /* =========================
       PASSO 4 - VALIDAR SESSÃO
    ========================= */

    console.log("\n🔎 Validando sessão...");

    const sessionRes = await client.get(
      '/Application/get_session_information/',
      {
        params: {
          _dc: Date.now()
        }
      }
    );

    console.log("📦 SESSION INFO:");
    console.log(sessionRes.data);

    /* =========================
       SALVAR SESSÃO
    ========================= */

    const cookieStr = cookies
      .map(c => `${c.key}=${c.value}`)
      .join('; ');

    const sessaoData = {
      cookies: cookieStr,
      createdAt: new Date().toISOString(),
      expiraEm: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      jar
    };

    sessions.set(username, sessaoData);

    console.log("✅ Login realizado com sucesso");

    return true;

  } catch (err) {

    console.error("\n❌ ERRO LOGIN:");
    console.error(err.message);

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Resposta:", err.response.data);
    }

    return false;
  }
}

/* ============================================================
   FUNÇÃO PRINCIPAL DE ACESSO (O QUE VOCÊ CHAMA NAS ROTAS)
============================================================ */
async function getClient(username, senha) {
    let session = sessions.get(username);

    if (session) {
        console.log(`♻️  Reutilizando sessão em memória para ${username}`);
        return criarClienteComSessao(username, session);
    }

    const sucesso = await loginAthenas(username, senha);
    if (!sucesso) throw new Error('Falha na autenticação com o Athenas.');

    return criarClienteComSessao(username, sessions.get(username));
}

module.exports = { getClient, loginAthenas };
/* =========================
   VALIDAR SESSÃO
========================= */
async function validarSessao(username) {
  const session = sessions.get(username);
  if (!session) return false;

  try {
    const response = await axios.get(
      'https://athenas.defensoria.ro.def.br/athenas/Application/get_session_information/',
      {
        params: { '_dc': Date.now() },
        headers: {
          'Cookie': session.cookies,
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 5000
      }
    );
    
    return response.status === 200;
  } catch (error) {
    console.log(`❌ Sessão inválida para ${username}`);
    sessions.delete(username);
    return false;
  }
}

module.exports = { 
  getClient,
  loginAthenas,
  validarSessao,

  sessions 
};