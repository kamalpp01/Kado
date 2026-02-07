onload = () => {
  document.body.classList.remove("container");

  const sound = document.getElementById("springSound");
  let soundPlayed = false;


  // === INTERAKSI BUNGA ===
  document.querySelectorAll('.flower, .flower__leaf, .flower__line__leaf').forEach(el => {
    el.addEventListener('click', (e) => {
      el.classList.add('shake');
      setTimeout(() => el.classList.remove('shake'), 400);

      // Cahaya bunga, 5–7 per klik
      const count = 5 + Math.floor(Math.random()*3);
      for (let i=0; i<count; i++){
        const light = document.createElement("div");
        light.className = "flower-light";
        light.style.left = e.pageX + (Math.random()*30-15) + "px";
        light.style.top = e.pageY + (Math.random()*30-15) + "px";
        light.style.background = ["#fffacd","#ffd700","#ffb6c1","#aee1ff"][Math.floor(Math.random()*4)];

        // Bisa diklik
        light.addEventListener("click", ()=>{
          light.style.background="#fffa6d";
          light.style.transform="scale(1.5)";
          setTimeout(()=>light.remove(),500);
        });

        document.body.appendChild(light);

        // Animasi ke atas acak
        const dx = (Math.random()*20-10) + "px";
        const dy = -(Math.random()*50+20) + "px";
        const rot = Math.random()*360 + "deg";

        light.animate([
          { transform:"translate(0,0) rotate(0deg)", opacity:1 },
          { transform:`translate(${dx},${dy}) rotate(${rot})`, opacity:0 }
        ], { duration: 1500 + Math.random()*500, easing:"ease-out" });

        setTimeout(()=>light.remove(),1800);
      }
    });
  });

// === KUNANG-KUNANG INTERAKTIF DENGAN TEKS RARE ===
const flower = document.querySelector('.flower'); // bunga
const fireflies = [];
const fireflyCount = 7;
let fireflyIndex = 0; // index kunang-kunang selanjutnya

const fireflyImages = [
  "img/kunang1.jpeg",
  "img/kunang2.jpeg",
  "img/kunang3.jpeg",
  "img/kunang4.jpeg",
  "img/kunang5.jpeg"
];

const fireflyColors = ["#fffb7d","#7dff7d","#7dffff","#ff7dff","#ff7d7d"];
const fireflyTexts = ["Wiii!","Yeee!","minion","jokowi","anies anies","tangkap gua","wisuda!!","valentin"];

// Buat kunang-kunang tapi sembunyi dulu di bunga
for (let i = 0; i < fireflyCount; i++) {
  const firefly = document.createElement("div");
  firefly.className = "firefly";

  const rect = flower.getBoundingClientRect();
  firefly.style.left = rect.left + "px";
  firefly.style.top = rect.top + "px";

  firefly.dataset.img = fireflyImages[i];
  firefly.style.background = fireflyColors[i];
  firefly.flying = false;
  firefly.dx = 0;
  firefly.dy = 0;

  document.body.appendChild(firefly);
  fireflies.push(firefly);

  firefly.addEventListener("click", (e) => {
    firefly.flying = false;

    const ffRect = firefly.getBoundingClientRect();
    const imgFrame = document.createElement("div");
    imgFrame.className = "firefly-frame";

    const img = document.createElement("img");
    img.src = firefly.dataset.img;
    imgFrame.appendChild(img);

    imgFrame.style.left = ffRect.left + "px";
    imgFrame.style.top = ffRect.top - 60 + "px";

    document.body.appendChild(imgFrame);

    const outsideClick = (ev) => {
      if (!imgFrame.contains(ev.target)) {
        imgFrame.remove();
        firefly.flying = true;
        firefly.dx = (Math.random() - 0.5) * 2;
        firefly.dy = (Math.random() - 0.5) * 2;
        document.removeEventListener("click", outsideClick);
      }
    };
    document.addEventListener("click", outsideClick);
    e.stopPropagation();
  });
}

function releaseNextFirefly() {
  if (fireflyIndex >= fireflies.length) return;
  const ff = fireflies[fireflyIndex];
  ff.flying = true;
  ff.dx = (Math.random() - 0.5) * 2;
  ff.dy = (Math.random() - 0.5) * 2;
  fireflyIndex++;
}

flower.addEventListener("click", () => {
  releaseNextFirefly();
});

// Animasi kunang-kunang terbang + kelap-kelip + teks jarang
function animateFireflies() {
  fireflies.forEach(ff => {
    if (!ff.flying) return;

    let x = parseFloat(ff.style.left);
    let y = parseFloat(ff.style.top);

    x += ff.dx;
    y += ff.dy;

    if (x < 0 || x > window.innerWidth - 5) ff.dx *= -1;
    if (y < 0 || y > window.innerHeight - 5) ff.dy *= -1;

    ff.style.left = x + "px";
    ff.style.top = y + "px";

    ff.style.opacity = 0.5 + Math.random() * 0.5;

    const trail = document.createElement("div");
    trail.className = "firefly-trail";
    trail.style.left = x + "px";
    trail.style.top = y + "px";
    trail.style.background = ff.style.background;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 500);

    // === Teks muncul lebih jarang ===
    if (Math.random() < 0.001) { // 1% chance per frame
      const text = document.createElement("div");
      text.className = "firefly-text";
      text.innerText = fireflyTexts[Math.floor(Math.random()*fireflyTexts.length)];
      text.style.left = x + "px";
      text.style.top = y - 10 + "px";
      text.style.color = ff.style.background;
      document.body.appendChild(text);
      text.animate([
        { transform: "translateY(0)", opacity: 1 },
        { transform: "translateY(-20px)", opacity: 0 }
      ], { duration: 1000, easing: "ease-out" });
      setTimeout(() => text.remove(), 1000);
    }

  });

  requestAnimationFrame(animateFireflies);
}
animateFireflies();

 // === HAMSTER ===
