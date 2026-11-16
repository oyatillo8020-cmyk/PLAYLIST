 const audio = document.getElementById('audio');
const $ = id => document.getElementById(id);

// Qo‘shiqlar ro‘yxati: mp3 fayllarni "music" papkasiga qo‘ying va shu yerga yozing
const tracks = [
  { name: "As It Was", url: "Harry Styles - As It Was (Official Video).mp3" },
  { name: "Eyes Without A Face", url: "Billy Idol - Eyes Without A Face.mp3" },
  { name: "The Less I Know The Better", url: "Tame Impala - The Less I Know The Better (Official Video).mp3" },
  { name: "Borderline", url: "Tame Impala - Borderline (Official Audio).mp3" },
  { name: "Let It Happen", url: "Tame Impala - Let It Happen (Official Video).mp3" },
  { name: "Loser", url: "Tame Impala - Loser (Official Video).mp3" },
  { name: "Dracula", url: "Tame Impala - Dracula (Official Video).mp3" },
  { name: "Ravyn Lenae - Love Me Not (Official Music Video).mp3", url: "Ravyn Lenae - Love Me Not (Official Music Video).mp3" },
  { name: "creless whisper", url: "VP6_tEYDQgc.mp3" },
];

let index = -1, shuffle = false, repeat = false;

const fmt = s => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return m + ':' + String(r).padStart(2, '0');
};

function render() {
  const ul = $('list');
  ul.innerHTML = '';
  tracks.forEach((t, i) => {
    const li = document.createElement('li');
    if (i === index) li.className = 'act';
    li.innerHTML = '<span></span><span></span>';
    li.children[0].textContent = t.name;
    li.children[1].textContent = i === index ? '♪' : '';
    li.onclick = () => load(i, true);
    ul.appendChild(li);
  });
}

function load(i, autoplay) {
  index = i;
  audio.src = tracks[i].url;
  $('title').textContent = tracks[i].name;
  $('sub').textContent = (i + 1) + ' / ' + tracks.length;
  render();
  if (autoplay) audio.play();
}

function toggle() {
  audio.paused ? audio.play() : audio.pause();
}

function next() {
  const n = shuffle ? Math.floor(Math.random() * tracks.length) : (index + 1) % tracks.length;
  load(n, true);
}

function prev() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  load((index - 1 + tracks.length) % tracks.length, true);
}

$('play').onclick = toggle;
$('next').onclick = next;
$('prev').onclick = prev;
$('shuffle').onclick = e => { shuffle = !shuffle; e.currentTarget.classList.toggle('on', shuffle); };
$('repeat').onclick = e => { repeat = !repeat; e.currentTarget.classList.toggle('on', repeat); };
$('vol').oninput = e => audio.volume = e.target.value;
audio.volume = 0.8;

$('seek').oninput = e => {
  if (audio.duration) audio.currentTime = e.target.value / 100 * audio.duration;
};

audio.onplay = () => { $('play').textContent = '⏸'; $('disc').classList.add('spin'); };
audio.onpause = () => { $('play').textContent = '▶'; $('disc').classList.remove('spin'); };
audio.onloadedmetadata = () => $('dur').textContent = fmt(audio.duration);
audio.ontimeupdate = () => {
  $('cur').textContent = fmt(audio.currentTime);
  if (audio.duration) $('seek').value = audio.currentTime / audio.duration * 100;
};
audio.onended = () => {
  if (repeat) { audio.currentTime = 0; audio.play(); }
  else if (shuffle || index < tracks.length - 1) next();
};

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'Space') { e.preventDefault(); toggle(); }
  if (e.code === 'ArrowRight') next();
  if (e.code === 'ArrowLeft') prev();
});

load(0, false);
