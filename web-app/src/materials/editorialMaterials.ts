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

export function createEditorialMaterials(): EditorialMaterialSet {
  return {
    nanocelluloseFibril: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.nanocelluloseFibril,
      roughness: 0.34,
      metalness: 0.05,
    }),
    nanocelluloseNode: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.nanocelluloseNode,
      roughness: 0.36,
      metalness: 0.08,
    }),
    hydrogelShell: new THREE.MeshPhysicalMaterial({
      color: EDITORIAL_COLORS.hydrogelShell,
      roughness: 0.16,
      metalness: 0.02,
      clearcoat: 0.65,
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    silverSatin: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.silverSatin,
      roughness: 0.25,
      metalness: 0.84,
      envMapIntensity: 1.35,
    }),
    rosemaryStrand: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.rosemaryStrand,
      roughness: 0.58,
      metalness: 0.04,
    }),
    rosemaryTip: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.rosemaryTip,
      roughness: 0.5,
      metalness: 0.06,
    }),
    folateStalk: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.folateStalk,
      roughness: 0.58,
      metalness: 0.03,
    }),
    folateHead: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.folateHead,
      roughness: 0.38,
      metalness: 0.12,
    }),
    tumorCell: new THREE.MeshPhysicalMaterial({
      color: EDITORIAL_COLORS.tumorCell,
      roughness: 0.48,
      clearcoat: 0.18,
      transparent: true,
      opacity: 0.88,
    }),
    vesselBranch: new THREE.MeshPhysicalMaterial({
      color: EDITORIAL_COLORS.vesselBranch,
      roughness: 0.4,
      clearcoat: 0.25,
    }),
    healthyCell: new THREE.MeshPhysicalMaterial({
      color: EDITORIAL_COLORS.healthyCell,
      roughness: 0.46,
      clearcoat: 0.15,
      transparent: true,
      opacity: 0.86,
    }),
    receptorFR: new THREE.MeshPhysicalMaterial({
      color: EDITORIAL_COLORS.receptorFR,
      roughness: 0.42,
      clearcoat: 0.22,
    }),
    clathrinCage: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.clathrinCage,
      roughness: 0.35,
      metalness: 0.08,
    }),
    dynaminCollar: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.dynaminCollar,
      roughness: 0.38,
      metalness: 0.12,
    }),
    mitoOuter: new THREE.MeshPhysicalMaterial({
      color: EDITORIAL_COLORS.mitoOuter,
      roughness: 0.28,
      clearcoat: 0.35,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    mitoCristae: new THREE.MeshPhysicalMaterial({
      color: EDITORIAL_COLORS.mitoCristae,
      roughness: 0.34,
      transparent: true,
      opacity: 0.52,
      side: THREE.DoubleSide,
    }),
    mitoDna: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.mitoDna,
      roughness: 0.38,
      metalness: 0.08,
    }),
    mitoEtc: new THREE.MeshStandardMaterial({
      color: 0xd18f4d,
      roughness: 0.38,
      metalness: 0.12,
    }),
    syringeGlass: new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      roughness: 0.12,
      clearcoat: 0.65,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    }),
    syringePlunger: new THREE.MeshStandardMaterial({
      color: 0x4fb3bf,
      roughness: 0.34,
      metalness: 0.25,
    }),
    apoptoticCell: new THREE.MeshPhysicalMaterial({
      color: EDITORIAL_COLORS.apoptoticCell,
      roughness: 0.38,
      clearcoat: 0.25,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    apoptosome: new THREE.MeshStandardMaterial({
      color: EDITORIAL_COLORS.apoptosome,
      roughness: 0.34,
      metalness: 0.14,
    }),
  };
}

/**
 * Procedural 3-softbox studio PMREM environment for satin silver & hydrated hydrogel reflections.
 */
export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x09111e);

  const softboxKey = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 12),
    new THREE.MeshBasicMaterial({ color: 0xf8fafc, side: THREE.DoubleSide })
  );
  softboxKey.position.set(-10, 12, 10);
  softboxKey.lookAt(0, 0, 0);
  envScene.add(softboxKey);

  const softboxFill = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 10),
    new THREE.MeshBasicMaterial({ color: 0x99d5df, side: THREE.DoubleSide })
  );
  softboxFill.position.set(9, 2, 12);
  softboxFill.lookAt(0, 0, 0);
  envScene.add(softboxFill);

  const softboxRim = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 8),
    new THREE.MeshBasicMaterial({ color: 0xbceaf4, side: THREE.DoubleSide })
  );
  softboxRim.position.set(0, -11, -10);
  softboxRim.lookAt(0, 0, 0);
  envScene.add(softboxRim);

  const rt = pmrem.fromScene(envScene, 0.045);
  pmrem.dispose();
  return rt.texture;
}
