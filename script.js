// ==================== BUSLOOT MAIN SCRIPT (PITY SYSTEM + CSGO STYLE) ====================

// ---------- STICKER DATABASE ----------
const STICKERS_DB = {
  common: [
    { id: "bus_yellow", name: "🚌 Xe buýt vàng", desc: "Phương tiện quen thuộc mỗi ngày", icon: "🚌", title: "Lữ khách bình thường" },
    { id: "ticket", name: "🎫 Vé lượt", desc: "Tấm vé nhỏ, niềm vui lớn", icon: "🎫", title: "Người soát vé" },
    { id: "plastic_chair", name: "🪑 Ghế nhựa", desc: "Ngồi yên và ngắm phố", icon: "🪑", title: "Khách quen" }
  ],
  uncommon: [
    { id: "phone_tap", name: "📱 Quẹt thẻ điện thoại", desc: "Thanh toán không tiếp xúc", icon: "📱", title: "Công dân số" },
    { id: "airpods", name: "🎧 AirPods thất lạc", desc: "Nhạc và lời ru trên xe", icon: "🎧", title: "Tín đồ âm nhạc" },
    { id: "banh_mi", name: "🥖 Bánh mì kẹp", desc: "Ăn vội trước giờ học", icon: "🥖", title: "Sinh viên bận rộn" }
  ],
  rare: [
    { id: "dragon_32", name: "🐉 Rồng biển số 32", desc: "Huyền thoại tuyến xe đông nhất", icon: "🐉", title: "Long Kỵ Sĩ" },
    { id: "street_guitar", name: "🎸 Guitar đường phố", desc: "Nghệ sĩ vỉa hè bất đắc dĩ", icon: "🎸", title: "Nghệ sĩ đường phố" },
    { id: "night_bus", name: "🌙 Xe đêm huyền thoại", desc: "Chuyến xe cuối cùng", icon: "🌙", title: "Kẻ lang thang" }
  ],
  epic: [
    { id: "gold_badge", name: "🏆 Huy hiệu vàng BusLoot", desc: "Thương hiệu của nhà vô địch", icon: "🏆", title: "Nhà vô địch" },
    { id: "future_bus", name: "🚀 Xe buýt tương lai", desc: "Chạy bằng năng lượng mặt trời", icon: "🚀", title: "Nhà du hành" },
    { id: "phoenix", name: "🔥 Phượng hoàng lửa", desc: "Tái sinh từ tro tàn", icon: "🔥", title: "Phượng Hoàng" }
  ],
  legendary: [
    { id: "bus_king", name: "👑 Vua của các tuyến xe", desc: "Ngồi đâu cũng thành ghế VIP", icon: "👑", title: "Quốc Vương" },
    { id: "urban_dragon", name: "🐉 Long mạch đô thị", desc: "Sức mạnh ngàn năm", icon: "🐉", title: "Long Thần" }
  ],
  mythic: [
    { id: "bus_star", name: "🌟 Tinh tú BusLoot", desc: "Loot từ cõi mộng", icon: "🌟", title: "Thần Thánh" },
    { id: "god_wheel", name: "⚡ Bánh xe thần thánh", desc: "Sấm sét và vinh quang", icon: "⚡", title: "Thần Sấm" }
  ],
  secret: [
    { id: "black_book", name: "📕 Sổ đen tài xế", desc: "Chứa bí mật không thể nói", icon: "📕", title: "Người giữ bí mật" }
  ],
  impossible: [
    { id: "skeleton_wheel", name: "💀 Xương rồng lăn bánh", desc: "Người chơi huyền thoại mở được???", icon: "💀", title: "TỬ THẦN" },
    { id: "void_bus", name: "🌀 Xe buýt hư không", desc: "Tồn tại giữa các chiều không gian", icon: "🌀", title: "KẺ HỦY DIỆT" },
    { id: "dragon_legend", name: "🐉 Long thần BusLoot", desc: "Sức mạnh tối thượng", icon: "🐉", title: "CHÚA TỂ RỒNG" },
    { id: "phoenix_king", name: "👑 Phượng hoàng đế", desc: "Bất tử và vĩnh cửu", icon: "👑", title: "HOÀNG ĐẾ BẤT TỬ" },
    { id: "god_mode", name: "✨ Chế độ thần linh", desc: "Bạn đã đạt đến đỉnh cao", icon: "✨", title: "THƯỢNG ĐẾ" }
  ]
};

