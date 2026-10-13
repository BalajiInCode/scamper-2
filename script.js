/**
 * SCAMPER on CCTV: Smart Campus Camera
 * Created by Balaji | © 2026 Balaji. All rights reserved.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // State Management
  const state = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    activeScene: null,
    sceneTimers: {},
    animationsPaused: false
  };

  // ------------------------------------------------------------------------
  // STICKY PROGRESS BAR NAVIGATION & INTERSECTION OBSERVER
  // ------------------------------------------------------------------------
  const SCENE_KEYS = ['s', 'c', 'a', 'm', 'p', 'e', 'r'];
  const navLetters = document.querySelectorAll('.scamper-nav .nav-letter');
  const sceneSections = document.querySelectorAll('.scene-section, .screen');
  const dockIndicator = document.getElementById('dockIndicator');
  const btnPrevScene = document.getElementById('btnPrevScene');
  const btnNextScene = document.getElementById('btnNextScene');

  const updateActiveNav = (letter) => {
    state.activeScene = letter ? letter.toLowerCase() : null;
    navLetters.forEach((link) => {
      const isTarget = link.getAttribute('data-scene') === letter?.toLowerCase();
      link.classList.toggle('active', isTarget);
    });

    if (letter && dockIndicator) {
      const idx = SCENE_KEYS.indexOf(letter.toLowerCase());
      if (idx !== -1) {
        dockIndicator.textContent = `${idx + 1} / 7`;
      }
    }
  };

  const getCurrentSceneIndex = () => {
    if (!state.activeScene) return 0;
    const idx = SCENE_KEYS.indexOf(state.activeScene);
    return idx === -1 ? 0 : idx;
  };

  const scrollToSceneIndex = (idx) => {
    if (idx < 0) {
      const intro = document.getElementById('introScreen');
      if (intro) intro.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (idx >= SCENE_KEYS.length) {
      const outro = document.getElementById('outroScreen');
      if (outro) outro.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const sceneId = `scene-${SCENE_KEYS[idx]}`;
    const targetEl = document.getElementById(sceneId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Setup Intersection Observer for 60fps view-dependent animations
  const observerOptions = {
    root: null,
    rootMargin: '-15% 0px -25% 0px',
    threshold: 0.25
  };

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const section = entry.target;
      const letter = section.getAttribute('data-letter');

      if (entry.isIntersecting) {
        section.classList.add('in-view');
        if (letter) {
          updateActiveNav(letter);
          startSceneAnimation(letter);
        }
      } else {
        section.classList.remove('in-view');
        if (letter) {
          stopSceneAnimation(letter);
        }
      }
    });
  }, observerOptions);

  sceneSections.forEach((sec) => sceneObserver.observe(sec));

  // Smooth scroll click handler for Nav Letters
  navLetters.forEach((navLink) => {
    navLink.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = navLink.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Quick Nav Dock Buttons
  if (btnPrevScene) {
    btnPrevScene.addEventListener('click', () => {
      const cur = getCurrentSceneIndex();
      scrollToSceneIndex(cur - 1);
    });
  }

  if (btnNextScene) {
    btnNextScene.addEventListener('click', () => {
      const cur = getCurrentSceneIndex();
      scrollToSceneIndex(cur + 1);
    });
  }

  // Keyboard navigation (ArrowDown/Up, PageDown/Up)
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const cur = getCurrentSceneIndex();
      scrollToSceneIndex(cur + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const cur = getCurrentSceneIndex();
      scrollToSceneIndex(cur - 1);
    }
  });

  // ------------------------------------------------------------------------
  // SCENE SPECIFIC ANIMATION CONTROLLERS
  // ------------------------------------------------------------------------

  function startSceneAnimation(letter) {
    if (state.animationsPaused || state.reducedMotion) return;

    switch (letter.toUpperCase()) {
      case 'S':
        animateSceneS();
        break;
      case 'C':
        animateSceneC();
        break;
      case 'A':
        animateSceneA();
        break;
      case 'M':
        animateSceneM();
        break;
      case 'P':
        animateSceneP();
        break;
      case 'E':
        animateSceneE();
        break;
      case 'R':
        animateSceneR();
        break;
    }
  }

  function stopSceneAnimation(letter) {
    if (state.sceneTimers[letter]) {
      clearTimeout(state.sceneTimers[letter]);
      clearInterval(state.sceneTimers[letter]);
      delete state.sceneTimers[letter];
    }
  }

  // --- SCENE 1: S (SUBSTITUTE) ---
  function animateSceneS() {
    const sceneEl = document.getElementById('scene-s');
    if (!sceneEl) return;

    stopSceneAnimation('S');

    function runCycle() {
      // Step 1: Sleeping
      sceneEl.classList.remove('state-alert');
      sceneEl.classList.add('state-sleeping');

      // Step 2: After 2.5s, Intruder detected -> Alert sent -> Guard snaps awake
      state.sceneTimers['S'] = setTimeout(() => {
        sceneEl.classList.remove('state-sleeping');
        sceneEl.classList.add('state-alert');

        // Loop after 4.5s
        state.sceneTimers['S'] = setTimeout(runCycle, 4500);
      }, 2500);
    }

    runCycle();
  }

  // --- SCENE 2: C (COMBINE) ---
  function animateSceneC() {
    const sceneEl = document.getElementById('scene-c');
    if (!sceneEl) return;

    stopSceneAnimation('C');

    const tempDigits = sceneEl.querySelector('.thermo-digits');
    const mercuryBar = sceneEl.querySelector('.thermo-mercury-bar');

    let currentTemp = 24;
    let tempInterval;

    function tempCycle() {
      currentTemp = 24;
      if (tempDigits) tempDigits.textContent = '24°C';

      // Rise temp to 120°C
      let target = 120;
      let step = 4;
      tempInterval = setInterval(() => {
        if (currentTemp < target) {
          currentTemp += step;
          if (tempDigits) tempDigits.textContent = `${currentTemp}°C`;
        } else {
          clearInterval(tempInterval);
          // Wait and cool down
          setTimeout(() => {
            let coolInterval = setInterval(() => {
              if (currentTemp > 24) {
                currentTemp -= step * 1.5;
                if (tempDigits) tempDigits.textContent = `${Math.max(24, Math.round(currentTemp))}°C`;
              } else {
                clearInterval(coolInterval);
                setTimeout(tempCycle, 2000);
              }
            }, 50);
          }, 3000);
        }
      }, 70);
    }

    tempCycle();
    state.sceneTimers['C'] = tempInterval;
  }

  // --- SCENE 3: A (ADAPT) ---
  function animateSceneA() {
    const sceneEl = document.getElementById('scene-a');
    if (!sceneEl) return;

    stopSceneAnimation('A');

    const students = [1, 2, 3, 4];
    const counterText = sceneEl.querySelector('.attend-counter-text');
    const statusText = sceneEl.querySelector('.attend-status-text');
    const statusBg = sceneEl.querySelector('.attend-status-bg');

    function resetAttendance() {
      students.forEach((i) => {
        const tick = sceneEl.querySelector(`.tick-${i}`);
        const reticle = sceneEl.querySelector(`.reticle-${i}`);
        if (tick) tick.classList.remove('scanned');
        if (reticle) reticle.classList.remove('scanning');
      });
      if (counterText) counterText.textContent = '0/4';
      if (statusText) statusText.textContent = 'SCANNING...';
      if (statusBg) statusBg.setAttribute('fill', '#FFA502');
    }

    function scanNext(index) {
      if (index >= students.length) {
        if (statusText) statusText.textContent = '100% PRESENT!';
        if (statusBg) statusBg.setAttribute('fill', '#2ED573');
        // Restart cycle after 4s
        state.sceneTimers['A'] = setTimeout(startClassCycle, 4000);
        return;
      }

      const id = students[index];
      const reticle = sceneEl.querySelector(`.reticle-${id}`);
      const tick = sceneEl.querySelector(`.tick-${id}`);

      if (reticle) reticle.classList.add('scanning');

      state.sceneTimers['A'] = setTimeout(() => {
        if (tick) tick.classList.add('scanned');
        if (reticle) reticle.classList.remove('scanning');
        if (counterText) counterText.textContent = `${index + 1}/4`;

        state.sceneTimers['A'] = setTimeout(() => {
          scanNext(index + 1);
        }, 1100);
      }, 800);
    }

    function startClassCycle() {
      resetAttendance();
      state.sceneTimers['A'] = setTimeout(() => scanNext(0), 800);
    }

    startClassCycle();
  }

  // --- SCENE 4: M (MODIFY) ---
  function animateSceneM() {
    const sceneEl = document.getElementById('scene-m');
    if (!sceneEl) return;
    // CSS animations handle LED pulse and student walk seamlessly
  }

  // --- SCENE 5: P (PUT TO ANOTHER USE) ---
  function animateSceneP() {
    const sceneEl = document.getElementById('scene-p');
    if (!sceneEl) return;
    // Continuous sonar ripple & red detection bounding box handled via CSS
  }

  // --- SCENE 6: E (ELIMINATE) ---
  function animateSceneE() {
    const sceneEl = document.getElementById('scene-e');
    if (!sceneEl) return;

    stopSceneAnimation('E');

    function cableCycle() {
      sceneEl.classList.remove('cut-done');

      // Snip happens at 1.8s
      state.sceneTimers['E'] = setTimeout(() => {
        sceneEl.classList.add('cut-done');

        // Reset and repeat after 6s
        state.sceneTimers['E'] = setTimeout(cableCycle, 6000);
      }, 2000);
    }

    cableCycle();
  }

  // --- SCENE 7: R (REVERSE) ---
  function animateSceneR() {
    const sceneEl = document.getElementById('scene-r');
    if (!sceneEl) return;
    // Autonomous Drone flight loop is executed smoothly via CSS @keyframes
  }

  // ------------------------------------------------------------------------
  // AUTO TOUR (PLAY STORY MODE)
  // ------------------------------------------------------------------------
  const autoTourBtn = document.getElementById('autoTourBtn');
  let autoTourInterval = null;
  let isTourRunning = false;

  const stopAutoTour = () => {
    if (autoTourInterval) {
      clearInterval(autoTourInterval);
      autoTourInterval = null;
    }
    isTourRunning = false;
    if (autoTourBtn) {
      autoTourBtn.classList.remove('active');
      autoTourBtn.innerHTML = `
        <span class="tour-icon">▶</span>
        <span class="tour-label">Auto Tour</span>
      `;
    }
  };

  const startAutoTour = () => {
    isTourRunning = true;
    if (autoTourBtn) {
      autoTourBtn.classList.add('active');
      autoTourBtn.innerHTML = `
        <span class="tour-icon">⏸</span>
        <span class="tour-label">Pause Tour</span>
      `;
    }

    let tourIndex = getCurrentSceneIndex();
    scrollToSceneIndex(tourIndex);

    autoTourInterval = setInterval(() => {
      tourIndex++;
      if (tourIndex >= SCENE_KEYS.length) {
        scrollToSceneIndex(SCENE_KEYS.length); // outro
        stopAutoTour();
      } else {
        scrollToSceneIndex(tourIndex);
      }
    }, 5500);
  };

  if (autoTourBtn) {
    autoTourBtn.addEventListener('click', () => {
      if (isTourRunning) {
        stopAutoTour();
      } else {
        startAutoTour();
      }
    });
  }

  // ------------------------------------------------------------------------
  // INTERACTIVE BUTTON CONTROLS FOR EACH SCENE
  // ------------------------------------------------------------------------

  // Scene S: Intruder Alert Trigger
  const btnTriggerAlertS = document.getElementById('btnTriggerAlertS');
  if (btnTriggerAlertS) {
    btnTriggerAlertS.addEventListener('click', () => {
      const sceneEl = document.getElementById('scene-s');
      if (!sceneEl) return;
      stopSceneAnimation('S');
      sceneEl.classList.remove('state-sleeping');
      sceneEl.classList.add('state-alert');

      btnTriggerAlertS.textContent = '🚨 Alert Sent to Guard!';
      btnTriggerAlertS.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btnTriggerAlertS.style.transform = '';
        setTimeout(() => {
          btnTriggerAlertS.textContent = '🚨 Trigger Intruder Alert';
        }, 1500);
      }, 200);

      state.sceneTimers['S'] = setTimeout(() => {
        animateSceneS();
      }, 4000);
    });
  }

  // Scene C: Flame Flare & Tamper Test
  const btnFireTestC = document.getElementById('btnFireTestC');
  if (btnFireTestC) {
    btnFireTestC.addEventListener('click', () => {
      const sceneEl = document.getElementById('scene-c');
      if (!sceneEl) return;
      sceneEl.classList.add('flare-active');
      const tempDigits = sceneEl.querySelector('.thermo-digits');
      if (tempDigits) tempDigits.textContent = '145°C';

      btnFireTestC.textContent = '🔥 Flame Flared to 145°C!';
      setTimeout(() => {
        sceneEl.classList.remove('flare-active');
        btnFireTestC.textContent = '🔥 Flame Flare';
        animateSceneC();
      }, 3000);
    });
  }

  const btnTamperTestC = document.getElementById('btnTamperTestC');
  if (btnTamperTestC) {
    btnTamperTestC.addEventListener('click', () => {
      const sceneEl = document.getElementById('scene-c');
      if (!sceneEl) return;
      sceneEl.classList.add('tamper-active');

      btnTamperTestC.textContent = '✋ Lens Tamper Triggered!';
      setTimeout(() => {
        sceneEl.classList.remove('tamper-active');
        btnTamperTestC.textContent = '✋ Cover Lens';
      }, 3500);
    });
  }

  // Scene A: Scan All Faces
  const btnScanAllA = document.getElementById('btnScanAllA');
  if (btnScanAllA) {
    btnScanAllA.addEventListener('click', () => {
      const sceneEl = document.getElementById('scene-a');
      if (!sceneEl) return;
      stopSceneAnimation('A');

      const counterText = sceneEl.querySelector('.attend-counter-text');
      const statusText = sceneEl.querySelector('.attend-status-text');
      const statusBg = sceneEl.querySelector('.attend-status-bg');

      // Instantly mark all scanned with visual flourish
      [1, 2, 3, 4].forEach((i) => {
        const tick = sceneEl.querySelector(`.tick-${i}`);
        const reticle = sceneEl.querySelector(`.reticle-${i}`);
        if (tick) tick.classList.add('scanned');
        if (reticle) reticle.classList.remove('scanning');
      });

      if (counterText) counterText.textContent = '4/4';
      if (statusText) statusText.textContent = '100% PRESENT!';
      if (statusBg) statusBg.setAttribute('fill', '#2ED573');

      btnScanAllA.textContent = '📋 All 4 Faces Scanned!';
      setTimeout(() => {
        btnScanAllA.textContent = '📋 Scan All Faces';
        state.sceneTimers['A'] = setTimeout(animateSceneA, 3000);
      }, 1500);
    });
  }

  // Scene M: Boost Brightness
  const btnLightBoostM = document.getElementById('btnLightBoostM');
  if (btnLightBoostM) {
    btnLightBoostM.addEventListener('click', () => {
      const sceneEl = document.getElementById('scene-m');
      if (!sceneEl) return;
      const isBoosted = sceneEl.classList.toggle('boost-active');
      if (isBoosted) {
        btnLightBoostM.textContent = '💡 4K Night Vision Boosted!';
      } else {
        btnLightBoostM.textContent = '💡 Boost Brightness';
      }
    });
  }

  // Scene P: Trigger Metal Alarm
  const btnScanMetalP = document.getElementById('btnScanMetalP');
  if (btnScanMetalP) {
    btnScanMetalP.addEventListener('click', () => {
      const sceneEl = document.getElementById('scene-p');
      if (!sceneEl) return;
      sceneEl.classList.add('metal-triggered');
      btnScanMetalP.textContent = '🚨 Metal Weapon Detected!';
      setTimeout(() => {
        sceneEl.classList.remove('metal-triggered');
        btnScanMetalP.textContent = '🚨 Trigger Metal Alarm';
      }, 3500);
    });
  }

  // Scene E: Snip AC Cable
  const btnSnipWireE = document.getElementById('btnSnipWireE');
  if (btnSnipWireE) {
    btnSnipWireE.addEventListener('click', () => {
      const sceneEl = document.getElementById('scene-e');
      if (!sceneEl) return;
      sceneEl.classList.add('snip-burst', 'cut-done');
      btnSnipWireE.textContent = '✂️ AC Cable Eliminated!';
      setTimeout(() => {
        sceneEl.classList.remove('snip-burst');
        btnSnipWireE.textContent = '✂️ Snip AC Cable';
      }, 3500);
    });
  }

  // Scene R: Launch Drone Patrol
  const btnLaunchDroneR = document.getElementById('btnLaunchDroneR');
  if (btnLaunchDroneR) {
    btnLaunchDroneR.addEventListener('click', () => {
      const sceneEl = document.getElementById('scene-r');
      if (!sceneEl) return;
      sceneEl.classList.add('drone-turbo');
      btnLaunchDroneR.textContent = '🚁 Patrol Drone Dispatched!';
      setTimeout(() => {
        sceneEl.classList.remove('drone-turbo');
        btnLaunchDroneR.textContent = '🚁 Launch Drone Patrol';
      }, 4500);
    });
  }

  // ------------------------------------------------------------------------
  // REPLAY BUTTONS FOR EACH SCENE
  // ------------------------------------------------------------------------
  document.querySelectorAll('.scene-replay-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const letter = targetId.replace('scene-', '').toUpperCase();
      stopSceneAnimation(letter);
      startSceneAnimation(letter);

      // Button feedback
      btn.textContent = 'Replayed! ✨';
      setTimeout(() => {
        btn.textContent = 'Replay Action ↺';
      }, 1200);
    });
  });

  // ------------------------------------------------------------------------
  // INTERACTIVE CHARACTERS MICRO-INTERACTIONS (SOUND-FREE)
  // ------------------------------------------------------------------------
  const reactionPhrases = {
    'Security Guard': ['Officer Dan: All clear! 🫡', 'Alert level: 100%! 🛡️', 'No sleeping now! ☕'],
    'AI Robot Mascot': ['CamBot: Bleep Bloop! 🤖', 'Smart scan active! ✨', 'I ♥ Campus Safety!'],
    'Student Mia': ['Mia: Hi CamBot! 👋', 'On time for class! 🎒', 'Super safe path! 🌟'],
    'Student Leo': ['Leo: Night vision is crisp! 👓', 'Present and accounted for! 📚', 'Crystal clear LEDs! 💡'],
    'Student Sam': ['Sam: Drone patrol is epic! ⚽', 'Safety first! 🏃', 'High five AeroCam! ✋'],
    'Student Zoe': ['Zoe: Attendance counted! ✔', 'Smart cameras rock! 💜', 'Lab ready! 🔬'],
    'Drone Camera AeroCam': ['AeroCam: Whirrrr! 🚁', 'Autopilot cruising! 📡', 'Battery 100%! ⚡']
  };

  const interactiveChars = document.querySelectorAll('.interactive-char');

  interactiveChars.forEach((char) => {
    const triggerReaction = (e) => {
      const label = char.getAttribute('aria-label') || 'Character';
      const tooltip = char.getAttribute('data-tooltip');
      const phrases = reactionPhrases[label] || [tooltip || 'Nice to meet you! ✨'];
      const chosenText = phrases[Math.floor(Math.random() * phrases.length)];

      // Bounce character
      char.style.transform = 'scale(1.15) translateY(-6px)';
      setTimeout(() => {
        char.style.transform = '';
      }, 300);

      // Create floating bubble
      createReactionBubble(char, chosenText, e);
    };

    char.addEventListener('click', triggerReaction);
    char.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerReaction(e);
      }
    });
  });

  function createReactionBubble(targetEl, text, evt) {
    const bubble = document.createElement('div');
    bubble.className = 'char-reaction-bubble';
    bubble.textContent = text;

    const rect = targetEl.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    bubble.style.top = `${Math.max(10, rect.top + scrollTop - 24)}px`;
    const targetCenterX = rect.left + scrollLeft + rect.width / 2;
    const clampedX = Math.max(130, Math.min(window.innerWidth - 130, targetCenterX));
    bubble.style.left = `${clampedX}px`;
    bubble.style.transform = 'translateX(-50%)';

    document.body.appendChild(bubble);

    setTimeout(() => {
      bubble.remove();
    }, 1500);
  }

  // ------------------------------------------------------------------------
  // ANIMATION PAUSE / RESUME TOGGLE BUTTON
  // ------------------------------------------------------------------------
  const motionToggle = document.getElementById('motionToggle');
  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      state.animationsPaused = !state.animationsPaused;

      if (state.animationsPaused) {
        document.body.classList.add('paused-animations');
        motionToggle.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        `;
        motionToggle.setAttribute('title', 'Resume animations');
      } else {
        document.body.classList.remove('paused-animations');
        motionToggle.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        `;
        motionToggle.setAttribute('title', 'Pause animations');
        // Restart active scene
        if (state.activeScene) {
          startSceneAnimation(state.activeScene);
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // INITIALIZE FIRST SCENE CHECK
  // ------------------------------------------------------------------------
  updateActiveNav('S');
  animateSceneS();
});
