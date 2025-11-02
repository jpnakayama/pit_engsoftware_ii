// Utilidades globais para o front
const API = window.location.origin;

function setToken(t) { localStorage.setItem('token', t); }
function getToken() { return localStorage.getItem('token'); }
function clearToken() { localStorage.removeItem('token'); }

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: 'Bearer ' + t } : {};
}

// Chamada de API com tratamento de erro simples
async function api(path, opts = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders(), opts.headers || {});
  const res = await fetch(API + path, Object.assign({}, opts, { headers }));

  const ct = res.headers.get('content-type') || '';
  const isJSON = ct.includes('application/json');

  if (!res.ok) {
    let msg = res.statusText;
    if (isJSON) {
      try { const err = await res.json(); msg = err.message || msg; } catch(_) {}
    }
    alert('Erro: ' + msg);
    throw new Error(msg);
  }
  return isJSON ? res.json() : res.text();
}

function fmtBRL(cents) {
  return (Number(cents || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Exporta no escopo global (se quiser acessar via console)
window.App = { API, setToken, getToken, clearToken, authHeaders, api, fmtBRL };
