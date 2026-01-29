
    // --- Game Data ---
    const words = ['apple','car','house','tree','phone','cat','book','sun','chair','bottle'];
    let players = [];
    let currentDrawer = 0;
    let currentWord = '';
    let roundActive = false;
    let startTime = 0;

    // --- Canvas Setup ---
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    canvas.addEventListener('mousedown', () => drawing = true);
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseleave', () => drawing = false);
    canvas.addEventListener('mousemove', draw);

    function draw(e) {
      if (!drawing || !roundActive) return;
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --- Players ---
    function addPlayer() {
      const name = document.getElementById('playerName').value.trim();
      if (!name) return;
      players.push({ name, score: 0 });
      document.getElementById('playerName').value = '';
      renderPlayers();
      if (players.length >= 2 && !roundActive) startRound();
    }

    function renderPlayers() {
      document.getElementById('players').innerHTML =
        '<strong>Players:</strong><br>' +
        players.map((p, i) =>
          `<span class="badge">${i === currentDrawer ? '🎨 ' : ''}${p.name}</span>`
        ).join('');
      renderScores();
    }

    function renderScores() {
      document.getElementById('scores').innerHTML =
        '<strong>Scores:</strong><br>' +
        players.map(p => `${p.name}: ${p.score}`).join('<br>');
    }

    // --- Game Flow ---
    function startRound() {
      clearCanvas();
      currentWord = words[Math.floor(Math.random() * words.length)];
      roundActive = true;
      startTime = Date.now();
      document.getElementById('status').innerText =
        `🎯 ${players[currentDrawer].name} is drawing | Others guess!`;
      alert(`Drawer word: ${currentWord}`); // pass-the-device
      renderPlayers();
    }

    function submitGuess() {
      if (!roundActive) return;
      const guess = document.getElementById('guessInput').value.trim().toLowerCase();
      document.getElementById('guessInput').value = '';
      if (guess === currentWord) {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        const points = Math.max(10 - timeTaken, 1);
        players.forEach((p, i) => {
          if (i !== currentDrawer) p.score += points;
        });
        document.getElementById('status').innerText = `✅ Correct! Word was "${currentWord}"`;
        endRound();
      }
    }

    function endRound() {
      roundActive = false;
      currentDrawer = (currentDrawer + 1) % players.length;
      renderScores();
      setTimeout(startRound, 1000);
    }
  