const hamster = document.querySelector(".hamster");
let hamsterPos = -50; // posisi awal di kanan (supaya mulai ke kiri)
let direction = -1;   // -1 = bergerak ke kiri

function moveHamster() {
  hamsterPos += 0.2 * direction;

  // jika kena batas kiri/kanan, balik arah
  if (hamsterPos > 40) direction = -1; // balik ke kiri
  if (hamsterPos < -80) direction = 1;   // balik ke kanan

  hamster.style.left = hamsterPos + "vmin";
  hamster.classList.toggle("hamster--flip", direction === -1);

  requestAnimationFrame(moveHamster);
}
moveHamster();

hamster.addEventListener("click", (e) => {
  // efek hop
  hamster.style.transform = "translateY(-2vmin)";
  setTimeout(() => hamster.style.transform = "translateY(0)", 200);

  // floating text lucu
  const texts = ["Hai cewee!", "cuhhh", "huhuu", "Whee!"];
  const text = document.createElement("div");
  text.className = "hamster-text";
  text.innerText = texts[Math.floor(Math.random() * texts.length)];

  const rect = hamster.getBoundingClientRect();
  text.style.left = rect.left + rect.width / 2 + "px";
  text.style.top = rect.top - 10 + "px";
  document.body.appendChild(text);
  setTimeout(() => text.remove(), 1200);

  // floating heart
  const heart = document.createElement("div");
  heart.innerText = "💛";
  heart.className = "floating-heart";
  heart.style.left = rect.left + rect.width / 2 + "px";
  heart.style.top = rect.top - 5 + "px";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1200);
});


 // === VALENTINE INTERAKTIF TERUS-MENERUS ===
const valentineContainer = document.createElement("div");
valentineContainer.id = "valentineContainer";
document.body.appendChild(valentineContainer);

// Tambahkan gambar laki-laki & perempuan
const valentineImg = document.createElement("img");
valentineImg.src = "img/palen.png"; // ganti dengan gambar kamu
valentineImg.id = "valentineImg";
valentineContainer.appendChild(valentineImg);

