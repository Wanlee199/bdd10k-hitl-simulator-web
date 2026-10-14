/**
 * BDD10K ACTIVE LEARNING LAB - MAIN APPLICATION ENTRY POINT
 * Tích hợp toàn bộ các module mô phỏng, canvas, đồ thị và máy tính ROI
 */

import { PROJECT_METADATA } from './data.js';
import { FlywheelSimulator } from './flywheel-simulator.js';
import { OracleStudio } from './oracle-studio.js';
import { BenchmarkCharts } from './benchmark-charts.js';
import { RoiCalculator } from './roi-calculator.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log(`[BDD10K Lab] Initializing Autonomous Driving HITL Platform v4.0...`);

  // 1. Initialize Hero Animated Numbers
  initHeroCounters();

  // 2. Initialize Navigation Smooth Scroll & Active Tabs
  initNavigation();

  // 3. Initialize Interactive Modules
  const flywheel = new FlywheelSimulator();
  const oracle = new OracleStudio();
  const benchmark = new BenchmarkCharts();
  const roi = new RoiCalculator();

  console.log(`[BDD10K Lab] All interactive modules mounted successfully!`);
});

/**
 * Animated number ticker for Hero HUD
 */
function initHeroCounters() {
  const countElements = [
    { id: 'counterDeltaMap', target: 4.95, prefix: '+', suffix: '%', decimals: 2 },
    { id: 'counterBudgetSaved', target: 40.1, prefix: '', suffix: '%', decimals: 1 },
    { id: 'counterPeakMap', target: 27.85, prefix: '', suffix: '%', decimals: 2 },
    { id: 'counterDedupFps', target: 360, prefix: '>', suffix: ' FPS', decimals: 0 },
    { id: 'counterStorageWaste', target: 0, prefix: '', suffix: ' KB', decimals: 0 }
  ];

  countElements.forEach(item => {
    const el = document.getElementById(item.id);
    if (!el) return;

    let current = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = item.target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= item.target) {
        current = item.target;
        clearInterval(timer);
      }
      el.textContent = `${item.prefix}${current.toFixed(item.decimals)}${item.suffix}`;
    }, stepTime);
  });
}

/**
 * Navigation Bar Scroll Spy & Active States
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
