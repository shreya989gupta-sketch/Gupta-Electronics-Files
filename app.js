/**
 * Gupta Electronics - Main Application Script
 * Proprietor: Suresh Gupta | Dhar Road, Manawar (M.P.) 454446
 * Features: 2-Second Fullscreen Hero Slider, Interactive Brand Animations, Smooth Navigation & WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const siteHeader = document.getElementById('siteHeader');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const toastContainer = document.getElementById('toastContainer');

  // Hero Slider Elements
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const sliderPrevBtn = document.getElementById('sliderPrevBtn');
  const sliderNextBtn = document.getElementById('sliderNextBtn');
  const timerFill = document.getElementById('timerFill');
  const heroSliderSection = document.getElementById('home');

  // Hero Action Buttons
  const heroExploreBtn = document.getElementById('heroExploreBtn');
  const heroContactBtn = document.getElementById('heroContactBtn');

  // Brands Interactive Elements
  const brandCards = document.querySelectorAll('.brand-card');
  const brandPopover = document.getElementById('brandPopover');
  const popoverBrandTitle = document.getElementById('popoverBrandTitle');
  const popoverBrandDesc = document.getElementById('popoverBrandDesc');
  const popoverCloseBtn = document.getElementById('popoverCloseBtn');

  // Forms
  const contactForm = document.getElementById('contactForm');
  const whatsappDirectBtn = document.getElementById('whatsappDirectBtn');

  /* ==========================================================================
     1. Theme Management (Dark / Light)
     ========================================================================== */
  const storedTheme = localStorage.getItem('ge_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('ge_theme', nextTheme);
      updateThemeIcon(nextTheme);
      showToast(`Switched to ${nextTheme.toUpperCase()} theme`, 'info');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIconSun) return;
    if (theme === 'light') {
      themeIconSun.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    } else {
      themeIconSun.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    }
  }

  /* ==========================================================================
     2. Fullscreen Hero Slider (Auto Slides Every 2 Seconds)
     ========================================================================== */
  let currentSlide = 0;
  const totalSlides = slides.length;
  const SLIDE_INTERVAL_MS = 2000; // Exact 2 seconds as requested
  let slideInterval = null;
  let progressInterval = null;
  let progress = 0;

  function showSlide(index) {
    if (index < 0) {
      currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    resetTimer();
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function resetTimer() {
    progress = 0;
    if (timerFill) {
      timerFill.style.width = '0%';
    }
  }

  function startAutoSlide() {
    stopAutoSlide();

    // 2-Second interval
    slideInterval = setInterval(() => {
      nextSlide();
    }, SLIDE_INTERVAL_MS);

    // Progress bar fill across 2 seconds
    const step = 100 / (SLIDE_INTERVAL_MS / 50);
    progressInterval = setInterval(() => {
      progress += step;
      if (progress > 100) progress = 100;
      if (timerFill) {
        timerFill.style.width = `${progress}%`;
      }
    }, 50);
  }

  function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    if (progressInterval) clearInterval(progressInterval);
  }

  if (sliderNextBtn) {
    sliderNextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });
  }

  if (sliderPrevBtn) {
    sliderPrevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(slideIndex);
      startAutoSlide();
    });
  });

  if (heroSliderSection) {
    heroSliderSection.addEventListener('mouseenter', () => {
      stopAutoSlide();
    });
    heroSliderSection.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  }

  showSlide(0);
  startAutoSlide();

  /* ==========================================================================
     3. Hero Action Buttons (Explore -> Fan | Contact Us -> Contact Form)
     ========================================================================== */
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const fansSection = document.getElementById('fans');
      if (fansSection) {
        fansSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (heroContactBtn) {
    heroContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactFormCard = document.getElementById('contactFormCard') || document.getElementById('contact');
      if (contactFormCard) {
        contactFormCard.scrollIntoView({ behavior: 'smooth' });
        // Auto focus customer name input
        setTimeout(() => {
          const nameInput = document.getElementById('contactName');
          if (nameInput) nameInput.focus();
        }, 600);
      }
    });
  }

  /* ==========================================================================
     4. Interactive Brand Animations (Havells, Bajaj, Crompton, Polycab, Philips, Anchor)
     When clicked: trigger bounce animation, sound chime, and display verified details
     ========================================================================== */
  // Simple subtle web audio chime on click
  function playChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // AudioContext not allowed or not supported, ignore silently
    }
  }

  brandCards.forEach(card => {
    card.addEventListener('click', () => {
      playChime();

      // Trigger animation class
      card.classList.remove('anim-pop');
      void card.offsetWidth; // Force reflow
      card.classList.add('anim-pop');

      const brandName = card.getAttribute('data-brand') || 'Authorized Brand';
      const brandInfo = card.getAttribute('data-info') || 'Official verified dealership at Gupta Electronics.';

      if (popoverBrandTitle) popoverBrandTitle.textContent = `${brandName} (Official Partner)`;
      if (popoverBrandDesc) popoverBrandDesc.textContent = brandInfo;

      if (brandPopover) {
        brandPopover.classList.add('show');
        brandPopover.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      showToast(`✨ ${brandName} Verified Genuine Partner!`, 'success');
    });
  });

  if (popoverCloseBtn && brandPopover) {
    popoverCloseBtn.addEventListener('click', () => {
      brandPopover.classList.remove('show');
    });
  }

  /* ==========================================================================
     5. Navigation & Scroll Highlights
     (Items: Home Page, Fan, Switches, Tubelights&bulbs)
     ========================================================================== */
  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggleBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    const scrollPos = window.scrollY + 130;
    const sections = ['home', 'fans', 'switches', 'tubelights-bulbs'];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(l => {
            const href = l.getAttribute('href');
            if (href === `#${id}`) {
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });
        }
      }
    });
  });

  /* ==========================================================================
     6. Contact Form & WhatsApp Integration
     ========================================================================== */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const service = document.getElementById('contactService').value;
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !phone) {
        showToast('Please enter your Name and Phone Number.', 'error');
        return;
      }

      showToast(`Thank you ${name}! Suresh Gupta ji has received your message.`, 'success');

      // WhatsApp text generation
      const waText = encodeURIComponent(
        `Namaste Suresh ji, I am contacting you from the Gupta Electronics website.\n\n` +
        `👤 Name: ${name}\n` +
        `📞 Phone: ${phone}\n` +
        `⚡ Requirement: ${service}\n` +
        (message ? `📝 Message: ${message}\n` : '') +
        `\nPlease provide details and price quotation.`
      );

      setTimeout(() => {
        window.open(`https://wa.me/919981082392?text=${waText}`, '_blank');
      }, 1000);

      contactForm.reset();
    });
  }

  // Direct WhatsApp Button from Form
  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
      const name = document.getElementById('contactName').value.trim() || 'Customer';
      const phone = document.getElementById('contactPhone').value.trim() || 'Not specified';
      const service = document.getElementById('contactService').value;
      const message = document.getElementById('contactMessage').value.trim();

      const waText = encodeURIComponent(
        `Namaste Suresh ji (Gupta Electronics),\n` +
        `I want inquiry about: ${service}.\n` +
        `Name: ${name}\n` +
        (phone !== 'Not specified' ? `Phone: ${phone}\n` : '') +
        (message ? `Details: ${message}` : '')
      );

      window.open(`https://wa.me/919981082392?text=${waText}`, '_blank');
    });
  }

  /* ==========================================================================
     7. Toast Notification System
     ========================================================================== */
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  }
});
