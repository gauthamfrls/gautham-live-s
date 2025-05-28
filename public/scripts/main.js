let customButtons = JSON.parse(localStorage.getItem("customButtons") || "[]");
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
const titlePresetSelect = document.getElementById('titlePreset');
const pageTitle = document.getElementById('pageTitle');
const faviconLink = document.querySelector('link[rel="icon"]');
const newTitleInput = document.getElementById('newTitle');

function openInIframe(url) {
  const newTab = window.open("", "_blank");
  if (!newTab) return;
  const doc = newTab.document;
  doc.open();
  doc.write(`<!DOCTYPE html><html><head><title>${url}</title><style>body,html{margin:0;padding:0;height:100%;}iframe{border:none;width:100vw;height:100vh;}</style></head><body><iframe src="${url}" allowfullscreen></iframe></body></html>`);
  doc.close();
}

function loadLinks(containerId, data, isCustom=false) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  data.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = "main-btn";
    btn.textContent = item.name;
    btn.onclick = () => openInIframe(item.url);

    const starBtn = document.createElement("button");
    starBtn.className = "star-btn";
    starBtn.innerHTML = favorites.some(f => f.url === item.url) ? "★" : "☆";
    starBtn.title = favorites.some(f => f.url === item.url) ? "Remove from favorites" : "Add to favorites";
    starBtn.onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(item);
      starBtn.innerHTML = favorites.some(f => f.url === item.url) ? "★" : "☆";
      starBtn.title = favorites.some(f => f.url === item.url) ? "Remove from favorites" : "Add to favorites";
      renderFavorites();
    };

    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "Copy Link";
    copyBtn.title = "Copy URL to clipboard";
    copyBtn.onclick = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(item.url);
    };

    btn.appendChild(starBtn);
    btn.appendChild(copyBtn);

    if (isCustom) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "✖";
      deleteBtn.title = "Delete custom button";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        customButtons.splice(index, 1);
        localStorage.setItem("customButtons", JSON.stringify(customButtons));
        loadLinks("customButtonList", customButtons, true);
      };
      btn.appendChild(deleteBtn);
    }

    container.appendChild(btn);
  });
}

function toggleFavorite(item) {
  const idx = favorites.findIndex(f => f.url === item.url);
  if (idx === -1) favorites.push(item);
  else favorites.splice(idx, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function renderFavorites() {
  const container = document.getElementById("favoritesContainer");
  container.innerHTML = "";
  favorites.forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = item.name;
    btn.onclick = () => openInIframe(item.url);
    const star = document.createElement("span");
    star.textContent = "★";
    star.style.marginRight = "6px";
    btn.prepend(star);
    container.appendChild(btn);
  });
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const id = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(id).classList.add("active");
  });
});

document.getElementById("updateTitleBtn").addEventListener("click", () => {
  const newTitle = newTitleInput.value.trim();
  if (newTitle) {
    document.title = newTitle;
    pageTitle.textContent = newTitle;
    localStorage.setItem("pageTitle", newTitle);
  }
});

const themeColorInput = document.getElementById("themeColor");
themeColorInput.addEventListener("input", () => {
  document.documentElement.style.setProperty('--primary-color', themeColorInput.value);
  const darker = shadeColor(themeColorInput.value, -20);
  document.documentElement.style.setProperty('--hover-color', darker);
  localStorage.setItem("themeColor", themeColorInput.value);
});

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);
  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);
  R = (R<255)?R:255;
  G = (G<255)?G:255;
  B = (B<255)?B:255;
  const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
  return "#"+RR+GG+BB;
}

document.getElementById("addCustomBtn").addEventListener("click", () => {
  const name = document.getElementById("customName").value.trim();
  const url = document.getElementById("customUrl").value.trim();
  if (!name || !url) return alert("Please enter both name and URL");
  customButtons.push({name, url});
  localStorage.setItem("customButtons", JSON.stringify(customButtons));
  loadLinks("customButtonList", customButtons, true);
  document.getElementById("customName").value = "";
  document.getElementById("customUrl").value = "";
});

document.getElementById("generateBookmarkBtn").addEventListener("click", () => {
  const url = document.getElementById("bookmarkUrl").value.trim();
  const name = document.getElementById("bookmarkName").value.trim();
  if (!url || !name) return alert("Please enter both URL and name");
  const bookmarkLink = document.getElementById("bookmarkLink");
  bookmarkLink.href = url;
  bookmarkLink.textContent = name;
  document.getElementById("bookmarkContainer").style.display = "block";
});

document.getElementById("downloadBookmarkBtn").addEventListener("click", () => {
  const url = document.getElementById("bookmarkUrl").value.trim();
  const name = document.getElementById("bookmarkName").value.trim();
  if (!url || !name) return alert("Please enter both URL and name");
  const content = `<a href="${url}" target="_blank">${name}</a>`;
  const blob = new Blob([content], {type: "text/html"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name.replace(/\s+/g, "_")}_bookmark.html`;
  link.click();
  URL.revokeObjectURL(link.href);
});

const savedTitle = localStorage.getItem("pageTitle");
if (savedTitle) {
  document.title = savedTitle;
  pageTitle.textContent = savedTitle;
  newTitleInput.value = savedTitle;
}

const savedThemeColor = localStorage.getItem("themeColor");
if (savedThemeColor) {
  themeColorInput.value = savedThemeColor;
  document.documentElement.style.setProperty('--primary-color', savedThemeColor);
  const darker = shadeColor(savedThemeColor, -20);
  document.documentElement.style.setProperty('--hover-color', darker);
}

titlePresetSelect.addEventListener('change', () => {
  const val = titlePresetSelect.value;
  if (!val) return;
  const [title, favicon] = val.split('|');
  pageTitle.textContent = title;
  newTitleInput.value = title;
  document.title = title;
  localStorage.setItem("pageTitle", title);
  if (favicon) {
    if (faviconLink) {
      faviconLink.href = favicon;
      localStorage.setItem("favicon", favicon);
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = favicon;
      document.head.appendChild(link);
      localStorage.setItem("favicon", favicon);
    }
  }
});

const savedFavicon = localStorage.getItem("favicon");
if (savedFavicon) {
  if (faviconLink) {
    faviconLink.href = savedFavicon;
  } else {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = savedFavicon;
    document.head.appendChild(link);
  }
}

fetch("data/main.json")
  .then(res => res.json())
  .then(data => {
    loadLinks("proxyList", data.proxies);
    loadLinks("gameList", data.games);
    loadLinks("toolList", data.tools);
    loadLinks("emulatorList", data.emulators);
    loadLinks("appList", data.apps);
  });

loadLinks("customButtonList", customButtons, true);
renderFavorites();

const customHTML = localStorage.getItem("customHTML");
if (customHTML) {
  const container = document.createElement("div");
  container.innerHTML = customHTML;
  document.body.appendChild(container);
}

setInterval(updateTabTimestamp, 2000);
