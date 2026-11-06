const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 290" fill="none">${body}</svg>`;
const label = (x, y, text, color = '#aaacc2', size = 12) => `<text x="${x}" y="${y}" fill="${color}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="${size}">${text}</text>`;
const node = (x, y, text) => `<rect x="${x}" y="${y}" width="92" height="38" rx="9" fill="#212335" stroke="#43405b"/>${label(x + 14, y + 24, text)}`;

const torrentRoutes = [
  'M176 88L300 145', 'M176 202L300 145',
  'M424 88L300 145', 'M424 202L300 145',
];
const torrentPackets = `<g>${torrentRoutes.map((path, i) => `<g><circle r="7" fill="#bda0f0" opacity=".16"/><circle r="2.7" fill="#e6d8ff"/><animateMotion path="${path}" dur="${1.8 + i * .3}s" begin="${-i * .55}s" repeatCount="indefinite"/></g>`).join('')}</g>`;
const torrentProgress = `<rect x="210" y="259" width="180" height="5" rx="2.5" fill="#40324f"/><rect class="torrent-progress" x="210" y="259" width="8" height="5" rx="2.5" fill="#bda0eb"><animate attributeName="width" values="8;180;180;8" keyTimes="0;.82;.94;1" dur="7s" repeatCount="indefinite"/></rect>${label(210, 249, 'receiving pieces', '#9e8ab9', 9)}`;

const databaseRoutes = [
  'M276 98H312Q324 98 324 110V136Q324 148 336 148H502Q518 148 518 164V255Q518 267 506 267H310Q298 267 298 255V224Q298 212 310 212H357',
  'M421 133V145Q421 157 409 157H94Q78 157 78 173V222Q78 234 90 234H118',
  'M197 133V150Q197 166 213 166H290Q306 166 306 150V51Q306 39 318 39H500Q512 39 512 51V88Q512 100 500 100H485',
  'M276 215H284Q296 215 296 203V185Q296 173 308 173H334Q346 173 346 185V203Q346 215 357 215',
  'M421 249V256Q421 272 405 272H107Q91 272 91 256V52Q91 40 103 40H243Q255 40 255 52V65',
  'M357 95H343Q331 95 331 83V61Q331 49 319 49H235Q223 49 223 61V65',
];
const databasePacket = '<circle r="9" fill="#a7f5cc" opacity=".1"/><circle r="4.5" fill="#99efc5" opacity=".38"/><circle r="2.3" fill="#e1ffed"/>';
const databaseConnections = `<g stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35">${databaseRoutes.map((path, i) => `<path d="${path}" stroke="${i % 2 ? '#527e77' : '#6aa894'}" opacity="${i % 2 ? '.65' : '.78'}"/>`).join('')}</g>
  <g class="database-live-packets">${databaseRoutes.map((path, i) => `<g>${databasePacket}<animateMotion path="${path}" dur="${7 + i * .8}s" begin="${-1.5 - i * 1.7}s" repeatCount="indefinite" calcMode="paced"/></g>`).join('')}</g>
  <g class="database-still-packets">${[[518, 192], [160, 157], [306, 78], [346, 190], [91, 218], [278, 49]].map(([x, y]) => `<g transform="translate(${x} ${y})">${databasePacket}</g>`).join('')}</g>`;

