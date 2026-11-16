const monoFont = 'ui-monospace, SFMono-Regular, Menlo, monospace';

const svg = (name, body, viewBox = '0 0 480 270') =>
  `<svg xmlns="http://www.w3.org/2000/svg" class="project-visual project-visual-${name}" viewBox="${viewBox}" fill="none">${body}</svg>`;

const label = (x, y, text, color, size = 20, anchor = 'start') =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="${monoFont}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;

const torrentRoutes = [
  'M80 72L240 134',
  'M80 174L240 134',
  'M400 72L240 134',
  'M400 174L240 134',
];

const torrentPeer = (x, y, name) => `
  <rect x="${x}" y="${y}" width="112" height="40" rx="8" fill="#202e3e" stroke="#53697c"/>
  ${label(x + 56, y + 27, name, '#dce9f2', 20, 'middle')}`;

const torrentPackets = torrentRoutes.map((path, index) => `
  <g>
    <circle r="2.9" fill="#e1f1ff"/>
    <animateMotion path="${path}" dur="${1.8 + index * .3}s" begin="${-index * .55}s" repeatCount="indefinite"/>
  </g>`).join('');

const torrentProgress = `
  ${label(240, 225, 'Receiving pieces', '#a8c1d8', 20, 'middle')}
  <g transform="translate(150 239)">
    <rect width="180" height="5" rx="2.5" fill="#2b3b4c"/>
    <g class="torrent-progress project-visual-progress" transform="scale(.0444444444 1)">
      <animateTransform attributeName="transform" type="scale" values=".0444444444 1;1 1;1 1;.0444444444 1"
        keyTimes="0;.82;.94;1" dur="7s" repeatCount="indefinite"/>
      <rect width="180" height="5" rx="2.5" fill="#9bc4e5"/>
    </g>
  </g>`;

const torrentArtwork = `
  <g stroke="#536d84" stroke-width="1.5">
    ${torrentRoutes.map((path) => `<path d="${path}"/>`).join('')}
    <path d="M240 134V57"/>
    <path d="M80 72v102m320-102v102" stroke-dasharray="4 7" opacity=".5"/>
  </g>
  ${torrentPackets}
  ${torrentPeer(24, 52, 'peer_01')}
  ${torrentPeer(24, 154, 'peer_02')}
  ${torrentPeer(344, 52, 'peer_03')}
  ${torrentPeer(344, 154, 'peer_04')}
  <circle cx="240" cy="134" r="41" fill="#293c50" stroke="#83a3bc"/>
  <path d="M240 114v30m-11-11 11 11 11-11M225 154h30" stroke="#c9e0f2" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  ${label(240, 48, 'Tracker', '#d6e8f4', 20, 'middle')}
  ${torrentProgress}`;

const databaseRoutes = [
  'M276 98H312Q324 98 324 110V136Q324 148 336 148H502Q518 148 518 164V255Q518 267 506 267H310Q298 267 298 255V224Q298 212 310 212H357',
  'M421 133V145Q421 157 409 157H94Q78 157 78 173V222Q78 234 90 234H118',
  'M197 133V150Q197 166 213 166H290Q306 166 306 150V51Q306 39 318 39H500Q512 39 512 51V88Q512 100 500 100H485',
  'M276 215H284Q296 215 296 203V185Q296 173 308 173H334Q346 173 346 185V203Q346 215 357 215',
  'M421 249V256Q421 272 405 272H107Q91 272 91 256V52Q91 40 103 40H243Q255 40 255 52V65',
  'M357 95H343Q331 95 331 83V61Q331 49 319 49H235Q223 49 223 61V65',
];
const databasePacket = '<circle r="3.1" fill="#c8ecfd"/>';
const databaseConnections = `<g stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35">${databaseRoutes.map((path, i) => `<path d="${path}" stroke="${i % 2 ? '#476375' : '#6d8b9a'}" opacity="${i % 2 ? '.65' : '.78'}"/>`).join('')}</g>
  <g class="database-live-packets">${databaseRoutes.map((path, i) => `<g>${databasePacket}<animateMotion path="${path}" dur="${7 + i * .8}s" begin="${-1.5 - i * 1.7}s" repeatCount="indefinite" calcMode="paced"/></g>`).join('')}</g>
  <g class="database-still-packets">${[[518, 192], [160, 157], [306, 78], [346, 190], [91, 218], [278, 49]].map(([x, y]) => `<g transform="translate(${x} ${y})">${databasePacket}</g>`).join('')}</g>`;

