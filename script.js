// Toggle navigation for mobile and handle login modal behavior
document.addEventListener('DOMContentLoaded', function(){
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  const loginBtn = document.getElementById('loginBtn');
  const backdrop = document.getElementById('modalBackdrop');
  const cancelLogin = document.getElementById('cancelLogin');
  const loginForm = document.getElementById('loginForm');
  const accountMenu = document.getElementById('accountMenu');
  const accountProfile = document.getElementById('accountProfile');
  const accountLogout = document.getElementById('accountLogout');
  const noticeBackdrop = document.getElementById('noticeBackdrop');
  const noticeClose = document.getElementById('noticeClose');
  const noticeMessageEl = document.getElementById('noticeMessage');
  const yearSpan = document.getElementById('year');

  yearSpan.textContent = new Date().getFullYear();

  let loggedIn = false;
  let pendingOrder = null;
  const toast = document.getElementById('toast');

  function showToast(message, duration = 3200){
    if(!toast) return;
    const inner = toast.querySelector('.toast-inner');
    inner.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(()=> toast.classList.add('show'));
    if(toast._timeout) clearTimeout(toast._timeout);
    toast._timeout = setTimeout(()=>{
      toast.classList.remove('show');
      setTimeout(()=> toast.hidden = true, 260);
    }, duration);
  }

  hamburger.addEventListener('click', function(){
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){
      nav.style.display = 'block';
      nav.querySelectorAll('a')[0]?.focus();
    } else {
      nav.style.display = '';
    }
  });

  loginBtn.addEventListener('click', function(e){
    if(loggedIn){
      if(accountMenu){
        const isHidden = accountMenu.hidden;
        accountMenu.hidden = !isHidden;
      }
    } else {
      window.location.href = 'login.html';
    }
  });

  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    const name = item.dataset.name || item.getAttribute('aria-label') || 'item';
    function tryOrder(){
      if(loggedIn){
        alert('Proceed to order: ' + name + ' (demo)');
      } else {
        pendingOrder = name;
        showToast('Oops — looks like you need to log in to order.');
        backdrop.style.display = 'flex';
        backdrop.setAttribute('aria-hidden','false');
        document.getElementById('email')?.focus();
      }
    }
    item.addEventListener('click', tryOrder);
    item.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tryOrder(); } });
  });

  cancelLogin.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function(e){
    if(e.target === backdrop) closeModal();
  });

  function closeModal(){
    backdrop.style.display = 'none';
    backdrop.setAttribute('aria-hidden','true');
    loginBtn.focus();
    // hide toast if visible
    if(toast){
      if(toast._timeout) clearTimeout(toast._timeout);
      toast.classList.remove('show');
      setTimeout(()=> toast.hidden = true, 200);
    }
  }

  function updateAuthUI(email){
    if(loggedIn){
      loginBtn.textContent = 'Account';
      if(accountMenu) accountMenu.hidden = true;
      if(email && loginBtn){
        const short = email.split('@')[0];
        loginBtn.title = short;
      }
    } else {
      loginBtn.textContent = 'Log in';
      if(accountMenu) accountMenu.hidden = true;
      loginBtn.removeAttribute('title');
    }
  }

  (function initAuthFromStorage(){
    try{
      const flag = localStorage.getItem('rr_logged_in');
      const saved = localStorage.getItem('rr_user_email');
      if(flag === '1' && saved){
        loggedIn = true;
        updateAuthUI(saved);
      } else {
        loggedIn = false;
        updateAuthUI();
      }
    }catch(e){ loggedIn = false; updateAuthUI(); }
    if(accountMenu) accountMenu.hidden = true;
  })();

  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    loggedIn = true;
    try{ localStorage.setItem('rr_user_email', email); localStorage.setItem('rr_logged_in','1'); }catch(e){}
    closeModal();
    updateAuthUI(email);
    if(pendingOrder){
      alert('Signed in as ' + email + '. You can now order: ' + pendingOrder + ' (demo)');
      pendingOrder = null;
    } else {
      alert('Signed in as ' + email + ' (demo)');
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      if(backdrop.style.display === 'flex') closeModal();
      if(noticeBackdrop && noticeBackdrop.style.display === 'flex') closeNotice();
      if(hamburger.getAttribute('aria-expanded') === 'true'){
        hamburger.setAttribute('aria-expanded','false');
        nav.style.display = '';
      }
    }
  });

  window.addEventListener('message', function(e){
    const data = e.data || {};
    if(data && data.type === 'login'){
      const email = data.email || '';
      loggedIn = true;
      try{ localStorage.setItem('rr_user_email', email); }catch(e){}
      closeModal();
      updateAuthUI(email);
      if(pendingOrder){
        alert('Signed in as ' + email + '. You can now order: ' + pendingOrder + ' (demo)');
        pendingOrder = null;
      } else {
        alert('Signed in as ' + email + ' (demo)');
      }
    }
  });

  if(accountLogout){
    accountLogout.addEventListener('click', function(){
      loggedIn = false;
      try{ localStorage.removeItem('rr_user_email'); }catch(e){}
      updateAuthUI();
      alert('You have been signed out (demo).');
      if(accountMenu) accountMenu.hidden = true;
    });
  }
  if(accountProfile){
    accountProfile.addEventListener('click', function(){
      const msg = "Oops — we haven't been able to code that yet. Please wait for a future update.";
      showNotice(msg);
      if(accountMenu) accountMenu.hidden = true;
    });
  }

  function showNotice(message){
    if(!noticeBackdrop) return alert(message);
    if(noticeMessageEl) noticeMessageEl.textContent = message;
    noticeBackdrop.style.display = 'flex';
    noticeBackdrop.setAttribute('aria-hidden','false');
    noticeClose?.focus();
  }

  function closeNotice(){
    if(!noticeBackdrop) return;
    noticeBackdrop.style.display = 'none';
    noticeBackdrop.setAttribute('aria-hidden','true');
  }

  if(noticeClose){ noticeClose.addEventListener('click', closeNotice); }
  if(noticeBackdrop){ noticeBackdrop.addEventListener('click', function(e){ if(e.target === noticeBackdrop) closeNotice(); }); }

  document.addEventListener('click', function(e){
    if(accountMenu && !accountMenu.hidden){
      const isInside = e.target.closest && e.target.closest('.account-wrap');
      if(!isInside){ accountMenu.hidden = true; }
    }
  });
});
