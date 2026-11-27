import * as THREE from 'three';

export const EDITORIAL_COLORS = {
  nanocelluloseFibril: 0x8be0e8,
  nanocelluloseNode: 0x4fb3bf,
  hydrogelShell: 0x4fb3bf,
  silverSatin: 0xe2e8f0,
  rosemaryStrand: 0x4f9476,
  rosemaryTip: 0xcfa358,
  folateStalk: 0x7c9c8e,
  folateHead: 0xeab308,
  tumorCell: 0xa44c58,
  vesselBranch: 0xad2936,
  healthyCell: 0x3b7a9e,
  receptorFR: 0xbf3b3b,
  lipidHead: 0x5ec2cc,
  lipidHeadBot: 0x2f7d87,
  lipidHeadOx: 0xea580c,
  lipidTail: 0xcbb382,
  clathrinCage: 0x5ec2cc,
  dynaminCollar: 0xd9a14a,
  mitoOuter: 0x3b8a94,
  mitoCristae: 0x4fb3bf,
  mitoDna: 0xd9a14a,
  gshShield: 0x6b8f71,
  gshBlocked: 0x64748b,
  rosRadical: 0xb4823e,
  rosHot: 0xea580c,
  cytC: 0xd8b4fe,
  apoptoticCell: 0x6b3a5c,
  apoptosome: 0xc084fc,
} as const;

export interface EditorialMaterialSet {
  nanocelluloseFibril: THREE.MeshStandardMaterial;
  nanocelluloseNode: THREE.MeshStandardMaterial;
  hydrogelShell: THREE.MeshPhysicalMaterial;
  silverSatin: THREE.MeshStandardMaterial;
  rosemaryStrand: THREE.MeshStandardMaterial;
  rosemaryTip: THREE.MeshStandardMaterial;
  folateStalk: THREE.MeshStandardMaterial;
  folateHead: THREE.MeshStandardMaterial;
  tumorCell: THREE.MeshPhysicalMaterial;
  vesselBranch: THREE.MeshPhysicalMaterial;
  healthyCell: THREE.MeshPhysicalMaterial;
  receptorFR: THREE.MeshPhysicalMaterial;
  clathrinCage: THREE.MeshStandardMaterial;
  dynaminCollar: THREE.MeshStandardMaterial;
  mitoOuter: THREE.MeshPhysicalMaterial;
  mitoCristae: THREE.MeshPhysicalMaterial;
  mitoDna: THREE.MeshStandardMaterial;
  mitoEtc: THREE.MeshStandardMaterial;
  syringeGlass: THREE.MeshPhysicalMaterial;
  syringePlunger: THREE.MeshStandardMaterial;
  apoptoticCell: THREE.MeshPhysicalMaterial;
  apoptosome: THREE.MeshStandardMaterial;
}

/**
 * Injects an editorial Fresnel rim-translucency term into Standard/Physical shaders
 * at near-zero GPU cost for Intel UHD & mobile GPUs.
 */
export function attachFresnelRim<
  T extends THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
>(material: T, rimColorHex: number, rimPower = 2.2, rimStrength = 0.35): T {
  material.customProgramCacheKey = () =>
    `fresnel-${rimColorHex.toString(16)}-${rimPower}-${rimStrength}`;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = { value: new THREE.Color(rimColorHex) };
    shader.uniforms.uRimPower = { value: rimPower };
    shader.uniforms.uRimStrength = { value: rimStrength };

    shader.fragmentShader = shader.fragmentShader
      .replace(
        'void main() {',
        `uniform vec3 uRimColor;
uniform float uRimPower;
uniform float uRimStrength;
void main() {`
      )
      .replace(
        '#include <dithering_fragment>',
        `vec3 fresnelViewDir = normalize(vViewPosition);
float fresnelTerm = pow(1.0 - clamp(abs(dot(normal, fresnelViewDir)), 0.0, 1.0), uRimPower) * uRimStrength;
gl_FragColor.rgb += uRimColor * fresnelTerm;
#include <dithering_fragment>`
      );
  };
  return material;
}

function makeCanvasTexture(
  size: number,
  paint: (ctx: CanvasRenderingContext2D, size: number) => void,
  repeat = 2
): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  paint(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.needsUpdate = true;
  return tex;
}