// Fungsi spawn love melayang
function spawnLove() {
  const love = document.createElement("div");
  love.className = "valentine-love";
  love.innerText = "❤️";

  const rect = valentineImg.getBoundingClientRect();

  // posisi random sekitar gambar
  love.style.left = rect.left + Math.random()*rect.width + "px";
  love.style.top = rect.top + Math.random()*rect.height + "px";

  document.body.appendChild(love);

  // animasi melayang ke atas dengan sedikit gerakan horizontal
  const dx = (Math.random() - 0.5) * 2; // kiri/kanan
  const dy = -(Math.random() * 2 + 1);  // ke atas

  love.animate([
    { transform: "translate(0,0)", opacity: 1 },
    { transform: `translate(${dx*50}px, ${dy*50}px)`, opacity: 0 }
  ], { duration: 3000, easing: "ease-out" });

  setTimeout(() => love.remove(), 3000);

  // spawn love lagi secara acak
  const delay = 500 + Math.random() * 500; // 0.5s - 1s delay
  setTimeout(spawnLove, delay);
}

// Mulai spawn love terus-menerus setelah load
spawnLove();

// Klik gambar → munculkan Happy Valentine (floating text)
valentineImg.addEventListener("click", (e) => {
  const text = document.createElement("div");
  text.className = "valentine-text";
  text.innerText = "Happy Valentine 💖";
  const rect = valentineImg.getBoundingClientRect();
  text.style.left = rect.left + rect.width/2 - 60 + "px";
  text.style.top = rect.top - 30 + "px";
  document.body.appendChild(text);

  text.animate([
    { transform: "translateY(0)", opacity: 0 },
    { transform: "translateY(-20px)", opacity: 1 },
    { transform: "translateY(-40px)", opacity: 0 }
  ], { duration: 2000, easing: "ease-out" });
  setTimeout(() => text.remove(), 2000);
});



  // === INTERAKSI BINTANG ===
  const frameContainer = document.getElementById("star-frame-container");

  document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", (e) => {
      e.stopPropagation(); // biar klik di bintang ga trigger document click
      frameContainer.innerHTML = ""; // hapus frame lama

      const imgSrc = star.getAttribute("data-img");
      if (!imgSrc) return;

      const frame = document.createElement("div");
      frame.className = "star-frame";

      const img = document.createElement("img");
      img.src = imgSrc;
      frame.appendChild(img);

      // posisikan frame tepat di bawah bintang
      const rect = star.getBoundingClientRect();
      frame.style.top = rect.bottom + 5 + "px";
      frame.style.left = rect.left + "px";

      frameContainer.appendChild(frame);
    });
  });

  // Klik di mana saja selain bintang → hapus frame
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("star")) {
      frameContainer.innerHTML = "";
    }
  });
// Klik bintang
document.querySelectorAll(".star").forEach(star => {
  star.addEventListener("click", (e) => {
    e.stopPropagation(); // biar klik di bintang ga trigger document click
    frameContainer.innerHTML = ""; // hapus frame lama

    const imgSrc = star.getAttribute("data-img");
    if (!imgSrc) return;

    const frame = document.createElement("div");
    frame.className = "star-frame";

    const img = document.createElement("img");
    img.src = imgSrc;
    frame.appendChild(img);

    // posisikan frame tepat di bawah bintang
    const rect = star.getBoundingClientRect();
    frame.style.top = rect.bottom + 5 + "px";
    frame.style.left = rect.left + "px";

    frameContainer.appendChild(frame);
  });
});
// === INTERAKSI BULAN ===
const moon = document.getElementById("moon");

moon.addEventListener("click", (e) => {
  let img = moon.querySelector(".moon-face");

  if (!img) {
    // Buat gambar jika belum ada
    img = document.createElement("img");
    img.src = "img/muka.png"; // ganti dengan file gambar kamu
    img.className = "moon-face";
    moon.appendChild(img);

    // Efek muncul perlahan
    setTimeout(() => img.style.opacity = 0.3, 50); // samar
  } else {
    // Toggle: jika sudah ada, hapus
    moon.removeChild(img);
  }

  // Sparkle efek
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = e.pageX + (Math.random() * 40 - 20) + "px";
    sparkle.style.top = e.pageY + (Math.random() * 40 - 20) + "px";
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }

  // Floating text lucu
  const text = document.createElement("div");
  text.className = "hamster-text";
  text.innerText = "Wajah 🌙";
  text.style.left = e.pageX + "px";
  text.style.top = e.pageY - 10 + "px";
  document.body.appendChild(text);
  setTimeout(() => text.remove(), 1200);
});


