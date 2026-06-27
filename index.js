/* ============================================================
   M. Sethupathi — Portfolio JavaScript
   Particle Canvas | Typing Effect | Terminal | Scroll Reveal
   Lightbox | Skill Bars | Form Handler
   ============================================================ */

'use strict';

// ============================================================
// 1. HERO CANVAS — Interactive Particle Network
// ============================================================
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = 70;
  const CONNECTION_DIST = 140;
  const MOUSE_REPEL = 100;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      vx: randomBetween(-0.25, 0.25),
      vy: randomBetween(-0.25, 0.25),
      radius: randomBetween(1.5, 3),
      alpha: randomBetween(0.3, 0.8),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,135,${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,135,${p.alpha})`;
      ctx.fill();
    });
  }

  function update() {
    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < MOUSE_REPEL) {
        const force = (MOUSE_REPEL - dist) / MOUSE_REPEL * 0.6;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Speed cap
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 1.5) { p.vx *= 1.5 / speed; p.vy *= 1.5 / speed; }

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  init();
  loop();
})();


// ============================================================
// 2. NAVBAR — Scroll shrink + Mobile hamburger
// ============================================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
  });

  // Close menu on link click
  navLinks && navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('mobile-open');
    });
  });
})();


// ============================================================
// 3. TYPING EFFECT — Hero Subtitle
// ============================================================
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Penetration Tester',
    'Offensive Security Enthusiast',
    'CTF Player & Organizer',
    'Open Source Tool Builder',
    'OWASP Speaker',
    'Top 5% on TryHackMe',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (deleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 80);
    }
  }

  setTimeout(type, 800);
})();


// ============================================================
// 4. SCROLL REVEAL — IntersectionObserver
// ============================================================
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate skill bars when they enter viewport
        const bar = entry.target.querySelector('.skill-bar');
        if (bar) {
          const level = entry.target.dataset.skill || '75';
          bar.style.width = level + '%';
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();


// ============================================================
// 5. TERMINAL EMULATOR
// ============================================================
(function initTerminal() {
  const output = document.getElementById('terminal-output');
  const input  = document.getElementById('term-input');
  if (!output || !input) return;

  const PROMPT = '<span class="term-prompt">seth@portfolio:~$</span> ';
  let history = [];
  let historyIdx = -1;

  const commands = {
    help: () => `
<span class="term-green">Available commands:</span>
<div class="term-gap"></div>
  <span class="term-cyan">about</span>     — Who am I?
  <span class="term-cyan">skills</span>    — My technical skill set
  <span class="term-cyan">projects</span>  — Open source projects I've built
  <span class="term-cyan">experience</span>— Internship & work history
  <span class="term-cyan">ctf</span>       — CTF achievements & platforms
  <span class="term-cyan">patent</span>    — My published patent
  <span class="term-cyan">contact</span>   — How to reach me
  <span class="term-cyan">whoami</span>    — Quick identity card
  <span class="term-cyan">clear</span>     — Clear the terminal
<div class="term-gap"></div>
<span class="term-yellow">Tip:</span> Use ↑/↓ arrow keys to navigate history.
`,
    whoami: () => `
<span class="term-green">┌─[</span><span class="term-cyan">M. Sethupathi</span><span class="term-green">]</span>
<span class="term-green">│</span>  Role    : Cyber Security Engineer (BE Student)
<span class="term-green">│</span>  College : Mahendra Engineering College
<span class="term-green">│</span>  Batch   : 2023 – 2027
<span class="term-green">│</span>  CGPA    : 8.18
<span class="term-green">│</span>  Status  : <span class="term-yellow">Open to opportunities</span>
<span class="term-green">└─[</span><span class="term-pink">Offensive Security Focus</span><span class="term-green">]</span>
`,
    about: () => `
<span class="term-green">[about]</span> Loading profile...
<div class="term-gap"></div>
I'm a passionate Cyber Security student driven by curiosity and
an obsession with breaking things (ethically). I specialize in
<span class="term-cyan">penetration testing</span> and <span class="term-pink">offensive security</span>, with hands-on experience
discovering vulnerabilities in real-world applications.

I build open-source security tools, compete in CTFs, organize
events for my college community, and am always learning.

My goal: work in <span class="term-yellow">offensive security</span> and help organizations
stay resilient against modern cyber threats.
`,
    skills: () => `
