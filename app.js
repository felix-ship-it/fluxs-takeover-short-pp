/* ═══════════════════════════════════════════════════
   FLUXS Übernahme-Exposé 2026 — JavaScript
   - IntersectionObserver animations
   - Side nav dot tracking
   - Chart.js: Revenue + Growth Projection
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── IntersectionObserver: animate-up ───────────────────────
  const animEls = document.querySelectorAll('.animate-up');
  const animObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
  animEls.forEach(el => animObs.observe(el));

  // Trigger first slide immediately
  setTimeout(() => {
    document.querySelectorAll('#slide-0 .animate-up').forEach(el => el.classList.add('visible'));
  }, 50);

  // ─── Side Nav Dot Updates ────────────────────────────────────
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const sideNav = document.querySelector('.side-nav');

  // Dot click → scroll to slide
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index);
      slides[idx].scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Track active slide + toggle nav color
  const slideObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
        const idx = entry.target.dataset.slide;
        dots.forEach(d => d.classList.remove('active'));
        const activeDot = document.querySelector(`.dot[data-index="${idx}"]`);
        if (activeDot) activeDot.classList.add('active');

        if (entry.target.classList.contains('slide--light') || entry.target.classList.contains('slide--tint')) {
          if (sideNav) sideNav.classList.add('dark');
        } else {
          if (sideNav) sideNav.classList.remove('dark');
        }
      }
    });
  }, { threshold: 0.5 });

  slides.forEach(s => slideObs.observe(s));

  // ─── Chart.js Configuration ─────────────────────────────────
  const GREEN = '#055445';
  const LIME = '#E7F883';
  const LIME_LIGHT = '#f4fdb9';
  const UK_COLOR = '#c4e067';

  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.color = '#8a9490';

  // ─── Revenue Chart (Traction) with YoY labels ───────────────
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    const yoyLabels = [null, '+95%', '+44%', '+13%'];

    const yoyPlugin = {
      id: 'yoyLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        ctx.save();
        meta.data.forEach((bar, i) => {
          const label = yoyLabels[i];
          if (!label) return;
          const x = bar.x;
          const y = bar.y - 8;
          ctx.font = "bold 11px 'Space Mono', monospace";
          ctx.fillStyle = LIME;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(label, x, y);
        });
        ctx.restore();
      }
    };

    new Chart(revenueCtx, {
      type: 'bar',
      data: {
        labels: ['2022', '2023', '2024', '2025'],
        datasets: [{
          data: [1.32, 2.57, 3.69, 4.18],
          backgroundColor: [
            'rgba(231,248,131,0.25)',
            'rgba(231,248,131,0.45)',
            'rgba(231,248,131,0.7)',
            LIME
          ],
          borderColor: [LIME, LIME, LIME, LIME],
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        layout: { padding: { top: 28 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `€${ctx.parsed.y.toFixed(2)}M`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.08)' },
            ticks: {
              color: 'rgba(255,255,255,0.55)',
              font: { family: "'Space Mono', monospace", size: 12 }
            }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.08)' },
            ticks: {
              color: 'rgba(255,255,255,0.55)',
              font: { family: "'Space Mono', monospace", size: 11 },
              callback: v => `€${v}M`
            }
          }
        }
      },
      plugins: [yoyPlugin]
    });
  }

  // ─── Growth Projection Chart (7 years, 4 datasets) ──────────
  const growthCtx = document.getElementById('growthChart');
  if (growthCtx) {
    new Chart(growthCtx, {
      type: 'bar',
      data: {
        labels: ['2022 (Ist)', '2023 (Ist)', '2024 (Ist)', '2025 (Ist)', '2026 (Proj.)', '2027 (Proj.)', '2028 (Proj.)'],
        datasets: [
          {
            label: 'Deutschland',
            data: [1.32, 2.57, 3.69, 4.18, 5.0, 5.8, 6.5],
            backgroundColor: GREEN,
            borderRadius: 4,
            borderSkipped: 'start',
          },
          {
            label: 'BeNeLux',
            data: [0, 0, 0, 0, 0.2, 0.8, 1.3],
            backgroundColor: LIME,
            borderRadius: 4,
            borderSkipped: 'start',
          },
          {
            label: 'Polen',
            data: [0, 0, 0, 0, 0, 0, 0.5],
            backgroundColor: LIME_LIGHT,
            borderRadius: 4,
            borderSkipped: 'start',
          },
          {
            label: 'UK',
            data: [0, 0, 0, 0, 0, 0.2, 1.7],
            backgroundColor: UK_COLOR,
            borderRadius: 4,
            borderSkipped: 'start',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: { family: "'Space Mono', monospace", size: 10 },
              boxWidth: 12,
              padding: 16,
              color: '#8a9490'
            }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: €${ctx.parsed.y.toFixed(1)}M`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: {
              font: { family: "'Space Mono', monospace", size: 10 },
              color: '#8a9490',
              maxRotation: 0
            }
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: {
              font: { family: "'Space Mono', monospace", size: 10 },
              callback: v => `€${v}M`,
              color: '#8a9490'
            }
          }
        }
      }
    });
  }

});
