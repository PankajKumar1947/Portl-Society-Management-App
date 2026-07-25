// State Variables for Simulator
let timerInterval = null;
let currentVisitor = null;

// Tab switcher for simulators
window.switchSimMode = function(mode) {
  // Reset active tabs
  document.querySelectorAll('.sim-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.sim-panel').forEach(panel => panel.classList.remove('active'));
  
  // Find current elements
  const currentTabBtn = Array.from(document.querySelectorAll('.sim-tab-btn')).find(btn => 
    btn.getAttribute('onclick').includes(mode)
  );
  const currentPanel = document.getElementById(`sim-${mode}`);
  
  if (currentTabBtn) currentTabBtn.classList.add('active');
  if (currentPanel) currentPanel.classList.add('active');
  
  resetSimulator();
  resetPreApprovedSim();
};

// Reset Walk-In Simulator
window.resetSimulator = function() {
  clearInterval(timerInterval);
  timerInterval = null;
  currentVisitor = null;
  
  // Reset Guard Screen Views
  document.getElementById('guard-state-form').classList.add('active');
  document.getElementById('guard-state-waiting').classList.remove('active');
  document.getElementById('guard-state-approved').classList.remove('active');
  document.getElementById('guard-state-rejected').classList.remove('active');
  
  // Reset Resident Screen Overlays
  const banner = document.getElementById('resident-notification-banner');
  banner.classList.remove('active');
  banner.style.display = 'none';
  
  // Reset packet line
  const packet = document.querySelector('.data-packet');
  packet.className = 'data-packet';
};

// Start Walk-In Simulator Flow
window.startWalkInSimulation = function() {
  const flat = document.getElementById('sim-flat').value || '402';
  const name = document.getElementById('sim-visitor-name').value || 'Ramesh Kumar';
  const typeSelect = document.getElementById('sim-visitor-type');
  const type = typeSelect.options[typeSelect.selectedIndex].text;
  const purpose = document.getElementById('sim-purpose').value || 'Delivery';
  
  currentVisitor = { flat, name, type, purpose };
  
  // Update texts in simulators
  document.querySelectorAll('.txt-flat').forEach(el => el.textContent = flat);
  document.querySelectorAll('.txt-name').forEach(el => el.textContent = name);
  document.querySelectorAll('.txt-purpose').forEach(el => el.textContent = purpose);
  
  // Transition Guard screen to Waiting
  document.getElementById('guard-state-form').classList.remove('active');
  document.getElementById('guard-state-waiting').classList.add('active');
  
  // Launch WebSocket Packet animation to Resident
  const packet = document.querySelector('.data-packet');
  packet.className = 'data-packet send-to-resident';
  
  // Mock Timer
  let secondsLeft = 120;
  const timerDisplay = document.getElementById('sim-timer');
  timerDisplay.textContent = secondsLeft;
  
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsLeft--;
    timerDisplay.textContent = secondsLeft;
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      resetSimulator();
    }
  }, 1000);
  
  // After 800ms packet delivery time, show resident phone alert
  setTimeout(() => {
    const banner = document.getElementById('resident-notification-banner');
    banner.style.display = 'block';
    setTimeout(() => {
      banner.classList.add('active');
    }, 10);
  }, 800);
};

// Resident approves/rejects visitor
window.simulateResidentAction = function(approved) {
  // Hide resident notification banner
  const banner = document.getElementById('resident-notification-banner');
  banner.classList.remove('active');
  setTimeout(() => {
    banner.style.display = 'none';
  }, 300);
  
  // Send data packet back to guard
  const packet = document.querySelector('.data-packet');
  packet.className = 'data-packet send-to-guard';
  
  // After packet delivery, transition guard screen to outcome
  setTimeout(() => {
    clearInterval(timerInterval);
    document.getElementById('guard-state-waiting').classList.remove('active');
    
    if (approved) {
      document.getElementById('guard-state-approved').classList.add('active');
      
      // Update Resident Active Visitors list
      const list = document.getElementById('resident-visitors-list');
      list.innerHTML = `
        <div class="visitor-entry-card">
          <div class="visitor-info-left">
            <h5>${currentVisitor.name}</h5>
            <p>${currentVisitor.type} • Active Now</p>
          </div>
          <span class="badge badge-success">Inside</span>
        </div>
      `;
    } else {
      document.getElementById('guard-state-rejected').classList.add('active');
    }
  }, 800);
};

