/* ============================
   MAIN SCRIPT — DirectSeq Website
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ----------------------------
     Mobile menu toggle
     ---------------------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle?.addEventListener('click', function () {
    this.classList.toggle('active');
    navLinks?.classList.toggle('active');
  });

  /* ----------------------------
     Smooth scrolling for anchors
     EXCLUDES .bio-link (modals)
     ---------------------------- */
  document.querySelectorAll('a[href^="#"]:not(.bio-link)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Ignore empty or just '#'
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      // Close mobile menu if open
      menuToggle?.classList.remove('active');
      navLinks?.classList.remove('active');

      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ----------------------------
     Hero buttons (scoped)
     ---------------------------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroPrimary = hero.querySelector('.btn-primary');
    const heroSecondary = hero.querySelector('.btn-secondary');

    heroPrimary?.addEventListener('click', () => {
      document.querySelector('#technology')?.scrollIntoView({ behavior: 'smooth' });
    });

    heroSecondary?.addEventListener('click', () => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ============================
     Helix Scroll Animation
     ============================ */
  class HelixScroll {
    constructor() {
      this.container = document.getElementById('helix-scroll');
      if (!this.container) return;

      this.bars = [];
      this.numBars = 20;
      this.amplitude = 40;
      this.verticalSpacing = 60;
      this.morphDistance = 300; // Distance over which morphing occurs
      this.init();
    }

    init() {
      // Create bars once
      for (let i = 0; i < this.numBars; i++) {
        const bar = document.createElement('div');
        bar.className = 'helix-bar';
        this.container.appendChild(bar);
        this.bars.push(bar);
      }

      // Listen + initial paint
      window.addEventListener('scroll', () => this.updateHelix(), { passive: true });
      this.updateHelix();
    }

    updateHelix() {
      const scrollY = window.scrollY || 0;
      const progress = Math.min(scrollY / this.morphDistance, 1);
      const centerX = window.innerWidth / 2;

      this.bars.forEach((bar, i) => {
        const y = i * this.verticalSpacing;
        const sineX = Math.sin(scrollY * 0.01 + i * 0.5) * this.amplitude;
        const x = sineX * progress;
        const rotation = 90 * progress;
        const opacity = 1 - (i / this.numBars) * (0.3 + 0.7 * progress);
        bar.style.transform = `translate(${centerX + x}px, ${y}px) rotate(${rotation}deg)`;
        bar.style.opacity = opacity;
      });
    }
  }

  /* ============================
     Navbar Scroll Handling
     ============================ */
  class NavbarScroll {
    constructor() {
      this.navbar = document.querySelector('.navbar');
      if (!this.navbar) return;

      this.scrollThreshold = 100;
      this.isVisible = false;

      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

      if (window.scrollY > this.scrollThreshold) {
        this.showNavbar();
      }
    }

    handleScroll() {
      const y = window.scrollY;
      if (y > this.scrollThreshold && !this.isVisible) this.showNavbar();
      else if (y <= this.scrollThreshold && this.isVisible) this.hideNavbar();
    }

    showNavbar() {
      this.navbar.classList.add('navbar-visible');
      this.isVisible = true;
    }

    hideNavbar() {
      this.navbar.classList.remove('navbar-visible');
      this.isVisible = false;
    }
  }

  /* ============================
     Team Bio Modals
     - Excludes from smooth scroll
     - Delegated handlers
     - Click outside + Esc to close
     ============================ */
  class TeamBios {
    constructor() {
      this.hasLinks = !!document.querySelector('.bio-link');
      this.hasModals = !!document.querySelector('.bio-modal');
      if (!this.hasLinks || !this.hasModals) return;
      this.init();
    }

    openModal(modal) {
      modal.style.display = 'flex';
      // Optional: focus first focusable element
      const focusable = modal.querySelector('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
      focusable?.focus();
    }

    closeModal(modal) {
      modal.style.display = 'none';
    }

    init() {
      // Open modals (delegation)
      document.addEventListener('click', (e) => {
        const link = e.target.closest('.bio-link');
        if (!link) return;

        // Prevent default & stop any smooth scroll
        e.preventDefault();
        e.stopPropagation();

        const href = link.getAttribute('href');
        if (!href) return;
        const modal = document.querySelector(href);
        if (modal && modal.classList.contains('bio-modal')) {
          this.openModal(modal);
        }
      });

      // Close via × button (delegation)
      document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.bio-modal .close');
        if (!closeBtn) return;
        const modal = closeBtn.closest('.bio-modal');
        if (modal) this.closeModal(modal);
      });

      // Close when clicking outside content
      window.addEventListener('click', (e) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains('bio-modal')) {
          this.closeModal(e.target);
        }
      });

      // Esc to close any open modal
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.bio-modal[style*="display: flex"]').forEach(m => (m.style.display = 'none'));
        }
      });
    }
  }

  /* ============================
     Initialize Everything
     ============================ */
  new HelixScroll();
  new NavbarScroll();
  new TeamBios();

  /* ============================
     Contact form: simple thank-you
     (fires before redirect to Formspree)
     ============================ */
  const contactForm = document.querySelector('#contact form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      alert('Thank you! Your message has been sent successfully.');
      // No preventDefault(): form still submits to Formspree
    });
  }
});