const BASE_RARITY_CONFIG = [
  { name: "common", chance: 55, display: "COMMON", color: "#6c757d", glow: "none" },
  { name: "uncommon", chance: 25, display: "UNCOMMON", color: "#28a745", glow: "none" },
  { name: "rare", chance: 12, display: "RARE", color: "#007bff", glow: "0 0 10px #007bff" },
  { name: "epic", chance: 5, display: "EPIC", color: "#9b59b6", glow: "0 0 15px #9b59b6" },
  { name: "legendary", chance: 2, display: "LEGENDARY", color: "#f39c12", glow: "0 0 20px #f39c12" },
  { name: "mythic", chance: 0.8, display: "MYTHIC", color: "#e84393", glow: "0 0 25px #e84393" },
  { name: "secret", chance: 0.19, display: "SECRET", color: "#f1c40f", glow: "0 0 30px #f1c40f" }
];

const IMPOSSIBLE_CONFIG = {
  name: "impossible",
  chance: 0.001,
  display: "✦ IMPOSSIBLE ✦",
  color: "#ff0066",
  glow: "0 0 40px #ff0066, 0 0 60px #ff0066"
};

// ---------- GLOBAL STATE ----------
let currentUser = null;
let users = JSON.parse(localStorage.getItem("busloot_users")) || {};
let inventory = {};
let rideCount = 0;
let streak = 0;
let rideInProgress = false;
let rideTimer = null;
let availableOpens = 0;
let consecutiveOpensWithoutImpossible = 0;
let pityRateActive = false;

// Tạo user demo
if (Object.keys(users).length === 0) {
  users["123"] = {
    password: "123",
    school: "FTU",
    inventory: {},
    rideCount: 5,
    streak: 5,
    availableOpens: 3,
    consecutiveOpensWithoutImpossible: 0
  };
  users["admin"] = {
    password: "admin",
    school: "HUST",
    inventory: {},
    rideCount: 3,
    streak: 3,
    availableOpens: 2,
    consecutiveOpensWithoutImpossible: 0
  };
  localStorage.setItem("busloot_users", JSON.stringify(users));
}

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    if (toast) toast.classList.add("hidden");
  }, duration);
}

function rollRarity() {
  if (pityRateActive) {
    const isImpossible = Math.random() * 100 < 50;
    if (isImpossible) {
      consecutiveOpensWithoutImpossible = 0;
      pityRateActive = false;
      return "impossible";
    } else {
      consecutiveOpensWithoutImpossible++;
      if (consecutiveOpensWithoutImpossible >= 10) {
        pityRateActive = true;
      }
      return rollNormalRarity();
    }
  }
  
  const rand = Math.random() * 100;
  if (rand < IMPOSSIBLE_CONFIG.chance) {
    consecutiveOpensWithoutImpossible = 0;
    pityRateActive = false;
    return "impossible";
  }
  
  let cumulative = 0;
  for (const rarity of BASE_RARITY_CONFIG) {
    cumulative += rarity.chance;
    if (rand < cumulative) {
      consecutiveOpensWithoutImpossible++;
      if (consecutiveOpensWithoutImpossible >= 10) {
        pityRateActive = true;
        showToast("⚠️ PITY SYSTEM ACTIVATED! Lần sau 50% ra IMPOSSIBLE! ⚠️", 3000);
      }
      return rarity.name;
    }
  }
  
  consecutiveOpensWithoutImpossible++;
  if (consecutiveOpensWithoutImpossible >= 10) {
    pityRateActive = true;
    showToast("⚠️ PITY SYSTEM ACTIVATED! Lần sau 50% ra IMPOSSIBLE! ⚠️", 3000);
  }
  return "common";
}

function rollNormalRarity() {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const rarity of BASE_RARITY_CONFIG) {
    cumulative += rarity.chance;
    if (rand < cumulative) return rarity.name;
  }
  return "common";
}

function getRandomSticker(rarity) {
  const stickers = STICKERS_DB[rarity];
  if (!stickers || stickers.length === 0) {
    return { id: "unknown", name: "❓ Bí ẩn", desc: "???", icon: "❓", title: "???", rarity: rarity };
  }
  const sticker = stickers[Math.floor(Math.random() * stickers.length)];
  return { ...sticker, rarity: rarity };
}

