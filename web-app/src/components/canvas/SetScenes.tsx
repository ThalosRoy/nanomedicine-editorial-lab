import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  EDITORIAL_COLORS,
  type EditorialMaterialSet,
} from '../../materials/editorialMaterials';
import type { LigandMode, SetId } from '../../types/simulation';
import {
  EditorialAgNPUnit,
  NanocelluloseScaffold,
} from './GlbParts';
import {
  MODEL_PATHS,
  makePointerProps,
  useGlbGeometries,
  type InteractionCallbacks,
} from './glbHelpers';

interface SetScenesProps {
  activeSet: SetId;
  localT: number;
  xrayMode: boolean;
  ligandMode: LigandMode;
  agConcentration: number;
  rosRate: number;
  pulseBoost: number;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}

const NANOGEL_POCKETS: [number, number, number][] = [
  [0.0, 0.0, 0.0],
  [1.2, 0.8, 1.05],
  [-1.45, 1.05, 0.65],
  [1.5, -1.05, -0.75],
  [-0.95, -1.35, 1.15],
  [-1.25, 0.15, -1.55],
  [0.45, 1.65, -1.05],
  [1.75, 0.55, -0.95],
];

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/* --------------------------------------------------------------------------
 * SET 00: Scientific Editorial Environment & 5 Unified Material Families
 * -------------------------------------------------------------------------- */