<span class="term-green">[skills]</span> Scanning toolkit...
<div class="term-gap"></div>
<span class="term-cyan">Core Domains</span>
  ◉ Penetration Testing    ████████████░░  Advanced
  ◉ WAPT                   ███████████░░░  Advanced
  ◉ Linux & Shell          ████████████░░  Proficient
  ◉ Networking             ██████████░░░░  Proficient
<div class="term-gap"></div>
<span class="term-pink">Languages</span>
  ◉ Python                 ████████████░░  Proficient
<div class="term-gap"></div>
<span class="term-yellow">Platforms</span>
  ◉ TryHackMe — <span class="term-green">Top 5% Globally</span>
  ◉ Hack The Box — Active
`,
    projects: () => `
<span class="term-green">[projects]</span> Listing repositories...
<div class="term-gap"></div>
<span class="term-cyan">01</span> <span class="term-yellow">GhostRoute</span>
   Modular Linux anonymity tool — Tor + proxies + obfuscation TUI
   Stack: <span class="term-pink">Python, Linux, Tor</span>

<span class="term-cyan">02</span> <span class="term-yellow">Attack Surface Mapper</span>
   Modular web attack surface discovery with rich terminal UI
   Stack: <span class="term-pink">Python, OSINT, Recon</span>

<span class="term-cyan">03</span> <span class="term-yellow">Pentest MCP</span>
   AI-powered pentest automation via Model Context Protocol
   Stack: <span class="term-pink">Python, MCP, AI</span>

<span class="term-cyan">04</span> <span class="term-yellow">Brute Force Script</span>
   Java tool for brute-forcing traditional network protocols
   Stack: <span class="term-pink">Java, Networking</span>
`,
    experience: () => `
<span class="term-green">[experience]</span> Loading work history...
<div class="term-gap"></div>
<span class="term-yellow">Ozone Cyber Security</span> <span class="term-cyan">Jun 2025 – Jul 2025</span>
  Role : Cyber Security Intern
  Work : Full pentest engagements — recon to exploitation
  Findings: <span class="term-pink">XSS, SQLi, HTML Injection</span>

<span class="term-yellow">Skillintern India</span> <span class="term-cyan">Feb 2024 – May 2024</span>
  Role : Cyber Security Intern (Remote)
  Work : Core security methodology & vulnerability assessment
`,
    ctf: () => `
<span class="term-green">[ctf]</span> Retrieving competition data...
<div class="term-gap"></div>
<span class="term-yellow">🥈 2nd Place</span> — Inter-College CTF Event
   Demonstrated skills in exploitation, crypto & reversing

<span class="term-yellow">🎯 Top 7%</span> — TryHackMe (Global Ranking)
   Consistent solve across web, priv-esc, network categories

<span class="term-yellow">💀 Hack The Box</span>
   Active participant — retired & active vulnerable machines

<span class="term-yellow">🚩 CTF Organizer</span>
   Conducted & organized multiple CTF events at college
`,
    patent: () => `
<span class="term-green">[patent]</span> Loading intellectual property...
<div class="term-gap"></div>
<span class="term-cyan">Status    :</span> <span class="term-yellow">Published</span>
<span class="term-cyan">Title     :</span> Secure Decentralized Storage and Access of
             Digital Documents Using Blockchain Technology
<span class="term-cyan">Domain    :</span> Blockchain | Cryptography | Distributed Systems
<div class="term-gap"></div>
<span class="term-green">[OK]</span> Patent successfully retrieved.
`,
    contact: () => `
<span class="term-green">[contact]</span> Initializing communication channels...
<div class="term-gap"></div>
  📧 Email    : sethupathi7454@gmail.com
  🎓 College  : Mahendra Engineering College
  📍 Location : Tamil Nadu, India
  🐙 GitHub   : github.com/sethupathi-cyber
  🔗 LinkedIn : linkedin.com/in/sethupathi-m-
  🎯 THM      : tryhackme.com/p/sethupathiM
<div class="term-gap"></div>
<span class="term-yellow">Or scroll down and use the contact form ↓</span>
`,
    clear: () => null, // Handled separately
  };

  function printLine(html, cls = '') {
    const div = document.createElement('div');
    div.className = 'term-line ' + cls;
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function printWelcome() {
    printLine(`<span class="term-green">
