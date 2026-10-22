/* ==========================================================================
   IVY Parent Connect - Interactive Web Script
   Canvas Animation, Language Toggle, Direct Download Progress, FAQ Accordion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initCanvasParticles();
  initBilingualSwitcher();
  initDirectDownloadHandler();
  initQrModal();
  initFaqAccordion();
  initStatsCounter();
  initHamburgerMenu();
  initStickyBar();
});

/* --------------------------------------------------------------------------
   1. Header Scroll Glass Effect
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Canvas Particle Constellation Background Effect
   -------------------------------------------------------------------------- */
function initCanvasParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numParticles = Math.floor(width < 768 ? 25 : 55);
  const particles = [];

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(110, 177, 227, ' : 'rgba(76, 175, 80, ',
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(110, 177, 227, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* --------------------------------------------------------------------------
   3. Interactive Bilingual Language Switcher (English <-> Amharic)
   -------------------------------------------------------------------------- */
const translations = {
  en: {
    heroTitle: 'Stay Connected with Your Child\'s Journey at <span class="highlight">IVY</span>',
    heroSubtitle: 'Instant bilingual announcements, event RSVPs, digital notice board, and teacher updates — directly on your Android phone.',
    downloadBtn: '<span class="btn-icon">📥</span> Direct Download APK',
    phoneTag: 'Urgent Announcement',
    phoneTitle: 'Parent-Teacher Meeting & Field Trip RSVP',
    phoneBody: 'Please confirm attendance for Friday\'s Science Museum trip by 4:00 PM.',
    phoneRsvp: 'Confirm RSVP',
    phoneAck: 'Acknowledge',
    demoTitle: 'Bilingual Announcement Preview',
    demoUrgent: 'Urgent Notice',
    demoCardTitle: 'Field Trip to National Science Center',
    demoCardBody: 'Dear Parents, tomorrow\'s field trip requires signed permission forms. Buses depart at 8:30 AM sharp. Lunch and water will be provided.'
  },
  am: {
    heroTitle: 'የልጅዎን ትምህርት እና ደህንነት በ<span class="highlight">አይቪ (IVY)</span> ይከታተሉ',
    heroSubtitle: 'ፈጣን በሁለት ቋንቋ (እንግሊዝኛ እና አማርኛ) ማስታወቂያዎች፣ የእንቅስቃሴዎች የቀን መቁጠሪያ፣ የዲጂታል ማስታወቂያ ሰሌዳ እና መምህራን መልእክቶች።',
    downloadBtn: '<span class="btn-icon">📥</span> ኤፒኬውን አሁኑኑ ያውርዱ (APK)',
    phoneTag: 'አስቸኳይ ማስታወቂያ',
    phoneTitle: 'የወላጆች እና መምህራን ስብሰባ እና የጉብኝት ማረጋገጫ',
    phoneBody: 'እባክዎን የዓርብ ሳይንስ ሙዚየም ጉብኝት መሳተፍዎን እስከ ቀኑ 10:00 ሰዓት ያረጋግጡ።',
    phoneRsvp: 'አረጋግጣለሁ (RSVP)',
    phoneAck: 'ተረድቻለሁ',
    demoTitle: 'በሁለት ቋንቋ የቀረበ የማስታወቂያ ምሳሌ',
    demoUrgent: 'አስቸኳይ ማስታወቂያ',
    demoCardTitle: 'የብሔራዊ ሳይንስ ማዕከል ጉብኝት',
    demoCardBody: 'ውድ ወላጆች፣\n\nአሁን ባለው የአየር ሁኔታ እና የልጆቻችንን ደህንነት በማስቀደም፣ ነገ ህዳር 24 ቀን ትምህርት ቤታችን ዝግ እንደሚሆን በአክብሮት እናሳውቃለን።\n\nስለ ትብብራችሁና መረዳታችሁ እናመሰግናለን።'
  }
};

let currentLang = 'en';

function initBilingualSwitcher() {
  const globalLangBtns = document.querySelectorAll('.lang-toggle-btn');
  const demoLangBtns = document.querySelectorAll('.demo-lang-btn');
  const phoneLangBtn = document.querySelector('.phone-lang-switch');

  function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Update Hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const downloadBtnText = document.querySelector('#btn-main-download');

    if (heroTitle) heroTitle.innerHTML = t.heroTitle;
    if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
    if (downloadBtnText) downloadBtnText.innerHTML = t.downloadBtn;

    // Toggle font family for Amharic readability
    if (lang === 'am') {
      document.body.classList.add('lang-amharic');
    } else {
      document.body.classList.remove('lang-amharic');
    }

    // Update Phone Mockup elements
    const phoneTag = document.querySelector('.phone-card-tag');
    const phoneTitle = document.querySelector('.phone-card-title');
    const phoneBody = document.querySelector('.phone-card-body');
    const phoneRsvp = document.querySelector('.phone-btn-rsvp');
    const phoneAck = document.querySelector('.phone-btn-ack');

    if (phoneTag) phoneTag.textContent = t.phoneTag;
    if (phoneTitle) phoneTitle.textContent = t.phoneTitle;
    if (phoneBody) phoneBody.textContent = t.phoneBody;
    if (phoneRsvp) phoneRsvp.textContent = t.phoneRsvp;
    if (phoneAck) phoneAck.textContent = t.phoneAck;

    // Update Demo section
    const demoUrgent = document.querySelector('.demo-badge-urgent');
    const demoCardTitle = document.querySelector('.demo-card-title-text');
    const demoCardBody = document.querySelector('.demo-card-body-text');

    if (demoUrgent) demoUrgent.textContent = t.demoUrgent;
    if (demoCardTitle) demoCardTitle.textContent = t.demoCardTitle;
    if (demoCardBody) demoCardBody.textContent = t.demoCardBody;

    // Active button states
    demoLangBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    if (phoneLangBtn) {
      phoneLangBtn.textContent = lang === 'en' ? 'EN' : 'አማርኛ';
    }
  }

  demoLangBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  globalLangBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'am' : 'en'));
  });

  if (phoneLangBtn) {
    phoneLangBtn.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'am' : 'en'));
  }
}