function getRarityConfig(rarity) {
  if (rarity === "impossible") return IMPOSSIBLE_CONFIG;
  return BASE_RARITY_CONFIG.find(r => r.name === rarity);
}

function saveData() {
  if (currentUser && users[currentUser]) {
    users[currentUser].inventory = inventory;
    users[currentUser].rideCount = rideCount;
    users[currentUser].streak = streak;
    users[currentUser].availableOpens = availableOpens;
    users[currentUser].consecutiveOpensWithoutImpossible = consecutiveOpensWithoutImpossible;
    localStorage.setItem("busloot_users", JSON.stringify(users));
  }
}

function loadUserData(username) {
  const userData = users[username];
  if (userData) {
    inventory = userData.inventory || {};
    rideCount = userData.rideCount || 0;
    streak = userData.streak || 0;
    availableOpens = userData.availableOpens || 0;
    consecutiveOpensWithoutImpossible = userData.consecutiveOpensWithoutImpossible || 0;
    pityRateActive = false;
  } else {
    inventory = {};
    rideCount = 0;
    streak = 0;
    availableOpens = 0;
    consecutiveOpensWithoutImpossible = 0;
    pityRateActive = false;
  }
  updateUI();
}

function updateUI() {
  const rideCountElem = document.getElementById("rideCount");
  const streakValueElem = document.getElementById("streakValue");
  const bonusCounterElem = document.getElementById("bonusCounter");
  const userLabelElem = document.getElementById("userLabel");
  const openButton = document.getElementById("openButton");
  const startRideButton = document.getElementById("startRideButton");
  const availableOpensElem = document.getElementById("availableOpens");
  const pityCounterElem = document.getElementById("pityCounter");
  const toggleAuthButton = document.getElementById("toggleAuthButton");
  const profilePanel = document.getElementById("profilePanel");
  
  if (rideCountElem) rideCountElem.textContent = rideCount;
  if (streakValueElem) streakValueElem.textContent = `${streak} trips`;
  if (bonusCounterElem) {
    const remainingBonus = 3 - (rideCount % 3);
    bonusCounterElem.textContent = remainingBonus > 0 ? remainingBonus : 3;
  }
  if (availableOpensElem) availableOpensElem.textContent = availableOpens;
  
  if (pityCounterElem) {
    const remainingForPity = Math.max(0, 10 - consecutiveOpensWithoutImpossible);
    if (pityRateActive) {
      pityCounterElem.innerHTML = `🎯 PITY ACTIVE! Next: 50% IMPOSSIBLE!`;
      pityCounterElem.style.color = "#ff0066";
    } else {
      pityCounterElem.innerHTML = `⚡ ${remainingForPity} rolls until 50% IMPOSSIBLE ⚡`;
      pityCounterElem.style.color = "#f5af19";
    }
  }
  
  if (currentUser && users[currentUser]) {
    if (userLabelElem) userLabelElem.innerHTML = `👤 ${currentUser} • ${users[currentUser].school || "Unknown"}`;
    if (toggleAuthButton) {
      toggleAuthButton.textContent = "Đăng xuất";
      toggleAuthButton.onclick = logout;
    }
    if (openButton) openButton.disabled = !(availableOpens > 0);
    if (startRideButton) startRideButton.disabled = rideInProgress;
    if (profilePanel) {
      profilePanel.style.display = "block";
      loadUserProfile();
    }
  } else {
    if (userLabelElem) userLabelElem.innerHTML = "Chưa đăng nhập";
    if (toggleAuthButton) {
      toggleAuthButton.textContent = "Đăng nhập / Đăng ký";
      toggleAuthButton.onclick = showAuthModal;
    }
    if (openButton) openButton.disabled = true;
    if (startRideButton) startRideButton.disabled = true;
    if (profilePanel) profilePanel.style.display = "none";
  }
  
  updateInventoryDisplay();
  updateTradeSelect();
  updateLeaderboard();
  updateCollectionSummary();
}

function addStickerToInventory(sticker, rarity) {
  const key = `${rarity}_${sticker.id}`;
  if (!inventory[key]) {
    inventory[key] = { ...sticker, rarity, count: 0 };
  }
  inventory[key].count++;
  saveData();
  updateUI();
}

