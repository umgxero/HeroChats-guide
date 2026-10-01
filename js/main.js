/**
 * Hero Chats — Main Application Logic
 * - APK download trigger + progress modal
 * - QR code generator
 * - Contact form → Telegram Bot API
 * - Mobile menu + smooth scroll
 */
(function () {
  'use strict';

  const APK_FILE = 'Hero-Chats.apk';
  const APK_SIZE_MB = '29.46';

  // Telegram Bot Configuration — Admin only (@umgxero)
  const TELEGRAM_BOT_TOKEN = '8980382334:AAF7RrcWpt8ShetJaBpKMUr-iUZ5sE9Ul5g';
  const TELEGRAM_CHAT_ID = '5122043113';

  // =========================================================================
  // INIT — Run after DOM is ready
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initApkDownload();
    initQRCode();
    initContactForm();
  });

  // =========================================================================
  // 1. MOBILE MENU
  // =========================================================================
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('site-nav-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }

  // =========================================================================
  // 2. SMOOTH SCROLL
  // =========================================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // =========================================================================
  // 3. APK DOWNLOAD + MODAL
  // =========================================================================
  function initApkDownload() {
    const modal = document.getElementById('install-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const triggers = document.querySelectorAll('[data-trigger-download]');
    if (!modal) return;

    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Trigger actual file download
        const a = document.createElement('a');
        a.href = APK_FILE;
        a.download = APK_FILE;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Show modal
        modal.classList.add('open');
        simulateProgress();
      });
    });

    // Close modal
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  function simulateProgress() {
    const fill = document.getElementById('modal-progress-fill');
    const text = document.getElementById('modal-progress-text');
    if (!fill || !text) return;

    let progress = 0;
    fill.style.width = '0%';
    text.textContent = `0% · Transferring ${APK_SIZE_MB} MB...`;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        fill.style.width = '100%';
        text.textContent = '100% · Download complete! Check your notification tray.';
      } else {
        fill.style.width = `${progress}%`;
        const loaded = ((progress / 100) * parseFloat(APK_SIZE_MB)).toFixed(1);
        text.textContent = `${progress}% · ${loaded} / ${APK_SIZE_MB} MB`;
      }
    }, 250);
  }

  // =========================================================================
  // 4. QR CODE
  // =========================================================================
  function initQRCode() {
    const box = document.getElementById('install-qrcode-box');
    if (!box || typeof QRCode === 'undefined') return;

    const apkUrl = new URL(APK_FILE, window.location.href).href;
    new QRCode(box, {
      text: apkUrl,
      width: 140,
      height: 140,
      colorDark: '#09090b',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });
  }

  // =========================================================================
  // 5. CONTACT FORM → TELEGRAM (sends to admin @umgxero)
  // =========================================================================
  function initContactForm() {
    const form = document.getElementById('admin-contact-form');
    const feedback = document.getElementById('contact-feedback');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = val('admin-input-name');
      const email = val('admin-input-email');
      const category = val('admin-input-category');
      const message = val('admin-input-message');
      const submitBtn = form.querySelector('button[type="submit"]');

      // Validate
      if (!name || !email || !message) {
        showFeedback(feedback, 'Please fill in all required fields.', false);
        return;
      }

      // Disable button
      const origText = submitBtn ? submitBtn.textContent : 'Send';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Build Telegram message
      const text = [
        '📩 <b>New Contact Message</b>',
        '',
        `👤 <b>Name:</b> ${escHtml(name)}`,
        `📧 <b>Email:</b> ${escHtml(email)}`,
        `📋 <b>Subject:</b> ${escHtml(category)}`,
        '',
        `💬 <b>Message:</b>`,
        escHtml(message),
        '',
        `🕐 <b>Sent:</b> ${new Date().toLocaleString()}`
      ].join('\n');

      try {
        const res = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: text,
              parse_mode: 'HTML',
            }),
          }
        );

        const data = await res.json();

        if (data.ok) {
          showFeedback(feedback, '✓ Message sent successfully! We\'ll get back to you soon.', true);
          form.reset();
        } else {
          throw new Error(data.description || 'Telegram API error');
        }
      } catch (err) {
        console.error('[HeroChats] Send error:', err);
        showFeedback(
          feedback,
          'Failed to send message. Please contact us directly on Telegram @umgxero.',
          false
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = origText;
        }
      }
    });
  }

  // =========================================================================
  // HELPERS
  // =========================================================================
  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function showFeedback(el, msg, success) {
    if (!el) return;
    el.textContent = msg;
    el.className = 'form-feedback ' + (success ? 'success' : 'error');
    el.style.display = 'block';

    setTimeout(() => {
      el.style.display = 'none';
      el.className = 'form-feedback';
    }, 6000);
  }
})();
