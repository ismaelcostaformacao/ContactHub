/**
 * ContactHub - main.js
 * Funcionalidades: Cookie Banner, CRUD de contactos com localStorage
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar todas as funcionalidades
  initCookieBanner();
  initContactCRUD();
  updateContactTable();
  updateDashboard();
});

/**
 * ==========================================
 * COOKIE BANNER
 * ==========================================
 */
function initCookieBanner() {
  const cookieAccepted = localStorage.getItem('contacthub_cookies_accepted');
  
  if (!cookieAccepted) {
    showCookieBanner();
  }
}

function showCookieBanner() {
  // Criar o banner de cookies dinamicamente
  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="container py-3">
      <div class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <p class="mb-0 cookie-text">
          Utilizamos cookies para melhorar a sua experiência. Ao continuar, aceita a nossa política de cookies.
        </p>
        <div class="d-flex gap-2">
          <button id="cookieAccept" class="btn btn-primary btn-sm">Aceitar</button>
          <button id="cookieReject" class="btn btn-outline-secondary btn-sm">Rejeitar</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Adicionar estilos CSS para o banner
  addCookieStyles();
  
  // Event listeners
  document.getElementById('cookieAccept').addEventListener('click', acceptCookies);
  document.getElementById('cookieReject').addEventListener('click', rejectCookies);
}

function addCookieStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #1a1a2e;
      color: #ffffff;
      z-index: 9999;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
    }
    .cookie-text {
      font-size: 0.9rem;
      max-width: 600px;
    }
  `;
  document.head.appendChild(style);
}

function acceptCookies() {
  localStorage.setItem('contacthub_cookies_accepted', 'true');
  localStorage.setItem('contacthub_cookies_timestamp', new Date().toISOString());
  hideCookieBanner();
}

function rejectCookies() {
  localStorage.setItem('contacthub_cookies_accepted', 'false');
  localStorage.setItem('contacthub_cookies_timestamp', new Date().toISOString());
  hideCookieBanner();
}

function hideCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.style.display = 'none';
  }
}

/**
 * ==========================================
 * CRUD DE CONTACTOS COM LOCALSTORAGE
 * ==========================================
 */

// Chave para armazenar no localStorage
const CONTACTS_STORAGE_KEY = 'contacthub_contacts';

// Dados iniciais de exemplo (se não houver dados no localStorage)
const initialContacts = [
  { id: 1, nome: 'Ana Ribeiro', empresa: 'Alfa Tech', email: 'ana.ribeiro@alfatech.pt', telefone: '+351912345678', estado: 'Ativo', categoria: 'Cliente', dataCriacao: '2025-01-15' },
  { id: 2, nome: 'Tiago Silva', empresa: 'Nova Linha', email: 'tiago.silva@novalinha.pt', telefone: '+351913456789', estado: 'Seguimento', categoria: 'Prospect', dataCriacao: '2025-02-20' },
  { id: 3, nome: 'Ines Costa', empresa: 'Brisa Digital', email: 'ines.costa@brisadigital.pt', telefone: '+351914567890', estado: 'Novo', categoria: 'Parceiro', dataCriacao: '2025-03-10' }
];

function initContactCRUD() {
  // Verificar se já existem contactos no localStorage
  if (!localStorage.getItem(CONTACTS_STORAGE_KEY)) {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(initialContacts));
  }
  
  // Configurar o formulário de contacto
  setupContactForm();
}

function getContacts() {
  const contacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
  return contacts ? JSON.parse(contacts) : [];
}

function saveContacts(contacts) {
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  updateContactTable();
  updateDashboard();
}

function setupContactForm() {
  const form = document.getElementById('contactoForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obter valores do formulário
    const novoContacto = {
      id: Date.now(), // ID único baseado em timestamp
      nome: document.getElementById('contactoNome').value.trim(),
      empresa: document.getElementById('contactoEmpresa').value.trim(),
      email: document.getElementById('contactoEmail').value.trim(),
      telefone: document.getElementById('contactoTelefone').value.trim(),
      morada: document.getElementById('contactoMorada')?.value.trim() || '',
      cidade: document.getElementById('contactoCidade')?.value.trim() || '',
      estado: document.getElementById('contactoEstado').value,
      categoria: document.getElementById('contactoCategoria').value,
      prioridade: document.getElementById('contactoPrioridade').value,
      notas: document.getElementById('contactoNotas')?.value.trim() || '',
      dataCriacao: new Date().toISOString().split('T')[0]
    };
    
    // Adicionar contacto
    addContact(novoContacto);
    
    // Resetar formulário e fechar modal
    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('contactoModal'));
    if (modal) modal.hide();
    
    // Mostrar feedback
    showNotification('Contacto adicionado com sucesso!', 'success');
  });
}

function addContact(contacto) {
  const contacts = getContacts();
  contacts.push(contacto);
  saveContacts(contacts);
}

function editContact(id) {
  const contacts = getContacts();
  const contacto = contacts.find(c => c.id === id);
  
  if (!contacto) return;
  
  // Preencher formulário com dados do contacto
  document.getElementById('contactoNome').value = contacto.nome;
  document.getElementById('contactoEmpresa').value = contacto.empresa;
  document.getElementById('contactoEmail').value = contacto.email;
  document.getElementById('contactoTelefone').value = contacto.telefone;
  if (document.getElementById('contactoMorada')) {
    document.getElementById('contactoMorada').value = contacto.morada || '';
  }
  if (document.getElementById('contactoCidade')) {
    document.getElementById('contactoCidade').value = contacto.cidade || '';
  }
  document.getElementById('contactoEstado').value = contacto.estado;
  document.getElementById('contactoCategoria').value = contacto.categoria;
  document.getElementById('contactoPrioridade').value = contacto.prioridade;
  if (document.getElementById('contactoNotas')) {
    document.getElementById('contactoNotas').value = contacto.notas || '';
  }
  
  // Abrir modal
  const modal = new bootstrap.Modal(document.getElementById('contactoModal'));
  modal.show();
  
  // Remover listener antigo e adicionar novo para atualização
  const form = document.getElementById('contactoForm');
  const oldSubmitHandler = form.onsubmit;
  form.onsubmit = function(e) {
    e.preventDefault();
    
    // Atualizar contacto
    contacto.nome = document.getElementById('contactoNome').value.trim();
    contacto.empresa = document.getElementById('contactoEmpresa').value.trim();
    contacto.email = document.getElementById('contactoEmail').value.trim();
    contacto.telefone = document.getElementById('contactoTelefone').value.trim();
    if (document.getElementById('contactoMorada')) {
      contacto.morada = document.getElementById('contactoMorada').value.trim();
    }
    if (document.getElementById('contactoCidade')) {
      contacto.cidade = document.getElementById('contactoCidade').value.trim();
    }
    contacto.estado = document.getElementById('contactoEstado').value;
    contacto.categoria = document.getElementById('contactoCategoria').value;
    contacto.prioridade = document.getElementById('contactoPrioridade').value;
    if (document.getElementById('contactoNotas')) {
      contacto.notas = document.getElementById('contactoNotas').value.trim();
    }
    
    saveContacts(contacts);
    
    // Resetar formulário e fechar modal
    form.reset();
    form.onsubmit = oldSubmitHandler;
    modal.hide();
    
    showNotification('Contacto atualizado com sucesso!', 'success');
  };
}

function deleteContact(id) {
  if (!confirm('Tem a certeza que deseja eliminar este contacto?')) return;
  
  const contacts = getContacts();
  const filteredContacts = contacts.filter(c => c.id !== id);
  saveContacts(filteredContacts);
  
  showNotification('Contacto eliminado com sucesso!', 'info');
}

function updateContactTable() {
  const tbody = document.querySelector('#contactos tbody');
  if (!tbody) return;
  
  const contacts = getContacts();
  
  if (contacts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4 text-muted">
          Sem contactos registados. Clique em "Novo contacto" para adicionar.
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = contacts.map(contacto => `
    <tr>
      <td>${escapeHtml(contacto.nome)}</td>
      <td>${escapeHtml(contacto.empresa)}</td>
      <td>${escapeHtml(contacto.email)}</td>
      <td><span class="badge ${getEstadoBadgeClass(contacto.estado)}">${escapeHtml(contacto.estado)}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editContact(${contacto.id})" title="Editar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteContact(${contacto.id})" title="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6ZM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function getEstadoBadgeClass(estado) {
  switch(estado) {
    case 'Ativo': return 'text-bg-success';
    case 'Seguimento': return 'text-bg-warning';
    case 'Novo': return 'text-bg-secondary';
    case 'Inativo': return 'text-bg-danger';
    default: return 'text-bg-light';
  }
}

function updateDashboard() {
  const contacts = getContacts();
  
  // Atualizar total de contactos
  const totalElement = document.querySelector('#resumo .display-5:first-of-type');
  if (totalElement) {
    totalElement.textContent = contacts.length;
  }
  
  // Atualizar tarefas em aberto (contactos em estado "Seguimento" ou "Novo")
  const openTasks = contacts.filter(c => c.estado === 'Seguimento' || c.estado === 'Novo').length;
  const tasksElement = document.querySelectorAll('#resumo .display-5')[1];
  if (tasksElement) {
    tasksElement.textContent = openTasks;
  }
}

/**
 * Utilitários
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = 'info') {
  // Criar notificação toast simples
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} position-fixed`;
  notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
  notification.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <span>${message}</span>
      <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remover após 3 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}
