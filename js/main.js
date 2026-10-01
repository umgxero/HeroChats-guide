/**
 * HERO CHATS — CORE CLIENT APPLICATION LOGIC
 * Manages:
 * - Direct APK download initiation & interactive progress HUD
 * - 3D Setup Procedure step synchronization & device OEM switcher
 * - Live QR code generator for mobile devices
 * - SHA-256 hash copy
 * - Admin contact terminal dispatcher
 * - Feature tabs and smooth interactions
 */

(function () {
  'use strict';

  const APK_FILE = 'Hero-Chats.apk';
  const APK_SIZE_MB = '29.46';
  const APK_SHA256 = '554f8d1f739839618eed3a8bca51d777b1f71e070da4bffd49f69f078f4c9ddf';

  // =========================================================================
  // 1. ONE-CLICK APK INSTALLATION / DOWNLOAD TRIGGER & HUD MODAL
  // =========================================================================
  const modalBackdrop = document.getElementById('install-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalProgressFill = document.getElementById('modal-progress-fill');
  const modalProgressText = document.getElementById('modal-progress-text');
  const downloadTriggers = document.querySelectorAll('[data-trigger-download]');

  function startApkDownload(e) {
    if (e) e.preventDefault();

    // 1. Trigger actual browser file download
    const link = document.createElement('a');
    link.href = APK_FILE;
    link.download = APK_FILE;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Open interactive installation HUD modal
    if (modalBackdrop) {
      modalBackdrop.classList.add('open');
      simulateDownloadProgress();
    }
  }

  function simulateDownloadProgress() {
    if (!modalProgressFill || !modalProgressText) return;

    modalProgressFill.style.width = '0%';
    modalProgressText.textContent = `0% (${APK_SIZE_MB} MB) · Initializing stream...`;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        modalProgressFill.style.width = '100%';
        modalProgressText.textContent = `100% · Download Complete! Check notification shade & tap Install.`;
      } else {
        modalProgressFill.style.width = `${progress}%`;
        const loadedMb = ((progress / 100) * parseFloat(APK_SIZE_MB)).toFixed(1);
        modalProgressText.textContent = `${progress}% (${loadedMb} / ${APK_SIZE_MB} MB) · Transferring via direct link...`;
      }
    }, 250);
  }

  downloadTriggers.forEach((btn) => {
    btn.addEventListener('click', startApkDownload);
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
      }
    });
  }

  // =========================================================================
  // 2. 3D SETUP PROCEDURE STEP CONTROLLER
  // =========================================================================
  const stepCards = document.querySelectorAll('.step-card');
  const prevStepBtn = document.getElementById('btn-prev-step');
  const nextStepBtn = document.getElementById('btn-next-step');
  const autoPlayBtn = document.getElementById('btn-autoplay-steps');

  let currentActiveStep = 1;
  let autoPlayTimer = null;
  let isAutoPlaying = false;

  function goToStep(stepNum) {
    currentActiveStep = stepNum;

    // Update Step Cards UI
    stepCards.forEach((card) => {
      const cardStep = parseInt(card.getAttribute('data-step'), 10);
      if (cardStep === stepNum) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Notify 3D Scene
    if (window.HeroChatsSetup3D && typeof window.HeroChatsSetup3D.setStep === 'function') {
      window.HeroChatsSetup3D.setStep(stepNum);
    }

    // Update Nav Buttons
    if (prevStepBtn) prevStepBtn.disabled = stepNum === 1;
    if (nextStepBtn) {
      if (stepNum === 4) {
        nextStepBtn.textContent = 'Finish Guide';
      } else {
        nextStepBtn.textContent = 'Next Step →';
      }
    }
  }

  stepCards.forEach((card) => {
    card.addEventListener('click', () => {
      stopAutoPlay();
      const step = parseInt(card.getAttribute('data-step'), 10);
      goToStep(step);
    });
  });

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      stopAutoPlay();
      if (currentActiveStep > 1) {
        goToStep(currentActiveStep - 1);
      }
    });
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      stopAutoPlay();
      if (currentActiveStep < 4) {
        goToStep(currentActiveStep + 1);
      } else {
        goToStep(1); // loop back or start install
      }
    });
  }

  function startAutoPlay() {
    isAutoPlaying = true;
    if (autoPlayBtn) {
      autoPlayBtn.classList.add('active');
      autoPlayBtn.textContent = 'Pause Auto-Play';
    }
    autoPlayTimer = setInterval(() => {
      let next = currentActiveStep + 1;
      if (next > 4) next = 1;
      goToStep(next);
    }, 4500);
  }

  function stopAutoPlay() {
    isAutoPlaying = false;
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    if (autoPlayBtn) {
      autoPlayBtn.classList.remove('active');
      autoPlayBtn.textContent = 'Auto-Play Demo';
    }
  }

  if (autoPlayBtn) {
    autoPlayBtn.addEventListener('click', () => {
      if (isAutoPlaying) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });
  }

  // =========================================================================
  // 3. DEVICE OS OEM GUIDANCE SWITCHER (FOR STEP 2)
  // =========================================================================
  const deviceTabBtns = document.querySelectorAll('.device-tab-btn');
  const deviceGuides = {
    samsung: [
      '1. Open Samsung Settings → tap "Security and Privacy".',
      '2. Scroll down and tap "Install unknown apps".',
      '3. Locate your browser (Chrome or Samsung Internet).',
      '4. Toggle the switch to ON.'
    ],
    pixel: [
      '1. Open Settings → tap "Apps" → tap "Special app access".',
      '2. Tap "Install unknown apps".',
      '3. Select Chrome (or browser used for download).',
      '4. Enable "Allow from this source".'
    ],
    xiaomi: [
      '1. Open Settings → "Privacy protection" → "Special permissions".',
      '2. Tap "Install unknown apps" → select Chrome / File Manager.',
      '3. Check "I am aware of the possible risks" and confirm OK.'
    ],
    oneplus: [
      '1. Open Settings → "Password & Security" → "System security".',
      '2. Tap "Installation sources".',
      '3. Find Chrome / Browser and enable the toggle.'
    ],
    oppovivo: [
      '1. Open Settings → "Security" or "App Management".',
      '2. Tap "Special App Access" → "Install Unknown Apps".',
      '3. Select Chrome / Downloads and toggle to Allow.'
    ]
  };

  const guideContainer = document.getElementById('device-guide-list');

  function renderDeviceGuide(brandKey) {
    if (!guideContainer) return;
    const steps = deviceGuides[brandKey] || deviceGuides.samsung;
    guideContainer.innerHTML = '';
    steps.forEach((s) => {
      const li = document.createElement('li');
      li.textContent = s;
      guideContainer.appendChild(li);
    });
  }

  deviceTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      deviceTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const brand = btn.getAttribute('data-device');
      renderDeviceGuide(brand);
    });
  });

  // Render initial default device guide
  renderDeviceGuide('samsung');

  // =========================================================================
  // 4. QR CODE GENERATOR FOR DIRECT MOBILE INSTALLATION
  // =========================================================================
  const qrBox = document.getElementById('install-qrcode-box');
  if (qrBox && typeof QRCode !== 'undefined') {
    // Generate absolute link to APK
    const apkUrl = new URL(APK_FILE, window.location.href).href;
    new QRCode(qrBox, {
      text: apkUrl,
      width: 140,
      height: 140,
      colorDark: '#09090b',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });
  }

  // =========================================================================
  // 5. SHA-256 CHECKSUM COPY BUTTON
  // =========================================================================
  const copyHashBtn = document.getElementById('btn-copy-hash');
  if (copyHashBtn) {
    copyHashBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(APK_SHA256).then(() => {
        const origText = copyHashBtn.textContent;
        copyHashBtn.textContent = 'COPIED TO CLIPBOARD ✓';
        copyHashBtn.style.color = '#f97316';
        setTimeout(() => {
          copyHashBtn.textContent = origText;
          copyHashBtn.style.color = '';
        }, 2200);
      });
    });
  }

  // =========================================================================
  // 6. FEATURE TABS SHOWCASE
  // =========================================================================
  const featureTabBtns = document.querySelectorAll('.feature-tab-btn');
  const featureTabPanels = document.querySelectorAll('.feature-tab-panel');

  featureTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      featureTabBtns.forEach((b) => b.classList.remove('active'));
      featureTabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(`panel-${targetId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 7. ADMIN CONTACT & SECURITY INCIDENT DISPATCH CONSOLE
  // =========================================================================
  const contactForm = document.getElementById('admin-contact-form');
  const contactFeedback = document.getElementById('contact-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('admin-input-name');
      const emailInput = document.getElementById('admin-input-email');
      const categoryInput = document.getElementById('admin-input-category');
      const messageInput = document.getElementById('admin-input-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!messageInput.value.trim()) {
        alert('Please enter your inquiry or report message.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING TO ADMIN NODE...';
      }

      // Simulate telemetry dispatch
      setTimeout(() => {
        if (contactFeedback) {
          contactFeedback.style.display = 'block';
          const ticketId = 'HC-' + Math.floor(100000 + Math.random() * 900000);
          contactFeedback.innerHTML = `
            <strong>[DISPATCH CONFIRMED · ${ticketId}]</strong><br>
            Your report/message was encrypted and transmitted to the UMG Admin Operations Node.<br>
            Target: <code>admin@herochats.app</code> · Expected Response: &lt; 2 Hours.
          `;
        }

        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'TRANSMIT ENCRYPTED TICKET →';
        }
      }, 1200);
    });
  }

  // =========================================================================
  // 8. MOBILE MENU TOGGLE
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('site-nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '72px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = '#09090b';
        navMenu.style.padding = '20px';
        navMenu.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        navMenu.style.gap = '16px';
      }
    });
  }
})();