const judgeStatus = (y, index) => {
  const runningAt = [.12, .26, .4][index];
  const acceptedAt = [.3, .48, .66][index];
  const queued = `<g opacity="1"><animate attributeName="opacity" values="1;0;0" keyTimes="0;${runningAt};1" dur="9s" repeatCount="indefinite" calcMode="discrete"/><circle cx="300" cy="${y - 4}" r="5" stroke="#c3a76e" stroke-width="1.5"/><path d="M300 ${y - 7}v3l2 1" stroke="#c3a76e" stroke-width="1.4" stroke-linecap="round"/>${label(329, y, 'Queued', '#c8b784')}</g>`;
  const running = `<g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0;${runningAt};${acceptedAt};1" dur="9s" repeatCount="indefinite" calcMode="discrete"/><g transform="translate(300 ${y - 4})"><g><animateTransform attributeName="transform" type="rotate" values="0;360" dur="1.5s" repeatCount="indefinite"/><circle r="5" stroke="#90b8d1" stroke-width="1.7" stroke-dasharray="20 12"/></g></g>${label(329, y, 'Running', '#a8cadf')}</g>`;
  const accepted = `<g opacity="0"><animate attributeName="opacity" values="0;1;1" keyTimes="0;${acceptedAt};1" dur="9s" repeatCount="indefinite" calcMode="discrete"/><path d="m293 ${y - 4} 5 5 10-12" stroke="#7bbca6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>${label(329, y, 'Accepted', '#98d0b9')}</g>`;
  return queued + running + accepted;
};

const judgeArtwork = `<rect x="109" y="44" width="382" height="205" rx="12" fill="#1a2330" stroke="#344a5c"/><path d="M109 80h382M265 80v169" stroke="#344a5c"/><g fill="#789ab2"><circle cx="128" cy="62" r="3"/><circle cx="140" cy="62" r="3"/><circle cx="152" cy="62" r="3"/></g>${label(178, 66, 'CampusJudge', '#bbd2e3')}${label(131, 110, 'SUBMISSIONS', '#7e9eb6', 10)}${label(131, 142, 'solution.cpp', '#b5c8db')}${label(131, 174, 'solution.py', '#b5c8db')}${label(131, 206, 'solution.go', '#b5c8db')}${[141, 173, 205].map(judgeStatus).join('')}`;

const unoKeys = '0;.08;.25;.5;.58;.75;1';
const unoEase = Array(6).fill('.4 0 .2 1').join(';');
const unoCard = (blue) => `<rect width="124" height="178" rx="15" fill="${blue ? '#333b70' : '#68455e'}" stroke="${blue ? '#777ab6' : '#b37a9c'}"/><ellipse cx="62" cy="89" rx="40" ry="64" stroke="${blue ? '#aaa6d4' : '#e4b8d1'}" opacity=".5"/><text x="62" y="89" text-anchor="middle" dominant-baseline="central" fill="${blue ? '#d8d5ef' : '#f0d9e8'}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="${blue ? 30 : 42}">${blue ? 'UNO' : '+4'}</text>`;
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
const hashCandidateFrames = (x, y, column, color, size) => hashCandidates.map((row, index) => {
  const visibility = Array.from({ length: hashCandidates.length + 1 }, (_, frame) => frame % hashCandidates.length === index ? 1 : 0).join(';');
  return `<text x="${x}" y="${y}" fill="${color}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="${size}" opacity="${index === 0 ? 1 : 0}">${row[column]}<animate attributeName="opacity" values="${visibility}" keyTimes="0;.125;.25;.375;.5;.625;.75;.875;1" dur="4s" repeatCount="indefinite" calcMode="discrete"/></text>`;
}).join('');

const hashArtwork = `<g stroke="#635467" stroke-width="1.3"><path d="M217 145h23m120 0h25M300 103V77m0 111v26"/></g><rect x="80" y="104" width="137" height="82" rx="10" fill="#29232e" stroke="#66516e"/><path d="M80 126h137" stroke="#4d4055"/><g fill="#9e83a8"><circle cx="94" cy="115" r="2"/><circle cx="102" cy="115" r="2"/><circle cx="110" cy="115" r="2"/></g>${label(138, 118, 'input', '#a993b1', 9)}${hashCandidateFrames(94, 159, 0, '#e4c9e5', 17)}<rect x="240" y="103" width="120" height="85" rx="13" fill="#362b38" stroke="#9d7c9a"/>${label(263, 152, 'SHA-1', '#dfbed8', 21)}<rect x="385" y="124" width="130" height="42" rx="8" fill="#2b242e" stroke="#725a76"/>${label(395, 114, 'digest', '#ad93b1', 10)}${hashCandidateFrames(396, 151, 1, '#cab6d3', 14)}${label(251, 65, 'threads', '#b39aaf')}${label(246, 241, 'processes', '#b39aaf')}<g fill="#a486aa"><circle cx="231" cy="77" r="3"/><circle cx="251" cy="77" r="3"/><circle cx="271" cy="77" r="3"/><circle cx="329" cy="77" r="3"/><circle cx="349" cy="77" r="3"/><circle cx="369" cy="77" r="3"/></g>`;