function createOrganicMicroTexture(): THREE.CanvasTexture | null {
  return makeCanvasTexture(
    256,
    (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      // Deterministic cellular mottled grain
      for (let i = 0; i < 420; i++) {
        const x = ((i * 73.13) % 1) * s;
        const y = ((i * 19.37 + Math.sin(i) * 0.25 + 1) % 1) * s;
        const r = 4 + (i % 7) * 2.5;
        const lum = 104 + ((i * 37) % 52);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${lum}, ${lum}, ${lum}, 0.35)`);
        grad.addColorStop(1, `rgba(${lum}, ${lum}, ${lum}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    3
  );
}

function createSatinMetalTexture(): THREE.CanvasTexture | null {
  return makeCanvasTexture(
    256,
    (ctx, s) => {
      ctx.fillStyle = '#888888';
      ctx.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 2) {
        const v = 122 + Math.round(Math.sin(y * 0.45) * 14 + Math.cos(y * 1.3) * 8);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(0, y, s, 1);
      }
    },
    4
  );
}

function createFibrilMicroTexture(): THREE.CanvasTexture | null {
  return makeCanvasTexture(
    256,
    (ctx, s) => {
      ctx.fillStyle = '#848484';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 160; i++) {
        const x = ((i * 41.7) % 1) * s;
        const v = 110 + (i % 45);
        ctx.strokeStyle = `rgba(${v},${v},${v},0.35)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo((x + 18) % s, s);
        ctx.stroke();
      }
    },
    2
  );
}

export function createEditorialMaterials(): EditorialMaterialSet {
  const organicTex = createOrganicMicroTexture();
  const metalTex = createSatinMetalTexture();
  const fibrilTex = createFibrilMicroTexture();

  return {
    nanocelluloseFibril: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.nanocelluloseFibril,
      roughness: 0.34,
      metalness: 0.05,
      bumpMap: fibrilTex,
      bumpScale: 0.018,
    }),
    nanocelluloseNode: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.nanocelluloseNode,
      roughness: 0.36,
      metalness: 0.08,
      bumpMap: fibrilTex,
      bumpScale: 0.015,
    }),
    hydrogelShell: attachFresnelRim(
      new THREE.MeshPhysicalMaterial({
        color: EDITORIAL_COLORS.hydrogelShell,
        roughness: 0.16,
        metalness: 0.02,
        clearcoat: 0.68,
        clearcoatRoughness: 0.18,
        transparent: true,
        opacity: 0.21,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      0xa5f3fc,
      2.2,
      0.42
    ),
    silverSatin: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.silverSatin,
      roughness: 0.24,
      metalness: 0.86,
      envMapIntensity: 1.45,
      bumpMap: metalTex,
      bumpScale: 0.01,
      roughnessMap: metalTex,
    }),
    rosemaryStrand: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.rosemaryStrand,
      roughness: 0.56,
      metalness: 0.04,
      bumpMap: organicTex,
      bumpScale: 0.02,
    }),
    rosemaryTip: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.rosemaryTip,
      roughness: 0.48,
      metalness: 0.06,
    }),
    folateStalk: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.folateStalk,
      roughness: 0.56,
      metalness: 0.03,
    }),
    folateHead: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.folateHead,
      roughness: 0.36,
      metalness: 0.12,
    }),
    tumorCell: attachFresnelRim(
      new THREE.MeshPhysicalMaterial({
        color: EDITORIAL_COLORS.tumorCell,
        roughness: 0.46,
        clearcoat: 0.2,
        transparent: true,
        opacity: 0.88,
        bumpMap: organicTex,
        bumpScale: 0.045,
        roughnessMap: organicTex,
      }),
      0xfda4af,
      2.5,
      0.24
    ),
    vesselBranch: new THREE.MeshPhysicalMaterial({
      color: EDITORIAL_COLORS.vesselBranch,
      roughness: 0.38,
      clearcoat: 0.26,
      bumpMap: organicTex,
      bumpScale: 0.025,
    }),
    healthyCell: attachFresnelRim(
      new THREE.MeshPhysicalMaterial({
        color: EDITORIAL_COLORS.healthyCell,
        roughness: 0.44,
        clearcoat: 0.16,
        transparent: true,
        opacity: 0.86,
        bumpMap: organicTex,
        bumpScale: 0.028,
      }),
      0x7dd3fc,
      2.5,
      0.22
    ),
    receptorFR: new THREE.MeshPhysicalMaterial({
      color: EDITORIAL_COLORS.receptorFR,
      roughness: 0.4,
      clearcoat: 0.24,
      bumpMap: organicTex,
      bumpScale: 0.025,
    }),
    clathrinCage: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.clathrinCage,
      roughness: 0.34,
      metalness: 0.08,
    }),
    dynaminCollar: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.dynaminCollar,
      roughness: 0.36,
      metalness: 0.14,
    }),
    mitoOuter: attachFresnelRim(
      new THREE.MeshPhysicalMaterial({
        color: EDITORIAL_COLORS.mitoOuter,
        roughness: 0.26,
        clearcoat: 0.38,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      0x99f6e4,
      2.0,
      0.38
    ),
    mitoCristae: attachFresnelRim(
      new THREE.MeshPhysicalMaterial({
        color: EDITORIAL_COLORS.mitoCristae,
        roughness: 0.34,
        transparent: true,
        opacity: 0.54,
        side: THREE.DoubleSide,
        bumpMap: organicTex,
        bumpScale: 0.03,
      }),
      0x7dd3fc,
      2.3,
      0.26
    ),
    mitoDna: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.mitoDna,
      roughness: 0.36,
      metalness: 0.08,
    }),
    mitoEtc: new THREE.MeshStandardMaterial({
      color: 0xd18f4d,
      roughness: 0.38,
      metalness: 0.12,
    }),
    syringeGlass: attachFresnelRim(
      new THREE.MeshPhysicalMaterial({
        color: 0xdbeafe,
        roughness: 0.12,
        clearcoat: 0.68,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
      }),
      0xe0f2fe,
      2.2,
      0.32
    ),
    syringePlunger: new THREE.MeshStandardMaterial({
      color: 0x4fb3bf,
      roughness: 0.34,
      metalness: 0.25,
    }),
    apoptoticCell: attachFresnelRim(
      new THREE.MeshPhysicalMaterial({
        color: EDITORIAL_COLORS.apoptoticCell,
        roughness: 0.36,
        clearcoat: 0.28,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        side: THREE.DoubleSide,
        bumpMap: organicTex,
        bumpScale: 0.032,
      }),
      0xe879f9,
      2.0,
      0.38
    ),
    apoptosome: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.apoptosome,
      roughness: 0.32,
      metalness: 0.16,
    }),
  };
}

/**
 * Multi-softbox studio PMREM environment for high-contrast metallic silver & hydrogel reflections.
 */
export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x08101c);

  const softboxKey = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 12),
    new THREE.MeshBasicMaterial({ color: 0xfffdf7, side: THREE.DoubleSide })
  );
  softboxKey.position.set(-10, 12, 10);
  softboxKey.lookAt(0, 0, 0);
  envScene.add(softboxKey);

  const overheadStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 5),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  overheadStrip.position.set(0, 15, 2);
  overheadStrip.lookAt(0, 0, 0);
  envScene.add(overheadStrip);

  const softboxFill = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 10),
    new THREE.MeshBasicMaterial({ color: 0x99d5df, side: THREE.DoubleSide })
  );
  softboxFill.position.set(10, 2, 12);
  softboxFill.lookAt(0, 0, 0);
  envScene.add(softboxFill);

  const softboxRim = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 8),
    new THREE.MeshBasicMaterial({ color: 0x7dd3fc, side: THREE.DoubleSide })
  );
  softboxRim.position.set(0, -10, -11);
  softboxRim.lookAt(0, 0, 0);
  envScene.add(softboxRim);

  const floorBounce = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 16),
    new THREE.MeshBasicMaterial({ color: 0x162a3a, side: THREE.DoubleSide })
  );
  floorBounce.position.set(0, -14, 0);
  floorBounce.lookAt(0, 0, 0);
  envScene.add(floorBounce);

  const rt = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  return rt.texture;
}