const databaseNodes = [
  { x: 118, y: 65, width: 158, name: 'patients', fields: 'id · name · age' },
  { x: 357, y: 65, width: 128, name: 'doctors', fields: 'id · name' },
  { x: 118, y: 181, width: 158, name: 'appointments', fields: 'patient_id' },
  { x: 357, y: 181, width: 128, name: 'records', fields: 'id · status' },
];

const databasePorts = [
  [276, 98], [421, 133], [197, 133], [485, 100], [276, 215], [357, 215],
  [421, 249], [255, 65], [357, 95], [223, 65], [118, 234], [357, 212],
];

const databaseArtwork = `
  ${databaseConnections}
  ${databaseNodes.map(({ x, y, width, name, fields }) => `
    <rect x="${x}" y="${y}" width="${width}" height="68" rx="10" fill="#253747" stroke="#5e7d91"/>
    ${label(x + width / 2, y + 36, name, '#daeaf5', 20, 'middle')}
    <g class="project-visual-detail">${label(x + width / 2, y + 56, fields, '#a6becd', 16, 'middle')}</g>`).join('')}
  <g fill="#92b2c5" stroke="#253747" stroke-width="1.5">
    ${databasePorts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5"/>`).join('')}
  </g>`;

const judgeStatus = (y, index) => {
  const runningAt = [.12, .26, .4][index];
  const acceptedAt = [.3, .48, .66][index];
  const iconY = y - 7;
  return `
    <g opacity="1">
      <animate attributeName="opacity" values="1;0;0" keyTimes="0;${runningAt};1"
        dur="9s" repeatCount="indefinite" calcMode="discrete"/>
      <circle cx="278" cy="${iconY}" r="6" stroke="#d0b67a" stroke-width="1.5"/>
      <path d="M278 ${iconY - 3}v3l2 1" stroke="#d0b67a" stroke-width="1.4" stroke-linecap="round"/>
      ${label(302, y, 'Queued', '#dbca9e')}
    </g>
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;0;0" keyTimes="0;${runningAt};${acceptedAt};1"
        dur="9s" repeatCount="indefinite" calcMode="discrete"/>
      <g transform="translate(278 ${iconY})">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0;360"
            dur="1.5s" repeatCount="indefinite"/>
          <circle r="6" stroke="#9abed7" stroke-width="1.7" stroke-dasharray="24 14"/>
        </g>
      </g>
      ${label(302, y, 'Running', '#b6d4e7')}
    </g>
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;1" keyTimes="0;${acceptedAt};1"
        dur="9s" repeatCount="indefinite" calcMode="discrete"/>
      <path d="m271 ${iconY} 5 5 10-12" stroke="#9bd0b4" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
      ${label(302, y, 'Accepted', '#b5dfc9')}
    </g>`;
};

const judgeArtwork = `
  <rect x="28" y="36" width="424" height="198" rx="12" fill="#202e3c" stroke="#5b7284"/>
  <path d="M28 79h424M28 129h424M28 179h424M244 79v155" stroke="#42596b"/>
  ${label(52, 65, 'Submissions', '#d4e4ef', 22)}
  ${['solution.cpp', 'solution.py', 'solution.go'].map((name, index) => {
    const y = 112 + index * 50;
    return label(52, y, name, '#c9dce9') + judgeStatus(y, index);
  }).join('')}`;

const unoKeys = '0;.08;.25;.5;.58;.75;1';
const unoEase = Array(6).fill('.4 0 .2 1').join(';');
const unoCard = (blue) => `<rect width="124" height="178" rx="15" fill="${blue ? '#294b68' : '#634254'}" stroke="${blue ? '#7397b3' : '#a48296'}"/><ellipse cx="62" cy="89" rx="40" ry="64" stroke="${blue ? '#9fb9d0' : '#d3b3c4'}" opacity=".5"/><text x="62" y="89" text-anchor="middle" dominant-baseline="central" fill="${blue ? '#e3eefa' : '#f3e2ec'}" font-family="${monoFont}" font-size="${blue ? 30 : 42}">${blue ? 'UNO' : '+4'}</text>`;
const unoMovingCard = (blue, frontCopy = false) => {
  const translations = blue ? '177 58;177 58;130 62;272 51;272 51;330 45;177 58' : '272 51;272 51;330 45;177 58;177 58;130 62;272 51';
  const rotations = blue ? '-18 62 89;-18 62 89;-22 62 89;14 62 89;14 62 89;18 62 89;-18 62 89' : '14 62 89;14 62 89;18 62 89;-18 62 89;-18 62 89;-22 62 89;14 62 89';
  const depth = blue ? `<animate attributeName="opacity" values="${frontCopy ? '0;1;0;0' : '1;0;1;1'}" keyTimes="0;.25;.75;1" dur="8s" repeatCount="indefinite" calcMode="discrete"/>` : '';
  return `<g opacity="${frontCopy ? 0 : 1}">${depth}<g transform="translate(${blue ? '177 58' : '272 51'})"><animateTransform attributeName="transform" type="translate" values="${translations}" keyTimes="${unoKeys}" keySplines="${unoEase}" calcMode="spline" dur="8s" repeatCount="indefinite"/><g transform="rotate(${blue ? -18 : 14} 62 89)"><animateTransform attributeName="transform" type="rotate" values="${rotations}" keyTimes="${unoKeys}" keySplines="${unoEase}" calcMode="spline" dur="8s" repeatCount="indefinite"/>${unoCard(blue)}</g></g></g>`;
};

// The two blue copies exchange paint order only when the cards are separated.
const unoArtwork = unoMovingCard(true) + unoMovingCard(false) + unoMovingCard(true, true);

const hashCandidates = [
  ['r7m2p4a', '6a8df521'],
  ['k9b3v7s', 'ceadd42d'],
  ['m2a8q5z', '6ce57884'],
  ['x4p6n1c', '04344d54'],
  ['b8t3w7e', '5005877f'],
  ['q5d9h2u', '14fd127d'],
  ['n3c6s8k', '88c66750'],
  ['v1f4j7r', 'a5f36d1e']
];
const hashFrameTimes = Array.from(
  { length: hashCandidates.length + 1 },
  (_, frame) => frame / hashCandidates.length,
).join(';');

const hashCandidateFrames = (x, y, column, color, size) => hashCandidates.map((row, index) => {
  const visibility = Array.from({ length: hashCandidates.length + 1 }, (_, frame) => frame % hashCandidates.length === index ? 1 : 0).join(';');
  return `<text x="${x}" y="${y}" fill="${color}" font-family="${monoFont}" font-size="${size}" opacity="${index === 0 ? 1 : 0}">${row[column]}<animate attributeName="opacity" values="${visibility}" keyTimes="${hashFrameTimes}" dur="4s" repeatCount="indefinite" calcMode="discrete"/></text>`;
}).join('');

const hashArtwork = `
  <path d="M162 150h22m112 0h22M240 108V82m0 110v26" stroke="#667f96" stroke-width="1.5"/>
  <rect x="24" y="108" width="138" height="84" rx="9" fill="#243242" stroke="#5b7287"/>
  <rect x="184" y="108" width="112" height="84" rx="11" fill="#2d4054" stroke="#87a2ba"/>
  <rect x="318" y="108" width="138" height="84" rx="9" fill="#243242" stroke="#5b7287"/>
  ${label(40, 136, 'Input', '#adc1d3')}
  ${hashCandidateFrames(40, 172, 0, '#e4eff8', 20)}
  ${label(240, 158, 'SHA-1', '#dae9f6', 22, 'middle')}
  ${label(334, 136, 'Digest', '#adc1d3')}
  ${hashCandidateFrames(334, 172, 1, '#d6e6f3', 20)}
  ${label(240, 64, 'Threads', '#adc1d3', 20, 'middle')}
  ${label(240, 246, 'Processes', '#adc1d3', 20, 'middle')}
  <g fill="#819bb2">
    <circle cx="200" cy="82" r="2.5"/><circle cx="220" cy="82" r="2.5"/><circle cx="240" cy="82" r="2.5"/>
    <circle cx="260" cy="82" r="2.5"/><circle cx="280" cy="82" r="2.5"/>
  </g>`;

const spaceStars = [
  [128, 70, 1.5, 2.6, .35], [444, 65, 1.8, 3.8, .5],
  [361, 221, 1.5, 4.4, .28], [209, 224, 1.5, 3.1, .4],
  [488, 190, 1.5, 4.8, .3], [301, 53, 1.8, 2.9, .5],
  [87, 181, 1.8, 4.1, .42],
];
const spaceStarField = spaceStars.map(([x, y, radius, duration, base], index) => `
  <circle cx="${x}" cy="${y}" r="${radius}" fill="#a7bbd7" opacity="${base}">
    <animate attributeName="opacity" values="${base};${base + .12};${base}" keyTimes="0;.5;1"
      dur="${duration}s" begin="${-index * .47}s" repeatCount="indefinite" calcMode="spline"
      keySplines=".4 0 .6 1;.4 0 .6 1"/>
  </circle>`).join('');

const spaceLaser = (path, color, offset) => `<g class="space-laser" opacity="0"><animateMotion path="${path}" keyPoints="0;1;1" keyTimes="0;.45;1" calcMode="linear" dur="1.6s" begin="${offset}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.04;.4;.45;1" calcMode="linear" dur="1.6s" begin="${offset}s" repeatCount="indefinite"/><path d="M-7 0h14" stroke="${color}" stroke-width="2.1" stroke-linecap="round"/><path d="M-4 0h8" stroke="#f1f6ff" stroke-width=".7" stroke-linecap="round"/></g>`;
const spaceMuzzle = (x, y, color, offset) => `<circle cx="${x}" cy="${y}" r="4" fill="${color}" opacity="0"><animate attributeName="opacity" values="0;.75;0;0" keyTimes="0;.05;.15;1" dur=".8s" begin="${offset}s" repeatCount="indefinite"/></circle>`;
const spaceShip = (x, angle, fill, stroke) => `<g class="space-ship" transform="translate(${x} 145) rotate(${angle})"><path d="M-19-16 26 0-19 16-9 0Z" fill="${fill}" stroke="${stroke}" stroke-linejoin="round"/><path d="M-12-6-3 0-12 6" stroke="${stroke}" stroke-width="1" opacity=".5"/></g>`;
const spaceOrbitTimes = '0;.12;.32;.48;.62;.8;.9;1';
const spaceBlueAngles = [0, 70, 230, 265, 355, 485, 535, 720];
const spacePurpleAngles = [0, 70, 110, 265, 355, 590, 640, 720];
const spaceOrbitEase = '.35 0 .65 1;.25 0 .55 1;.45 0 .8 1;.35 0 .65 1;.2 0 .7 1;.35 0 .65 1;.25 0 .8 1';
const spaceOrbitMotion = (angles) => `<animateTransform attributeName="transform" type="rotate" values="${angles.map(angle => `${angle} 300 145`).join(';')}" keyTimes="${spaceOrbitTimes}" keySplines="${spaceOrbitEase}" calcMode="spline" dur="20s" repeatCount="indefinite"/>`;
// Fire only inside phases where both angles match and the ships face each other.
const spaceCrossfire = `<g class="space-fire-window" opacity="0"><animate attributeName="opacity" values="0;1;0;1;0;0" keyTimes="0;.015;.115;.49;.615;1" calcMode="discrete" dur="20s" repeatCount="indefinite"/><g>${spaceOrbitMotion(spaceBlueAngles)}${spaceLaser('M248 143H350', '#a6ceff', 0)}${spaceLaser('M248 143H350', '#a6ceff', -.8)}${spaceLaser('M352 147H250', '#b8c5dd', -.4)}${spaceLaser('M352 147H250', '#b8c5dd', -1.2)}${spaceMuzzle(245, 143, '#d0e7ff', 0)}${spaceMuzzle(355, 147, '#d3dcec', -.4)}</g></g>`;
const spaceArtwork = `
  ${spaceStarField}
  <circle cx="300" cy="145" r="81" stroke="#567086" stroke-dasharray="4 8"/>
  <g class="space-orbit space-orbit-blue">
    ${spaceOrbitMotion(spaceBlueAngles)}
    ${spaceShip(219, 0, '#729db9', '#c6e4f4')}
  </g>
  <g class="space-orbit space-orbit-purple">
    ${spaceOrbitMotion(spacePurpleAngles)}
    ${spaceShip(381, 180, '#8f98aa', '#dbe0ed')}
  </g>
  ${spaceCrossfire}
  <circle cx="132" cy="263" r="3" fill="#9fbbe5"/>
  ${label(144, 270, 'player_01', '#b6c8e4')}
  <circle cx="349" cy="263" r="3" fill="#afbdd2"/>
  ${label(361, 270, 'player_02', '#c1cde0')}`;

export const projectArt = {
  torrent: svg('torrent', torrentArtwork),
  judge: svg('judge', judgeArtwork),
  uno: svg('uno', unoArtwork, '60 10 480 270'),
  database: svg('database', databaseArtwork, '60 12 480 270'),
  hash: svg('hash', hashArtwork),
  space: svg('space', spaceArtwork, '60 10 480 270'),
};
