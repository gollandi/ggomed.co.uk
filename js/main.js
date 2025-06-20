/* =====================================================
   GGO Med homepage interactions
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- DOM refs ---------- */
  const body       = document.body;
  const btnFeel    = document.getElementById('btnFeel');
  const btnNeed    = document.getElementById('btnNeed');
  const panelFeel  = document.getElementById('panelFeel');
  const panelNeed  = document.getElementById('panelNeed');
  const megaToggle = document.getElementById('megaToggle');
  const megaMenu   = document.getElementById('megaMenu');

  /* ---------- Mega-menu ---------- */
  if (megaToggle && megaMenu) {
    megaToggle.addEventListener('click', () => {
      const isOpen = megaToggle.getAttribute('aria-expanded') === 'true';
      megaToggle.setAttribute('aria-expanded', !isOpen);
      megaMenu.hidden = isOpen; // If closing, hidden = true. If opening, hidden = false.
      body.classList.toggle('menu-open', !isOpen);
    });

    document.addEventListener('keydown', e => {
      // If Escape key is pressed and megaMenu is currently not hidden (i.e., open)
      if (e.key === 'Escape' && !megaMenu.hidden) {
        megaToggle.click(); // Simulate a click on megaToggle to close the menu
      }
    });
  }

  /* ---------- Helper: animate panels ---------- */
  function dealCards(panel, direction = 'in') {
    if (!panel) return;

    // Remove any previous anim-state classes
    panel.classList.remove('deal-in', 'deal-out');

    // Prepare stagger delays for both .hub-card and .option-card
    const cards = panel.querySelectorAll('.hub-card, .option-card');
    cards.forEach((card, idx) => {
      card.style.animationDelay = `${idx * 90}ms`;
    });

    // Reflow to restart animation if classes are re-added quickly
    void panel.offsetWidth;
    panel.classList.add(direction === 'in' ? 'deal-in' : 'deal-out');
  }

  /* ---------- Open / close logic for hero flow panels ---------- */
  let currentPanel = null;
  const DURATION_PANEL_TRANSITION = 600; // Must match CSS transition time for .panel

  function openPanel(targetPanel, panelColorClass) {
    if (!targetPanel) return;

    // If the clicked panel is already open, close it.
    if (currentPanel === targetPanel) {
      dealCards(currentPanel, 'out');
      currentPanel.classList.remove('panel--open');
      if (panelColorClass) currentPanel.classList.remove(panelColorClass);
      // Optional: After transition, could set currentPanel.hidden = true for full cleanup,
      // but CSS (max-height:0, opacity:0, pointer-events:none) should suffice.
      currentPanel = null;
      // Optionally update button states (e.g., remove 'active' class)
      if (btnFeel) btnFeel.classList.remove('active-btn-feel'); // Example active state class
      if (btnNeed) btnNeed.classList.remove('active-btn-need');
      return;
    }

    // If another panel is open, close it first.
    if (currentPanel) {
      const oldPanel = currentPanel;
      const oldColorClass = oldPanel === panelFeel ? 'panel--blue' : (oldPanel === panelNeed ? 'panel--green' : '');
      
      dealCards(oldPanel, 'out');
      oldPanel.classList.remove('panel--open');
      if (oldColorClass) oldPanel.classList.remove(oldColorClass);
      // The old panel will transition out. No need to wait with setTimeout
      // before opening the new one for a quicker UI response.
    }

    // Open the new panel.
    // Ensure 'hidden' attribute is removed so CSS transitions can play.
    if (targetPanel.hidden) {
      targetPanel.hidden = false;
    }
    
    targetPanel.classList.add('panel--open');
    if (panelColorClass) {
      targetPanel.classList.add(panelColorClass);
    }
    dealCards(targetPanel, 'in');
    currentPanel = targetPanel;

    // Optionally update button states
    if (btnFeel) btnFeel.classList.toggle('active-btn-feel', targetPanel === panelFeel);
    if (btnNeed) btnNeed.classList.toggle('active-btn-need', targetPanel === panelNeed);
  }

  if (btnFeel && panelFeel) {
    btnFeel.addEventListener('click', () => openPanel(panelFeel, 'panel--blue'));
  }
  if (btnNeed && panelNeed) {
    btnNeed.addEventListener('click', () => openPanel(panelNeed, 'panel--green'));
  }

  /* ---------- Accordion logic for hub-cards ---------- */
  document.querySelectorAll('.hub-trigger').forEach(btn => {
    const innerContent = btn.nextElementSibling;
    if (innerContent) {
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);
        innerContent.hidden = isExpanded;
      });
    }
  });
});