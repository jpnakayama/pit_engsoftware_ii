// Utilidades globais para o front
const API = window.location.origin;

function setToken(t) { localStorage.setItem('token', t); }
function getToken() { return localStorage.getItem('token'); }
function clearToken() { localStorage.removeItem('token'); }

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: 'Bearer ' + t } : {};
}

// Sistema de Modal Genérico
function showModal(type, title, message, options = {}) {
  // Remove modal existente se houver
  const existingModal = document.getElementById('genericModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Cores e ícones por tipo
  const modalConfig = {
    error: {
      color: '#e63946',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    success: {
      color: '#52b788',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    warning: {
      color: '#ffd60a',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    info: {
      color: '#4361ee',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    }
  };

  const config = modalConfig[type] || modalConfig.info;
  const showCancel = options.showCancel !== false;
  const onConfirm = options.onConfirm || null;
  const confirmText = options.confirmText || 'OK';
  const cancelText = options.cancelText || 'Cancelar';

  // Criar modal
  const modalHTML = `
    <div id="genericModal" class="generic-modal-overlay" style="display: flex;">
      <div class="generic-modal">
        <div class="generic-modal-icon" style="color: ${config.color};">
          ${config.icon}
        </div>
        <h3 class="generic-modal-title">${title}</h3>
        <p class="generic-modal-message">${message}</p>
        <div class="generic-modal-buttons">
          ${showCancel ? `<button class="generic-modal-btn-secondary" onclick="closeGenericModal()">${cancelText}</button>` : ''}
          <button class="generic-modal-btn-primary" onclick="closeGenericModal(${onConfirm ? 'true' : 'false'})" style="background-color: ${config.color};">
            ${confirmText}
          </button>
        </div>
      </div>
    </div>
  `;

  // Inserir no body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.body.style.overflow = 'hidden';

  // Armazenar callback
  if (onConfirm) {
    window._modalOnConfirm = onConfirm;
  }
}

function closeGenericModal(confirmed = false) {
  const modal = document.getElementById('genericModal');
  if (modal) {
    modal.style.display = 'none';
    setTimeout(() => modal.remove(), 300);
    document.body.style.overflow = '';
    
    if (confirmed && window._modalOnConfirm) {
      window._modalOnConfirm();
      window._modalOnConfirm = null;
    }
  }
}

// Fechar modal ao clicar fora (usando event delegation)
document.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'genericModal') {
    closeGenericModal();
  }
});

// Chamada de API com tratamento de erro usando modal
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
    showModal('error', 'Erro', msg);
    throw new Error(msg);
  }
  return isJSON ? res.json() : res.text();
}

function fmtBRL(cents) {
  return (Number(cents || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para fazer logout
function logout() {
  showModal('info', 'Confirmar Logout', 'Deseja realmente sair?', {
    showCancel: true,
    confirmText: 'Sair',
    cancelText: 'Cancelar',
    onConfirm: () => {
      clearToken();
      // Aguardar um pouco para o modal fechar antes de redirecionar
      setTimeout(() => {
        location.href = 'login.html';
      }, 300);
    }
  });
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
  
  // Verificar se o usuário está logado
  const isLoggedIn = !!getToken();
  
  // Botão de usuário: logout se logado, login se não logado
  const userButton = isLoggedIn 
    ? `<button class="header-icon-btn" onclick="logout()" title="Sair">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>`
    : `<a href="login.html" title="Entrar">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4"/>
          <path d="M6 20c0-4 2.5-6 6-6s6 2 6 6"/>
        </svg>
      </a>`;
  
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
        ${userButton}
        <a href="cart.html" title="Carrinho">
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
window.App = { API, setToken, getToken, clearToken, authHeaders, api, fmtBRL, getMenuHTML, showModal, closeGenericModal, logout };

// Disponibiliza funções globalmente para uso direto
window.showModal = showModal;
window.closeGenericModal = closeGenericModal;
window.logout = logout;