function updateInventoryDisplay() {
  const grid = document.getElementById("inventoryGrid");
  if (!grid) return;
  grid.innerHTML = "";
  
  // Sort stickers by rarity (rarest first)
  const rarityOrder = ["impossible", "secret", "mythic", "legendary", "epic", "rare", "uncommon", "common"];
  const stickers = Object.values(inventory).sort((a, b) => {
    const aIndex = rarityOrder.indexOf(a.rarity);
    const bIndex = rarityOrder.indexOf(b.rarity);
    return aIndex - bIndex;
  });
  
  if (stickers.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; opacity: 0.5;">Chưa có sticker nào!</div>';
    return;
  }
  
  stickers.forEach(sticker => {
    const tile = document.createElement("div");
    tile.className = "inventory-tile";
    tile.innerHTML = `
      <div class="tile-badge ${sticker.rarity}"></div>
      <div class="tile-art">${sticker.icon}</div>
      <div class="tile-name">${sticker.name}</div>
      <div class="tile-count">x${sticker.count}</div>
    `;
    grid.appendChild(tile);
  });
}

function updateCollectionSummary() {
  const totalStickers = Object.keys(STICKERS_DB).reduce((sum, rarity) => sum + STICKERS_DB[rarity].length, 0);
  const collectedStickers = Object.keys(inventory).length;
  const percentage = totalStickers > 0 ? Math.round((collectedStickers / totalStickers) * 100) : 0;
  const summaryElem = document.getElementById("collectionSummary");
  if (summaryElem) summaryElem.textContent = `${collectedStickers} stickers • ${percentage}%`;
}