function Set00EditorialEnvironment({
  xrayMode,
  materials,
  callbacks,
}: {
  xrayMode: boolean;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  const ringRef = useRef<THREE.Group>(null);
  const receptorGeos = useGlbGeometries(MODEL_PATHS.receptorFra);
  const mitoGeos = useGlbGeometries(MODEL_PATHS.mitochondrion);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <group>
      {/* Subtle Studio Calibration Disc */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.0, 0]}
        receiveShadow
        {...makePointerProps('editorial_studio', 'Plataforma de calibración Scientific Editorial', callbacks)}
      >
        <ringGeometry args={[2.2, 6.2, 64]} />
        <meshStandardMaterial
          color="#132235"
          roughness={0.65}
          metalness={0.2}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={ringRef}>
        {/* 1. Nanocellulose Matrix */}
        <group position={[-4.5, 0.1, 0]}>
          <NanocelluloseScaffold
            scale={0.38}
            cutaway={xrayMode}
            materials={materials}
            callbacks={callbacks}
          />
        </group>

        {/* 2. Silver Core + 3. Rosemary Corona + Folate */}
        <EditorialAgNPUnit
          position={[-1.5, 0.1, 1.2]}
          scale={0.82}
          cutawayCorona={xrayMode}
          withFolate
          materials={materials}
          callbacks={callbacks}
        />

        {/* 4. Receptor FR-alpha + Membrane Family */}
        <group position={[1.6, -0.3, 1.1]} scale={1.45}>
          {receptorGeos['Receptor_FR_Alpha'] && (
            <mesh
              geometry={receptorGeos['Receptor_FR_Alpha']}
              material={materials.receptorFR}
              {...makePointerProps('fr_alpha', 'Familia Macromolecular · Receptor FR-α', callbacks)}
            />
          )}
        </group>

        {/* 5. Mitochondrion Cutaway Organelle */}
        <group position={[4.5, 0.1, -0.4]} scale={0.26} rotation={[0.2, -0.4, 0]}>
          {mitoGeos['Mito_Outer_Cutaway'] && (
            <mesh
              geometry={mitoGeos['Mito_Outer_Cutaway']}
              material={materials.mitoOuter}
              {...makePointerProps('mito_cristae', 'Familia Organelo · Mitocondria en corte 3/4', callbacks)}
            />
          )}
          {mitoGeos['Mito_Cristae_Inner'] && (
            <mesh
              geometry={mitoGeos['Mito_Cristae_Inner']}
              material={materials.mitoCristae}
            />
          )}
          {mitoGeos['Mito_MtDNA_Helix'] && (
            <mesh geometry={mitoGeos['Mito_MtDNA_Helix']} material={materials.mitoDna} />
          )}
        </group>
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 01: Polymer Matrix Architecture (Nanocellulose + Folate Variant)
 * -------------------------------------------------------------------------- */
function Set01PolymerMatrix({
  xrayMode,
  ligandMode,
  materials,
  callbacks,
}: {
  xrayMode: boolean;
  ligandMode: LigandMode;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      <NanocelluloseScaffold
        scale={0.95}
        cutaway={xrayMode}
        withFolate={ligandMode !== 'base'}
        materials={materials}
        callbacks={callbacks}
      />
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 02: Silver Nanoparticles (Ag0 Satin Core + Ag+ Ion Orbit)
 * -------------------------------------------------------------------------- */
function Set02SilverNanoparticles({
  agConcentration,
  materials,
  callbacks,
}: {
  agConcentration: number;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  const coreGeos = useGlbGeometries(MODEL_PATHS.agnpCore);
  const ionsRef = useRef<THREE.Group>(null);

  const ionOffsets = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        angle: (i / 14) * Math.PI * 2,
        tilt: ((i % 5) - 2) * 0.35,
        radius: 2.35 + (i % 3) * 0.32,
        speed: 0.45 + (i % 4) * 0.12,
      })),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ionsRef.current) {
      ionsRef.current.children.forEach((child, idx) => {
        const cfg = ionOffsets[idx];
        const a = cfg.angle + t * cfg.speed;
        child.position.set(
          Math.cos(a) * cfg.radius,
          Math.sin(a * 1.3 + idx) * cfg.tilt * 1.4,
          Math.sin(a) * cfg.radius
        );
      });
    }
  });

  const visibleIons = Math.max(4, Math.round(ionOffsets.length * agConcentration));

  return (
    <group>
      {coreGeos['AgNP_Core'] && (
        <mesh
          geometry={coreGeos['AgNP_Core']}
          material={materials.silverSatin}
          scale={1.55}
          castShadow
          receiveShadow
          {...makePointerProps(
            'ag0_core',
            'Núcleo metálico de plata Ag⁰ (~17.5 nm · Micro-facetado satinado)',
            callbacks
          )}
        />
      )}
      <group ref={ionsRef}>
        {ionOffsets.map((_, idx) => (
          <mesh
            key={idx}
            visible={idx < visibleIons}
            material={materials.silverSatin}
            {...makePointerProps('ag_ion', 'Iones de plata Ag⁺ (Referencia iónica)', callbacks)}
          >
            <sphereGeometry args={[0.11, 14, 12]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 03: Rosemary Phytochemical Corona
 * -------------------------------------------------------------------------- */
function Set03RosemaryCorona({
  xrayMode,
  ligandMode,
  materials,
  callbacks,
}: {
  xrayMode: boolean;
  ligandMode: LigandMode;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.16;
    }
  });

  return (
    <group ref={groupRef}>
      <EditorialAgNPUnit
        scale={1.45}
        cutawayCorona={xrayMode}
        withFolate={ligandMode !== 'base'}
        materials={materials}
        callbacks={callbacks}
      />
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 04: Embedded Nanogel System (Protagonist)
 * -------------------------------------------------------------------------- */
function Set04EmbeddedNanogel({
  xrayMode,
  ligandMode,
  agConcentration,
  materials,
  callbacks,
}: {
  xrayMode: boolean;
  ligandMode: LigandMode;
  agConcentration: number;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    }
  });

  const visibleUnits = Math.max(3, Math.round(NANOGEL_POCKETS.length * agConcentration));

  return (
    <group ref={groupRef}>
      <NanocelluloseScaffold
        scale={0.95}
        cutaway={xrayMode}
        withFolate={ligandMode !== 'base'}
        materials={materials}
        callbacks={callbacks}
      />
      {NANOGEL_POCKETS.map((pos, idx) =>
        idx < visibleUnits ? (
          <EditorialAgNPUnit
            key={idx}
            position={[pos[0] * 0.95, pos[1] * 0.95, pos[2] * 0.95]}
            scale={idx === 0 ? 0.42 : 0.32}
            cutawayCorona={idx === 0 && xrayMode}
            withFolate={ligandMode !== 'base'}
            materials={materials}
            callbacks={callbacks}
          />
        ) : null
      )}
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 05: Tumor Tissue Microenvironment (Warburg pH 6.2-6.8 vs Healthy 7.4)
 * -------------------------------------------------------------------------- */
function Set05TumorMicroenvironment({
  localT,
  xrayMode,
  ligandMode,
  agConcentration,
  materials,
  callbacks,
}: {
  localT: number;
  xrayMode: boolean;
  ligandMode: LigandMode;
  agConcentration: number;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  const tumorGeos = useGlbGeometries(MODEL_PATHS.tumorMicroenv);
  const protonsRef = useRef<THREE.Group>(null);
  const releasedRef = useRef<THREE.Group>(null);

  const protons = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        x: 0.4 + ((i * 1.37) % 5.2),
        y: ((i % 7) - 3) * 0.72,
        z: Math.sin(i * 2.3) * 1.8,
        phase: i,
      })),
    []
  );

  const releasedTargets = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const ang = (i / 8) * Math.PI * 2;
        return new THREE.Vector3(
          2.2 + Math.cos(ang) * (1.8 + (i % 3) * 0.4),
          Math.sin(ang) * (1.5 + (i % 2) * 0.4),
          Math.sin(i * 1.9) * 1.1
        );
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (protonsRef.current) {
      protonsRef.current.children.forEach((child, idx) => {
        const p = protons[idx];
        child.position.set(p.x, p.y + Math.sin(t * 1.8 + p.phase) * 0.22, p.z);
      });
    }
    if (releasedRef.current) {
      const rel = smoothstep(0.2, 0.95, localT);
      releasedRef.current.children.forEach((child, idx) => {
        const start = new THREE.Vector3(2.2, 0, 0.2);
        child.position.lerpVectors(start, releasedTargets[idx], rel);
      });
    }
  });

  const depotScale = 0.26 + smoothstep(0.05, 0.45, localT) * 0.16;
  const visCount = Math.max(2, Math.round(releasedTargets.length * agConcentration));

  return (
    <group>
      {tumorGeos['Healthy_Epithelium'] && (
        <mesh
          geometry={tumorGeos['Healthy_Epithelium']}
          material={materials.healthyCell}
          {...makePointerProps(
            'healthy_tissue',
            'Tejido sano ordenado (pH 7.4 · Nanogel inactivo)',
            callbacks
          )}
        />
      )}
      {tumorGeos['Tumor_Spheroid_Cluster'] && (
        <mesh
          geometry={tumorGeos['Tumor_Spheroid_Cluster']}
          material={materials.tumorCell}
          {...makePointerProps(
            'warburg_tumor',
            'Esferoide tumoral · Efecto Warburg (pH 6.2–6.8)',
            callbacks
          )}
        />
      )}
      {tumorGeos['Vessel_Branch'] && (
        <mesh
          geometry={tumorGeos['Vessel_Branch']}
          material={materials.vesselBranch}
          {...makePointerProps(
            'vessel_branch',
            'Vasculatura angiogénica tumoral',
            callbacks
          )}
        />
      )}

      {/* Localized Nanogel Depot inside tumor interstitium */}
      <group position={[2.2, 0, 0.2]}>
        <NanocelluloseScaffold
          scale={depotScale}
          cutaway={xrayMode}
          withFolate={ligandMode !== 'base'}
          materials={materials}
          callbacks={callbacks}
        />
      </group>

      {/* Released AgNPs responding to Warburg acidity */}
      <group ref={releasedRef}>
        {releasedTargets.map((_, idx) => (
          <group key={idx} visible={localT > 0.18 && idx < visCount}>
            <EditorialAgNPUnit
              scale={0.18}
              withFolate={ligandMode !== 'base'}
              materials={materials}
              callbacks={callbacks}
            />
          </group>
        ))}
      </group>

      {/* Warburg H+ Protons */}
      <group ref={protonsRef}>
        {protons.map((_, idx) => (
          <mesh
            key={idx}
            {...makePointerProps('warburg_tumor', 'Protones H⁺ · Acidez tumoral (Warburg)', callbacks)}
          >
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color={EDITORIAL_COLORS.folateHead} roughness={0.45} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 06: Nanogel–Tissue Interaction & Ligand Targeting (Base vs +Folate)
 * -------------------------------------------------------------------------- */
function Set06TissueInteraction({
  localT,
  xrayMode,
  ligandMode,
  materials,
  callbacks,
}: {
  localT: number;
  xrayMode: boolean;
  ligandMode: LigandMode;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  const receptorGeos = useGlbGeometries(MODEL_PATHS.receptorFra);
  const baseUnitRef = useRef<THREE.Group>(null);
  const folateUnitRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const lipidPositions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let ix = -11; ix <= 11; ix++) {
      for (let iz = -3; iz <= 3; iz++) {
        arr.push([ix * 0.54, Math.cos(ix * 0.35) * 0.18, iz * 0.54]);
      }
    }
    return arr;
  }, []);

  const receptorXs = [-4.6, -2.8, -1.0, 1.0, 2.8, 4.6];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const baseApp = smoothstep(0.08, 0.9, localT) * 0.52;
    const folApp = smoothstep(0.05, 0.62, localT);

    const baseX = ligandMode === 'base' ? 0 : -2.85;
    const folX = ligandMode === 'folate' ? 0 : 2.85;

    if (baseUnitRef.current) {
      baseUnitRef.current.position.set(baseX, 2.2 - baseApp * 2.1 + Math.sin(t * 1.4) * 0.08, 0);
      baseUnitRef.current.rotation.y = t * 0.22;
    }
    if (folateUnitRef.current) {
      folateUnitRef.current.position.set(
        folX,
        2.2 - folApp * 2.75 + Math.sin(t * 1.6) * 0.04 * (1 - folApp),
        0
      );
      folateUnitRef.current.rotation.y = t * 0.28 * (1 - folApp * 0.85);
    }
    if (ringsRef.current) {
      ringsRef.current.position.x = folX;
      ringsRef.current.children.forEach((ring, idx) => {
        const mesh = ring as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (folApp > 0.78 && ligandMode !== 'base') {
          const wave = (t * 1.1 + idx * 0.5) % 1;
          mesh.scale.setScalar(0.65 + wave * 1.15);
          mat.opacity = (1 - wave) * 0.6;
        } else {
          mat.opacity = 0;
        }
      });
    }
  });

  return (
    <group position={[0, -0.8, 0]}>
      {/* Explicit Double-Leaflet Phospholipid Bilayer */}
      <group position={[0, -1.45, 0]}>
        {lipidPositions.map(([x, y, z], idx) => (
          <group key={idx} position={[x, y, z]}>
            <mesh
              position={[0, 0.25, 0]}
              {...makePointerProps(
                'lipid_bilayer',
                'Bicapa fosfolipídica plasmática (Cabeza polar externa)',
                callbacks
              )}
            >
              <sphereGeometry args={[0.11, 10, 8]} />
              <meshStandardMaterial color={EDITORIAL_COLORS.lipidHead} roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.25, 0]}>
              <sphereGeometry args={[0.11, 10, 8]} />
              <meshStandardMaterial color={EDITORIAL_COLORS.lipidHeadBot} roughness={0.42} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.026, 0.026, 0.48, 6]} />
              <meshStandardMaterial
                color={EDITORIAL_COLORS.lipidTail}
                roughness={0.65}
                transparent
                opacity={0.55}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Trimeric FR-alpha Receptors embedded in bilayer */}
      {receptorXs.map((rx, idx) => (
        <group
          key={idx}
          position={[rx, -1.02 + Math.cos(rx * 0.35) * 0.18, idx % 2 === 0 ? 0.3 : -0.3]}
          scale={0.85}
        >
          {receptorGeos['Receptor_FR_Alpha'] && (
            <mesh
              geometry={receptorGeos['Receptor_FR_Alpha']}
              material={materials.receptorFR}
              {...makePointerProps(
                'fr_alpha',
                'Receptor trimérico de Folato (FR-α)',
                callbacks
              )}
            />
          )}
        </group>
      ))}

      {/* Comparison Divider in 'compare' mode */}
      {ligandMode === 'compare' && (
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 5.8, 8]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.22} />
        </mesh>
      )}

      {/* Base Particle */}
      <group ref={baseUnitRef} visible={ligandMode === 'base' || ligandMode === 'compare'}>
        <EditorialAgNPUnit
          scale={0.88}
          cutawayCorona={xrayMode}
          withFolate={false}
          materials={materials}
          callbacks={callbacks}
        />
      </group>

      {/* +Folate Selective Particle */}
      <group ref={folateUnitRef} visible={ligandMode === 'folate' || ligandMode === 'compare'}>
        <EditorialAgNPUnit
          scale={0.88}
          cutawayCorona={xrayMode}
          withFolate
          materials={materials}
          callbacks={callbacks}
        />
      </group>

      {/* FR-alpha Docking Rings */}
      <group ref={ringsRef} position={[2.85, -0.38, 0]}>
        {[0, 1].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55 + i * 0.25, 0.025, 10, 32]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 07: Endocytosis (CME) & Endosomal Escape (Proposed Mechanism)
 * -------------------------------------------------------------------------- */