const spaceStars = [
  [128, 70, 1.5, 2.6, .35], [444, 65, 1.8, 3.8, .5],
  [361, 221, 1.5, 4.4, .28], [209, 224, 1.5, 3.1, .4],
  [488, 190, 1.5, 4.8, .3], [301, 53, 1.8, 2.9, .5],
  [87, 181, 1.8, 4.1, .42],
];
const spaceStarField = spaceStars.map(([x, y, radius, duration, base], index) => `<g opacity="${base}"><circle cx="${x}" cy="${y}" r="${radius + 3}" fill="#a2b7db" opacity=".1"/><circle cx="${x}" cy="${y}" r="${radius}" fill="#bdcdef"/>${radius > 1.5 ? `<path d="M${x - 4} ${y}h8m-4-4v8" stroke="#c3d5f0" stroke-width=".7"/>` : ''}<animate attributeName="opacity" values="${base};.95;${base}" keyTimes="0;.5;1" dur="${duration}s" begin="${-index * .47}s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1"/></g>`).join('');
const spaceLaser = (path, color, offset) => `<g class="space-laser" opacity="0"><animateMotion path="${path}" keyPoints="0;1;1" keyTimes="0;.45;1" calcMode="linear" dur="1.6s" begin="${offset}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.04;.4;.45;1" calcMode="linear" dur="1.6s" begin="${offset}s" repeatCount="indefinite"/><circle r="5" fill="${color}" opacity=".12"/><path d="M-7 0h14" stroke="${color}" stroke-width="2.1" stroke-linecap="round"/><path d="M-4 0h8" stroke="#f1f3ff" stroke-width=".7" stroke-linecap="round"/></g>`;
const spaceMuzzle = (x, y, color, offset) => `<circle cx="${x}" cy="${y}" r="4" fill="${color}" opacity="0"><animate attributeName="opacity" values="0;.75;0;0" keyTimes="0;.05;.15;1" dur=".8s" begin="${offset}s" repeatCount="indefinite"/></circle>`;
const spaceShip = (x, angle, fill, stroke) => `<g class="space-ship" transform="translate(${x} 145) rotate(${angle})"><path d="M-19-16 26 0-19 16-9 0Z" fill="${fill}" stroke="${stroke}" stroke-linejoin="round"/><path d="M-12-6-3 0-12 6" stroke="${stroke}" stroke-width="1" opacity=".5"/></g>`;
const spaceOrbitTimes = '0;.12;.32;.48;.62;.8;.9;1';
const spaceBlueAngles = [0, 70, 230, 265, 355, 485, 535, 720];
const spacePurpleAngles = [0, 70, 110, 265, 355, 590, 640, 720];
const spaceOrbitEase = '.35 0 .65 1;.25 0 .55 1;.45 0 .8 1;.35 0 .65 1;.2 0 .7 1;.35 0 .65 1;.25 0 .8 1';
const spaceOrbitMotion = (angles) => `<animateTransform attributeName="transform" type="rotate" values="${angles.map(angle => `${angle} 300 145`).join(';')}" keyTimes="${spaceOrbitTimes}" keySplines="${spaceOrbitEase}" calcMode="spline" dur="20s" repeatCount="indefinite"/>`;
// Fire only inside phases where both angles match and the ships face each other.
const spaceCrossfire = `<g class="space-fire-window" opacity="0"><animate attributeName="opacity" values="0;1;0;1;0;0" keyTimes="0;.015;.115;.49;.615;1" calcMode="discrete" dur="20s" repeatCount="indefinite"/><g>${spaceOrbitMotion(spaceBlueAngles)}${spaceLaser('M248 143H350', '#a6ceff', 0)}${spaceLaser('M248 143H350', '#a6ceff', -.8)}${spaceLaser('M352 147H250', '#d7b5f4', -.4)}${spaceLaser('M352 147H250', '#d7b5f4', -1.2)}${spaceMuzzle(245, 143, '#d0e7ff', 0)}${spaceMuzzle(355, 147, '#efcfff', -.4)}</g></g>`;
const spaceArtwork = `${spaceStarField}<circle cx="300" cy="145" r="81" stroke="#455572" stroke-dasharray="4 8"/><g class="space-orbit space-orbit-blue">${spaceOrbitMotion(spaceBlueAngles)}${spaceShip(219, 0, '#7794c1', '#bfd8f4')}</g><g class="space-orbit space-orbit-purple">${spaceOrbitMotion(spacePurpleAngles)}${spaceShip(381, 180, '#9b84ba', '#dfc5f0')}</g>${spaceCrossfire}<circle cx="159" cy="263" r="2" fill="#9fbbe5"/>${label(171, 267, 'player_01', '#8297b5')}<circle cx="349" cy="263" r="2" fill="#c5a9df"/>${label(361, 267, 'player_02', '#aa96bd')}`;