███████╗███████╗████████╗██╗  ██╗
██╔════╝██╔════╝╚══██╔══╝██║  ██║
███████╗█████╗     ██║   ███████║
╚════██║██╔══╝     ██║   ██╔══██║
███████║███████╗   ██║   ██║  ██║
╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝
</span>`);
    printLine(`<span class="term-cyan">Sethupathi's Portfolio Terminal v1.0</span>`);
    printLine(`<span class="term-secondary" style="color:var(--text-muted);">Type <span class="term-green">help</span> to see available commands.</span>`);
    const gap = document.createElement('div');
    gap.className = 'term-gap';
    output.appendChild(gap);
  }

  function runCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase();

    // Echo the command
    printLine(PROMPT + '<span class="term-cmd">' + escHtml(cmd) + '</span>');

    if (trimmed === '') return;
    if (trimmed === 'clear') {
      output.innerHTML = '';
      return;
    }

    if (commands[trimmed]) {
      const result = commands[trimmed]();
      if (result) printLine(result);
    } else {
      printLine(`<span class="term-error">Command not found: ${escHtml(trimmed)}</span>`);
      printLine(`<span style="color:var(--text-muted);">Type <span class="term-green">help</span> for available commands.</span>`);
    }
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = input.value;
      if (cmd.trim()) {
        history.unshift(cmd);
        historyIdx = -1;
        if (history.length > 50) history.pop();
      }
      runCommand(cmd);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      } else {
        historyIdx = -1;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab completion
      const partial = input.value.trim().toLowerCase();
      const match = Object.keys(commands).find(k => k.startsWith(partial));
      if (match) input.value = match;
    }
  });

  // Focus terminal on click anywhere in the terminal window
  document.querySelector('.terminal-window') &&
    document.querySelector('.terminal-window').addEventListener('click', () => input.focus());

  printWelcome();
  // Auto-run welcome animation
  setTimeout(() => {
    printLine(PROMPT + '<span class="term-cmd">whoami</span>');
    setTimeout(() => {
      printLine(commands.whoami());
    }, 400);
  }, 600);
})();


// ============================================================
// 6. LIGHTBOX — Gallery Image Modal
// ============================================================
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');

  if (!lightbox) return;

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbImg.alt = caption;
    lbCap.textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(item.dataset.img, item.dataset.caption);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item.dataset.img, item.dataset.caption);
      }
    });
  });

  lbClose && lbClose.addEventListener('click', closeLightbox);

  // Close on backdrop click
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();


// ============================================================
// 7. CONTACT FORM — Validation & Feedback
// ============================================================
(function initContactForm() {
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submit   = document.getElementById('contact-submit');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showFeedback('⚠ Please fill in all required fields.', 'warn');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('⚠ Please enter a valid email address.', 'warn');
      return;
    }

    // Formspree — real email delivery
    submit.textContent = 'SENDING...';
    submit.disabled = true;

    const subject = document.getElementById('form-subject').value.trim();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject || 'Portfolio Contact');
    formData.append('message', message);

    fetch('https://formspree.io/f/sethupathi7454@gmail.com', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        showFeedback('✓ Message sent! I\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        showFeedback('✗ Failed to send. Please email directly: sethupathi7454@gmail.com', 'warn');
      }
    })
    .catch(() => {
      showFeedback('✗ Network error. Please email: sethupathi7454@gmail.com', 'warn');
    })
    .finally(() => {
      submit.textContent = 'SEND_MESSAGE.exe ↗';
      submit.disabled = false;
    });
  });

  function showFeedback(msg, type) {
    feedback.style.display = 'block';
    feedback.textContent = msg;
    feedback.style.background = type === 'success'
      ? 'rgba(0,255,135,0.08)'
      : 'rgba(255,189,46,0.08)';
    feedback.style.border = type === 'success'
      ? '1px solid rgba(0,255,135,0.25)'
      : '1px solid rgba(255,189,46,0.25)';
    feedback.style.color = type === 'success'
      ? 'var(--accent-green)'
      : 'var(--accent-yellow)';
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 5000);
  }
})();


// ============================================================
// 8. SMOOTH ACTIVE NAV LINK — Highlight on scroll
// ============================================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAs.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--accent-green)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();