function Set07EndocytosisEscape({
  localT,
  xrayMode,
  ligandMode,
  agConcentration,
  rosRate,
  materials,
  callbacks,
}: {
  localT: number;
  xrayMode: boolean;
  ligandMode: LigandMode;
  agConcentration: number;
  rosRate: number;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  const clathrinGeos = useGlbGeometries(MODEL_PATHS.clathrinCage);
  const coreGeos = useGlbGeometries(MODEL_PATHS.agnpCore);
  const coronaGeos = useGlbGeometries(MODEL_PATHS.rosemaryCorona);

  const headsTopRef = useRef<THREE.Group>(null);
  const headsBotRef = useRef<THREE.Group>(null);
  const tailsRef = useRef<THREE.Group>(null);
  const cargoRef = useRef<THREE.Group>(null);
  const clathrinRef = useRef<THREE.Group>(null);
  const dynaminRef = useRef<THREE.Mesh>(null);
  const endoRef = useRef<THREE.Group>(null);
  const coronaShellRef = useRef<THREE.Group>(null);
  const protonsRef = useRef<THREE.Group>(null);
  const rosRef = useRef<THREE.Group>(null);
  const escapeIonsRef = useRef<THREE.Group>(null);

  const cmePhase = smoothstep(0.0, 0.36, localT);
  const acidPhase = smoothstep(0.32, 0.68, localT);
  const escapePhase = smoothstep(0.6, 0.98, localT);

  const lipidGrid = useMemo(() => {
    const arr: [number, number][] = [];
    for (let ix = -9; ix <= 9; ix++) {
      for (let iz = -3; iz <= 3; iz++) {
        arr.push([ix * 0.56, iz * 0.56]);
      }
    }
    return arr;
  }, []);

  const rosDirections = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / 24);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 2);
        return new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        );
      }),
    []
  );

  const escapeDirs = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const spreadY = ((i % 6) - 2.5) * 0.28;
        const spreadZ = Math.sin(i * 1.9) * 0.55;
        return new THREE.Vector3(0.85 + (i % 3) * 0.15, spreadY, spreadZ).normalize();
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. CME Membrane invagination (localT < 0.42)
    if (headsTopRef.current && headsBotRef.current && tailsRef.current) {
      const invag = smoothstep(0.02, 0.28, localT);
      const pinch = smoothstep(0.24, 0.38, localT);
      const pitDepth = invag * 2.8;
      lipidGrid.forEach(([x, z], idx) => {
        const r2 = x * x + z * z;
        const well = Math.exp(-r2 / 4.2) * pitDepth * (1 - pinch * 0.82);
        headsTopRef.current!.children[idx].position.set(x, 1.35 - well + 0.24, z);
        headsBotRef.current!.children[idx].position.set(x, 1.35 - well - 0.24, z);
        tailsRef.current!.children[idx].position.set(x, 1.35 - well, z);
      });
    }

    // 2. Cargo + Clathrin Cage + Dynamin Collar
    if (cargoRef.current && clathrinRef.current && dynaminRef.current) {
      const dropY = 2.0 - cmePhase * 2.15;
      cargoRef.current.position.set(0, dropY, 0);
      cargoRef.current.rotation.y = t * 0.25;
      const coreScale = 0.85 * (1 - escapePhase * 0.55);
      cargoRef.current.scale.setScalar(Math.max(0.32, coreScale));

      clathrinRef.current.position.set(0, dropY, 0);
      clathrinRef.current.rotation.y = t * 0.18;
      const fadeClathrin = 1 - smoothstep(0.32, 0.44, localT);
      clathrinRef.current.scale.setScalar((0.55 + cmePhase * 0.42) * Math.max(0.01, fadeClathrin));

      const dynActive = localT > 0.18 && localT < 0.38;
      dynaminRef.current.visible = dynActive;
      dynaminRef.current.position.set(0, 1.0, 0);
      dynaminRef.current.rotation.y = t * 1.4;
      const neck = Math.max(0.3, 1.0 - smoothstep(0.2, 0.36, localT) * 0.65);
      dynaminRef.current.scale.set(neck, 1, neck);
    }

    // 3. Acidifying Endosome + Corona Opening
    if (endoRef.current) {
      const col = new THREE.Color(0x3b82a6)
        .lerp(new THREE.Color(0xc2593f), acidPhase)
        .lerp(new THREE.Color(0xdc2626), escapePhase * 0.7);
      endoRef.current.children.forEach((ch) => {
        const m = (ch as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        if (m && m.color) {
          m.color.copy(col);
          m.opacity = 0.26 * (1 - escapePhase * 0.45);
        }
      });
    }

    if (coronaShellRef.current) {
      coronaShellRef.current.visible = escapePhase < 0.85;
      const expand = 1 + acidPhase * 0.75;
      coronaShellRef.current.scale.setScalar(expand);
      coronaShellRef.current.rotation.y = t * 0.22;
    }

    // 4. V-ATPase Protons & ROS Peroxidation Waves
    if (protonsRef.current) {
      protonsRef.current.children.forEach((child, idx) => {
        const cyc = (t * 0.75 + idx / 18) % 1;
        const ang = (idx / 18) * Math.PI * 2;
        const r = 3.1 * (1 - cyc * 0.68);
        child.position.set(Math.cos(ang) * r, Math.sin(ang) * r, Math.sin(cyc * Math.PI) * 0.7);
      });
    }

    if (rosRef.current) {
      const visRos = Math.round(rosDirections.length * (0.35 + rosRate * 0.65));
      rosRef.current.children.forEach((child, idx) => {
        child.visible = escapePhase > 0.05 && idx < visRos;
        if (!child.visible) return;
        const cyc = (t * 0.85 + idx / 24) % 1;
        const rad = 0.9 + cyc * 2.35;
        child.position.copy(rosDirections[idx]).multiplyScalar(rad);
      });
    }

    // 5. Cytosolic Ag+ Escape Stream
    if (escapeIonsRef.current) {
      const visAg = Math.round(escapeDirs.length * agConcentration);
      escapeIonsRef.current.children.forEach((child, idx) => {
        child.visible = escapePhase > 0.1 && idx < visAg;
        if (!child.visible) return;
        const delay = (idx / escapeDirs.length) * 0.45;
        const subT = Math.max(0, Math.min(1, (escapePhase - delay) / (1 - delay)));
        const dist = 0.7 + subT * 5.8;
        child.position.copy(escapeDirs[idx]).multiplyScalar(dist);
      });
    }
  });

  const showCmeMembrane = localT < 0.42;
  const showEndosome = localT >= 0.3;

  return (
    <group>
      {/* Phase 7a: Clathrin-mediated membrane invagination */}
      {showCmeMembrane && (
        <group>
          <group ref={headsTopRef}>
            {lipidGrid.map((_, i) => (
              <mesh
                key={i}
                {...makePointerProps('lipid_bilayer', 'Bicapa plasmática en invaginación CME', callbacks)}
              >
                <sphereGeometry args={[0.105, 8, 6]} />
                <meshStandardMaterial color={EDITORIAL_COLORS.lipidHead} roughness={0.36} />
              </mesh>
            ))}
          </group>
          <group ref={headsBotRef}>
            {lipidGrid.map((_, i) => (
              <mesh key={i}>
                <sphereGeometry args={[0.105, 8, 6]} />
                <meshStandardMaterial color={EDITORIAL_COLORS.lipidHeadBot} roughness={0.42} />
              </mesh>
            ))}
          </group>
          <group ref={tailsRef}>
            {lipidGrid.map((_, i) => (
              <mesh key={i}>
                <cylinderGeometry args={[0.022, 0.022, 0.46, 5]} />
                <meshStandardMaterial
                  color={EDITORIAL_COLORS.lipidTail}
                  roughness={0.65}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* Clathrin Cage + Dynamin */}
      <group ref={clathrinRef} visible={localT < 0.44}>
        {clathrinGeos['Clathrin_Struts'] && (
          <mesh
            geometry={clathrinGeos['Clathrin_Struts']}
            material={materials.clathrinCage}
            {...makePointerProps('clathrin', 'Canasta poliédrica de Clatrina (CME)', callbacks)}
          />
        )}
        {clathrinGeos['Clathrin_Hubs'] && (
          <mesh geometry={clathrinGeos['Clathrin_Hubs']} material={materials.clathrinCage} />
        )}
      </group>
      {clathrinGeos['Dynamin_Collar'] && (
        <mesh
          ref={dynaminRef}
          geometry={clathrinGeos['Dynamin_Collar']}
          material={materials.dynaminCollar}
          {...makePointerProps('clathrin', 'Collar de Dinamina (Escisión vesicular)', callbacks)}
        />
      )}

      {/* Core AgNP inside CME / Endosome */}
      <group ref={cargoRef}>
        {coreGeos['AgNP_Core'] && (
          <mesh
            geometry={coreGeos['AgNP_Core']}
            material={materials.silverSatin}
            {...makePointerProps(
              'ag0_core',
              escapePhase > 0.2 ? 'Núcleo Ag⁰ en disolución oxidativa' : 'Núcleo metálico Ag⁰',
              callbacks
            )}
          />
        )}
        <group ref={coronaShellRef}>
          {coronaGeos['Corona_Strands_Cutaway'] && (
            <mesh
              geometry={
                xrayMode
                  ? coronaGeos['Corona_Strands_Cutaway']
                  : coronaGeos['Corona_Strands_Full']
              }
              material={materials.rosemaryStrand}
              {...makePointerProps(
                'rosemary_corona',
                acidPhase > 0.3
                  ? 'Corona de romero protonándose (pH 4.5)'
                  : 'Corona de romero',
                callbacks
              )}
            />
          )}
          {coronaGeos['Corona_Tips_Cutaway'] && (
            <mesh
              geometry={
                xrayMode ? coronaGeos['Corona_Tips_Cutaway'] : coronaGeos['Corona_Tips_Full']
              }
              material={materials.rosemaryTip}
            />
          )}
          {ligandMode !== 'base' && <group scale={1} />}
        </group>
      </group>

      {/* Phase 7b & 7c: Endosome + V-ATPase Pumps + Breach */}
      {showEndosome && (
        <group>
          <group ref={endoRef}>
            <mesh
              visible={!xrayMode}
              {...makePointerProps('vatpase', 'Endosoma en acidificación (pH 4.5)', callbacks)}
            >
              <sphereGeometry args={[3.2, 42, 30]} />
              <meshPhysicalMaterial
                color="#3b82a6"
                roughness={0.22}
                clearcoat={0.4}
                transparent
                opacity={0.26}
                depthWrite={false}
              />
            </mesh>
            <mesh
              visible={xrayMode}
              {...makePointerProps('endosome_escape', 'Lumen endosomal (Corte 3/4)', callbacks)}
            >
              <sphereGeometry args={[3.2, 42, 30, Math.PI * 0.42, Math.PI * 1.44, 0, Math.PI]} />
              <meshPhysicalMaterial
                color="#3b82a6"
                roughness={0.22}
                clearcoat={0.4}
                transparent
                opacity={0.26}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>

          {/* 6 V-ATPase Proton Pumps */}
          {Array.from({ length: 6 }, (_, i) => {
            const ang = (i / 6) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(ang) * 3.2, Math.sin(ang) * 3.2, 0]}
                rotation={[0, 0, ang + Math.PI / 2]}
                {...makePointerProps(
                  'vatpase',
                  'Bomba V-ATPasa (Transporte de protones H⁺)',
                  callbacks
                )}
              >
                <cylinderGeometry args={[0.22, 0.28, 0.72, 14]} />
                <meshStandardMaterial color="#4fb3bf" roughness={0.38} />
              </mesh>
            );
          })}

          <group ref={protonsRef} visible={acidPhase > 0.05 && escapePhase < 0.7}>
            {Array.from({ length: 18 }, (_, i) => (
              <mesh key={i}>
                <sphereGeometry args={[0.07, 10, 8]} />
                <meshStandardMaterial color={EDITORIAL_COLORS.folateHead} roughness={0.4} />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* ROS Peroxidation Waves */}
      <group ref={rosRef}>
        {rosDirections.map((_, idx) => (
          <mesh
            key={idx}
            {...makePointerProps(
              'endosome_escape',
              'Especies ROS peroxidando membrana endosómica',
              callbacks
            )}
          >
            <sphereGeometry args={[0.1, 10, 8]} />
            <meshStandardMaterial
              color={EDITORIAL_COLORS.rosHot}
              emissive="#9a3412"
              emissiveIntensity={0.45}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>

      {/* Escaping Cytosolic Ag+ Ions */}
      <group ref={escapeIonsRef}>
        {escapeDirs.map((_, idx) => (
          <mesh
            key={idx}
            material={materials.silverSatin}
            {...makePointerProps('ag_ion', 'Escape de iones Ag⁺ hacia el citosol', callbacks)}
          >
            <sphereGeometry args={[0.13, 14, 10]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 08: Mitochondrial Oxidative Stress & Apoptosis (Proposed Mechanism)
 * -------------------------------------------------------------------------- */
function Set08MitochondriaApoptosis({
  localT,
  xrayMode,
  agConcentration,
  rosRate,
  pulseBoost,
  materials,
  callbacks,
}: {
  localT: number;
  xrayMode: boolean;
  agConcentration: number;
  rosRate: number;
  pulseBoost: number;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  const mitoGeos = useGlbGeometries(MODEL_PATHS.mitochondrion);
  const apopGeos = useGlbGeometries(MODEL_PATHS.apoptosomeCell);

  const mitoGroupRef = useRef<THREE.Group>(null);
  const agIonsRef = useRef<THREE.Group>(null);
  const gshRef = useRef<THREE.Group>(null);
  const rosRef = useRef<THREE.Group>(null);
  const apopGroupRef = useRef<THREE.Group>(null);
  const cytStreamRef = useRef<THREE.Group>(null);
  const wheelARef = useRef<THREE.Mesh>(null);
  const wheelBRef = useRef<THREE.Mesh>(null);
  const bodiesRef = useRef<THREE.Group>(null);

  const padlockPositions = useMemo<[number, number, number][]>(
    () => [
      [-4.2, 2.8, 1.0],
      [0.2, 3.2, 1.2],
      [4.3, 2.5, 0.9],
      [-3.8, -2.7, 1.0],
      [4.0, -2.6, 1.0],
    ],
    []
  );

  const gshPositions = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const x = ((i % 4) - 1.5) * 1.9;
        const y = ((Math.floor(i / 4) % 4) - 1.5) * 0.65;
        const z = Math.sin(i * 1.7) * 0.9;
        return new THREE.Vector3(x, y, z);
      }),
    []
  );

  const agOuterPositions = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const ang = (i / 18) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(ang) * 7.8, Math.sin(ang) * 4.4, Math.sin(i * 2.1) * 2.5);
      }),
    []
  );

  const cytTargets = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        start: new THREE.Vector3(-2.4, -0.5, 0.4),
        end: (i % 2 === 0 ? new THREE.Vector3(1.6, 1.0, 0.4) : new THREE.Vector3(3.2, -1.0, -0.4)).add(
          new THREE.Vector3(Math.sin(i) * 0.45, Math.cos(i) * 0.45, 0)
        ),
        offset: i / 16,
      })),
    []
  );

  const bodyDirs = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const ang = (i / 8) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(ang) * 4.2, Math.sin(ang) * 3.0, Math.sin(i * 1.9) * 1.6);
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const boost = pulseBoost / 100;
    const agInflux = Math.min(1, localT * 1.8 + boost);
    const rosStorm = Math.min(1, Math.max(0, (localT - 0.15) * 1.6 + boost)) * (0.45 + rosRate * 0.55);
    const apopPhase = smoothstep(0.45, 0.95, localT);

    // Mitochondrion position & swelling transition
    if (mitoGroupRef.current) {
      const targetPos = new THREE.Vector3(-2.4 * apopPhase, -0.9 * apopPhase, 0);
      mitoGroupRef.current.position.copy(targetPos);
      const s = (1 + rosStorm * 0.08) * (1 - apopPhase * 0.48);
      mitoGroupRef.current.scale.setScalar(s);
      mitoGroupRef.current.rotation.z = apopPhase * 0.22;
    }

    // Converging Ag+ ions blocking GSH
    if (agIonsRef.current) {
      const visAg = Math.round(agOuterPositions.length * agConcentration);
      agIonsRef.current.children.forEach((child, idx) => {
        child.visible = idx < visAg && apopPhase < 0.75;
        if (!child.visible) return;
        const tgt = gshPositions[idx % gshPositions.length];
        child.position.lerpVectors(agOuterPositions[idx], tgt, agInflux);
      });
    }

    // GSH shields turning slate when blocked
    if (gshRef.current) {
      gshRef.current.children.forEach((grp, idx) => {
        grp.visible = apopPhase < 0.65;
        grp.position.y = padlockPositions[idx][1] + Math.sin(t * 1.3 + idx) * 0.1;
        const blocked = agInflux > 0.35 + idx * 0.1;
        const mesh = grp.children[0] as THREE.Mesh;
        const shackle = grp.children[1] as THREE.Mesh;
        if (mesh && shackle) {
          (mesh.material as THREE.MeshStandardMaterial).color.setHex(
            blocked ? EDITORIAL_COLORS.gshBlocked : EDITORIAL_COLORS.gshShield
          );
          shackle.rotation.z = blocked ? -0.58 : 0;
        }
      });
    }

    // ROS surge cloud
    if (rosRef.current) {
      const visRos = Math.round(32 * Math.min(1, 0.18 + rosStorm * 0.82));
      rosRef.current.children.forEach((child, idx) => {
        child.visible = idx < visRos && apopPhase < 0.85;
        if (!child.visible) return;
        const phase = t * (1.1 + (idx % 4) * 0.25) + idx;
        const rad = 1.6 + (idx % 5) * 0.65;
        child.position.set(
          Math.sin(phase) * rad * 1.6,
          Math.cos(phase * 1.1) * rad * 0.7,
          Math.cos(phase * 0.85) * rad * 0.85
        );
      });
    }

    // Apoptosome Cell Cutaway + Caspase 9 -> 3 + Cytochrome c
    if (apopGroupRef.current) {
      apopGroupRef.current.visible = localT > 0.36;
      const appear = smoothstep(0.36, 0.62, localT);
      apopGroupRef.current.scale.setScalar(0.5 + appear * 0.5);
    }

    if (wheelARef.current && wheelBRef.current) {
      wheelARef.current.rotation.z = t * 0.55;
      wheelBRef.current.rotation.z = -t * 0.48;
      const wheelScale = smoothstep(0.45, 0.72, localT);
      wheelARef.current.scale.setScalar(Math.max(0.01, wheelScale));
      wheelBRef.current.scale.setScalar(Math.max(0.01, wheelScale));
    }

    if (cytStreamRef.current) {
      cytStreamRef.current.children.forEach((child, idx) => {
        child.visible = localT > 0.44;
        if (!child.visible) return;
        const cfg = cytTargets[idx];
        const flow = (t * 0.42 + cfg.offset) % 1;
        child.position.lerpVectors(cfg.start, cfg.end, flow);
        child.position.y += Math.sin(flow * Math.PI) * 0.9;
      });
    }

    if (bodiesRef.current) {
      const bAppear = smoothstep(0.62, 0.96, localT);
      bodiesRef.current.children.forEach((child, idx) => {
        child.visible = localT > 0.6;
        child.scale.setScalar(0.25 + bAppear * 0.75);
        child.position.copy(bodyDirs[idx]).multiplyScalar(0.68 + bAppear * 0.32);
        child.position.y += Math.sin(t * 1.2 + idx) * 0.1;
      });
    }
  });

  return (
    <group>
      {/* Mitochondrion (Blender Cutaway + Cristae + mtDNA) */}
      <group ref={mitoGroupRef}>
        {mitoGeos['Mito_Outer_Cutaway'] && (
          <mesh
            geometry={mitoGeos['Mito_Outer_Cutaway']}
            material={materials.mitoOuter}
            visible={xrayMode}
            {...makePointerProps(
              'mito_cristae',
              'Membrana mitocondrial externa (Corte 3/4)',
              callbacks
            )}
          />
        )}
        {mitoGeos['Mito_Cristae_Inner'] && (
          <mesh
            geometry={mitoGeos['Mito_Cristae_Inner']}
            material={materials.mitoCristae}
            {...makePointerProps(
              'mito_cristae',
              'Crestas mitocondriales internas (ΔΨm)',
              callbacks
            )}
          />
        )}
        {mitoGeos['Mito_MtDNA_Helix'] && (
          <mesh
            geometry={mitoGeos['Mito_MtDNA_Helix']}
            material={materials.mitoDna}
            {...makePointerProps('mito_cristae', 'ADN mitocondrial circular (mtDNA)', callbacks)}
          />
        )}
        {/* GSH Internal Molecules */}
        {gshPositions.map((pos, idx) => (
          <mesh
            key={idx}
            position={[pos.x, pos.y, pos.z]}
            {...makePointerProps('gsh', 'Glutatión reducido (GSH)', callbacks)}
          >
            <sphereGeometry args={[0.14, 12, 10]} />
            <meshStandardMaterial color={EDITORIAL_COLORS.gshShield} roughness={0.42} />
          </mesh>
        ))}
      </group>

      {/* GSH Padlock Shields */}
      <group ref={gshRef}>
        {padlockPositions.map((pos, idx) => (
          <group key={idx} position={pos}>
            <mesh
              {...makePointerProps(
                'gsh',
                'Escudo antioxidante GSH (Bloqueo tiol –SH por Ag⁺)',
                callbacks
              )}
            >
              <boxGeometry args={[0.56, 0.46, 0.2]} />
              <meshStandardMaterial
                color={EDITORIAL_COLORS.gshShield}
                roughness={0.36}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[0, 0.24, 0]}>
              <torusGeometry args={[0.2, 0.052, 10, 20, Math.PI]} />
              <meshStandardMaterial
                color={EDITORIAL_COLORS.gshShield}
                roughness={0.36}
                metalness={0.3}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Converging Ag+ Ions */}
      <group ref={agIonsRef}>
        {agOuterPositions.map((_, idx) => (
          <mesh
            key={idx}
            material={materials.silverSatin}
            {...makePointerProps('ag_ion', 'Ion Plata (Ag⁺ · Secuestro de tiol –SH)', callbacks)}
          >
            <sphereGeometry args={[0.135, 14, 10]} />
          </mesh>
        ))}
      </group>

      {/* ROS Surge Radicals */}
      <group ref={rosRef}>
        {Array.from({ length: 32 }, (_, idx) => (
          <mesh
            key={idx}
            {...makePointerProps('ros', 'Especies Reactivas de Oxígeno (ROS)', callbacks)}
          >
            <sphereGeometry args={[0.1, 10, 8]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? EDITORIAL_COLORS.rosHot : EDITORIAL_COLORS.rosRadical}
              emissive="#92400e"
              emissiveIntensity={0.42}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>

      {/* Apoptosis Stage (Cell Cortex Cutaway + Apoptosome Wheels + Cytochrome c) */}
      <group ref={apopGroupRef}>
        {apopGeos['Cell_Cortex_Cutaway'] && (
          <mesh
            geometry={apopGeos['Cell_Cortex_Cutaway']}
            material={materials.apoptoticCell}
            visible={xrayMode}
            {...makePointerProps(
              'apoptosome',
              'Célula tumoral en apoptosis programada limpia',
              callbacks
            )}
          />
        )}
        {apopGeos['Apoptosome_Wheel'] && (
          <>
            <mesh
              ref={wheelARef}
              geometry={apopGeos['Apoptosome_Wheel']}
              material={materials.apoptosome}
              position={[1.6, 1.0, 0.4]}
              {...makePointerProps(
                'apoptosome',
                'Complejo activo Caspasa 9 → Caspasa 3',
                callbacks
              )}
            />
            <mesh
              ref={wheelBRef}
              geometry={apopGeos['Apoptosome_Wheel']}
              material={materials.apoptosome}
              position={[3.2, -1.0, -0.4]}
              {...makePointerProps('apoptosome', 'Apoptosoma ejecutor Caspasa 3', callbacks)}
            />
          </>
        )}

        <group ref={cytStreamRef}>
          {cytTargets.map((_, idx) => (
            <mesh
              key={idx}
              {...makePointerProps('cytc', 'Citocromo c liberado al citosol', callbacks)}
            >
              <sphereGeometry args={[0.13, 12, 10]} />
              <meshStandardMaterial
                color={EDITORIAL_COLORS.cytC}
                roughness={0.3}
                metalness={0.15}
              />
            </mesh>
          ))}
        </group>

        <group ref={bodiesRef}>
          {bodyDirs.map((_, idx) => (
            <mesh
              key={idx}
              {...makePointerProps(
                'apoptosome',
                'Cuerpo apoptótico sellado (Sin necrosis inflamatoria)',
                callbacks
              )}
            >
              <sphereGeometry args={[0.48 + (idx % 3) * 0.12, 20, 16]} />
              <meshPhysicalMaterial
                color="#8b5cf6"
                roughness={0.32}
                clearcoat={0.3}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------------
 * Master Dispatcher across all 9 Sets (00 - 08)
 * -------------------------------------------------------------------------- */
export function SetScenes(props: SetScenesProps) {
  switch (props.activeSet) {
    case 0:
      return (
        <Set00EditorialEnvironment
          xrayMode={props.xrayMode}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 1:
      return (
        <Set01PolymerMatrix
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 2:
      return (
        <Set02SilverNanoparticles
          agConcentration={props.agConcentration}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 3:
      return (
        <Set03RosemaryCorona
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 4:
      return (
        <Set04EmbeddedNanogel
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          agConcentration={props.agConcentration}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 5:
      return (
        <Set05TumorMicroenvironment
          localT={props.localT}
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          agConcentration={props.agConcentration}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 6:
      return (
        <Set06TissueInteraction
          localT={props.localT}
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 7:
      return (
        <Set07EndocytosisEscape
          localT={props.localT}
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          agConcentration={props.agConcentration}
          rosRate={props.rosRate}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 8:
      return (
        <Set08MitochondriaApoptosis
          localT={props.localT}
          xrayMode={props.xrayMode}
          agConcentration={props.agConcentration}
          rosRate={props.rosRate}
          pulseBoost={props.pulseBoost}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
  }
}
