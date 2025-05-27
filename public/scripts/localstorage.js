// Save title and favicon to localStorage
function saveTitleAndFavicon(title, faviconUrl) {
  localStorage.setItem("pageTitle", title);
  localStorage.setItem("faviconUrl", faviconUrl);
}

function loadTitleAndFavicon() {
  const savedTitle = localStorage.getItem("pageTitle");
  const savedFavicon = localStorage.getItem("faviconUrl");
  if (savedTitle) document.title = savedTitle;
  if (savedFavicon) {
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = savedFavicon;
  }
}

// Save custom buttons array to localStorage
function saveCustomButtons(buttons) {
  localStorage.setItem("customButtons", JSON.stringify(buttons));
}

function loadCustomButtons() {
  return JSON.parse(localStorage.getItem("customButtons") || "[]");
}

// Manage tabs count using localStorage and storage event
const TAB_ID = Math.random().toString(36).slice(2);
const TAB_KEY = "activeTabsCount";
const TAB_LIST_KEY = "activeTabsList";

function updateTabsList(add = true) {
  let tabsList = JSON.parse(localStorage.getItem(TAB_LIST_KEY) || "[]");
  if (add) {
    if (!tabsList.includes(TAB_ID)) {
      tabsList.push(TAB_ID);
      localStorage.setItem(TAB_LIST_KEY, JSON.stringify(tabsList));
    }
  } else {
    tabsList = tabsList.filter(id => id !== TAB_ID);
    localStorage.setItem(TAB_LIST_KEY, JSON.stringify(tabsList));
  }
}

function enforceSingleTab() {
  window.addEventListener("storage", (e) => {
    if (e.key === TAB_LIST_KEY) {
      let tabsList = JSON.parse(e.newValue || "[]");
      if (tabsList.length > 1 && tabsList[0] !== TAB_ID) {
        alert("You already have this site open in another tab. This tab will now close.");
        window.close();
      }
    }
  });

  // Initial check on load
  const tabsList = JSON.parse(localStorage.getItem(TAB_LIST_KEY) || "[]");
  if (tabsList.length > 0 && tabsList[0] !== TAB_ID) {
    alert("You already have this site open in another tab. This tab will now close.");
    window.close();
  }
}

// Add current tab to active tabs list
updateTabsList(true);
enforceSingleTab();

// Remove current tab from active tabs list when unloading
window.addEventListener("beforeunload", () => {
  updateTabsList(false);
});