// === INTERAKSI AWAN ===
document.querySelectorAll(".cloud").forEach(cloud => {
  cloud.addEventListener("click", (e) => {

    // Floating text lucu
    const text = document.createElement("div");
    text.className = "hamster-text";
    const messages = ["hujan!", "Ini Hujan!", "pakyu"];
    text.innerText = messages[Math.floor(Math.random()*messages.length)];

    // posisi text di atas awan
    const rect = cloud.getBoundingClientRect();
    text.style.left = rect.left + rect.width/2 + "px";
    text.style.top = rect.top - 10 + "px";

    document.body.appendChild(text);
    setTimeout(() => text.remove(), 1200);

    // Hujan air kecil dari awan
    for (let i = 0; i < 10; i++) {
      const drop = document.createElement("div");
      drop.className = "raindrop";
      
      // posisi drop random di atas awan
      drop.style.left = rect.left + Math.random() * rect.width + "px";
      drop.style.top = rect.bottom + "px";

      document.body.appendChild(drop);
      setTimeout(() => drop.remove(), 1000);
    }

    // Sparkle kecil
    for (let i = 0; i < 5; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = rect.left + Math.random()*rect.width + "px";
      sparkle.style.top = rect.top + Math.random()*rect.height + "px";
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }
  });
});
// Ambil semua awan kecuali awan pertama (Goku)
document.querySelectorAll('.cloud--2, .cloud--3, .cloud--4').forEach(cloud => {
  cloud.addEventListener('click', (e) => {

    const rect = cloud.getBoundingClientRect();

    // === Sparkle di klik ===
    for(let i=0; i<5; i++) { // 5 sparkle per klik
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = rect.left + Math.random()*rect.width + "px";
      sparkle.style.top = rect.top + Math.random()*rect.height + "px";
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }

    // === Hujan air ===
    for(let i=0; i<10; i++) { // 10 hujan per klik
      const drop = document.createElement("div");
      drop.className = "raindrop";
      drop.style.left = rect.left + Math.random()*rect.width + "px";
      drop.style.top = rect.top + "px"; // mulai dari atas awan
      document.body.appendChild(drop);
      setTimeout(() => drop.remove(), 1000);
    }

  });
});
// === INTERAKSI PIANO PLAYER + Not musik terus-menerus ===
const piano = document.getElementById("pianoPlayer");
const springSound = document.getElementById("springSound");

let notesActive = false; // kontrol not musik

// Fungsi buat not musik
function createFloatingNote() {
  if (!notesActive) return;

  const notes = ["🎵","🎶","♩","♪"];
  const colors = ["#ffef7d", "#ff7d7d", "#7dfff5", "#ff7dff"];
  const note = document.createElement("div");
  note.className = "floating-note";
  note.innerText = notes[Math.floor(Math.random() * notes.length)];
  note.style.color = colors[Math.floor(Math.random() * colors.length)];

  // posisi random di atas piano
  const pianoRect = piano.getBoundingClientRect();
  note.style.left = pianoRect.left + Math.random() * pianoRect.width + "px";
  note.style.top = pianoRect.top - 20 + Math.random() * 10 + "px";

  // arah melayang random ke kiri/kanan
  const dx = (Math.random() - 0.5) * 2; // -1 .. 1
  note.style.setProperty('--dx', dx + "vmin");

  document.body.appendChild(note);

  setTimeout(() => note.remove(), 2000);

  // Tambah sparkle di sekitar not
  if (Math.random() < 0.5) { // 50% chance
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = parseFloat(note.style.left) + Math.random()*2 + "px";
    sparkle.style.top = parseFloat(note.style.top) + Math.random()*2 + "px";
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }
}

// Spawn not terus random
function spawnNotesRandomly() {
  createFloatingNote();
  const delay = 300 + Math.random() * 500; // 0.3s - 0.8s
  setTimeout(spawnNotesRandomly, delay);
}

// Klik piano
piano.addEventListener("click", (e) => {
  springSound.volume = 0.4;
  springSound.play();

  // Aktifkan not musik
  if (!notesActive) {
    notesActive = true;
    spawnNotesRandomly();
  }
});

};
