# M. Sethupathi — Cyber Security Portfolio

> 🔐 **Live Portfolio**: [sethupathi.github.io/portfolio](https://sethupathi.github.io/portfolio)

A modern, dark-themed cybersecurity portfolio built with vanilla HTML, CSS, and JavaScript. No build tools required — fully compatible with GitHub Pages.

## ✨ Features

- **Interactive Particle Canvas** — Responsive WebGL-like particle network that reacts to mouse movement
- **CLI Terminal Emulator** — Visitors can explore the portfolio by typing commands (`help`, `skills`, `projects`, `ctf`, `patent`, etc.)
- **Typing Hero Effect** — Animated rotating subtitle in the hero section
- **Scroll Reveal Animations** — Smooth fade/slide-in animations triggered on scroll
- **Animated Skill Bars** — Progress bars animate into view on scroll
- **Image Gallery with Lightbox** — Click-to-expand modal viewer for event photos
- **Responsive Design** — Optimized for mobile, tablet, and desktop screens
- **Dark Cyberpunk Theme** — Premium glassmorphic cards, neon glow accents, grid overlays

## 📁 File Structure

```
portfoliyo/
├── index.html          ← Main HTML (all sections)
├── index.css           ← Design system & styles
├── index.js            ← All interactivity
├── profile photo.png   ← Your profile photo
├── ctf_event_pic.jpg   ← CTF event reference image
├── owasp_event.jpg.jpeg← OWASP event photo
├── owasp_poster.jpeg   ← OWASP poster
└── README.md           ← This file
```

## 🚀 Hosting on GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set **Source** to `main` branch, root `/`
4. Your portfolio will be live at `https://<username>.github.io/<repo-name>/`

## 🎨 Customization

Before pushing to GitHub, update these items in `index.html`:
- **Contact links** — Replace `sethupathi@example.com`, GitHub/LinkedIn/TryHackMe URLs
- **GitHub project links** — Update the `href` on each project card's "View on GitHub" button

## 🛠️ Local Development

No build step needed. To preview locally:

```bash
# Using Python (already installed)
python -m http.server 8000
# Then open: http://localhost:8000
```

---

Built with ❤️ and ☕ for Offensive Security | © 2025 M. Sethupathi