function updateTradeSelect() {
  const select = document.getElementById("tradeSelect");
  if (!select) return;
  select.innerHTML = '<option value="">Chọn sticker để trade</option>';
  Object.entries(inventory).forEach(([key, sticker]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${sticker.icon} ${sticker.name} x${sticker.count} - ${sticker.rarity}`;
    select.appendChild(option);
  });
}

function updateLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");
  if (!leaderboardList) return;
  const sortedUsers = Object.entries(users).map(([username, data]) => ({
    username,
    score: Object.values(data.inventory || {}).reduce((sum, s) => sum + s.count, 0),
    school: data.school || "Unknown"
  })).sort((a, b) => b.score - a.score).slice(0, 10);
  
  if (sortedUsers.length === 0) {
    leaderboardList.innerHTML = '<div style="text-align: center; opacity: 0.5;">Chưa có người chơi</div>';
    return;
  }
  leaderboardList.innerHTML = sortedUsers.map((user, idx) => `
    <div class="leaderboard-item">
      <span class="leaderboard-rank">#${idx + 1}</span>
      <span class="leaderboard-name">${user.username} (${user.school})</span>
      <span class="leaderboard-score">${user.score} stickers</span>
    </div>
  `).join("");
}

function playSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.15;
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
    oscillator.stop(audioCtx.currentTime + 0.5);
    audioCtx.resume();
  } catch(e) {}
}

function playExplosionSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create explosion sound with multiple frequencies
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.frequency.value = 100 + Math.random() * 200;
        gain.gain.value = 0.3;
        
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
        osc.stop(audioCtx.currentTime + 0.3);
      }, i * 150);
    }
    audioCtx.resume();
  } catch(e) {}
}

function createIntenseFireworks() {
  // Left side fireworks
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      for (let j = 0; j < 4; j++) {
        createFirework(50 + Math.random() * 150, 100 + Math.random() * (window.innerHeight - 200));
      }
    }, i * 100);
  }
  
  // Right side fireworks
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      for (let j = 0; j < 4; j++) {
        createFirework(window.innerWidth - 50 - Math.random() * 150, 100 + Math.random() * (window.innerHeight - 200));
      }
    }, i * 100);
  }
  
  // Center fireworks
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createFirework(window.innerWidth / 2 + (Math.random() - 0.5) * 300, window.innerHeight / 2 + (Math.random() - 0.5) * 200);
    }, i * 80);
  }
}

function createFirework(x, y) {
  const colors = ['#ff0000', '#ff0066', '#ff00ff', '#ffaa00', '#ffff00', '#00ff00', '#00ffff'];
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '10000';
    particle.style.borderRadius = '50%';
    document.body.appendChild(particle);
    const angle = Math.random() * Math.PI * 2;
    const velocity = 100 + Math.random() * 150;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 100;
    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
    ], { duration: 1000, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }).onfinish = () => particle.remove();
  }
}

function createSideFireworks() {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => createFirework(100 + Math.random() * 200, 100 + Math.random() * (window.innerHeight - 200)), i * 150);
    setTimeout(() => createFirework(window.innerWidth - 100 - Math.random() * 200, 100 + Math.random() * (window.innerHeight - 200)), i * 150);
  }
  for (let i = 0; i < 10; i++) {
    setTimeout(() => createFirework(window.innerWidth / 2 + (Math.random() - 0.5) * 200, window.innerHeight / 2 + (Math.random() - 0.5) * 150), i * 100);
  }
}

function createConfetti() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#ff0066'];
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    document.body.appendChild(confetti);
    confetti.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], { duration: 1500 }).onfinish = () => confetti.remove();
  }
}

async function openCapsule() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập!");
    return;
  }
  if (availableOpens <= 0) {
    showToast("Bạn chưa có lượt mở!");
    return;
  }
  
  const openBtn = document.getElementById("openButton");
  const lootSlot = document.getElementById("lootSlot");
  if (!openBtn || !lootSlot) return;
  
  openBtn.disabled = true;
  const lootPanel = document.querySelector(".loot-panel");
  if (lootPanel) lootPanel.classList.add("csgo-spin");
  
  lootSlot.innerHTML = `<div style="text-align:center;"><div style="font-size:70px;animation:csgoRotate 0.5s linear infinite;">🎲</div><p style="margin-top:16px;font-weight:bold;">🌀 ROLLING... 🌀</p><p style="font-size:12px;">${pityRateActive ? '⭐ PITY ACTIVE! 50% IMPOSSIBLE! ⭐' : `💀 ${Math.max(0, 10 - consecutiveOpensWithoutImpossible)} rolls to pity 💀`}</p></div>`;
  
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  const rarity = rollRarity();
  const sticker = getRandomSticker(rarity);
  const rarityConfig = getRarityConfig(rarity);
  const isImpossible = rarity === "impossible";
  
  availableOpens--;
  addStickerToInventory(sticker, rarity);
  
  if (isImpossible) {
    playExplosionSound();
    createIntenseFireworks();
  } else {
    playSound();
  }
  
  if (lootPanel) lootPanel.classList.remove("csgo-spin");
  createConfetti();
  
  if (rarityConfig) {
    const originalBg = document.body.style.background;
    document.body.style.transition = "background 0.3s";
    document.body.style.background = rarityConfig.color;
    setTimeout(() => document.body.style.background = originalBg, 500);
  }
  
  const titleHtml = isImpossible ? `
    <div style="margin:20px 0;">
      <div style="font-size:24px;font-weight:bold;color:#ff0066;text-shadow:0 0 20px #ff0066;animation:pulse 0.5s ease infinite;">✦ CHÚC MỪNG! ✦</div>
      <div style="font-size:18px;color:#ffaa00;">Bạn đã sở hữu vật phẩm HIẾM nhất!</div>
      <div style="font-size:28px;font-weight:800;margin-top:12px;background:linear-gradient(45deg,#ff0066,#ffaa00,#ff0066);-webkit-background-clip:text;background-clip:text;color:transparent;">${sticker.title || "HUYỀN THOẠI"}</div>
    </div>
  ` : '';
  
  lootSlot.innerHTML = `
    <div style="text-align:center;animation:csgoReveal 0.8s ease;">
      <div style="font-size:100px;margin-bottom:12px;filter:drop-shadow(${rarityConfig?.glow || 'none'});animation:csgoItemDrop 0.5s ease;">${sticker.icon}</div>
      <div style="font-size:28px;font-weight:800;margin-bottom:8px;color:${rarityConfig?.color || '#fff'};">${sticker.name}</div>
      <div style="display:inline-block;padding:8px 24px;border-radius:40px;font-size:16px;font-weight:bold;background:${rarityConfig?.color || '#666'};color:white;">${rarityConfig?.display || rarity}</div>
      <div style="font-size:14px;margin-top:16px;">✨ ${sticker.desc} ✨</div>
      ${titleHtml}
    </div>
  `;
  
  openBtn.disabled = false;
  showToast(isImpossible ? `💀 ${sticker.title}! Nhận: ${sticker.name} (IMPOSSIBLE)! 💀` : `🎉 Nhận: ${sticker.name} (${rarityConfig?.display})!`);
  saveData();
}

function startRide() {
    if (!currentUser) { showToast("Đăng nhập!"); return; }
    if (rideInProgress) { showToast("Đang trên xe xanh!"); return; }

    let route = document.getElementById("busRouteSelect").options[document.getElementById("busRouteSelect").selectedIndex]?.text.split(" - ")[0] || "Tuyến 32";
    let point = document.getElementById("pickupPointSelect").value;

    rideInProgress = true;
    let btn = document.getElementById("startRideButton");
    let openBtn = document.getElementById("openButton");
    let statusDiv = document.getElementById("rideStatus");

    btn.disabled = true;
    openBtn.disabled = true;
    statusDiv.style.display = "block";

    let count = 5;
    // Hiển thị ngay giây đầu tiên
    statusDiv.innerHTML = `🚌 Đang di chuyển trên ${route} - Đón tại ${point}... ⏳ ${count} giây ⏳`;

    let interval = setInterval(() => {
        if (rideInProgress) {
            playTick(); // Âm thanh tíc tắc mỗi giây
            count--;
            if (count >= 0) {
                statusDiv.innerHTML = `🚌 Đang di chuyển trên ${route} - Đón tại ${point}... ⏳ ${count} giây ⏳`;
            }
            if (count < 0) {
                clearInterval(interval);
            }
        } else {
            clearInterval(interval);
        }
    }, 1000);

    if (rideTimer) clearTimeout(rideTimer);
    rideTimer = setTimeout(() => {
        if (rideInProgress) {
            rideInProgress = false;
            rideCount++;
            availableOpens++;
            saveData();
            updateUI();
            statusDiv.innerHTML = `✅ Đã đến ${point}! +1 lượt roll ✅`;
            showToast(`🎁 +1 lượt roll! Tổng: ${rideCount} chuyến`);
            btn.disabled = false;
            openBtn.disabled = false;
            // Tự động ẩn trạng thái sau 3 giây
            setTimeout(() => {
                if (statusDiv.innerHTML.includes("Đã đến")) {
                    statusDiv.style.display = "none";
                }
            }, 3000);
        }
        clearInterval(interval);
    }, 5000);
}

function showAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) modal.classList.remove("hidden");
}

function hideAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) modal.classList.add("hidden");
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  const authMessage = document.getElementById("authMessage");
  if (!username || !password) {
    if (authMessage) authMessage.textContent = "Nhập đầy đủ!";
    return;
  }
  if (!users[username] || users[username].password !== password) {
    if (authMessage) authMessage.textContent = "Sai tên hoặc mật khẩu!";
    return;
  }
  currentUser = username;
  loadUserData(username);
  hideAuthModal();
  showToast(`Chào mừng ${username}!`);
}

function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;
  const school = document.getElementById("signupSchool").value;
  const authMessage = document.getElementById("authMessageSignup");
  if (!username || !password) {
    if (authMessage) authMessage.textContent = "Nhập đầy đủ!";
    return;
  }
  if (password !== confirm) {
    if (authMessage) authMessage.textContent = "Mật khẩu không khớp!";
    return;
  }
  if (users[username]) {
    if (authMessage) authMessage.textContent = "Tên đã tồn tại!";
    return;
  }
  users[username] = { password, school, inventory: {}, rideCount: 0, streak: 0, availableOpens: 0, consecutiveOpensWithoutImpossible: 0 };
  currentUser = username;
  loadUserData(username);
  hideAuthModal();
  showToast(`Đăng ký thành công!`);
}

// User profile data
function saveUserProfile() {
  if (!currentUser) return;
  
  const profile = {
    avatar: document.getElementById("avatarDisplay")?.innerHTML.split('font-size:80px;text-align:center;line-height:1;">')[1]?.split('</div>')[0] || "🚌",
    nickname: document.getElementById("nicknameInput")?.value || "",
    dob: document.getElementById("dobInput")?.value || "",
    bio: document.getElementById("bioInput")?.value || "",
    wallpaper: document.getElementById("wallpaperSelect")?.value || "default",
    stickerTheme: document.getElementById("stickerThemeSelect")?.value || "default"
  };
  
  if (users[currentUser]) {
    users[currentUser].profile = profile;
    localStorage.setItem("busloot_users", JSON.stringify(users));
    showToast("✅ Lưu hồ sơ thành công!");
  }
}

function loadUserProfile() {
  if (!currentUser || !users[currentUser]?.profile) return;
  
  const profile = users[currentUser].profile;
  
  // Load avatar
  if (profile.avatar) {
    const display = document.getElementById("avatarDisplay");
    if (display) display.innerHTML = `<div style="font-size:80px;text-align:center;line-height:1;">${profile.avatar}</div>`;
  }
  
  // Load profile info
  if (document.getElementById("nicknameInput")) document.getElementById("nicknameInput").value = profile.nickname || "";
  if (document.getElementById("dobInput")) document.getElementById("dobInput").value = profile.dob || "";
  if (document.getElementById("bioInput")) document.getElementById("bioInput").value = profile.bio || "";
  if (document.getElementById("wallpaperSelect")) document.getElementById("wallpaperSelect").value = profile.wallpaper || "default";
  if (document.getElementById("stickerThemeSelect")) document.getElementById("stickerThemeSelect").value = profile.stickerTheme || "default";
  
  applyWallpaper(profile.wallpaper || "default");
}

function applyWallpaper(theme) {
  let gradient = "radial-gradient(circle at top, rgba(76, 175, 80, 0.16), transparent 24%), linear-gradient(180deg, #051409 0%, #030a05 100%)";
  
  switch(theme) {
    case "dark":
      gradient = "radial-gradient(circle at top, rgba(100, 100, 100, 0.16), transparent 24%), linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)";
      break;
    case "nature":
      gradient = "radial-gradient(circle at top, rgba(100, 150, 100, 0.16), transparent 24%), linear-gradient(180deg, #0d1f0d 0%, #050a05 100%)";
      break;
    case "neon":
      gradient = "radial-gradient(circle at top, rgba(0, 255, 136, 0.16), transparent 24%), linear-gradient(180deg, #001a0f 0%, #000d05 100%)";
      break;
  }
  
  document.body.style.background = gradient;
}

function logout() {
  currentUser = null;
  inventory = {};
  rideCount = 0;
  streak = 0;
  availableOpens = 0;
  consecutiveOpensWithoutImpossible = 0;
  pityRateActive = false;
  updateUI();
  showToast("Đã đăng xuất!");
}

function proposeTrade() {
  const selectedKey = document.getElementById("tradeSelect").value;
  if (!selectedKey) { showToast("Chọn sticker để trade!"); return; }
  const sticker = inventory[selectedKey];
  if (!sticker || sticker.count < 2) { showToast("Cần ít nhất 2 sticker!"); return; }
  const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "secret", "impossible"];
  const currentIdx = rarityOrder.indexOf(sticker.rarity);
  const targetRarity = rarityOrder[Math.min(currentIdx + 1, rarityOrder.length - 1)];
  if (targetRarity === sticker.rarity) { showToast("Đã ở cấp cao nhất!"); return; }
  const tradeOffer = document.getElementById("tradeOffer");
  if (!tradeOffer) return;
  tradeOffer.innerHTML = `
    <div style="text-align:center;">
      <p>${sticker.icon} ${sticker.name} x2 → 1 ${targetRarity.toUpperCase()}</p>
      <button id="acceptTradeBtn" class="primary">Chấp nhận</button>
      <button id="cancelTradeBtn" class="secondary">Hủy</button>
    </div>
  `;
  document.getElementById("acceptTradeBtn").onclick = () => {
    if (inventory[selectedKey] && inventory[selectedKey].count >= 2) {
      inventory[selectedKey].count -= 2;
      if (inventory[selectedKey].count === 0) delete inventory[selectedKey];
      const newSticker = getRandomSticker(targetRarity);
      addStickerToInventory(newSticker, targetRarity);
      saveData();
      updateUI();
      showToast(`Trade thành công! Nhận: ${newSticker.name}`);
      tradeOffer.innerHTML = '<div class="trade-empty">Trade hoàn tất!</div>';
    }
  };
  document.getElementById("cancelTradeBtn").onclick = () => {
    tradeOffer.innerHTML = '<div class="trade-empty">Đã hủy trade.</div>';
  };
}

function shareGame() {
  if (navigator.share) {
    navigator.share({ title: "BusLoot", text: "Tham gia BusLoot - PITY SYSTEM!", url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast("Đã copy link!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const statsRow = document.querySelector(".stats-row");
  if (statsRow) {
    if (!document.getElementById("availableOpens")) {
      const newCard = document.createElement("div");
      newCard.className = "stat-card";
      newCard.innerHTML = `<span class="stat-label">🎁 Lượt mở</span><strong id="availableOpens">0</strong>`;
      statsRow.appendChild(newCard);
    }
    if (!document.getElementById("pityCounter")) {
      const pityCard = document.createElement("div");
      pityCard.className = "stat-card";
      pityCard.style.background = "rgba(255,0,102,0.2)";
      pityCard.innerHTML = `<span class="stat-label">⚡ PITY</span><strong id="pityCounter" style="font-size:12px;">0 rolls</strong>`;
      statsRow.appendChild(pityCard);
    }
  }
  
  document.getElementById("toggleAuthButton").addEventListener("click", showAuthModal);
  document.getElementById("closeAuthButton").addEventListener("click", hideAuthModal);
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("signupForm").addEventListener("submit", handleSignup);
  
  document.getElementById("authLoginTab").addEventListener("click", () => {
    document.getElementById("authLoginTab").classList.add("active");
    document.getElementById("authSignupTab").classList.remove("active");
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("signupForm").classList.add("hidden");
  });
  document.getElementById("authSignupTab").addEventListener("click", () => {
    document.getElementById("authSignupTab").classList.add("active");
    document.getElementById("authLoginTab").classList.remove("active");
    document.getElementById("signupForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
  });
  
  document.getElementById("openButton").addEventListener("click", openCapsule);
  document.getElementById("startRideButton").addEventListener("click", startRide);
  document.getElementById("inventoryButton").addEventListener("click", () => document.getElementById("inventoryPanel").scrollIntoView({ behavior: "smooth" }));
  document.getElementById("shareButton").addEventListener("click", shareGame);
  document.getElementById("tradeButton").addEventListener("click", proposeTrade);
  
  // Profile customization events
  document.getElementById("saveProfileBtn").addEventListener("click", saveUserProfile);
  
  // Avatar preset buttons
  document.querySelectorAll(".avatar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const avatar = btn.dataset.avatar;
      document.getElementById("avatarDisplay").innerHTML = `<div style="font-size:80px;text-align:center;line-height:1;">${avatar}</div>`;
      document.querySelectorAll(".avatar-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
  
  // Avatar upload
  document.getElementById("uploadAvatarBtn").addEventListener("click", () => {
    document.getElementById("avatarUpload").click();
  });
  
  document.getElementById("avatarUpload").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById("avatarDisplay").innerHTML = `<img src="${event.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:24px;">`;
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Wallpaper selection
  document.getElementById("wallpaperSelect").addEventListener("change", (e) => {
    applyWallpaper(e.target.value);
  });
  
  const checkBtn = document.getElementById("checkLocationButton");
  const scanBtn = document.getElementById("scanButton");
  if (checkBtn) checkBtn.style.display = "none";
  if (scanBtn) scanBtn.style.display = "none";
  
  const profilePanel = document.getElementById("profilePanel");
  if (profilePanel) profilePanel.style.display = "none";
  
  const locStatus = document.getElementById("locationStatus");
  if (locStatus) locStatus.innerHTML = "🎮 PITY: 10 lần không IMPOSSIBLE → 50%!";
  const rideStatus = document.getElementById("rideStatus");
  if (rideStatus) rideStatus.innerHTML = "✨ Nhấn 'Bắt đầu' chờ 5 giây nhận lượt mở! ✨";
  
  updateUI();
  
  const style = document.createElement("style");
  style.textContent = `
    @keyframes csgoRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes csgoSpin { 0% { transform: perspective(500px) rotateY(0deg); } 100% { transform: perspective(500px) rotateY(360deg); } }
    @keyframes csgoReveal { 0% { opacity: 0; transform: scale(0.3) rotateY(90deg); } 100% { opacity: 1; transform: scale(1) rotateY(0deg); } }
    @keyframes csgoItemDrop { 0% { transform: translateY(-100px) rotate(-30deg); opacity: 0; } 100% { transform: translateY(0) rotate(0deg); opacity: 1; } }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    .csgo-spin { animation: csgoSpin 0.8s ease; transform-style: preserve-3d; }
  `;
  document.head.appendChild(style);
});