/* --------------------------------------------------------------------------
   4. Direct APK Download Handler (always serves the latest GitHub release)
   -------------------------------------------------------------------------- */
function initDirectDownloadHandler() {
  const REPO = 'Dagi1sire/app-releases';
  // Fallback only works if every release uses the same file name (app.apk)
  const FALLBACK_URL = `https://github.com/${REPO}/releases/latest/download/app.apk`;
  const FILE_NAME = 'IVY-Parent-Connect.apk';
  const downloadBtns = document.querySelectorAll('.trigger-apk-download');

  // Ask GitHub once per page load for the newest release and its .apk file,
  // whatever that file is named. Falls back to the /latest/ link on any error.
  let releasePromise = null;
  function getLatestRelease() {
    if (!releasePromise) {
      releasePromise = fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
        headers: { Accept: 'application/vnd.github+json' }
      })
        .then(res => {
          if (!res.ok) throw new Error('GitHub API ' + res.status);
          return res.json();
        })
        .then(release => {
          const apk = (release.assets || []).find(a => a.name.toLowerCase().endsWith('.apk'));
          return {
            url: apk ? apk.browser_download_url : FALLBACK_URL,
            version: release.tag_name || null
          };
        })
        .catch(() => ({ url: FALLBACK_URL, version: null }));
    }
    return releasePromise;
  }

  // Keep the version label on the page in sync with the latest release
  getLatestRelease().then(({ version }) => {
    if (!version) return;
    document.querySelectorAll('[data-apk-version]').forEach(el => {
      el.textContent = version;
    });
  });

  // Hidden link click: GitHub serves release files as attachments, so the
  // browser downloads the file and the page never navigates away.
  function startDownload(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = FILE_NAME;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (btn.dataset.busy) return;
      btn.dataset.busy = '1';

      const originalText = btn.innerHTML;
      btn.innerHTML = '⏳ Preparing Download...';
      btn.style.opacity = '0.85';

      const { url } = await getLatestRelease();
      startDownload(url);

      btn.innerHTML = '✅ Download Started!';
      btn.style.background = 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)';
      btn.style.opacity = '1';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        delete btn.dataset.busy;
      }, 4000);
    });
  });
}

/* --------------------------------------------------------------------------
   5. QR Code Installation Modal
   -------------------------------------------------------------------------- */
function initQrModal() {
  const openBtn = document.getElementById('btn-open-qr');
  const modal = document.getElementById('qr-modal');
  const closeBtn = document.getElementById('btn-close-qr');

  if (!openBtn || !modal || !closeBtn) return;

  openBtn.addEventListener('click', () => modal.classList.add('active'));
  closeBtn.addEventListener('click', () => modal.classList.remove('active'));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => other.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Live Stats Counter
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      animateNumbers();
    }
  }, { threshold: 0.3 });

  observer.observe(statsSection);

  function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number[data-count]');
    numbers.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      let count = 0;
      const speed = Math.ceil(target / 40);

      const timer = setInterval(() => {
        count += speed;
        if (count >= target) {
          el.textContent = target + (el.dataset.suffix || '');
          clearInterval(timer);
        } else {
          el.textContent = count + (el.dataset.suffix || '');
        }
      }, 30);
    });
  }
/* --------------------------------------------------------------------------
   8. Hamburger Navigation Menu (Mobile)
   -------------------------------------------------------------------------- */
function initHamburgerMenu() {
  const btn = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (!btn || !drawer) return;

  function closeDrawer() {
    btn.classList.remove('open');
    drawer.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    drawer.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll when drawer is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close drawer when any link inside it is tapped
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on outside tap
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !drawer.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   9. Sticky Mobile Download Bar
   -------------------------------------------------------------------------- */
function initStickyBar() {
  const bar = document.getElementById('mobile-sticky-bar');
  const heroCta = document.getElementById('btn-main-download');
  if (!bar || !heroCta) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      // Show bar when the hero CTA is out of view (user scrolled past it)
      bar.classList.toggle('visible', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-60px 0px 0px 0px' }
  );

  observer.observe(heroCta);
}
