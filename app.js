/**
 * Gupta Electronics - Modern Application Script
 * Proprietor: Suresh Gupta | Dhar Road, Manawar (M.P.) 454446
 * Features:
 *  - 2-Second Fullscreen Hero Slider with Progress Timer (Home Page)
 *  - Continuous 60fps Horizontal Brand Ribbon with Hover Pause (Home Page)
 *  - Dynamic Category Filter Tabs (Dedicated Product Pages)
 *  - Responsive Mobile Navigation & Multi-Page Link Highlighting
 *  - Smooth Scroll Reveal Animations
 *  - Direct Email (mailto) & Direct WhatsApp Enquiry Submission
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. Sticky Header & Mobile Menu Toggle
       ========================================================================== */
    const siteHeader = document.getElementById('siteHeader');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (siteHeader) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          siteHeader.classList.add('scrolled');
        } else {
          siteHeader.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    if (menuToggleBtn && navMenu) {
      menuToggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });

      // Close mobile menu when clicking any nav link
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
        });
      });
    }

    /* ==========================================================================
       2. Active Page Highlighting in Navigation
       ========================================================================== */
    const currentPath = window.location.pathname.toLowerCase();
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (
        (currentPage === 'index.html' && (href === 'index.html' || href === '#ge-home')) ||
        (currentPage.includes('fans') && href.includes('fans')) ||
        (currentPage.includes('switches') && href.includes('switches')) ||
        (currentPage.includes('tubelights') && href.includes('tubelights')) ||
        (currentPage.includes('wires') && href.includes('wires'))
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    /* ==========================================================================
       3. HERO BACKGROUND SLIDER (Auto-Advances Every 2 Seconds on Home Page)
       ========================================================================== */
    const slides = Array.from(document.querySelectorAll('.ge-hero-slide'));
    const dots = Array.from(document.querySelectorAll('.ge-dot'));
    const timerBar = document.querySelector('#geTimerBar');
    const heroSection = document.querySelector('#ge-home');

    if (slides.length > 0) {
      let currentSlide = 0;
      const totalSlides = slides.length;
      const SLIDE_DURATION = 2000; // Exact 2.0 seconds as requested
      let timerStartTime = null;
      let timerAnimationId = null;

      const SHOWCASE_DATA = [
        {
          cat: "SINCE 1998",
          live: "SHOWROOM LIVE",
          title: "Gupta Electronics Showroom",
          desc: "Dhar Road, Manawar (M.P.) • Over 25 Years of Proven Customer Trust with Suresh Gupta",
          img: "assets/about_showroom.jpg",
          badge: "⭐ 100% Genuine",
          pill: "Gupta Electronics • Dhar Road, Manawar (Since 1998)"
        },
        {
          cat: "BLDC CEILING FANS",
          live: "5-STAR BEE RATED",
          title: "BLDC Energy Saver Smart Fan",
          desc: "28W Brushless DC Motor with RF Remote • Saves up to ₹1,800/yr on power bill",
          img: "assets/fan_bldc_remote.jpg",
          badge: "⚡ 65% Power Saved",
          pill: "BLDC Ceiling Fans • Up to 65% Power Savings & 5-Yr Warranty"
        },
        {
          cat: "MODULAR SWITCHES",
          live: "SHOCKPROOF LUXURY",
          title: "Touch & Matte Modular Boards",
          desc: "Crystal Glass Switchboards with Soft Feather Touch & Flame-Retardant Polycarbonate",
          img: "assets/switch_black_glass.jpg",
          badge: "✨ 10-Yr Guarantee",
          pill: "Luxury Modular Switches • Touch Panels & Glass Switchboards"
        },
        {
          cat: "ARCHITECTURAL LIGHTING",
          live: "HIGH LUMEN TECH",
          title: "EyeComfort LED Batten & Bulbs",
          desc: "Flicker-Free High Surge Protection • Ultra Bright Daylight 6500K for Home & Office",
          img: "assets/light_led_batten.jpg",
          badge: "💡 Instant Replacement",
          pill: "High-Lumen LED Lighting • Flicker-Free Battens & Downlights"
        }
      ];

      function updateHeroShowcase(idx) {
        const data = SHOWCASE_DATA[idx % SHOWCASE_DATA.length];
        const pillText = document.getElementById('heroPillText');
        const scCat = document.getElementById('showcaseCat');
        const scLive = document.getElementById('showcaseLiveStatus');
        const scTitle = document.getElementById('showcaseTitle');
        const scDesc = document.getElementById('showcaseDesc');
        const scImg = document.getElementById('showcaseImg');
        const scBadge = document.getElementById('showcaseBadge');

        if (pillText) {
          pillText.style.opacity = '0';
          pillText.style.transform = 'translateY(6px)';
          setTimeout(() => {
            pillText.textContent = data.pill;
            pillText.style.opacity = '1';
            pillText.style.transform = 'translateY(0)';
          }, 150);
        }

        if (scImg) {
          scImg.style.opacity = '0.3';
          scImg.style.transform = 'scale(0.96)';
          setTimeout(() => {
            scImg.src = data.img;
            scImg.style.opacity = '1';
            scImg.style.transform = 'scale(1)';
          }, 150);
        }

        if (scCat) scCat.textContent = data.cat;
        if (scLive) scLive.textContent = data.live;
        if (scTitle) scTitle.textContent = data.title;
        if (scDesc) scDesc.textContent = data.desc;
        if (scBadge) scBadge.textContent = data.badge;
      }

      function showSlide(index) {
        if (totalSlides === 0) return;
        currentSlide = (index + totalSlides) % totalSlides;

        slides.forEach((slide, i) => {
          const isActive = (i === currentSlide);
          if (isActive) {
            slide.classList.remove('is-active');
            void slide.offsetWidth; // Force reflow to cleanly restart Ken Burns animation
            slide.classList.add('is-active');
          } else {
            slide.classList.remove('is-active');
          }
        });

        dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === currentSlide);
        });

        updateHeroShowcase(currentSlide);
        resetSlideTimer();
      }

      function animateTimer(timestamp) {
        if (!timerStartTime) timerStartTime = timestamp;
        const elapsed = timestamp - timerStartTime;
        const progress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);

        if (timerBar) {
          timerBar.style.width = `${progress}%`;
        }

        if (elapsed < SLIDE_DURATION) {
          timerAnimationId = requestAnimationFrame(animateTimer);
        } else {
          // Continuous smooth auto-slide every 2 seconds without pause
          showSlide(currentSlide + 1);
        }
      }

      function resetSlideTimer() {
        if (timerAnimationId) cancelAnimationFrame(timerAnimationId);
        timerStartTime = null;
        if (timerBar) timerBar.style.width = '0%';
        timerAnimationId = requestAnimationFrame(animateTimer);
      }

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          showSlide(index);
        });
      });

      // Start continuous 2-second rotation immediately
      resetSlideTimer();
    }

    /* ==========================================================================
       4. INTERACTIVE 3D CIRCULAR ORBIT LAYOUT FOR BRANDS
       ========================================================================== */
    const BRANDS_DATABASE = {
      havells: {
        name: 'Havells India',
        spec: 'Premium BLDC & Fabio Modular Series',
        tag: 'Official Authorized Partner',
        color: '#ff4444',
        warranty: '2 to 5 Years Official Warranty',
        desc: "India's #1 trusted brand for 5-star energy saving BLDC ceiling fans, flame-retardant wires, and premium modular switches with full counter warranty support at Suresh Gupta's showroom.",
        categories: ['BLDC Ceiling Fans', 'Modular Switches', 'FR-LSH Wires', 'LED Lighting', 'Home Appliances']
      },
      polycab: {
        name: 'Polycab India',
        spec: '100% Pure Electrolytic Copper',
        tag: 'Authorized Cable Distributor',
        color: '#c084fc',
        warranty: 'Company Certified Green FR-LSH',
        desc: "India's No.1 trusted wires and cables with 100% pure copper conductivity, high oxygen-index flame retardancy, and certified factory-sealed coils.",
        categories: ['House Wires', 'Submersible Cables', 'Flexible Wires', 'Industrial Cables', 'MCB Switchgear']
      },
      anchor: {
        name: 'Anchor Roma (Panasonic)',
        spec: 'Designer Modular Switchboards',
        tag: 'Authorized Roma Retailer',
        color: '#fbbf24',
        warranty: '10 Years Mechanical Warranty',
        desc: "India's favorite modular switches by Panasonic. Smooth tactile clicks, scratch-resistant glass front plates, smart touch dimmers, and heavy-duty safety MCBs.",
        categories: ['Modular Switches', 'Sockets', 'Glass Front Plates', 'Fan Regulators', 'Safety MCB & DB']
      },
      crompton: {
        name: 'Crompton Greaves',
        spec: 'Energion BLDC & High-Torque Pumps',
        tag: 'Authorized Brand Dealer',
        color: '#f5d28b',
        warranty: '2 to 5 Years Doorstep Warranty',
        desc: "Industry-leading air delivery with Energion ActivBLDC technology, anti-dust metallic finishes, silent copper motors, and agricultural water pumps.",
        categories: ['Ceiling Fans', 'ActivBLDC Fans', 'Water Pumps', 'LED Battens', 'Water Heaters']
      },
      philips: {
        name: 'Philips Lighting (Signify)',
        spec: 'EyeComfort LED Technology',
        tag: 'Authorized Lighting Partner',
        color: '#38bdf8',
        warranty: '1 to 2 Years Counter Replacement',
        desc: "Flicker-free architectural LED lighting with certified EyeComfort technology, high-lumen T-Bulbs, decorative vintage filament lamps, and ceiling panels.",
        categories: ['LED Battens', 'LED Bulbs', 'False Ceiling Downlights', 'Decorative Lights']
      },
      samsung: {
        name: 'Samsung Electronics',
        spec: 'Digital Inverter & 4K Crystal UHD',
        tag: 'Authorized Appliance Showcase',
        color: '#38bdf8',
        warranty: 'Up to 20 Years Compressor Warranty',
        desc: "Top-tier Crystal 4K Smart TVs, frost-free double door refrigerators, and digital inverter smart cooling appliances with official company guarantee.",
        categories: ['Smart UHD TVs', 'Refrigerators', 'Washing Machines', 'Inverter Air Conditioners']
      },
      lg: {
        name: 'LG Electronics',
        spec: 'AI Dual Inverter & ThinQ Smart',
        tag: 'Authorized Appliance Partner',
        color: '#f43f5e',
        warranty: '10 Years Smart Inverter Warranty',
        desc: "Life's Good with AI ThinQ Dual-Inverter air conditioners, direct-drive automatic washing machines, and energy saving multi-air flow refrigerators.",
        categories: ['Dual Inverter ACs', 'Smart Refrigerators', 'Front Load Washers', 'Smart OLED & 4K TVs']
      },
      whirlpool: {
        name: 'Whirlpool of India',
        spec: '6th Sense Intellisense Technology',
        tag: 'Authorized Partner',
        color: '#60a5fa',
        warranty: 'Up to 10 Years Warranty',
        desc: "Intelligent 6th Sense cooling technology providing up to 15 days garden freshness in refrigerators, and stainwash technology in washing machines.",
        categories: ['Intellisense Fridges', 'Top Load Washers', 'Microwaves', 'Chest Freezers']
      },
      lloyd: {
        name: 'Lloyd (A Havells Brand)',
        spec: 'Heavy-Duty 53°C Rapid Cooling',
        tag: 'Authorized Havells-Lloyd Hub',
        color: '#22d3ee',
        warranty: '5 Years Comprehensive AC Warranty',
        desc: "Engineered by Havells for extreme 53°C summers with 4-way swing air delivery, rapid 60-second chill, golden fin condensers, and chest freezers.",
        categories: ['Split Air Conditioners', 'Deep Freezers', 'Washing Machines', 'Smart LED TVs']
      },
      bajaj: {
        name: 'Bajaj Electricals',
        spec: 'High-Torque Motors & Appliances',
        tag: 'Authorized Dealer',
        color: '#ff8a65',
        warranty: '2 Years Manufacturer Warranty',
        desc: "Generations of trust in Indian households. High-speed copper ceiling and wall fans, energy-efficient storage geysers, mixer grinders, and room heaters.",
        categories: ['Ceiling & Table Fans', 'Water Heaters (Geysers)', 'Mixer Grinders', 'Room Coolers']
      },
      orient: {
        name: 'Orient Electric',
        spec: 'Aero Series & Aerodynamic Blades',
        tag: 'Authorized Partner',
        color: '#fb7185',
        warranty: '2 Years Doorstep Warranty',
        desc: "Celebrated for Aeroquiet noiseless curved blades, decorative metallic fans, emergency inverter LED lamps, and energy-efficient room coolers.",
        categories: ['Aeroquiet Fans', 'Underlight Fans', 'Inverter Bulbs', 'Exhaust Fans']
      },
      vguard: {
        name: 'V-Guard Industries',
        spec: 'Digital Voltage Stabilizers & Cables',
        tag: 'Authorized Voltage Specialist',
        color: '#34d399',
        warranty: '3 to 5 Years Complete Warranty',
        desc: "India's highest rated voltage stabilizers for refrigerators, air conditioners, and whole-house mainlines, plus pure copper submersible cables.",
        categories: ['AC Voltage Stabilizers', 'Mainline Stabilizers', 'Submersible Cables', 'Solar Inverters']
      }
    };

    const orbitArena = document.getElementById('geOrbitArena');
    const orbitStage = document.getElementById('geOrbitStage');
    const orbitOuter = document.getElementById('geOrbitOuter');
    const orbitInner = document.getElementById('geOrbitInner');
    const playPauseBtn = document.getElementById('btnOrbitPlayPause');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const playPauseText = document.getElementById('playPauseText');
    const tiltBtn = document.getElementById('btnOrbitTilt');
    const tiltText = document.getElementById('tiltText');
    const speedPills = document.querySelectorAll('.ge-speed-pill');
    const brandChips = document.querySelectorAll('.ge-brand-chip');
    const orbitPlanets = document.querySelectorAll('.ge-orbit-planet');
    const orbitItems = document.querySelectorAll('.ge-orbit-item');
    const btnOrbitView = document.getElementById('btnOrbitView');
    const btnGridView = document.getElementById('btnGridView');
    const brandGridView = document.getElementById('brandGridView');
    const brandGridCardsWrap = document.getElementById('brandGridCardsWrap');

    // Spotlight Elements
    const spotlightDot = document.getElementById('spotlightDot');
    const spotlightPartnerTag = document.getElementById('spotlightPartnerTag');
    const spotlightWarranty = document.getElementById('spotlightWarranty');
    const spotlightTitle = document.getElementById('spotlightTitle');
    const spotlightSpec = document.getElementById('spotlightSpec');
    const spotlightDesc = document.getElementById('spotlightDesc');
    const spotlightCategories = document.getElementById('spotlightCategories');
    const spotlightWaBtn = document.getElementById('spotlightWaBtn');

    if (orbitArena && orbitStage) {
      let isPaused = false;
      let isFlatView = false;
      let currentSpeed = 1;
      let selectedBrandKey = 'havells';

      // 1. Function to update Brand Spotlight HUD
      function updateBrandSpotlight(brandKey) {
        const data = BRANDS_DATABASE[brandKey];
        if (!data) return;
        selectedBrandKey = brandKey;

        if (spotlightTitle) spotlightTitle.textContent = data.name;
        if (spotlightSpec) spotlightSpec.textContent = data.spec;
        if (spotlightPartnerTag) spotlightPartnerTag.textContent = data.tag;
        if (spotlightWarranty) spotlightWarranty.textContent = data.warranty;
        if (spotlightDesc) spotlightDesc.textContent = data.desc;
        if (spotlightDot) {
          spotlightDot.style.background = data.color;
          spotlightDot.style.boxShadow = `0 0 10px ${data.color}`;
        }

        if (spotlightCategories && data.categories) {
          spotlightCategories.innerHTML = data.categories
            .map(cat => `<span class="ge-cat-tag">${cat}</span>`)
            .join('');
        }

        if (spotlightWaBtn) {
          const text = encodeURIComponent(`Hello Suresh ji, I am inquiring about ${data.name} products at Gupta Electronics Manawar.`);
          spotlightWaBtn.href = `https://wa.me/919981082392?text=${text}`;
        }

        // Highlight active planet item
        orbitItems.forEach(item => {
          const itemBrand = item.getAttribute('data-brand');
          item.classList.toggle('is-active', itemBrand === brandKey);
        });

        // Highlight active ribbon chip
        brandChips.forEach(chip => {
          const chipBrand = chip.getAttribute('data-brand');
          chip.classList.toggle('is-active', chipBrand === brandKey);
          if (chipBrand === brandKey) {
            chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        });
      }

      // Initialize with default brand (Havells)
      updateBrandSpotlight('havells');

      // 2. Click & Hover Handlers for Orbit Planet Nodes
      orbitItems.forEach(item => {
        const brandKey = item.getAttribute('data-brand');
        const planetBtn = item.querySelector('.ge-orbit-planet');

        if (planetBtn && brandKey) {
          planetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateBrandSpotlight(brandKey);
          });

          planetBtn.addEventListener('mouseenter', () => {
            updateBrandSpotlight(brandKey);
          });
        }
      });

      // 3. Quick Selector Ribbon Chips
      brandChips.forEach(chip => {
        const brandKey = chip.getAttribute('data-brand');
        if (brandKey) {
          chip.addEventListener('click', () => {
            updateBrandSpotlight(brandKey);
          });
        }
      });

      // 4. Play / Pause Orbit Button
      if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
          isPaused = !isPaused;
          orbitArena.classList.toggle('is-paused', isPaused);
          if (playPauseIcon) playPauseIcon.textContent = isPaused ? '▶' : '⏸';
          if (playPauseText) playPauseText.textContent = isPaused ? 'Play' : 'Pause';
        });
      }

      // 5. 3D Tilt View Angle Toggle
      if (tiltBtn) {
        tiltBtn.addEventListener('click', () => {
          isFlatView = !isFlatView;
          orbitStage.classList.toggle('is-flat-view', isFlatView);
          if (tiltText) tiltText.textContent = isFlatView ? 'Flat Top View' : '3D Tilt View';
        });
      }

      // 6. Orbit Speed Controls (1x, 2x)
      speedPills.forEach(pill => {
        pill.addEventListener('click', () => {
          speedPills.forEach(p => p.classList.remove('is-active'));
          pill.classList.add('is-active');

          const speed = parseFloat(pill.getAttribute('data-speed')) || 1;
          currentSpeed = speed;

          if (orbitOuter) {
            orbitOuter.style.animationDuration = `${56 / speed}s`;
          }
          if (orbitInner) {
            orbitInner.style.animationDuration = `${36 / speed}s`;
          }
        });
      });

      // 7. Interactive Mouse Gyro 3D Parallax on Orbit Stage
      orbitArena.addEventListener('mousemove', (e) => {
        if (isFlatView || window.innerWidth < 768) return;
        const rect = orbitArena.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (e.clientY - rect.top) / rect.height - 0.5;

        const tiltX = 24 - offsetY * 18;
        const tiltY = offsetX * 22;

        orbitStage.style.setProperty('--orbit-tilt-x', `${tiltX}deg`);
        orbitStage.style.setProperty('--orbit-tilt-y', `${tiltY}deg`);
      });

      orbitArena.addEventListener('mouseleave', () => {
        if (isFlatView) return;
        orbitStage.style.setProperty('--orbit-tilt-x', '24deg');
        orbitStage.style.setProperty('--orbit-tilt-y', '0deg');
      });

      // 8. View Mode Switcher: Orbit vs Grid
      function renderBrandGridCards() {
        if (!brandGridCardsWrap) return;
        const brandsList = Object.keys(BRANDS_DATABASE).map(key => ({ key, ...BRANDS_DATABASE[key] }));

        brandGridCardsWrap.innerHTML = brandsList.map(brand => {
          const waUrl = `https://wa.me/919981082392?text=${encodeURIComponent(`Hello Suresh ji, inquiring about ${brand.name} at Gupta Electronics.`)}`;
          return `
            <div class="ge-brand-grid-card" style="--card-brand-color:${brand.color}">
              <div class="ge-card-glare" aria-hidden="true"></div>
              <div class="ge-grid-card-top">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <span style="font-size:0.75rem; font-weight:800; color:${brand.color}; background:rgba(255,255,255,0.06); padding:3px 10px; border-radius:12px; border:1px solid ${brand.color}40;">
                    ${brand.tag}
                  </span>
                  <span style="font-size:0.75rem; font-weight:700; color:#34d399;">${brand.warranty}</span>
                </div>
                <h3 style="font-family:var(--font-heading); font-size:1.35rem; font-weight:800; color:#fff; margin-bottom:4px;">${brand.name}</h3>
                <div style="font-size:0.84rem; font-weight:700; color:var(--gold); margin-bottom:12px;">${brand.spec}</div>
                <p style="font-size:0.88rem; color:#cbd5e1; line-height:1.55; margin-bottom:16px;">${brand.desc}</p>
                <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:20px;">
                  ${brand.categories.map(c => `<span style="font-size:0.74rem; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px; color:#cbd5e1;">${c}</span>`).join('')}
                </div>
              </div>
              <div style="display:flex; gap:10px; margin-top:auto;">
                <a href="${waUrl}" target="_blank" rel="noopener" class="ge-btn ge-3d-btn" style="flex:1; padding:9px 12px; font-size:0.82rem;">WhatsApp ↗</a>
                <a href="tel:9981082392" class="ge-btn ge-outline ge-3d-btn" style="padding:9px 12px; font-size:0.82rem;">Call Shop</a>
              </div>
            </div>
          `;
        }).join('');
      }

      if (btnOrbitView && btnGridView) {
        btnOrbitView.addEventListener('click', () => {
          btnOrbitView.classList.add('is-active');
          btnGridView.classList.remove('is-active');
          if (orbitArena) orbitArena.style.display = 'flex';
          const ribbon = document.getElementById('brandSelectorRibbon');
          if (ribbon) ribbon.style.display = 'flex';
          if (brandGridView) brandGridView.style.display = 'none';
        });

        btnGridView.addEventListener('click', () => {
          btnGridView.classList.add('is-active');
          btnOrbitView.classList.remove('is-active');
          if (orbitArena) orbitArena.style.display = 'none';
          const ribbon = document.getElementById('brandSelectorRibbon');
          if (ribbon) ribbon.style.display = 'none';
          if (brandGridView) {
            brandGridView.style.display = 'block';
            renderBrandGridCards();
          }
        });
      }
    }

    /* ==========================================================================
       5. SITE-WIDE 3D CARD TILT & SPECULAR GLARE INTERACTION
       ========================================================================== */
    const tiltCards = document.querySelectorAll(
      '.ge-service-card, .ge-hero-3d-card, .ge-contact-form-card, .ge-contact-info-card, .ge-about-img-box, .ge-product-card'
    );

    tiltCards.forEach(card => {
      const glare = card.querySelector('.ge-card-glare');

      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPercent = mouseX / rect.width - 0.5;
        const yPercent = mouseY / rect.height - 0.5;

        // Smooth 3D tilt
        card.style.transform = `perspective(1000px) rotateY(${xPercent * 14}deg) rotateX(${-yPercent * 14}deg) scale3d(1.02, 1.02, 1.02) translateZ(8px)`;

        // Specular light reflection on cursor
        if (glare) {
          glare.style.opacity = '1';
          glare.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.22) 0%, transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        if (glare) {
          glare.style.opacity = '0';
        }
      });
    });

    /* ==========================================================================
       5. DYNAMIC CATEGORY FILTER TABS (Dedicated Pages)
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.ge-filter-btn');
    const productCards = document.querySelectorAll('.ge-product-card[data-category]');

    if (filterButtons.length > 0 && productCards.length > 0) {
      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filterValue = btn.getAttribute('data-filter');

          productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || '';
            const catList = cardCategory.trim().split(/\s+/);
            if (filterValue === 'all' || catList.includes(filterValue)) {
              card.style.display = 'flex';
              card.style.animation = 'fanDirectEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) both';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }

    /* ==========================================================================
       6. SCROLL ENTRANCE ANIMATION (.ge-reveal -> .ge-visible)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.ge-reveal');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ge-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('ge-visible'));
    }

    /* ==========================================================================
       7. CONTACT FORM & WHATSAPP HANDLING
       ========================================================================== */
    const form = document.querySelector('#geContactForm');
    const whatsappBtn = document.querySelector('#formWhatsAppBtn');
    const statusEl = document.querySelector('#geFormStatus');

    function getFormData() {
      const name = (document.querySelector('#ge-name') || {}).value || '';
      const phone = (document.querySelector('#ge-phone') || {}).value || '';
      const email = (document.querySelector('#ge-email') || {}).value || '';
      const message = (document.querySelector('#ge-message') || {}).value || '';
      return {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        message: message.trim()
      };
    }

    if (form) {
      // 1. Submit via Email client (mailto)
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = getFormData();

        if (!data.name || !data.phone || !data.message) {
          form.reportValidity();
          return;
        }

        const subject = encodeURIComponent(`Website enquiry from ${data.name} (Gupta Electronics)`);
        const body = encodeURIComponent(
          `Hello Suresh ji,\n\n` +
          `Name: ${data.name}\n` +
          `Phone: ${data.phone}\n` +
          `Email: ${data.email || 'Not provided'}\n\n` +
          `Enquiry Details:\n${data.message}\n\n` +
          `--\nSent from Gupta Electronics Website (Dhar Road, Manawar, M.P.)`
        );

        const mailto = `mailto:guptaelectronics@gmail.com?subject=${subject}&body=${body}`;

        if (statusEl) {
          statusEl.textContent = '✓ Opening your email client with pre-filled enquiry. Click Send to complete.';
        }

        window.location.href = mailto;
      });

      // 2. Submit via direct WhatsApp
      if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
          const data = getFormData();

          if (!data.name || !data.phone || !data.message) {
            form.reportValidity();
            return;
          }

          const waText = encodeURIComponent(
            `*Hello Suresh ji (Gupta Electronics)*\n\n` +
            `*Customer Name:* ${data.name}\n` +
            `*Phone:* ${data.phone}\n` +
            `*Email:* ${data.email || 'Not provided'}\n\n` +
            `*Enquiry:* ${data.message}\n\n` +
            `_Sent via website direct enquiry_`
          );

          const waUrl = `https://wa.me/919981082392?text=${waText}`;

          if (statusEl) {
            statusEl.textContent = '✓ Opening WhatsApp to send your enquiry directly to Suresh Gupta.';
          }

          window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
      }
    }

    /* ==========================================================================
       8. INTERACTIVE SIMULATORS & CALCULATORS (Fans, Switches, Lights, Wires)
       ========================================================================== */

    // A. 5-Speed Live Fan Regulator Controller (Fans Page)
    const liveFanStage = document.getElementById('liveFanStage');
    const speedButtons = document.querySelectorAll('.ge-speed-btn[data-speed]');
    const liveSpeedText = document.getElementById('liveSpeedText');
    const liveRpmText = document.getElementById('liveRpmText');
    const liveAirText = document.getElementById('liveAirText');

    if (liveFanStage && speedButtons.length > 0) {
      const speedMap = {
        '0': { label: 'OFF (Stopped)', rpm: '0 RPM', air: '0 CMM', class: 'speed-0' },
        '1': { label: 'Speed 1 (Gentle Breeze)', rpm: '120 RPM', air: '95 CMM', class: 'speed-1' },
        '2': { label: 'Speed 2 (Whisper Silent)', rpm: '200 RPM', air: '150 CMM', class: 'speed-2' },
        '3': { label: 'Speed 3 (Medium Comfort)', rpm: '280 RPM', air: '210 CMM', class: 'speed-3' },
        '4': { label: 'Speed 4 (High Airflow)', rpm: '350 RPM', air: '235 CMM', class: 'speed-4' },
        '5': { label: 'Speed 5 (Max Storm)', rpm: '390 RPM', air: '245 CMM', class: 'speed-5' },
        'turbo': { label: '⚡ TURBO BOOST (Atomberg Super Mode)', rpm: '440 RPM', air: '260 CMM', class: 'speed-turbo' }
      };

      speedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          speedButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const speedKey = btn.getAttribute('data-speed');
          const data = speedMap[speedKey] || speedMap['3'];

          liveFanStage.className = 'ge-fan-sim-stage ' + data.class;
          if (liveSpeedText) liveSpeedText.textContent = data.label;
          if (liveRpmText) liveRpmText.textContent = data.rpm;
          if (liveAirText) liveAirText.textContent = data.air;
        });
      });
    }

    // B. BLDC Energy Savings Calculator (Fans Page)
    const hoursSlider = document.getElementById('hoursSlider');
    const hoursDisplay = document.getElementById('hoursDisplay');
    const yearlySavingDisplay = document.getElementById('yearlySavingDisplay');
    const monthlySavingDisplay = document.getElementById('monthlySavingDisplay');

    if (hoursSlider) {
      const regularWatts = 75;
      const bldcWatts = 28;
      const savedWatts = regularWatts - bldcWatts; // 47 Watts saved per hour
      const tariffPerUnit = 8.00; // Average ₹8.00 per kWh in M.P.

      function updateBldcCalc() {
        const hours = parseInt(hoursSlider.value, 10);
        if (hoursDisplay) hoursDisplay.textContent = `${hours} Hours / Day`;

        const dailyKwh = (savedWatts * hours) / 1000;
        const yearlyUnits = dailyKwh * 365;
        const yearlyRupees = Math.round(yearlyUnits * tariffPerUnit);
        const monthlyRupees = Math.round(yearlyRupees / 12);

        if (yearlySavingDisplay) {
          yearlySavingDisplay.textContent = `₹ ${yearlyRupees.toLocaleString('en-IN')} / Year`;
        }
        if (monthlySavingDisplay) {
          monthlySavingDisplay.textContent = `₹ ${monthlyRupees.toLocaleString('en-IN')} / Month`;
        }
      }

      hoursSlider.addEventListener('input', updateBldcCalc);
      updateBldcCalc();
    }

    // C. Virtual Modular Switchboard Simulator (Switches Page)
    const virtualSwitchboard = document.getElementById('virtualSwitchboard');
    const simSwitches = document.querySelectorAll('.ge-sim-switch');
    const simStatusText = document.getElementById('simStatusText');

    if (virtualSwitchboard && simSwitches.length > 0) {
      function updateSwitchboardStatus() {
        if (!simStatusText) return;
        const statuses = [];
        simSwitches.forEach(sw => {
          const label = sw.querySelector('.sim-label')?.textContent || 'Switch';
          const isOn = sw.classList.contains('is-on');
          statuses.push(`${label} [${isOn ? 'ON' : 'OFF'}]`);
        });
        simStatusText.textContent = statuses.join(' • ');
      }

      simSwitches.forEach(sw => {
        sw.addEventListener('click', () => {
          sw.classList.toggle('is-on');
          updateSwitchboardStatus();
        });
      });
    }

    // D. Room Lighting Ambience Simulator (Tubelights & Bulbs Page)
    const lightRoomBox = document.getElementById('lightRoomBox');
    const lightModeButtons = document.querySelectorAll('[data-light-mode]');
    const lightModeTitle = document.getElementById('lightModeTitle');
    const lightModeDesc = document.getElementById('lightModeDesc');

    if (lightRoomBox && lightModeButtons.length > 0) {
      const modeData = {
        'day': {
          title: 'Cool Daylight (6500K)',
          desc: 'High-focus, crisp bright white light. Ideal for kitchens, study rooms, offices & grocery counters.'
        },
        'warm': {
          title: 'Natural White (4000K)',
          desc: 'Soft, balanced neutral light. Perfect for living rooms, dining halls & retail clothing display.'
        },
        'cozy': {
          title: 'Cozy Golden Amber (3000K)',
          desc: 'Warm soothing vintage glow. Ideal for bedrooms, dining areas, balconies & luxury drawing rooms.'
        },
        'emergency': {
          title: '🔋 Inverter Emergency Backup (4 Hours Active)',
          desc: 'Automatic seamless switchover when power cuts occur in Manawar. Constant glare-free illumination.'
        }
      };

      lightModeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          lightModeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const mode = btn.getAttribute('data-light-mode');
          lightRoomBox.className = `ge-light-room-box mode-${mode}`;

          const data = modeData[mode] || modeData['day'];
          if (lightModeTitle) lightModeTitle.textContent = data.title;
          if (lightModeDesc) lightModeDesc.textContent = data.desc;
        });
      });
    }

    // E. Electrical Wire Gauge & Load Calculator (Wires Page)
    const applianceSelect = document.getElementById('applianceSelect');
    const wireGaugeDisplay = document.getElementById('wireGaugeDisplay');
    const wireBrandDisplay = document.getElementById('wireBrandDisplay');
    const wireCurrentDisplay = document.getElementById('wireCurrentDisplay');

    if (applianceSelect) {
      const wireData = {
        'lighting': {
          gauge: '1.0 sq mm',
          brand: 'Polycab Green FR / Havells LifeLine',
          current: '✓ Safe Capacity: Up to 11 Amperes (Ideal for LED Batten, Chandelier & Fan points)'
        },
        'ac': {
          gauge: '2.5 sq mm / 4.0 sq mm',
          brand: 'Polycab Green FR-LSH or Havells LifeLine Plus',
          current: '✓ Safe Capacity: Up to 20 - 28 Amperes • Flame Retardant 105°C (Heavy Inverter AC)'
        },
        'geyser': {
          gauge: '2.5 sq mm',
          brand: 'Finolex Flamegard or Polycab FR-LSH',
          current: '✓ Safe Capacity: Up to 22 Amperes (Continuous heating water geyser load)'
        },
        'pump': {
          gauge: '4.0 sq mm (3-Core Submersible Flat Cable)',
          brand: 'Polycab Maxima Submersible / Finolex Pure Copper',
          current: '✓ Waterproof double-sheathed heavy copper cable for deep borewells in Nimar region'
        },
        'main': {
          gauge: '6.0 sq mm / 10.0 sq mm',
          brand: 'Polycab Single Core Multi-Strand FR or Havells',
          current: '✓ Heavy Main Incomer: Up to 42 - 55 Amperes (Feeds entire MCB distribution box)'
        }
      };

      function updateWireCalc() {
        const val = applianceSelect.value;
        const data = wireData[val] || wireData['ac'];
        if (wireGaugeDisplay) wireGaugeDisplay.textContent = data.gauge;
        if (wireBrandDisplay) wireBrandDisplay.textContent = data.brand;
        if (wireCurrentDisplay) wireCurrentDisplay.textContent = data.current;
      }

      applianceSelect.addEventListener('change', updateWireCalc);
      updateWireCalc();
    }

    /* ==========================================================================
       9. SMOOTH ANCHOR SCROLL OFFSET ADJUSTMENT
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 68;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    /* ==========================================================================
       10. INTERACTIVE 3D CARD PERSPECTIVE TILT
       ========================================================================== */
    const interactiveCards = document.querySelectorAll('.ge-3d-card, .ge-product-card, .ge-service-card, .ge-map-card, .ge-footer-owner-card');
    interactiveCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  });
})();