export const projectArt = {
  torrent: svg(`<g stroke="#514769" stroke-width="1.4"><path d="M176 88 300 145 424 88M176 202l124-57 124 57M300 145V61"/><path d="M176 88v114m248-114v114" stroke-dasharray="4 7" opacity=".5"/></g>${torrentPackets}${node(130, 69, 'peer_01')}${node(130, 183, 'peer_02')}${node(378, 69, 'peer_03')}${node(378, 183, 'peer_04')}<circle cx="300" cy="145" r="41" fill="#2d2540" stroke="#9d80d2"/><g stroke="#cbb7f3" stroke-width="2" stroke-linecap="round"><path d="M300 126v30m-11-11 11 11 11-11M285 165h30"/></g>${label(273, 51, 'tracker', '#c4b0e6')}${torrentProgress}`),
  judge: svg(judgeArtwork),
  uno: svg(unoArtwork),
  database: svg(`${databaseConnections}<g fill="#1e3430" stroke="#5b887b"><rect x="118" y="65" width="158" height="68" rx="11"/><rect x="357" y="65" width="128" height="68" rx="11"/><rect x="118" y="181" width="158" height="68" rx="11"/><rect x="357" y="181" width="128" height="68" rx="11"/></g><path d="M118 105h158M357 105h128M118 221h158M357 221h128" stroke="#43675d" opacity=".55"/><g fill="#a3d9bc" stroke="#1e3430" stroke-width="1.5"><circle cx="276" cy="98" r="2.5"/><circle cx="421" cy="133" r="2.5"/><circle cx="197" cy="133" r="2.5"/><circle cx="485" cy="100" r="2.5"/><circle cx="276" cy="215" r="2.5"/><circle cx="357" cy="215" r="2.5"/><circle cx="421" cy="249" r="2.5"/><circle cx="255" cy="65" r="2.5"/><circle cx="357" cy="95" r="2.5"/><circle cx="223" cy="65" r="2.5"/><circle cx="118" cy="234" r="2.5"/><circle cx="357" cy="212" r="2.5"/></g>${label(136, 93, 'patients', '#cee4d8')}${label(136, 119, 'id · name · age', '#8aaea0', 10)}${label(375, 93, 'doctors', '#cee4d8')}${label(375, 119, 'id · name', '#8aaea0', 10)}${label(136, 209, 'appointments', '#cee4d8')}${label(136, 235, 'patient_id · date', '#8aaea0', 10)}${label(375, 209, 'records', '#cee4d8')}${label(375, 235, 'id · status', '#8aaea0', 10)}`),
  hash: svg(hashArtwork),
  space: svg(spaceArtwork),
};
