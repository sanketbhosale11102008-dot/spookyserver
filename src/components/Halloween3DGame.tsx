import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Flame,
  Shield,
  Skull,
  Sparkles,
  Zap,
  Gauge,
} from 'lucide-react';
import { spookyAudio } from '../utils/soundEffects';

type GameState = 'title' | 'playing' | 'paused' | 'victory' | 'gameover';
type Difficulty = 'mortal' | 'nightmare' | 'extreme' | 'hellfire';

// Pre-allocated scratch objects to prevent garbage collection in 60fps loop
const _vec3 = new THREE.Vector3();
const _vec3b = new THREE.Vector3();
const _dir = new THREE.Vector3();

export const Halloween3DGame: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>('title');
  const [difficulty, setDifficulty] = useState<Difficulty>('extreme'); // Extreme mode selectable
  const [score, setScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(3);
  const [health, setHealth] = useState<number>(100);
  const [sanity, setSanity] = useState<number>(100);
  const [dashReady, setDashReady] = useState<boolean>(true);
  const [dashCooldownPct, setDashCooldownPct] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [hitFlash, setHitFlash] = useState<boolean>(false);
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);

  // References for mutable game loop state that shouldn't trigger React re-renders
  const stateRef = useRef<{
    gameState: GameState;
    difficulty: Difficulty;
    health: number;
    sanity: number;
    score: number;
    maxScore: number;
    isAudioMuted: boolean;
    hitstopFrames: number;
    cameraShake: number;
    isDashing: boolean;
    dashTimer: number;
    dashCooldown: number;
    playerYaw: number;
    playerPitch: number;
  }>({
    gameState: 'title',
    difficulty: 'extreme',
    health: 100,
    sanity: 100,
    score: 0,
    maxScore: 3,
    isAudioMuted: false,
    hitstopFrames: 0,
    cameraShake: 0,
    isDashing: false,
    dashTimer: 0,
    dashCooldown: 0,
    playerYaw: 0,
    playerPitch: 0,
  });

  // Scene object references for clean restart without page reloads
  const altarsRef = useRef<{
    group: THREE.Group;
    cleansed: boolean;
    light: THREE.PointLight;
    flameMesh: THREE.Mesh;
  }[]>([]);
  const phantomsRef = useRef<{
    group: THREE.Group;
    headGroup: THREE.Group;
    jawMesh: THREE.Mesh;
    light: THREE.PointLight;
    armL: THREE.Group;
    armR: THREE.Group;
    speed: number;
    angle: number;
    radius: number;
    jitterPhase: number;
  }[]>([]);
  const playerGroupRef = useRef<THREE.Group | null>(null);

  // Sync stateRef with React state
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  useEffect(() => {
    stateRef.current.difficulty = difficulty;
    // Extreme: 3 distant altars; Mortal: 5; Nightmare: 7; Hellfire: 8
    const targetMax = difficulty === 'extreme' ? 3 : difficulty === 'mortal' ? 5 : difficulty === 'nightmare' ? 7 : 8;
    setMaxScore(targetMax);
    stateRef.current.maxScore = targetMax;
  }, [difficulty]);

  useEffect(() => {
    stateRef.current.isAudioMuted = isAudioMuted;
  }, [isAudioMuted]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 650;

    // Detect software WebGL safely
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene Setup - Deep impenetrable midnight fog for intense torch survival horror
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04020a);
    scene.fog = new THREE.FogExp2(0x04020a, 0.048);

    // 2. Camera Setup (First-Person Perspective Eye Level)
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.rotation.order = 'YXZ';
    camera.position.set(0, 1.65, 0);

    // First-Person Torch / Flashlight Rig (attached directly to camera viewport)
    const torchRig = new THREE.Group();
    torchRig.position.set(0.34, -0.3, -0.52);

    // Torch Casing (Vintage heavy brass survival flashlight)
    const torchBodyGeo = new THREE.CylinderGeometry(0.038, 0.044, 0.42, 12);
    const torchMetalMat = new THREE.MeshStandardMaterial({
      color: 0x241e17,
      roughness: 0.45,
      metalness: 0.85,
    });
    const torchBody = new THREE.Mesh(torchBodyGeo, torchMetalMat);
    torchBody.rotation.x = Math.PI / 2;
    torchRig.add(torchBody);

    // Bezel & Reflector Head
    const headBezelGeo = new THREE.CylinderGeometry(0.075, 0.044, 0.15, 16);
    const brassHeadMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.35,
      metalness: 0.9,
    });
    const headBezel = new THREE.Mesh(headBezelGeo, brassHeadMat);
    headBezel.rotation.x = Math.PI / 2;
    headBezel.position.z = -0.24;
    torchRig.add(headBezel);

    // Glowing Incandescent Bulb / Lens
    const lensGeo = new THREE.CircleGeometry(0.07, 16);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.z = -0.316;
    torchRig.add(lens);

    // High-Intensity Focused Torch SpotLight (Cuts through crypt fog)
    const torchLight = new THREE.SpotLight(0xfff5dd, 5.0, 32, Math.PI / 4.5, 0.38, 1.25);
    torchLight.position.set(0, 0, -0.3);
    torchLight.castShadow = !isSoftwareGl;
    torchLight.shadow.mapSize.width = 1024;
    torchLight.shadow.mapSize.height = 1024;
    torchLight.shadow.bias = -0.0008;

    const torchTarget = new THREE.Object3D();
    torchTarget.position.set(0, 0, -18);
    camera.add(torchTarget);
    torchLight.target = torchTarget;
    torchRig.add(torchLight);

    // Soft Local Spill Light to illuminate ground around player's feet
    const torchSpillLight = new THREE.PointLight(0xffaa33, 1.2, 5);
    torchSpillLight.position.set(0, 0, -0.2);
    torchRig.add(torchSpillLight);

    camera.add(torchRig);
    scene.add(camera);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Studio PBR Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig (Dark, eerie ambient key - player relies on torchlight)
    const hemiLight = new THREE.HemisphereLight(0x2e1065, 0x030206, 0.45);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xd97706, 0.65);
    dirLight.position.set(15, 25, 10);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // 6. Terrain Ground with Procedural Crypt Material
    const groundGeo = new THREE.PlaneGeometry(130, 130, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090614,
      roughness: 0.94,
      metalness: 0.06,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    // 7. Player Entity (Position tracker on ground, pumpkin visible in title mode)
    const playerGroup = new THREE.Group();

    // Carved Pumpkin Head (visible on title screen)
    const pumpkinHeadGeo = new THREE.SphereGeometry(0.7, 16, 16);
    pumpkinHeadGeo.scale(1.2, 0.9, 1.2);
    const pumpkinMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.55,
      metalness: 0.1,
    });
    const pumpkinHead = new THREE.Mesh(pumpkinHeadGeo, pumpkinMat);
    pumpkinHead.position.y = 1.1;
    pumpkinHead.castShadow = !isSoftwareGl;
    playerGroup.add(pumpkinHead);

    const stemGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.4, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0.05, 1.8, -0.05);
    stem.rotation.z = 0.25;
    playerGroup.add(stem);

    const playerLight = new THREE.PointLight(0xff7700, 3.5, 14);
    playerLight.position.set(0, 1.1, 0.2);
    playerGroup.add(playerLight);

    const cageGeo = new THREE.TorusGeometry(0.75, 0.04, 8, 24);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 });
    const cage = new THREE.Mesh(cageGeo, brassMat);
    cage.rotation.x = Math.PI / 2;
    cage.position.y = 1.1;
    playerGroup.add(cage);

    const shroudGeo = new THREE.ConeGeometry(0.8, 1.4, 16, 1, true);
    const shroudMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const shroud = new THREE.Mesh(shroudGeo, shroudMat);
    shroud.position.y = 0.5;
    playerGroup.add(shroud);

    const shadowGeo = new THREE.CircleGeometry(0.9, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.02;
    playerGroup.add(contactShadow);

    scene.add(playerGroup);
    playerGroupRef.current = playerGroup;

    // 8. Procedural Graveyard Environment (Weathered Tombstones & Gnarled Trees)
    const tombstoneGeo = new THREE.BoxGeometry(0.75, 1.3, 0.25);
    const tombstoneMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.95 });
    const crossGeo = new THREE.BoxGeometry(0.5, 0.15, 0.1);

    for (let i = 0; i < 28; i++) {
      const stoneGroup = new THREE.Group();
      const stone = new THREE.Mesh(tombstoneGeo, tombstoneMat);
      stone.position.y = 0.65;
      stone.castShadow = !isSoftwareGl;
      stone.receiveShadow = !isSoftwareGl;
      stoneGroup.add(stone);

      const cross = new THREE.Mesh(crossGeo, tombstoneMat);
      cross.position.set(0, 0.85, 0.12);
      stoneGroup.add(cross);

      const angle = Math.random() * Math.PI * 2;
      const dist = 7 + Math.random() * 32;
      stoneGroup.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      stoneGroup.rotation.y = (Math.random() - 0.5) * 0.9;
      stoneGroup.rotation.z = (Math.random() - 0.5) * 0.2;
      scene.add(stoneGroup);
    }

    // Gnarled Dead Trees
    for (let i = 0; i < 12; i++) {
      const treeGroup = new THREE.Group();
      const trunkGeo = new THREE.CylinderGeometry(0.25, 0.65, 4.8, 7);
      const barkMat = new THREE.MeshStandardMaterial({ color: 0x18151f, roughness: 0.92 });
      const trunk = new THREE.Mesh(trunkGeo, barkMat);
      trunk.position.y = 2.4;
      trunk.castShadow = !isSoftwareGl;
      treeGroup.add(trunk);

      const branchGeo = new THREE.CylinderGeometry(0.12, 0.2, 2.2, 6);
      const branch1 = new THREE.Mesh(branchGeo, barkMat);
      branch1.position.set(0.6, 3.4, 0);
      branch1.rotation.z = -0.65;
      treeGroup.add(branch1);

      const branch2 = new THREE.Mesh(branchGeo, barkMat);
      branch2.position.set(-0.6, 2.9, 0);
      branch2.rotation.z = 0.75;
      treeGroup.add(branch2);

      const tAngle = (i / 12) * Math.PI * 2 + Math.random() * 0.3;
      const tDist = 14 + Math.random() * 26;
      treeGroup.position.set(Math.cos(tAngle) * tDist, 0, Math.sin(tAngle) * tDist);
      scene.add(treeGroup);
    }

    // 9. Cursed Pumpkin Altars (Configurable based on difficulty)
    // Extreme mode uses exactly 3 distant altars spread wide across the graveyard corners
    const altarCoords = [
      { x: 0, z: -28 },    // Far North Crypt Gate (Altar 1 - Extreme, Mortal, Nightmare, Hellfire)
      { x: 30, z: 22 },    // Far South-East Mausoleum (Altar 2 - Extreme, Mortal, Nightmare, Hellfire)
      { x: -30, z: 22 },   // Far South-West Catacomb (Altar 3 - Extreme, Mortal, Nightmare, Hellfire)
      { x: 18, z: -10 },   // Mid East Altar
      { x: -18, z: -10 },  // Mid West Altar
      { x: 0, z: 12 },     // Center Crypt Altar
      { x: 26, z: 4 },     // East Ridge Altar
      { x: -26, z: 4 },    // West Hollow Altar
    ];

    const altars: {
      group: THREE.Group;
      cleansed: boolean;
      light: THREE.PointLight;
      flameMesh: THREE.Mesh;
    }[] = [];

    altarCoords.forEach((pos) => {
      const altarGroup = new THREE.Group();
      altarGroup.position.set(pos.x, 0, pos.z);

      const pedGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.6, 8);
      const stonePedMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
      const ped = new THREE.Mesh(pedGeo, stonePedMat);
      ped.position.y = 0.3;
      altarGroup.add(ped);

      const shrinePumpGeo = new THREE.SphereGeometry(0.75, 12, 12);
      shrinePumpGeo.scale(1.2, 0.9, 1.2);
      const shrinePumpMat = new THREE.MeshStandardMaterial({
        color: 0x9a3412,
        roughness: 0.6,
      });
      const shrinePump = new THREE.Mesh(shrinePumpGeo, shrinePumpMat);
      shrinePump.position.y = 1.1;
      altarGroup.add(shrinePump);

      const beamGeo = new THREE.CylinderGeometry(0.15, 0.3, 5, 8);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.75,
      });
      const flameMesh = new THREE.Mesh(beamGeo, flameMat);
      flameMesh.position.y = 3.6;
      altarGroup.add(flameMesh);

      const altarLight = new THREE.PointLight(0xa855f7, 2, 8);
      altarLight.position.y = 1.6;
      altarGroup.add(altarLight);

      scene.add(altarGroup);
      altars.push({ group: altarGroup, cleansed: false, light: altarLight, flameMesh });
    });
    altarsRef.current = altars;

    // 10. Crypt Phantoms (Enemy count scales by difficulty)
    const phantoms: {
      group: THREE.Group;
      speed: number;
      angle: number;
      radius: number;
      light: THREE.PointLight;
    }[] = [];

    // Create 8 phantoms total (activated conditionally based on difficulty)
    for (let i = 0; i < 8; i++) {
      const phantomGroup = new THREE.Group();

      const pHeadGeo = new THREE.SphereGeometry(0.5, 12, 12);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.82,
        roughness: 0.2,
      });
      const pHead = new THREE.Mesh(pHeadGeo, pMat);
      pHead.position.y = 1.4;
      phantomGroup.add(pHead);

      const pEyeGeo = new THREE.SphereGeometry(0.09, 8, 8);
      const pEyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const eyeL = new THREE.Mesh(pEyeGeo, pEyeMat);
      eyeL.position.set(-0.16, 1.45, 0.42);
      const eyeR = new THREE.Mesh(pEyeGeo, pEyeMat);
      eyeR.position.set(0.16, 1.45, 0.42);
      phantomGroup.add(eyeL, eyeR);

      const pShroudGeo = new THREE.ConeGeometry(0.65, 1.6, 12, 1, true);
      const pShroudMat = new THREE.MeshStandardMaterial({
        color: 0x0891b2,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      });
      const pShroud = new THREE.Mesh(pShroudGeo, pShroudMat);
      pShroud.position.y = 0.6;
      phantomGroup.add(pShroud);

      const pLight = new THREE.PointLight(0x06b6d4, 1.8, 7);
      pLight.position.y = 1.4;
      phantomGroup.add(pLight);

      const pAngle = (i / 8) * Math.PI * 2;
      const pDist = 9 + (i % 4) * 5;
      phantomGroup.position.set(Math.cos(pAngle) * pDist, 0, Math.sin(pAngle) * pDist);

      scene.add(phantomGroup);
      phantoms.push({
        group: phantomGroup,
        speed: 2.2 + (i % 3) * 0.5,
        angle: pAngle,
        radius: pDist,
        light: pLight,
      });
    }
    phantomsRef.current = phantoms;

    // 11. Responsive Controls (WASD / Arrows, Space Banish, Shift Dash)
    const keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;

      // Start / Restart on Space / Enter
      if ((e.code === 'Space' || e.code === 'Enter') && stateRef.current.gameState === 'title') {
        startGame();
        return;
      }

      // Pause toggle
      if (e.code === 'Escape' && (stateRef.current.gameState === 'playing' || stateRef.current.gameState === 'paused')) {
        setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
        return;
      }

      // Space Action: Cleanse Altar
      if (e.code === 'Space' && stateRef.current.gameState === 'playing') {
        castBanishFlame();
      }

      // Shift Action: Spirit Dash / Dodge
      if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && stateRef.current.gameState === 'playing') {
        triggerSpiritDash();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    const handleBlur = () => {
      Object.keys(keys).forEach((k) => (keys[k] = false));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    // Spirit Dash Maneuver (Severely Reduced Stamina in Extreme Mode)
    const triggerSpiritDash = () => {
      if (stateRef.current.dashCooldown > 0) return;

      const isExtreme = stateRef.current.difficulty === 'extreme';
      // Extreme mode: 4.5s cooldown (vs 2.2s) and 0.28s burst (vs 0.35s)
      const cooldownDuration = isExtreme ? 4.5 : 2.2;
      const dashDuration = isExtreme ? 0.28 : 0.35;

      stateRef.current.isDashing = true;
      stateRef.current.dashTimer = dashDuration;
      stateRef.current.dashCooldown = cooldownDuration;
      setDashReady(false);

      if (!stateRef.current.isAudioMuted) {
        spookyAudio.playEerieWind();
      }

      // Visual flare on shroud (Rose-red flare in Extreme mode, Cyan in standard)
      (shroud.material as THREE.MeshStandardMaterial).color.setHex(isExtreme ? 0xf43f5e : 0x38bdf8);
      setTimeout(() => {
        (shroud.material as THREE.MeshStandardMaterial).color.setHex(0x818cf8);
      }, isExtreme ? 280 : 400);
    };

    const castBanishFlame = () => {
      if (!stateRef.current.isAudioMuted) {
        spookyAudio.playEerieWind();
      }

      playerLight.intensity = 8;
      setTimeout(() => (playerLight.intensity = 3.5), 250);

      const targetAltars = altars.slice(0, stateRef.current.maxScore);

      targetAltars.forEach((altar) => {
        if (!altar.cleansed) {
          const dist = playerGroup.position.distanceTo(altar.group.position);
          if (dist < 4.2) {
            altar.cleansed = true;
            altar.light.color.setHex(0xf97316);
            altar.light.intensity = 4;
            (altar.flameMesh.material as THREE.MeshBasicMaterial).color.setHex(0xf97316);

            if (!stateRef.current.isAudioMuted) {
              spookyAudio.playTollBell();
            }

            setScore((prev) => {
              const next = prev + 1;
              stateRef.current.score = next;
              if (next >= stateRef.current.maxScore) {
                setGameState('victory');
                spookyAudio.playTollBell();
              }
              return next;
            });
          }
        }
      });
    };

    const startGame = () => {
      setGameState('playing');
      spookyAudio.playTollBell();
    };

    // 12. Main 60fps Game Simulation Loop
    const clock = new THREE.Clock();
    let frameId = 0;
    let cameraAngle = 0;

    function tick() {
      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);
      const time = clock.getElapsedTime();

      // Hitstop delay handling for heavy impact game feel
      if (stateRef.current.hitstopFrames > 0) {
        stateRef.current.hitstopFrames--;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(tick);
        return;
      }

      // Update Dash Timers
      if (stateRef.current.dashTimer > 0) {
        stateRef.current.dashTimer -= dt;
        if (stateRef.current.dashTimer <= 0) {
          stateRef.current.isDashing = false;
        }
      }

      const currentGState = stateRef.current.gameState;
      const curDiff = stateRef.current.difficulty;
      const isExtreme = curDiff === 'extreme';

      if (stateRef.current.dashCooldown > 0) {
        stateRef.current.dashCooldown -= dt;
        const maxCooldown = isExtreme ? 4.5 : 2.2;
        const pct = Math.max(0, 100 - (stateRef.current.dashCooldown / maxCooldown) * 100);
        setDashCooldownPct(Math.round(pct));
        if (stateRef.current.dashCooldown <= 0) {
          stateRef.current.dashCooldown = 0;
          setDashReady(true);
        }
      }

      // Active enemy count based on difficulty
      // Extreme mode: 8 aggressive phantoms, 2.65x pursuit speed, wide 18 agro range, high damage
      const activePhantomCount = curDiff === 'mortal' ? 4 : curDiff === 'nightmare' ? 6 : 8;
      const speedMultiplier = isExtreme ? 2.65 : curDiff === 'hellfire' ? 2.1 : curDiff === 'nightmare' ? 1.45 : 1.0;
      const agroRange = isExtreme ? 18 : curDiff === 'hellfire' ? 15 : curDiff === 'nightmare' ? 12 : 9;
      const hitDamage = isExtreme ? 28 : curDiff === 'hellfire' ? 25 : curDiff === 'nightmare' ? 18 : 12;

      // Update Altar Visibility based on maxScore (in Extreme mode only the 3 distant altars appear)
      altars.forEach((altar, idx) => {
        altar.group.visible = idx < stateRef.current.maxScore;
      });

      // Title Screen: Live-world cinematic camera pan
      if (currentGState === 'title') {
        cameraAngle += dt * 0.15;
        camera.position.x = Math.cos(cameraAngle) * 18;
        camera.position.z = Math.sin(cameraAngle) * 18;
        camera.position.y = 7.5 + Math.sin(time * 0.5) * 1.5;
        camera.lookAt(0, 1.2, 0);

        playerGroup.position.y = Math.sin(time * 2) * 0.2;
      } else if (currentGState === 'playing') {
        // Player Movement
        _dir.set(0, 0, 0);
        if (keys['KeyW'] || keys['ArrowUp']) _dir.z -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) _dir.z += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) _dir.x -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) _dir.x += 1;

        if (_dir.lengthSq() > 0) {
          _dir.normalize();
          const baseSpeed = 7.5;
          const currentSpeed = stateRef.current.isDashing ? baseSpeed * 2.3 : baseSpeed;

          playerGroup.position.x += _dir.x * currentSpeed * dt;
          playerGroup.position.z += _dir.z * currentSpeed * dt;

          const targetRotation = Math.atan2(_dir.x, _dir.z);
          playerGroup.rotation.y = THREE.MathUtils.damp(playerGroup.rotation.y, targetRotation, 14, dt);

          playerGroup.position.y = 0.1 + Math.sin(time * (stateRef.current.isDashing ? 16 : 8)) * 0.14;
        } else {
          playerGroup.position.y = 0.1 + Math.sin(time * 3) * 0.08;
        }

        // Clamp inside boundary
        const maxDist = 42;
        const currentDist = Math.sqrt(playerGroup.position.x ** 2 + playerGroup.position.z ** 2);
        if (currentDist > maxDist) {
          playerGroup.position.x = (playerGroup.position.x / currentDist) * maxDist;
          playerGroup.position.z = (playerGroup.position.z / currentDist) * maxDist;
        }

        // Camera Follow with Exponential Damping
        const targetCamX = playerGroup.position.x;
        const targetCamZ = playerGroup.position.z + 8.8;
        const targetCamY = playerGroup.position.y + 4.8;

        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 6, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 6, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 6, dt);

        if (stateRef.current.cameraShake > 0) {
          camera.position.x += (Math.random() - 0.5) * stateRef.current.cameraShake;
          camera.position.y += (Math.random() - 0.5) * stateRef.current.cameraShake;
          stateRef.current.cameraShake = Math.max(0, stateRef.current.cameraShake - dt * 2.5);
        }

        camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1.2, playerGroup.position.z);

        // Enemy (Crypt Phantom) Pursuit & Aggression
        phantoms.slice(0, activePhantomCount).forEach((p) => {
          const distToPlayer = p.group.position.distanceTo(playerGroup.position);

          if (distToPlayer < agroRange) {
            // Aggressive Pursuit with telegraph
            _vec3.subVectors(playerGroup.position, p.group.position).normalize();
            p.group.position.x += _vec3.x * p.speed * speedMultiplier * dt;
            p.group.position.z += _vec3.z * p.speed * speedMultiplier * dt;

            // Telegraph: In Extreme mode, light glows menacing blood-red with higher intensity and rapid flicker
            if (isExtreme) {
              p.light.color.setHex(0xff0033);
              p.light.intensity = 2.8 + Math.sin(time * 14) * 1.0;
            } else {
              p.light.color.setHex(0xef4444);
              p.light.intensity = 1.8;
            }

            // Collision Check
            if (distToPlayer < 1.35) {
              stateRef.current.health = Math.max(0, stateRef.current.health - hitDamage);
              stateRef.current.cameraShake = 0.75;
              stateRef.current.hitstopFrames = 3;
              setHealth(stateRef.current.health);
              setHitFlash(true);
              setTimeout(() => setHitFlash(false), 200);

              if (!stateRef.current.isAudioMuted) {
                spookyAudio.playJumpScare();
              }

              // Knockback
              p.group.position.x -= _vec3.x * 4;
              p.group.position.z -= _vec3.z * 4;

              if (stateRef.current.health <= 0) {
                setGameState('gameover');
                spookyAudio.playTollBell();
              }
            }
          } else {
            // Patrol orbit
            p.angle += dt * 0.45;
            p.group.position.x = Math.cos(p.angle) * p.radius;
            p.group.position.z = Math.sin(p.angle) * p.radius;
            p.light.color.setHex(0x06b6d4);
            p.light.intensity = 1.8;
          }

          p.group.position.y = 1.2 + Math.sin(time * 3 + p.angle) * 0.35;
        });

        // Hide inactive phantoms
        phantoms.slice(activePhantomCount).forEach((p) => {
          p.group.position.set(0, -50, 0);
        });

        // Deep fog sanity drain
        if (Math.random() < (curDiff === 'hellfire' ? 0.08 : curDiff === 'extreme' ? 0.06 : 0.04)) {
          stateRef.current.sanity = Math.max(10, stateRef.current.sanity - 0.15);
          setSanity(Math.round(stateRef.current.sanity));
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', handleResize);

      groundGeo.dispose();
      groundMat.dispose();
      pumpkinHeadGeo.dispose();
      pumpkinMat.dispose();
      stemGeo.dispose();
      stemMat.dispose();
      cageGeo.dispose();
      brassMat.dispose();
      shroudGeo.dispose();
      shroudMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      tombstoneGeo.dispose();
      tombstoneMat.dispose();
      crossGeo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleRestart = () => {
    setHealth(100);
    setSanity(100);
    setScore(0);
    setDashReady(true);
    setDashCooldownPct(100);
    stateRef.current.health = 100;
    stateRef.current.sanity = 100;
    stateRef.current.score = 0;
    stateRef.current.dashCooldown = 0;
    stateRef.current.isDashing = false;

    // Reset player position to origin
    if (playerGroupRef.current) {
      playerGroupRef.current.position.set(0, 0.1, 0);
      playerGroupRef.current.rotation.set(0, 0, 0);
    }

    // Reset all altars
    altarsRef.current.forEach((altar) => {
      altar.cleansed = false;
      altar.light.color.setHex(0xa855f7);
      altar.light.intensity = 2;
      (altar.flameMesh.material as THREE.MeshBasicMaterial).color.setHex(0xa855f7);
    });

    // Reset phantoms to their orbital spawn points
    phantomsRef.current.forEach((p, idx) => {
      const pAngle = (idx / 8) * Math.PI * 2;
      const pDist = 9 + (idx % 4) * 5;
      p.angle = pAngle;
      p.radius = pDist;
      p.group.position.set(Math.cos(pAngle) * pDist, 0, Math.sin(pAngle) * pDist);
      p.light.color.setHex(0x06b6d4);
      p.light.intensity = 1.8;
    });

    setGameState('playing');
    spookyAudio.playTollBell();
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-orange-500/30 bg-[#070410] shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[640px]'
      }`}
    >
      {/* 3D WebGL Canvas Mounting Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Red Hit Flash Screen Vignette */}
      {hitFlash && <div className="absolute inset-0 pointer-events-none bg-red-600/35 z-20 animate-pulse" />}

      {/* GAME SHELL: 1. Title Screen Overlay */}
      {gameState === 'title' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-8 bg-gradient-to-t from-[#070410] via-[#070410]/50 to-transparent">
          <div className="w-full flex items-center justify-between text-xs text-orange-400 font-mono">
            <span className="px-2.5 py-1 rounded bg-black/60 border border-orange-500/30">
              Three.js 3D WebGL Engine
            </span>
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-orange-400" />
              <span className={`uppercase font-bold ${difficulty === 'extreme' ? 'text-rose-400 font-black' : 'text-orange-300'}`}>
                {difficulty} Mode
              </span>
            </div>
          </div>

          {/* Bespoke inline SVG Title Lockup */}
          <div className="text-center max-w-xl my-auto space-y-4">
            <svg viewBox="0 0 400 80" className="w-full max-w-md mx-auto drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]">
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#f97316"
                className="font-cinzel font-black tracking-widest text-3xl sm:text-4xl"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                PUMPKIN CRYPT
              </text>
              <text
                x="50%"
                y="85%"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#cbd5e1"
                className="font-mono text-xs uppercase tracking-widest"
              >
                The Haunting of Blackwood
              </text>
            </svg>

            <p className="text-sm text-zinc-300 font-serif leading-relaxed">
              Cleanse all cursed pumpkin altars in the haunted cemetery before the relentless crypt phantoms consume your soul.
            </p>

            {/* Difficulty Selector with Extreme Mode */}
            <div className="p-3.5 rounded-2xl bg-black/75 border border-purple-500/30 max-w-lg mx-auto shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-orange-400 uppercase tracking-wider">
                  Select Difficulty Level:
                </span>
                {difficulty === 'extreme' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950 text-rose-300 border border-rose-500/50 animate-pulse">
                    Extreme Active
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setDifficulty('mortal')}
                  className={`py-1.5 px-2 rounded-lg transition-colors ${
                    difficulty === 'mortal' ? 'bg-orange-500 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  Mortal (5)
                </button>
                <button
                  onClick={() => setDifficulty('nightmare')}
                  className={`py-1.5 px-2 rounded-lg transition-colors ${
                    difficulty === 'nightmare' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  Nightmare (7)
                </button>
                <button
                  onClick={() => setDifficulty('extreme')}
                  className={`py-1.5 px-2 rounded-lg transition-all border ${
                    difficulty === 'extreme'
                      ? 'bg-rose-700 border-rose-400 text-white font-black shadow-lg shadow-rose-600/50 ring-2 ring-rose-400'
                      : 'bg-zinc-900 border-rose-900/50 text-rose-300/80 hover:bg-zinc-800'
                  }`}
                >
                  Extreme (3)
                </button>
                <button
                  onClick={() => setDifficulty('hellfire')}
                  className={`py-1.5 px-2 rounded-lg transition-colors ${
                    difficulty === 'hellfire' ? 'bg-amber-500 text-black font-bold animate-pulse' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  Hellfire (8)
                </button>
              </div>

              {/* Mode Specific Description Callout */}
              <div
                className={`mt-2.5 text-[11px] font-mono rounded-lg px-2.5 py-1.5 text-left border transition-all ${
                  difficulty === 'extreme'
                    ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                    : 'bg-black/50 border-zinc-850 text-zinc-400'
                }`}
              >
                {difficulty === 'extreme' ? (
                  <div className="space-y-0.5">
                    <div className="font-bold text-rose-300 flex items-center gap-1.5">
                      <Skull className="w-3.5 h-3.5 text-rose-400" />
                      <span>Extreme Mode Specifications</span>
                    </div>
                    <div className="text-[10px] text-rose-300/90 leading-tight">
                      • <strong>Fewer Safe Zones:</strong> Exactly 3 distant altars spread to cemetery edges<br />
                      • <strong>Faster Phantoms:</strong> 2.65x hyper-aggressive pursuit exceeding walk speed<br />
                      • <strong>Reduced Stamina:</strong> 4.5s dash cooldown with shorter 0.28s dodge burst
                    </div>
                  </div>
                ) : difficulty === 'mortal' ? (
                  <span>Mortal: 5 nearby altars · Normal phantoms · Standard 2.2s dash stamina</span>
                ) : difficulty === 'nightmare' ? (
                  <span>Nightmare: 7 altars · 6 aggressive phantoms (1.45x speed) · Standard dash</span>
                ) : (
                  <span>Hellfire: 8 altars · 8 relentless phantoms (2.1x speed) · 25 dmg per hit</span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setGameState('playing');
                  spookyAudio.playTollBell();
                }}
                className={`px-8 py-3.5 rounded-xl text-black font-black text-sm tracking-wider uppercase shadow-xl active:scale-95 transition-all inline-flex items-center gap-2 ${
                  difficulty === 'extreme'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 shadow-rose-500/30'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-orange-500/30'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Enter Crypt (Press Space)</span>
              </button>
            </div>
          </div>

          {/* Flat Single-Line Control Hint */}
          <div className="text-xs text-zinc-400 font-mono bg-black/60 px-4 py-2 rounded-xl border border-purple-500/20">
            WASD / Arrows: Move · Space: Cleanse Altar · Shift: Spirit Dash · Esc: Pause
          </div>
        </div>
      )}

      {/* GAME SHELL: 2. Playing Low-Occlusion HUD Overlay (>= 85% Unobstructed) */}
      {gameState === 'playing' && (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6">
          {/* Top Status Clusters */}
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty Badge */}
              <div
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold uppercase shadow-lg ${
                  difficulty === 'extreme'
                    ? 'bg-rose-950/90 border-rose-500 text-rose-300 ring-1 ring-rose-500/50'
                    : 'bg-black/70 border-purple-500/40 text-purple-300'
                }`}
              >
                {difficulty === 'extreme' ? 'EXTREME MODE' : `${difficulty.toUpperCase()}`}
              </div>

              {/* Altars Cleansed */}
              <div className="px-3.5 py-1.5 rounded-xl bg-black/70 border border-orange-500/40 text-orange-400 flex items-center gap-2 text-xs font-mono tabular-nums shadow-lg">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>
                  Altars: {score} / {maxScore} {difficulty === 'extreme' ? '(Distant)' : ''}
                </span>
              </div>

              {/* Vitality */}
              <div className="px-3.5 py-1.5 rounded-xl bg-black/70 border border-red-500/40 text-red-400 flex items-center gap-2 text-xs font-mono tabular-nums shadow-lg">
                <Skull className="w-4 h-4 text-red-500" />
                <span>Vitality: {health}%</span>
              </div>

              {/* Spirit Dash / Reduced Stamina Indicator */}
              <div
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 shadow-lg transition-colors ${
                  dashReady
                    ? difficulty === 'extreme'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold'
                      : 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-black/70 border-zinc-700 text-zinc-500'
                }`}
              >
                <Zap
                  className={`w-3.5 h-3.5 ${
                    dashReady ? (difficulty === 'extreme' ? 'text-rose-400 animate-pulse' : 'text-cyan-400 animate-pulse') : ''
                  }`}
                />
                <span>
                  [SHIFT] {difficulty === 'extreme' ? 'Stamina' : 'Dash'}{' '}
                  {dashReady ? 'READY' : `${dashCooldownPct}% (${difficulty === 'extreme' ? '4.5s CD' : '2.2s CD'})`}
                </span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-2 rounded-xl bg-black/70 hover:bg-black border border-purple-500/30 text-zinc-300 transition-colors"
                title={isAudioMuted ? 'Unmute' : 'Mute'}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setGameState('paused')}
                className="p-2 rounded-xl bg-black/70 hover:bg-black border border-purple-500/30 text-zinc-300 transition-colors"
                title="Pause"
              >
                <Pause className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl bg-black/70 hover:bg-black border border-purple-500/30 text-zinc-300 transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="self-center text-[11px] font-mono text-zinc-400 bg-black/60 px-3 py-1 rounded-lg border border-purple-500/20">
            {difficulty === 'extreme'
              ? 'EXTREME: Phantoms outrun walk speed! Time your 4.5s Stamina Dash to reach the 3 distant altars'
              : 'Press SPACE near Altars to Cleanse · Press SHIFT to Dash away from Phantoms'}
          </div>
        </div>
      )}

      {/* GAME SHELL: 3. Pause Modal */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/75">
          <div className="p-8 rounded-2xl bg-[#120b22] border border-orange-500/40 text-center max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-2xl font-black text-white font-cinzel">Game Paused</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Altars: {score} / {maxScore} · Vitality: {health}% · Difficulty: {difficulty.toUpperCase()}
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setGameState('playing')}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs uppercase"
              >
                Resume Quest
              </button>
              <button
                onClick={handleRestart}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs"
              >
                Restart Crypt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME SHELL: 4. Victory Screen */}
      {gameState === 'victory' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/85">
          <div className="p-8 rounded-2xl bg-[#0f172a] border border-amber-500/50 text-center max-w-md w-full space-y-4 shadow-2xl">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-3xl font-black text-amber-400 font-cinzel">
              {difficulty === 'extreme' ? 'Extreme Crypt Conquered!' : 'Crypt Cleansed!'}
            </h3>
            <p className="text-sm text-zinc-300 font-serif leading-relaxed">
              {difficulty === 'extreme'
                ? `Incredible feat! You cleansed all 3 distant altars on EXTREME difficulty, evading 2.65x speed phantoms with severely depleted stamina. You are the Master of Blackwood Crypt!`
                : `All ${maxScore} cursed altars radiate with sacred flame on ${difficulty.toUpperCase()} difficulty. The ancient phantoms dissolve into the dawn mist. You conquered Blackwood Manor!`}
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-lg"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* GAME SHELL: 5. Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/85">
          <div className="p-8 rounded-2xl bg-[#1f0909] border border-red-500/50 text-center max-w-md w-full space-y-4 shadow-2xl">
            <Skull className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-3xl font-black text-red-500 font-cinzel">
              {difficulty === 'extreme' ? 'Extreme Annihilation' : 'Soul Consumed'}
            </h3>
            <p className="text-sm text-zinc-300 font-serif leading-relaxed">
              {difficulty === 'extreme'
                ? `The 2.65x speed phantoms overtook you before you could reach the 3 distant altars. With only a 4.5s stamina dash, every step requires pinpoint timing!`
                : `The ${difficulty} crypt phantoms swarmed your spirit in the darkness. Use [SHIFT] Dash to evade their lunges!`}
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
