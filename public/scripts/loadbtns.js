document.addEventListener("DOMContentLoaded", () => {
  const savedTitle = localStorage.getItem("pageTitle");
  if (savedTitle) {
    document.title = savedTitle;
    document.getElementById("pageTitle").textContent = savedTitle;
  }

  const savedColor = localStorage.getItem("themeColor");
  if (savedColor) {
    themeColorInput.value = savedColor;
    document.documentElement.style.setProperty('--primary-color', savedColor);
    document.documentElement.style.setProperty('--hover-color', shadeColor(savedColor, -20));
  }

  loadLinks("proxyList", proxies);
  loadLinks("gameList", games);
  loadLinks("toolList", tools);
  loadLinks("emulatorList", emulators);
  loadLinks("appList", apps);
  loadLinks("customButtonList", customButtons, true);
  renderFavorites();
});

document.getElementById("addCustomBtn").addEventListener("click", () => {
  const name = document.getElementById("customName").value.trim();
  const url = document.getElementById("customUrl").value.trim();
  if (!name || !url) return;
  const newBtn = { name, url };
  customButtons.push(newBtn);
  localStorage.setItem("customButtons", JSON.stringify(customButtons));
  loadLinks("customButtonList", customButtons, true);
  document.getElementById("customName").value = "";
  document.getElementById("customUrl").value = "";
});
