const pagesBox = document.getElementById("pages");
const board = document.getElementById("board");
const addPage = document.getElementById("addPage");

function renderPages() {
  pagesBox.innerHTML = "";
  pages.forEach(p => {
    const btn = document.createElement("button");
    btn.className = "page-btn";
    btn.style.setProperty("--c", p.color);
    btn.textContent = "Page " + p.id;
    btn.onclick = () => placeOnBoard(p);
    pagesBox.appendChild(btn);
  });
}

const fontSelect = document.getElementById("fontSelect");
let currentFont = localStorage.getItem("font") || "'Segoe UI', sans-serif";
fontSelect.value = currentFont;

fontSelect.onchange = () => {
  currentFont = fontSelect.value;
  localStorage.setItem("font", currentFont);

  document.querySelectorAll(".note textarea").forEach(t => {
    t.style.fontFamily = currentFont;
  });
};

const fontSizeSelect = document.getElementById("fontSizeSelect");
let currentFontSize = localStorage.getItem("fontSize") || "14px";
fontSizeSelect.value = currentFontSize;

fontSizeSelect.onchange = () => {
  currentFontSize = fontSizeSelect.value;
  localStorage.setItem("fontSize", currentFontSize);

  // Update all existing notes
  document.querySelectorAll(".note textarea").forEach(t => {
    t.style.fontSize = currentFontSize;
  });
};

function placeOnBoard(page) {
  const note = document.createElement("div");
  note.className = "note";
  note.style.setProperty("--c", page.color);
  note.style.left = "60px";
  note.style.top = "60px";

  // Different cute pin stickers
  const pins = [
    // Cute stickers
    "https://cdn-icons-png.flaticon.com/512/833/833472.png", // star
    "https://cdn-icons-png.flaticon.com/512/742/742751.png", // flower
    "https://cdn-icons-png.flaticon.com/512/2102/2102647.png", // heart

    // Animal pins
    "https://cdn-icons-png.flaticon.com/512/616/616408.png", // dog
    "https://cdn-icons-png.flaticon.com/512/616/616430.png", // cat
    "https://cdn-icons-png.flaticon.com/512/1998/1998610.png", // cow
    "https://cdn-icons-png.flaticon.com/512/616/616412.png", // bunny
    "https://cdn-icons-png.flaticon.com/512/1998/1998592.png"  // panda
    ];


  const pin = document.createElement("img");
  pin.className = "pin";
  pin.src = pins[Math.floor(Math.random() * pins.length)];

  const del = document.createElement("button");
  del.className = "delete";
  del.textContent = "🗑";
  del.title = "Delete Note";

  const ta = document.createElement("textarea");
  ta.value = page.text;
  ta.style.fontFamily = currentFont;
  ta.style.fontSize = currentFontSize;



  const data = { id: Date.now(), x: 60, y: 60, color: page.color, text: "" };
  boardNotes.push(data);

  ta.oninput = () => {
    data.text = ta.value;
    saveAll();
  };

  del.onclick = () => {
    board.removeChild(note);
    boardNotes = boardNotes.filter(n => n.id !== data.id);
    saveAll();
  };

  note.append(pin, del, ta);
  board.appendChild(note);
  makeDraggable(note, data);
  
  // 🔽 Remove this page from the sidebar (notebook)
  pages = pages.filter(p => p.id !== page.id);
  saveAll();
  renderPages();
}


addPage.onclick = () => {
  const colors = [
    "#ffccbc", // peach
    "#ffe0b2", // light orange
    "#fff9c4", // soft yellow
    "#f0f4c3", // pale lime
    "#c8e6c9", // mint green
    "#c5e1a5", // light green
    "#b2ebf2", // aqua
    "#b3e5fc", // baby blue
    "#d1ecf1", // ice blue
    "#e1f5fe", // cloud blue
    "#f8bbd0", // blush pink
    "#fce4ec", // rose
    "#e1bee7", // lavender
    "#d1c4e9", // soft violet
    "#ede7f6", // lilac
    "#f5f5dc", // cream
    "#fafafa", // paper white
    "#fdf1dc", // warm beige
    "#fffde7", // light butter
    "#f3e5ab"  // soft sand
    ];

  pages.push({
    id: pages.length + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    text: ""
  });
  saveAll();
  renderPages();
};

const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebar");

toggleSidebarBtn.onclick = () => {
  sidebar.classList.toggle("collapsed");
};

const openSidebarBtn = document.getElementById("openSidebarBtn");

toggleSidebarBtn.onclick = () => {
  sidebar.classList.toggle("collapsed");

  openSidebarBtn.style.display = sidebar.classList.contains("collapsed") ? "block" : "none";
};

openSidebarBtn.onclick = () => {
  sidebar.classList.remove("collapsed");
  openSidebarBtn.style.display = "none";
};




renderPages();