// Pre-Approved Flow: Generate QR Pass
window.generatePreApprovedPass = function() {
  const name = document.getElementById('pre-visitor-name').value || 'Amit Sharma';
  const typeSelect = document.getElementById('pre-visitor-type');
  const type = typeSelect.options[typeSelect.selectedIndex].text.split(' ')[1] || 'GUEST';
  const dateVal = document.getElementById('pre-visitor-date').value || '2026-07-26';
  
  // Format date
  const dateObj = new Date(dateVal);
  const formattedDate = isNaN(dateObj.getTime()) ? dateVal : dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  
  // Set card contents
  document.getElementById('pass-display-name').textContent = name;
  document.getElementById('pass-display-date').textContent = formattedDate;
  document.querySelector('.pass-type-badge').textContent = type.toUpperCase();
  
  // Animate card generation
  const card = document.getElementById('sim-generated-pass-card');
  card.classList.add('generated');
  
  // Show scanner scan button
  const scanBtn = document.getElementById('scan-pass-btn');
  scanBtn.style.display = 'block';
  
  // Set global variable for scanned visitor
  window.preApprovedVisitorName = name;
};

// Pre-Approved Flow: Guard Scan QR code
window.simulateGuardScanQR = function() {
  const name = window.preApprovedVisitorName || 'Amit Sharma';
  
  // Show camera scanner scanning line animation for brief moment, then complete
  document.querySelector('.scanner-help').textContent = 'Scanning QR Code...';
  
  setTimeout(() => {
    document.getElementById('guard-scanner-view').classList.remove('active');
    document.getElementById('guard-scanner-success').classList.add('active');
    document.getElementById('scan-visitor-name').textContent = name;
  }, 1200);
};

// Reset Pre-approved Simulator
window.resetPreApprovedSim = function() {
  document.getElementById('guard-scanner-view').classList.add('active');
  document.getElementById('guard-scanner-success').classList.remove('active');
  document.querySelector('.scanner-help').textContent = 'Awaiting resident pass generation';
  
  const card = document.getElementById('sim-generated-pass-card');
  card.classList.remove('generated');
  
  const scanBtn = document.getElementById('scan-pass-btn');
  scanBtn.style.display = 'none';
};

// Switch active roles display
window.switchRoleView = function(role) {
  // Tabs
  document.querySelectorAll('.role-tab').forEach(tab => tab.classList.remove('active'));
  
  // Contents
  document.querySelectorAll('.role-content-view').forEach(view => view.classList.remove('active'));
  
  // Activate selected elements
  const currentTab = Array.from(document.querySelectorAll('.role-tab')).find(tab => 
    tab.getAttribute('onclick').includes(role)
  );
  if (currentTab) currentTab.classList.add('active');
  
  const currentView = document.getElementById(`role-${role}`);
  if (currentView) currentView.classList.add('active');
};

// Play Mock Video Helper
window.playMockVideo = function() {
  const overlay = document.getElementById('video-overlay-pane');
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.display = 'none';
    const placeholder = document.getElementById('demo-video-iframe-placeholder');
    placeholder.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; color: var(--color-primary); padding: 20px; text-align: center;">
        <h4 style="color: #D3DB36; margin-bottom: 10px;">Google Drive Video Connection</h4>
        <p style="font-size: 13px; color: #9AA3AF; max-width: 420px; margin-bottom: 20px;">
          To embed a real video, upload your screen recording to Google Drive, change permissions to "Anyone with the link", copy the video ID, and replace the src in an iframe.
        </p>
        <button class="btn btn-primary" onclick="window.open('https://drive.google.com', '_blank')">Upload to Google Drive</button>
      </div>
    `;
  }, 500);
};
