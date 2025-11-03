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

// Função para gerar o menu HTML
function getMenuHTML(activePage = '') {
  const menuItems = [
    { href: 'products.html', label: 'Produtos', id: 'products' },
    { href: 'cart.html', label: 'Carrinho', id: 'cart' },
    { href: 'loyalty.html', label: 'Fidelidade', id: 'loyalty' },
    { href: 'order.html', label: 'Pedidos', id: 'order' }
  ];
  
  const navItems = menuItems.map(item => 
    `<li${activePage === item.id ? ' class="active"' : ''}><a href="${item.href}">${item.label}</a></li>`
  ).join('');
  
  return `
    <!-- Barra superior -->
    <header class="top-header">
      <div class="top-header-left">
      </div>
      <div class="top-header-center">
        <div class="logo-text-new">
          <span>Cupcakes</span>
          <svg class="logo-cupcake-icon" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="25" width="16" height="8" fill="#9d4edd"/>
            <rect x="8" y="20" width="24" height="8" fill="#4361ee"/>
            <rect x="6" y="16" width="28" height="6" fill="#48cae4"/>
            <rect x="4" y="12" width="32" height="6" fill="#52b788"/>
            <rect x="2" y="8" width="36" height="6" fill="#ffd60a"/>
            <rect x="18" y="4" width="4" height="6" fill="#e63946"/>
          </svg>
          <span>do JP</span>
        </div>
      </div>
      <div class="top-header-right">
        <a href="login.html">
          <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4"/>
            <path d="M6 20c0-4 2.5-6 6-6s6 2 6 6"/>
          </svg>
        </a>
        <a href="cart.html">
          <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </a>
      </div>
    </header>

    <!-- Menu de navegação -->
    <nav class="bottom-nav">
      <ul class="nav-links">
        ${navItems}
      </ul>
    </nav>
  `;
}

// Exporta no escopo global (se quiser acessar via console)
window.App = { API, setToken, getToken, clearToken, authHeaders, api, fmtBRL, getMenuHTML };
