/**
 * HERO CHATS — 3D INTERACTIVE THREE.JS ENGINE
 * Features:
 * 1. Hero 3D Smartphone with real-time dynamic canvas screen, exploded view, orbit controls
 * 2. Setup Procedure 3D Device with step-driven camera positions & interactive Android screen states
 * 3. Responsive WebGL renderers with particle matrix
 */

(function () {
  'use strict';

  // Check if THREE is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not yet available. Waiting...');
    return;
  }

  // Polyfill roundRect for maximum browser compatibility
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (typeof r === 'undefined') r = 0;
      if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
      this.beginPath();
      this.moveTo(x + r.tl, y);
      this.lineTo(x + w - r.tr, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
      this.lineTo(x + w, y + h - r.br);
      this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
      this.lineTo(x + r.bl, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
      this.lineTo(x, y + r.tl);
      this.quadraticCurveTo(x, y, x + r.tl, y);
      this.closePath();
      return this;
    };
  }

  // --- BRAND COLORS FOR 3D MATERIALS ---
  const COLOR_TITANIUM = 0x181820;
  const COLOR_FRAME = 0x22222a;
  const COLOR_EMBER = 0xf97316;
  const COLOR_EMBER_LIGHT = 0xfb923c;
  const COLOR_SCREEN_BG = 0x0c0c10;

  // =========================================================================
  // 1. DYNAMIC CANVAS SCREEN GENERATOR (HERO PHONE)
  // =========================================================================
  function createHeroScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    let currentScreenMode = 'chats'; // 'chats', 'call', 'vault'
    let waveAnim = 0;

    function renderScreen() {
      // Background
      ctx.fillStyle = '#0c0c12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Status Bar
      ctx.fillStyle = '#181822';
      ctx.fillRect(0, 0, canvas.width, 54);
      ctx.fillStyle = '#a3a3b0';
      ctx.font = '600 20px monospace';
      ctx.fillText('09:41', 28, 36);
      ctx.textAlign = 'right';
      ctx.fillText('5G · 100%', canvas.width - 28, 36);
      ctx.textAlign = 'left';

      // Header Bar
      ctx.fillStyle = '#14141c';
      ctx.fillRect(0, 54, canvas.width, 90);
      ctx.strokeStyle = '#272734';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 144);
      ctx.lineTo(canvas.width, 144);
      ctx.stroke();

      // Header Brand
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 26px -apple-system, sans-serif';
      ctx.fillText('HERO CHATS', 32, 108);

      ctx.fillStyle = '#f4f4f7';
      ctx.font = '14px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('[UMG PROTOCOL]', canvas.width - 32, 108);
      ctx.textAlign = 'left';

      if (currentScreenMode === 'chats') {
        // --- CHAT SCREEN ---
        // Message 1 (Incoming)
        drawMessageBubble(ctx, 32, 180, 360, 100, false, 'Dev Core [Admin]', 'Hero Chats v1.0.4 direct APK is live. WebRTC audio/video latency is now sub-20ms.', '09:38 AM');

        // Message 2 (Outbound)
        drawMessageBubble(ctx, 120, 305, 360, 90, true, 'You', 'Verified SHA-256 build. Voice call quality sounds phenomenal!', '09:39 AM');

        // Message 3 (Incoming)
        drawMessageBubble(ctx, 32, 420, 370, 100, false, 'Elena [Security]', 'Direct P2P channel established. Zero data stored on intermediary cloud relays.', '09:40 AM');

        // Incoming Call Widget Card
        ctx.fillStyle = '#1a181e';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(32, 550, 448, 200, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('● INCOMING ENCRYPTED CALL', 54, 588);

        ctx.fillStyle = '#f4f4f7';
        ctx.font = 'bold 24px -apple-system, sans-serif';
        ctx.fillText('UMG Security Node', 54, 626);

        ctx.fillStyle = '#a3a3b0';
        ctx.font = '14px monospace';
        ctx.fillText('Bitrate: 256kbps · WebRTC Direct', 54, 654);

        // Accept / Decline Buttons
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.roundRect(54, 680, 180, 48, 8);
        ctx.fill();
        ctx.fillStyle = '#09090b';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ACCEPT', 144, 710);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.roundRect(268, 680, 180, 48, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText('DECLINE', 358, 710);
        ctx.textAlign = 'left';

        // Chat Input Bar
        ctx.fillStyle = '#15151e';
        ctx.fillRect(0, canvas.height - 110, canvas.width, 110);
        ctx.strokeStyle = '#272734';
        ctx.strokeRect(28, canvas.height - 90, canvas.width - 56, 56);
        ctx.fillStyle = '#6b6b78';
        ctx.font = '18px monospace';
        ctx.fillText('Type encrypted message...', 48, canvas.height - 54);

      } else if (currentScreenMode === 'call') {
        // --- ACTIVE CALL SCREEN ---
        ctx.fillStyle = '#101018';
        ctx.fillRect(0, 144, canvas.width, canvas.height - 144);

        // Animated soundwave
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 28px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Elena Vance', canvas.width / 2, 280);

        ctx.fillStyle = '#a3a3b0';
        ctx.font = '16px monospace';
        ctx.fillText('CALL CONNECTED · 03:24', canvas.width / 2, 320);

        // Waveform bars
        const bars = 24;
        const startX = 64;
        const totalW = canvas.width - 128;
        const barW = totalW / bars - 4;
        waveAnim += 0.08;

        for (let i = 0; i < bars; i++) {
          const h = 20 + Math.sin(waveAnim + i * 0.45) * 45 + Math.cos(waveAnim * 1.5 + i) * 25;
          ctx.fillStyle = i % 2 === 0 ? '#f97316' : '#fb923c';
          ctx.fillRect(startX + i * (barW + 4), 480 - h / 2, barW, Math.max(10, h));
        }

        // Encryption verification token
        ctx.fillStyle = '#1a1820';
        ctx.strokeStyle = '#f97316';
        ctx.strokeRect(64, 600, canvas.width - 128, 60);
        ctx.fillRect(64, 600, canvas.width - 128, 60);
        ctx.fillStyle = '#f97316';
        ctx.font = '14px monospace';
        ctx.fillText('SAFETY NUMBERS: 9048-2819-4820-1940', canvas.width / 2, 636);

        // End Call Button
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 800, 48, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('END', canvas.width / 2, 806);
        ctx.textAlign = 'left';

      } else if (currentScreenMode === 'vault') {
        // --- VAULT / SECURITY SCREEN ---
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 22px monospace';
        ctx.fillText('● HARDWARE ENCRYPTION CORE', 32, 210);

        ctx.fillStyle = '#a3a3b0';
        ctx.font = '15px monospace';
        ctx.fillText('Device ID: com.herochats.app', 32, 250);
        ctx.fillText('Protocol: UMG Direct P2P v2.1', 32, 280);
        ctx.fillText('Key Exchange: X25519 Elliptic Curve', 32, 310);
        ctx.fillText('Cipher: ChaCha20-Poly1305', 32, 340);
        ctx.fillText('Local Database: SQLCipher AES-256', 32, 370);

        ctx.fillStyle = '#161622';
        ctx.fillRect(32, 430, canvas.width - 64, 260);
        ctx.strokeStyle = '#323246';
        ctx.strokeRect(32, 430, canvas.width - 64, 260);

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('SECURITY STATUS: ZERO EXPOSURE', 54, 470);

        ctx.fillStyle = '#a3a3b0';
        ctx.font = '13px monospace';
        ctx.fillText('• Cloud Message Retention: 0 Seconds', 54, 510);
        ctx.fillText('• Contact Telemetry: Disabled', 54, 545);
        ctx.fillText('• Anonymous User Registration: Active', 54, 580);
        ctx.fillText('• Admin Escalation: Ready', 54, 615);
        ctx.fillText('• Direct APK Signature: Validated', 54, 650);
      }
    }

    function drawMessageBubble(ctx, x, y, w, h, isOutbound, author, text, time) {
      ctx.fillStyle = isOutbound ? '#241a12' : '#161620';
      ctx.strokeStyle = isOutbound ? '#ea580c' : '#272738';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isOutbound ? '#fb923c' : '#f97316';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(author, x + 16, y + 24);

      ctx.fillStyle = '#e4e4eb';
      ctx.font = '14px -apple-system, sans-serif';
      wrapText(ctx, text, x + 16, y + 46, w - 32, 18);

      ctx.fillStyle = '#717182';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(time, x + w - 14, y + h - 10);
      ctx.textAlign = 'left';
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      let curY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, curY);
          line = words[n] + ' ';
          curY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, curY);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return {
      texture,
      update: () => {
        renderScreen();
        texture.needsUpdate = true;
      },
      setMode: (mode) => {
        currentScreenMode = mode;
        renderScreen();
        texture.needsUpdate = true;
      }
    };
  }

  // =========================================================================
  // 2. SETUP PHONE CANVAS SCREEN GENERATOR (FOR 4 STEPS)
  // =========================================================================
  function createSetupScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    let currentStep = 1;
    let stepProgress = 0;

    function renderStepScreen() {
      ctx.fillStyle = '#0c0c12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top Status Bar
      ctx.fillStyle = '#181822';
      ctx.fillRect(0, 0, canvas.width, 54);
      ctx.fillStyle = '#a3a3b0';
      ctx.font = '600 20px monospace';
      ctx.fillText('10:00', 28, 36);
      ctx.textAlign = 'right';
      ctx.fillText('100%', canvas.width - 28, 36);
      ctx.textAlign = 'left';

      // Header
      ctx.fillStyle = '#14141e';
      ctx.fillRect(0, 54, canvas.width, 70);
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`INSTALL STEP 0${currentStep} / 04`, 28, 98);

      if (currentStep === 1) {
        // --- STEP 1: BROWSER DOWNLOAD PROMPT ---
        ctx.fillStyle = '#161622';
        ctx.fillRect(0, 124, canvas.width, 60);
        ctx.fillStyle = '#f4f4f7';
        ctx.font = '16px monospace';
        ctx.fillText('Chrome · Direct Download', 28, 160);

        // Warning Dialog Box (Standard Android unknown APK prompt)
        ctx.fillStyle = '#181822';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(32, 280, canvas.width - 64, 380, 16);
        ctx.fill();
        ctx.stroke();

        // Download Icon
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 44px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⬇', canvas.width / 2, 350);

        ctx.fillStyle = '#f4f4f7';
        ctx.font = 'bold 22px -apple-system, sans-serif';
        ctx.fillText('File might be harmful', canvas.width / 2, 400);

        ctx.fillStyle = '#a3a3b0';
        ctx.font = '15px -apple-system, sans-serif';
        ctx.fillText('Do you want to download Hero-Chats.apk?', canvas.width / 2, 436);
        ctx.fillText('Size: 29.46 MB · Signed Package', canvas.width / 2, 464);

        // Action Buttons
        ctx.fillStyle = '#262634';
        ctx.beginPath();
        ctx.roundRect(56, 520, 180, 52, 8);
        ctx.fill();
        ctx.fillStyle = '#a3a3b0';
        ctx.font = 'bold 15px -apple-system, sans-serif';
        ctx.fillText('Cancel', 146, 552);

        // Highlit "Download anyway"
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(260, 520, 196, 52, 8);
        ctx.fill();
        ctx.fillStyle = '#09090b';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.fillText('Download anyway', 358, 552);

        // Simulated pulse progress bar
        stepProgress = (stepProgress + 0.02) % 1;
        ctx.fillStyle = '#242436';
        ctx.fillRect(56, 610, canvas.width - 112, 8);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(56, 610, (canvas.width - 112) * stepProgress, 8);

        ctx.textAlign = 'left';

      } else if (currentStep === 2) {
        // --- STEP 2: ANDROID SETTINGS UNKNOWN SOURCES ---
        ctx.fillStyle = '#161622';
        ctx.fillRect(0, 124, canvas.width, 70);
        ctx.fillStyle = '#f4f4f7';
        ctx.font = 'bold 22px -apple-system, sans-serif';
        ctx.fillText('Install unknown apps', 32, 168);

        // Settings items
        ctx.fillStyle = '#13131c';
        ctx.fillRect(24, 230, canvas.width - 48, 180);
        ctx.strokeStyle = '#f97316';
        ctx.strokeRect(24, 230, canvas.width - 48, 180);

        ctx.fillStyle = '#f4f4f7';
        ctx.font = 'bold 20px -apple-system, sans-serif';
        ctx.fillText('Allow from this source', 48, 280);

        ctx.fillStyle = '#a3a3b0';
        ctx.font = '14px -apple-system, sans-serif';
        ctx.fillText('Your phone and personal data are more vulnerable', 48, 314);
        ctx.fillText('to attack by unknown apps.', 48, 336);

        // Toggle Switch Animated (ON position)
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(canvas.width - 120, 255, 64, 34, 17);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(canvas.width - 73, 272, 13, 0, Math.PI * 2);
        ctx.fill();

        // Finger indicator
        ctx.fillStyle = '#fb923c';
        ctx.font = '28px monospace';
        ctx.fillText('👈 [TOGGLE ON]', canvas.width - 290, 280);

        // Guidance badge
        ctx.fillStyle = '#1c1a24';
        ctx.strokeStyle = '#423d56';
        ctx.strokeRect(24, 460, canvas.width - 48, 140);
        ctx.fillRect(24, 460, canvas.width - 48, 140);
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('SYSTEM AUTHORIZATION:', 44, 496);
        ctx.fillStyle = '#e4e4eb';
        ctx.font = '14px monospace';
        ctx.fillText('Enabling allows your browser to unpack', 44, 528);
        ctx.fillText('the official Hero-Chats.apk package.', 44, 552);

      } else if (currentStep === 3) {
        // --- STEP 3: PACKAGE INSTALLATION CONFIRMATION ---
        ctx.fillStyle = '#181824';
        ctx.strokeStyle = '#2d2d42';
        ctx.strokeRect(32, 240, canvas.width - 64, 440);
        ctx.fillRect(32, 240, canvas.width - 64, 440);

        // App Icon
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(canvas.width / 2 - 40, 280, 80, 80, 16);
        ctx.fill();
        ctx.fillStyle = '#09090b';
        ctx.font = 'bold 44px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('H', canvas.width / 2, 340);

        ctx.fillStyle = '#f4f4f7';
        ctx.font = 'bold 24px -apple-system, sans-serif';
        ctx.fillText('Hero Chats', canvas.width / 2, 400);

        ctx.fillStyle = '#a3a3b0';
        ctx.font = '15px monospace';
        ctx.fillText('com.herochats.app', canvas.width / 2, 430);
        ctx.fillText('Do you want to install this app?', canvas.width / 2, 470);

        // Buttons
        ctx.fillStyle = '#262634';
        ctx.beginPath();
        ctx.roundRect(64, 560, 170, 52, 8);
        ctx.fill();
        ctx.fillStyle = '#a3a3b0';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.fillText('CANCEL', 149, 592);

        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(266, 560, 170, 52, 8);
        ctx.fill();
        ctx.fillStyle = '#09090b';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.fillText('INSTALL', 351, 592);
        ctx.textAlign = 'left';

      } else if (currentStep === 4) {
        // --- STEP 4: LAUNCH & ONBOARDING ---
        ctx.fillStyle = '#101018';
        ctx.fillRect(0, 124, canvas.width, canvas.height - 124);

        // App ready checkmark
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 280, 48, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#09090b';
        ctx.font = 'bold 44px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✓', canvas.width / 2, 296);

        ctx.fillStyle = '#f4f4f7';
        ctx.font = 'bold 26px -apple-system, sans-serif';
        ctx.fillText('Hero Chats Installed', canvas.width / 2, 370);

        ctx.fillStyle = '#a3a3b0';
        ctx.font = '15px -apple-system, sans-serif';
        ctx.fillText('Your peer-to-peer messaging node is ready.', canvas.width / 2, 410);

        // Open App Button
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(64, 520, canvas.width - 128, 64, 10);
        ctx.fill();
        ctx.fillStyle = '#09090b';
        ctx.font = 'bold 20px -apple-system, sans-serif';
        ctx.fillText('OPEN HERO CHATS', canvas.width / 2, 560);

        ctx.fillStyle = '#717182';
        ctx.font = '13px monospace';
        ctx.fillText('Connected to UMG Peer Protocol', canvas.width / 2, 640);
        ctx.textAlign = 'left';
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return {
      texture,
      update: () => {
        renderStepScreen();
        texture.needsUpdate = true;
      },
      setStep: (step) => {
        currentStep = step;
        renderStepScreen();
        texture.needsUpdate = true;
      }
    };
  }

  // =========================================================================
  // 3. SMARTPHONE 3D MESH BUILDER
  // =========================================================================
  function createSmartphoneModel(screenTexture) {
    const phoneGroup = new THREE.Group();

    // Dimensions: Width: 2.2, Height: 4.5, Depth: 0.22
    const width = 2.2;
    const height = 4.5;
    const depth = 0.2;

    // 1. Titanium Frame (Chassis Body)
    const chassisGeo = new THREE.BoxGeometry(width, height, depth);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: COLOR_FRAME,
      roughness: 0.35,
      metalness: 0.85,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    phoneGroup.add(chassis);

    // 2. Bezel Front
    const bezelGeo = new THREE.PlaneGeometry(width * 0.96, height * 0.96);
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x07070a });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.z = depth / 2 + 0.002;
    phoneGroup.add(bezel);

    // 3. Dynamic AMOLED Display
    const screenGeo = new THREE.PlaneGeometry(width * 0.92, height * 0.92);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      transparent: false,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = depth / 2 + 0.004;
    phoneGroup.add(screen);

    // 4. Sapphire Glass Front Plate (Subtle reflection)
    const glassGeo = new THREE.PlaneGeometry(width * 0.96, height * 0.96);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.z = depth / 2 + 0.008;
    phoneGroup.add(glass);

    // 5. Punch-hole Selfie Camera
    const cameraPunchGeo = new THREE.CircleGeometry(0.045, 24);
    const cameraPunchMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const cameraPunch = new THREE.Mesh(cameraPunchGeo, cameraPunchMat);
    cameraPunch.position.set(0, height * 0.42, depth / 2 + 0.01);
    phoneGroup.add(cameraPunch);

    // 6. Camera Bump on the Back
    const bumpGeo = new THREE.BoxGeometry(0.8, 1.2, 0.08);
    const bumpMat = new THREE.MeshStandardMaterial({
      color: 0x121218,
      roughness: 0.2,
      metalness: 0.9,
    });
    const bump = new THREE.Mesh(bumpGeo, bumpMat);
    bump.position.set(-0.55, height * 0.3, -depth / 2 - 0.04);
    phoneGroup.add(bump);

    // Dual Camera Lenses
    for (let i = 0; i < 2; i++) {
      const lensRingGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.06, 32);
      lensRingGeo.rotateX(Math.PI / 2);
      const lensRingMat = new THREE.MeshStandardMaterial({
        color: COLOR_EMBER,
        roughness: 0.3,
        metalness: 0.7,
      });
      const lensRing = new THREE.Mesh(lensRingGeo, lensRingMat);
      lensRing.position.set(-0.55, height * 0.36 - i * 0.45, -depth / 2 - 0.08);
      phoneGroup.add(lensRing);

      const glassLensGeo = new THREE.CircleGeometry(0.12, 32);
      const glassLensMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
      const glassLens = new THREE.Mesh(glassLensGeo, glassLensMat);
      glassLens.position.set(-0.55, height * 0.36 - i * 0.45, -depth / 2 - 0.111);
      phoneGroup.add(glassLens);
    }

    // 7. Back Emblem (Hero Chats emblem on titanium back)
    const emblemGeo = new THREE.PlaneGeometry(0.6, 0.6);
    const emblemMat = new THREE.MeshBasicMaterial({
      color: COLOR_EMBER_LIGHT,
      transparent: true,
      opacity: 0.7,
    });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.rotation.y = Math.PI;
    emblem.position.set(0, -0.2, -depth / 2 - 0.002);
    phoneGroup.add(emblem);

    // 8. Side Buttons (Power & Volume)
    const powerBtnGeo = new THREE.BoxGeometry(0.04, 0.35, 0.08);
    const btnMat = new THREE.MeshStandardMaterial({ color: COLOR_EMBER, metalness: 0.8, roughness: 0.3 });
    const powerBtn = new THREE.Mesh(powerBtnGeo, btnMat);
    powerBtn.position.set(width / 2 + 0.02, 0.5, 0);
    phoneGroup.add(powerBtn);

    const volBtnGeo = new THREE.BoxGeometry(0.04, 0.65, 0.08);
    const volBtn = new THREE.Mesh(volBtnGeo, btnMat);
    volBtn.position.set(-width / 2 - 0.02, 0.4, 0);
    phoneGroup.add(volBtn);

    // Store references for exploded view animation
    phoneGroup.userData = {
      chassis,
      screen,
      glass,
      bump,
      exploded: false,
    };

    return phoneGroup;
  }

  // =========================================================================
  // 4. HERO SECTION 3D SCENE INITIALIZATION
  // =========================================================================
  function initHeroScene() {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // OrbitControls
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false; // keep clean framing
      controls.maxPolarAngle = Math.PI / 2 + 0.3;
      controls.minPolarAngle = Math.PI / 2 - 0.3;
    }

    // Lighting (Warm amber cyber highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const emberRimLight = new THREE.DirectionalLight(0xf97316, 2.8);
    emberRimLight.position.set(-6, -2, -4);
    scene.add(emberRimLight);

    const topWarmLight = new THREE.PointLight(0xfb923c, 1.8, 15);
    topWarmLight.position.set(2, 4, 3);
    scene.add(topWarmLight);

    // Floating Particle Matrix (Dust of encrypted tokens)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.045,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Screen Texture
    const heroScreen = createHeroScreenTexture();

    // Smartphone Model
    const phone = createSmartphoneModel(heroScreen.texture);
    phone.rotation.y = -0.32;
    phone.rotation.x = 0.12;
    scene.add(phone);

    // Auto-rotation toggle
    let isAutoRotating = true;
    let isExploded = false;

    // Render Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      heroScreen.update();

      if (isAutoRotating && !isExploded) {
        phone.rotation.y += 0.006;
        phone.position.y = Math.sin(clock.getElapsedTime() * 1.4) * 0.08;
      }

      // Gentle particle drift
      particles.rotation.y += 0.0008;

      // Exploded view animation tween
      if (isExploded) {
        phone.userData.glass.position.z = THREE.MathUtils.lerp(phone.userData.glass.position.z, 0.9, 0.08);
        phone.userData.screen.position.z = THREE.MathUtils.lerp(phone.userData.screen.position.z, 0.5, 0.08);
        phone.userData.bump.position.z = THREE.MathUtils.lerp(phone.userData.bump.position.z, -0.8, 0.08);
      } else {
        phone.userData.glass.position.z = THREE.MathUtils.lerp(phone.userData.glass.position.z, 0.108, 0.08);
        phone.userData.screen.position.z = THREE.MathUtils.lerp(phone.userData.screen.position.z, 0.104, 0.08);
        phone.userData.bump.position.z = THREE.MathUtils.lerp(phone.userData.bump.position.z, -0.14, 0.08);
      }

      if (controls) controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Wire up HUD Controls
    const screenBtns = document.querySelectorAll('[data-hero-screen]');
    screenBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        screenBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-hero-screen');
        heroScreen.setMode(mode);
      });
    });

    const explodeBtn = document.getElementById('btn-explode-view');
    if (explodeBtn) {
      explodeBtn.addEventListener('click', () => {
        isExploded = !isExploded;
        explodeBtn.classList.toggle('active', isExploded);
        explodeBtn.textContent = isExploded ? 'Reassemble Chassis' : 'Explode Hardware';
        if (isExploded) isAutoRotating = false;
      });
    }

    const resetBtn = document.getElementById('btn-reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        isAutoRotating = true;
        isExploded = false;
        if (explodeBtn) {
          explodeBtn.classList.remove('active');
          explodeBtn.textContent = 'Explode Hardware';
        }
        phone.rotation.set(0.12, -0.32, 0);
        camera.position.set(0, 0, 7.5);
      });
    }

    // Pause auto rotate when user manually touches/orbits
    container.addEventListener('pointerdown', () => {
      isAutoRotating = false;
    });
  }

  // =========================================================================
  // 5. SETUP WALKTHROUGH 3D SCENE INITIALIZATION
  // =========================================================================
  function initSetupScene() {
    const container = document.getElementById('setup-three-canvas');
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // OrbitControls
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const emberRimLight = new THREE.DirectionalLight(0xf97316, 2.5);
    emberRimLight.position.set(-5, -2, -3);
    scene.add(emberRimLight);

    // Screen Texture
    const setupScreen = createSetupScreenTexture();

    // Phone Model
    const phone = createSmartphoneModel(setupScreen.texture);
    scene.add(phone);

    // Target Orientations for each step
    const stepConfigs = {
      1: { rotY: -0.15, rotX: 0.05, posY: 0, camZ: 7.2 },
      2: { rotY: 0.22, rotX: 0.08, posY: 0, camZ: 6.8 }, // tilt to show setting toggle
      3: { rotY: -0.05, rotX: 0.02, posY: 0, camZ: 6.9 }, // centered on package prompt
      4: { rotY: 0.0, rotX: 0.0, posY: 0.05, camZ: 6.6 },  // victory / hero state
    };

    let activeStep = 1;
    let targetConfig = stepConfigs[1];

    function setStep(stepNum) {
      activeStep = stepNum;
      targetConfig = stepConfigs[stepNum] || stepConfigs[1];
      setupScreen.setStep(stepNum);
    }

    // Render Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      clock.getDelta();

      setupScreen.update();

      // Smooth camera/phone interpolation to step target
      phone.rotation.y = THREE.MathUtils.lerp(phone.rotation.y, targetConfig.rotY, 0.06);
      phone.rotation.x = THREE.MathUtils.lerp(phone.rotation.x, targetConfig.rotX, 0.06);
      phone.position.y = THREE.MathUtils.lerp(phone.position.y, targetConfig.posY, 0.06);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetConfig.camZ, 0.06);

      if (controls) controls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Expose global controller
    window.HeroChatsSetup3D = {
      setStep: setStep,
      getStep: () => activeStep,
    };
  }

  // Initialize both scenes once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeroScene();
      initSetupScene();
    });
  } else {
    initHeroScene();
    initSetupScene();
  }
})();
