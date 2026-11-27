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
  const receptorGeos = useGlbGeometries(MODEL_PATHS.receptorFra);
  const mitoGeos = useGlbGeometries(MODEL_PATHS.mitochondrion);

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.0, 0]}
        receiveShadow
        {...makePointerProps(
          'editorial_studio',
          'Plataforma de calibración Scientific Editorial',
          callbacks
        )}
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

      <group position={[-4.5, 0.1, 0]}>
        <NanocelluloseScaffold
          scale={0.38}
          cutaway={xrayMode}
          materials={materials}
          callbacks={callbacks}
        />
      </group>

      <EditorialAgNPUnit
        position={[-1.5, 0.1, 1.2]}
        scale={0.82}
        cutawayCorona={xrayMode}
        withFolate
        materials={materials}
        callbacks={callbacks}
      />

      <group position={[1.6, -0.3, 1.1]} scale={1.45}>
        {receptorGeos['Receptor_FR_Alpha'] && (
          <mesh
            geometry={receptorGeos['Receptor_FR_Alpha']}
            material={materials.receptorFR}
            {...makePointerProps('fr_alpha', 'Familia Macromolecular · Receptor FR-α', callbacks)}
          />
        )}
      </group>

      <group position={[4.5, 0.1, -0.4]} scale={0.26}>
        {mitoGeos['Mito_Outer_Cutaway'] && (
          <mesh
            geometry={mitoGeos['Mito_Outer_Cutaway']}
            material={materials.mitoOuter}
            {...makePointerProps('mito_cristae', 'Familia Organelo · Mitocondria en corte 3/4', callbacks)}
          />
        )}
        {mitoGeos['Mito_Cristae_Inner'] && (
          <mesh geometry={mitoGeos['Mito_Cristae_Inner']} material={materials.mitoCristae} />
        )}
        {mitoGeos['Mito_MtDNA_Helix'] && (
          <mesh geometry={mitoGeos['Mito_MtDNA_Helix']} material={materials.mitoDna} />
        )}
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 01: Polymer Matrix Architecture (Pure Nanocellulose)
 * -------------------------------------------------------------------------- */
function Set01PolymerMatrix({
  xrayMode,
  materials,
  callbacks,
}: {
  xrayMode: boolean;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  return (
    <NanocelluloseScaffold
      scale={0.95}
      cutaway={xrayMode}
      materials={materials}
      callbacks={callbacks}
    />
  );
}

/* --------------------------------------------------------------------------
 * SET 02: AgNP + Rosemary Phytochemical Corona (+Optional Folate on AgNP)
 * -------------------------------------------------------------------------- */
function Set02RosemaryCorona({
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
  return (
    <EditorialAgNPUnit
      scale={1.45}
      cutawayCorona={xrayMode}
      withFolate={ligandMode !== 'base'}
      materials={materials}
      callbacks={callbacks}
    />
  );
}

/* --------------------------------------------------------------------------
 * SET 03: Embedded Nanogel System (Protagonist — Folate ONLY on Internal AgNPs)
 * -------------------------------------------------------------------------- */
function Set03EmbeddedNanogel({
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
  const visibleUnits = Math.max(3, Math.round(NANOGEL_POCKETS.length * agConcentration));

  return (
    <group>
      <NanocelluloseScaffold
        scale={0.95}
        cutaway={xrayMode}
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
 * SET 04: Syringe Pseudoplastic Injection & Warburg Microenvironment
 * -------------------------------------------------------------------------- */
function Set04TumorInjection({
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
  const syringeGeos = useGlbGeometries(MODEL_PATHS.syringeInjector);
  const plungerRef = useRef<THREE.Mesh>(null);
  const dropsRef = useRef<THREE.Group>(null);
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
    const injectT = smoothstep(0.0, 0.55, localT);

    if (plungerRef.current) {
      plungerRef.current.position.y = -injectT * 1.75;
    }

    if (dropsRef.current) {
      dropsRef.current.children.forEach((child, idx) => {
        const cyc = (t * 1.15 + idx / 8) % 1;
        child.visible = localT < 0.72;
        child.position.set(0, 3.2 - cyc * 3.1, 0);
      });
    }

    if (protonsRef.current) {
      protonsRef.current.children.forEach((child, idx) => {
        const p = protons[idx];
        child.position.set(p.x, p.y + Math.sin(t * 1.4 + p.phase) * 0.22, p.z);
      });
    }

    if (releasedRef.current) {
      const rel = smoothstep(0.28, 0.96, localT);
      releasedRef.current.children.forEach((child, idx) => {
        const start = new THREE.Vector3(2.2, 0, 0.25);
        child.position.lerpVectors(start, releasedTargets[idx], rel);
      });
    }
  });

  const depotScale = 0.20 + smoothstep(0.05, 0.55, localT) * 0.24;
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
          {...makePointerProps('vessel_branch', 'Vasculatura angiogénica tumoral', callbacks)}
        />
      )}

      {/* Angled Syringe Injector aimed directly into tumor core */}
      <group position={[2.2, 0.0, 0.25]} rotation={[0, 0, -0.44]}>
        {syringeGeos['Syringe_Barrel'] && (
          <mesh
            geometry={syringeGeos['Syringe_Barrel']}
            material={materials.syringeGlass}
            {...makePointerProps(
              'syringe_gel',
              'Jeringa de administración intratumoral',
              callbacks
            )}
          />
        )}
        {syringeGeos['Syringe_Plunger'] && (
          <mesh
            ref={plungerRef}
            geometry={syringeGeos['Syringe_Plunger']}
            material={materials.syringePlunger}
            {...makePointerProps(
              'syringe_gel',
              'Émbolo · Flujo pseudoplástico bajo presión',
              callbacks
            )}
          />
        )}
        {syringeGeos['Syringe_Needle'] && (
          <mesh
            geometry={syringeGeos['Syringe_Needle']}
            material={materials.silverSatin}
            {...makePointerProps('syringe_gel', 'Cánula metálica de depósito in situ', callbacks)}
          />
        )}
        <group ref={dropsRef}>
          {Array.from({ length: 8 }, (_, idx) => (
            <mesh key={idx} scale={[0.75, 1.9, 0.75]}>
              <sphereGeometry args={[0.095, 12, 10]} />
              <meshPhysicalMaterial
                color="#5ec2cc"
                roughness={0.2}
                transparent
                opacity={0.78}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Localized Nanogel Depot formed in situ inside tumor */}
      <group position={[2.2, 0, 0.25]}>
        <NanocelluloseScaffold
          scale={depotScale}
          cutaway={xrayMode}
          materials={materials}
          callbacks={callbacks}
        />
      </group>

      {/* Released AgNPs responding to Warburg acidity */}
      <group ref={releasedRef}>
        {releasedTargets.map((_, idx) => (
          <group key={idx} visible={localT > 0.24 && idx < visCount}>
            <EditorialAgNPUnit
              scale={0.18}
              withFolate={ligandMode !== 'base'}
              materials={materials}
              callbacks={callbacks}
            />
          </group>
        ))}
      </group>

      <group ref={protonsRef}>
        {protons.map((_, idx) => (
          <mesh
            key={idx}
            {...makePointerProps('warburg_tumor', 'Protones H⁺ · Acidez tumoral (Warburg)', callbacks)}
          >
            <sphereGeometry args={[0.055, 10, 8]} />
            <meshStandardMaterial color={EDITORIAL_COLORS.folateHead} roughness={0.45} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 05: Nanogel–Tissue Interaction & Ligand Targeting (Base vs +Folate)
 * -------------------------------------------------------------------------- */
function Set05TissueInteraction({
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
      baseUnitRef.current.position.set(baseX, 2.2 - baseApp * 2.1 + Math.sin(t * 1.2) * 0.06, 0);
    }
    if (folateUnitRef.current) {
      folateUnitRef.current.position.set(
        folX,
        2.2 - folApp * 2.75 + Math.sin(t * 1.3) * 0.04 * (1 - folApp),
        0
      );
    }
    if (ringsRef.current) {
      ringsRef.current.position.x = folX;
      ringsRef.current.children.forEach((ring, idx) => {
        const mesh = ring as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (folApp > 0.78 && ligandMode !== 'base') {
          const wave = (t * 0.9 + idx * 0.5) % 1;
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
              {...makePointerProps('fr_alpha', 'Receptor trimérico de Folato (FR-α)', callbacks)}
            />
          )}
        </group>
      ))}

      {ligandMode === 'compare' && (
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 5.8, 8]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.22} />
        </mesh>
      )}

      <group ref={baseUnitRef} visible={ligandMode === 'base' || ligandMode === 'compare'}>
        <EditorialAgNPUnit
          scale={0.88}
          cutawayCorona={xrayMode}
          withFolate={false}
          materials={materials}
          callbacks={callbacks}
        />
      </group>

      <group ref={folateUnitRef} visible={ligandMode === 'folate' || ligandMode === 'compare'}>
        <EditorialAgNPUnit
          scale={0.88}
          cutawayCorona={xrayMode}
          withFolate
          materials={materials}
          callbacks={callbacks}
        />
      </group>

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
 * SET 06: Endocytosis (Horizontal Dynamin Neck Scission) & Endosomal Escape
 * -------------------------------------------------------------------------- */
function Set06EndocytosisEscape({
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
  const folateGeos = useGlbGeometries(MODEL_PATHS.folateLigands);

  const headsTopRef = useRef<THREE.Group>(null);
  const headsBotRef = useRef<THREE.Group>(null);
  const tailsRef = useRef<THREE.Group>(null);
  const neckFunnelRef = useRef<THREE.Mesh>(null);
  const cargoRef = useRef<THREE.Group>(null);
  const clathrinRef = useRef<THREE.Group>(null);
  const dynaminRef = useRef<THREE.Mesh>(null);
  const endoRef = useRef<THREE.Group>(null);
  const coronaShellRef = useRef<THREE.Group>(null);
  const protonsRef = useRef<THREE.Group>(null);
  const rosRef = useRef<THREE.Group>(null);
  const escapeIonsRef = useRef<THREE.Group>(null);

  const cmePhase = smoothstep(0.0, 0.34, localT);
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

    const invag = smoothstep(0.0, 0.24, localT);
    const scission = smoothstep(0.18, 0.34, localT);
    const detach = smoothstep(0.30, 0.42, localT);

    if (headsTopRef.current && headsBotRef.current && tailsRef.current) {
      const pitDepth = invag * 2.2 * (1 - scission * 0.92);
      lipidGrid.forEach(([x, z], idx) => {
        const r = Math.hypot(x, z);
        const r2 = r * r;
        const well = Math.exp(-r2 / 3.4) * pitDepth;
        const neckPinch =
          r > 0.25 && r < 2.2 ? Math.sin(scission * Math.PI) * 0.26 * (1 / (0.6 + r)) : 0;
        const px = x * (1 - neckPinch);
        const pz = z * (1 - neckPinch);
        headsTopRef.current!.children[idx].position.set(px, 1.9 - well + 0.22, pz);
        headsBotRef.current!.children[idx].position.set(px, 1.9 - well - 0.22, pz);
        tailsRef.current!.children[idx].position.set(px, 1.9 - well, pz);
      });
    }

    if (neckFunnelRef.current) {
      neckFunnelRef.current.visible = localT > 0.06 && localT < 0.35;
      const neckPinchScale = Math.max(0.08, 1.0 - scission * 0.92);
      neckFunnelRef.current.scale.set(neckPinchScale, 1, neckPinchScale);
    }

    if (dynaminRef.current) {
      dynaminRef.current.visible = localT > 0.12 && localT < 0.37;
      dynaminRef.current.position.set(0, 1.42, 0);
      dynaminRef.current.rotation.set(0, t * 0.45, 0);
      const collarScale = Math.max(0.18, 1.15 - scission * 0.95);
      dynaminRef.current.scale.set(collarScale, 1, collarScale);
    }

    const vesicleY = 1.6 - cmePhase * 1.9 - detach * 0.15 + smoothstep(0.42, 0.55, localT) * 0.45;
    if (cargoRef.current && clathrinRef.current) {
      cargoRef.current.position.set(0, vesicleY, 0);
      const coreScale = 0.85 * (1 - escapePhase * 0.55);
      cargoRef.current.scale.setScalar(Math.max(0.32, coreScale));

      clathrinRef.current.position.set(0, vesicleY, 0);
      const fadeClathrin = 1 - smoothstep(0.34, 0.46, localT);
      clathrinRef.current.scale.setScalar((0.55 + cmePhase * 0.42) * Math.max(0.01, fadeClathrin));
    }

    if (endoRef.current) {
      endoRef.current.position.set(0, vesicleY, 0);
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
      coronaShellRef.current.scale.setScalar(1 + acidPhase * 0.75);
    }

    if (protonsRef.current) {
      protonsRef.current.position.set(0, vesicleY, 0);
      protonsRef.current.children.forEach((child, idx) => {
        const cyc = (t * 0.65 + idx / 18) % 1;
        const ang = (idx / 18) * Math.PI * 2;
        const r = 3.0 * (1 - cyc * 0.68);
        child.position.set(Math.cos(ang) * r, Math.sin(ang) * r, Math.sin(cyc * Math.PI) * 0.7);
      });
    }

    if (rosRef.current) {
      rosRef.current.position.set(0, vesicleY, 0);
      const visRos = Math.round(rosDirections.length * (0.35 + rosRate * 0.65));
      rosRef.current.children.forEach((child, idx) => {
        child.visible = escapePhase > 0.05 && idx < visRos;
        if (!child.visible) return;
        const cyc = (t * 0.75 + idx / 24) % 1;
        const rad = 0.9 + cyc * 2.35;
        child.position.copy(rosDirections[idx]).multiplyScalar(rad);
      });
    }

    if (escapeIonsRef.current) {
      escapeIonsRef.current.position.set(0, vesicleY, 0);
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

  const showCmeMembrane = localT < 0.44;
  const showEndosome = localT >= 0.3;

  return (
    <group>
      {showCmeMembrane && (
        <group>
          <group ref={headsTopRef}>
            {lipidGrid.map((_, i) => (
              <mesh
                key={i}
                {...makePointerProps('lipid_bilayer', 'Bicapa plasmática (Hoja externa)', callbacks)}
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
                <cylinderGeometry args={[0.022, 0.022, 0.42, 5]} />
                <meshStandardMaterial
                  color={EDITORIAL_COLORS.lipidTail}
                  roughness={0.65}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            ))}
          </group>

          <mesh ref={neckFunnelRef} position={[0, 1.38, 0]}>
            <cylinderGeometry args={[0.85, 1.15, 0.95, 24, 1, true]} />
            <meshPhysicalMaterial
              color={EDITORIAL_COLORS.lipidHead}
              roughness={0.28}
              transparent
              opacity={0.32}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {clathrinGeos['Dynamin_Collar'] && (
        <mesh
          ref={dynaminRef}
          geometry={clathrinGeos['Dynamin_Collar']}
          material={materials.dynaminCollar}
          {...makePointerProps(
            'clathrin',
            'Collar de Dinamina (Estrangula el cuello en el plano de membrana)',
            callbacks
          )}
        />
      )}

      <group ref={clathrinRef} visible={localT < 0.46}>
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
                acidPhase > 0.3 ? 'Corona de romero protonándose (pH 4.5)' : 'Corona de romero',
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
          {ligandMode !== 'base' && folateGeos['Folate_Heads_Cutaway'] && (
            <>
              <mesh
                geometry={
                  xrayMode ? folateGeos['Folate_Stalks_Cutaway'] : folateGeos['Folate_Stalks_Full']
                }
                material={materials.folateStalk}
              />
              <mesh
                geometry={
                  xrayMode ? folateGeos['Folate_Heads_Cutaway'] : folateGeos['Folate_Heads_Full']
                }
                material={materials.folateHead}
              />
            </>
          )}
        </group>
      </group>

      {showEndosome && (
        <group>
          <group ref={endoRef}>
            <mesh
              visible={!xrayMode}
              {...makePointerProps('vatpase', 'Endosoma sellado en citosol (pH 4.5)', callbacks)}
            >
              <sphereGeometry args={[3.15, 42, 30]} />
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
              {...makePointerProps(
                'endosome_escape',
                'Lumen endosomal en citosol (Corte 3/4 frontal)',
                callbacks
              )}
            >
              <sphereGeometry args={[3.15, 42, 30, Math.PI * 1.08, Math.PI * 1.3, 0, Math.PI]} />
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

            {Array.from({ length: 6 }, (_, i) => {
              const ang = (i / 6) * Math.PI * 2;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(ang) * 3.15, Math.sin(ang) * 3.15, 0]}
                  rotation={[0, 0, ang + Math.PI / 2]}
                  {...makePointerProps(
                    'vatpase',
                    'Bomba V-ATPasa (Acidificación endosomal)',
                    callbacks
                  )}
                >
                  <cylinderGeometry args={[0.21, 0.27, 0.7, 14]} />
                  <meshStandardMaterial color="#4fb3bf" roughness={0.38} />
                </mesh>
              );
            })}
          </group>

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
 * SET 07: Explicit Intracristal Mitochondria — GSH (-SH) Sequestration & ROS
 * -------------------------------------------------------------------------- */
function Set07MitochondrialStress({
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

  const cristaeMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: EDITORIAL_COLORS.mitoCristae,
        roughness: 0.34,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      }),
    []
  );
  const dnaMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: EDITORIAL_COLORS.mitoDna,
        roughness: 0.38,
        metalness: 0.08,
      }),
    []
  );

  const mitoGroupRef = useRef<THREE.Group>(null);
  const gshTripeptideRef = useRef<THREE.Group>(null);
  const agIonsRef = useRef<THREE.Group>(null);
  const agSBridgesRef = useRef<THREE.Group>(null);
  const padlocksRef = useRef<THREE.Group>(null);
  const cristaeLipidsRef = useRef<THREE.Group>(null);
  const rosBurstRef = useRef<THREE.Group>(null);
  const mtDnaRef = useRef<THREE.Mesh>(null);

  // 14 explicit GSH tripeptides (Glu-Cys-Gly + golden -SH thiol sphere) inside mitochondrial matrix
  const gshNodes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const x = -3.8 + (i % 7) * 1.25;
        const y = (i < 7 ? 0.85 : -0.75) + Math.sin(i * 1.6) * 0.35;
        const z = 0.25 + Math.cos(i * 2.1) * 0.65;
        return new THREE.Vector3(x, y, z);
      }),
    []
  );

  // 14 entering Ag+ cations converging directly onto each GSH -SH thiol sphere
  const agEntryOrigins = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const ang = (i / 14) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(ang) * 7.2,
          Math.sin(ang) * 4.2,
          1.4 + Math.sin(i * 1.7) * 1.5
        );
      }),
    []
  );

  // 5 outer thiol padlock shields
  const padlockPositions = useMemo<[number, number, number][]>(
    () => [
      [-4.2, 2.7, 1.1],
      [0.1, 3.1, 1.2],
      [4.2, 2.5, 0.9],
      [-3.8, -2.6, 1.0],
      [4.0, -2.5, 1.0],
    ],
    []
  );

  // 36 inner-cristae phospholipid heads oxidized by ROS
  const cristaeLipids = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const rx = -4.3 + (i / 35) * 8.6;
        const ang = i * 1.35;
        return new THREE.Vector3(
          rx,
          Math.sin(ang) * 1.45 + Math.sin(rx * 0.25) * 0.24,
          Math.cos(ang) * 1.25
        );
      }),
    []
  );

  // 8 ETC respiratory sources matching Mito_ETC_Complexes in build_blender_assets.py
  const etcSources = useMemo(
    () =>
      [-3.6, -2.3, -0.8, 0.6, 2.0, 3.4, -1.6, 1.4].map((ex, idx) => {
        const ang = idx * 1.25 - 0.8;
        return new THREE.Vector3(
          ex,
          Math.sin(ang) * 1.35 + Math.sin(ex * 0.25) * 0.26,
          Math.cos(ang) * 1.05
        );
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const boost = pulseBoost / 100;
    const seqT = Math.min(1, localT * 1.85 + boost);
    const rosT = Math.min(1, Math.max(0, (localT - 0.24) * 1.45 + boost)) * (0.45 + rosRate * 0.55);

    // Cristae oxidation & swelling + mtDNA oxidative shift
    cristaeMat.color
      .setHex(EDITORIAL_COLORS.mitoCristae)
      .lerp(new THREE.Color(0xb84a58), rosT);
    dnaMat.color
      .setHex(EDITORIAL_COLORS.mitoDna)
      .lerp(new THREE.Color(0xdc2626), rosT);

    if (mitoGroupRef.current) {
      const swell = 1 + rosT * 0.06;
      mitoGroupRef.current.scale.set(swell, swell, swell);
    }

    if (mtDnaRef.current) {
      mtDnaRef.current.rotation.y = t * 0.12;
    }

    // Converging Ag+ ions -> bind directly to GSH -SH thiol sphere (0.28 offset)
    const visAg = Math.round(agEntryOrigins.length * agConcentration);
    if (agIonsRef.current && gshTripeptideRef.current && agSBridgesRef.current) {
      gshNodes.forEach((gPos, idx) => {
        const thiolPos = new THREE.Vector3(gPos.x + 0.22, gPos.y + 0.08, gPos.z + 0.06);
        const boundPos = new THREE.Vector3(thiolPos.x + 0.26, thiolPos.y + 0.06, thiolPos.z + 0.06);
        const isVis = idx < visAg;
        const agMesh = agIonsRef.current!.children[idx] as THREE.Mesh;
        agMesh.visible = isVis;
        if (isVis) {
          agMesh.position.lerpVectors(agEntryOrigins[idx], boundPos, seqT);
        }

        const isBound = isVis && seqT > 0.72;
        const gshGrp = gshTripeptideRef.current!.children[idx];
        // Turn GSH tripeptide lobes slate-gray when sequestered into Ag-SG
        for (let k = 0; k < 3; k++) {
          const lobe = gshGrp.children[k] as THREE.Mesh;
          (lobe.material as THREE.MeshStandardMaterial).color.setHex(
            isBound ? EDITORIAL_COLORS.gshBlocked : EDITORIAL_COLORS.gshShield
          );
        }
        // Golden -SH sulfur dims when locked into Ag-S
        const thiolSphere = gshGrp.children[3] as THREE.Mesh;
        (thiolSphere.material as THREE.MeshStandardMaterial).color.setHex(
          isBound ? 0x94a3b8 : EDITORIAL_COLORS.folateHead
        );

        // Visible Ag-S covalent sequestration bridge rod
        const bridge = agSBridgesRef.current!.children[idx] as THREE.Mesh;
        bridge.visible = isBound;
        if (isBound) {
          bridge.position.lerpVectors(thiolPos, boundPos, 0.5);
          bridge.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            boundPos.clone().sub(thiolPos).normalize()
          );
        }
      });
    }

    // Outer GSH padlock shields unlock and turn slate-gray
    if (padlocksRef.current) {
      padlocksRef.current.children.forEach((grp, idx) => {
        grp.position.y = padlockPositions[idx][1] + Math.sin(t * 1.1 + idx) * 0.08;
        const broken = seqT > 0.36 + idx * 0.1;
        const body = grp.children[0] as THREE.Mesh;
        const shackle = grp.children[1] as THREE.Mesh;
        (body.material as THREE.MeshStandardMaterial).color.setHex(
          broken ? EDITORIAL_COLORS.gshBlocked : EDITORIAL_COLORS.gshShield
        );
        shackle.rotation.z = broken ? -0.6 : 0;
      });
    }

    // Inner-cristae phospholipids oxidize from cyan to orange-red with thermal jitter
    if (cristaeLipidsRef.current) {
      cristaeLipidsRef.current.children.forEach((child, idx) => {
        const mesh = child as THREE.Mesh;
        const isOx = rosT > (idx / cristaeLipids.length) * 0.85;
        (mesh.material as THREE.MeshStandardMaterial).color.setHex(
          isOx ? EDITORIAL_COLORS.rosHot : EDITORIAL_COLORS.lipidHead
        );
        const jitter = isOx ? Math.sin(t * 14 + idx) * 0.04 * rosT : 0;
        mesh.position.set(
          cristaeLipids[idx].x + jitter,
          cristaeLipids[idx].y + jitter,
          cristaeLipids[idx].z
        );
      });
    }

    // ROS radicals erupting directly from ETC respiratory complexes
    if (rosBurstRef.current) {
      const activeCount = Math.round(36 * Math.min(1, 0.14 + rosT * 0.86));
      rosBurstRef.current.children.forEach((child, idx) => {
        child.visible = idx < activeCount;
        if (!child.visible) return;
        const src = etcSources[idx % etcSources.length];
        const cyc = (t * (0.65 + (idx % 4) * 0.16) + idx * 0.19) % 1;
        const ang = idx * 2.1 + t * 1.2;
        const spread = 0.25 + cyc * 1.65;
        child.position.set(
          src.x + Math.cos(ang) * spread * 0.8,
          src.y + Math.sin(ang * 1.2) * spread * 0.65,
          src.z + Math.sin(ang * 0.7) * spread * 0.65
        );
      });
    }
  });

  return (
    <group>
      <group ref={mitoGroupRef}>
        {mitoGeos['Mito_Outer_Cutaway'] && (
          <mesh
            geometry={mitoGeos['Mito_Outer_Cutaway']}
            material={materials.mitoOuter}
            visible={xrayMode}
            {...makePointerProps(
              'mito_cristae',
              'Membrana mitocondrial externa (Corte 3/4 frontal)',
              callbacks
            )}
          />
        )}
        {mitoGeos['Mito_Cristae_Inner'] && (
          <mesh
            geometry={mitoGeos['Mito_Cristae_Inner']}
            material={cristaeMat}
            {...makePointerProps(
              'mito_cristae',
              'Crestas mitocondriales internas bajo estrés oxidativo',
              callbacks
            )}
          />
        )}
        {mitoGeos['Mito_ETC_Complexes'] && (
          <mesh
            geometry={mitoGeos['Mito_ETC_Complexes']}
            material={materials.mitoEtc}
            {...makePointerProps(
              'etc_complex',
              'Complejos ETC (Fuga electrónica → Generación de ROS)',
              callbacks
            )}
          />
        )}
        {mitoGeos['Mito_MtDNA_Helix'] && (
          <mesh
            ref={mtDnaRef}
            geometry={mitoGeos['Mito_MtDNA_Helix']}
            material={dnaMat}
            {...makePointerProps('mito_cristae', 'ADN mitocondrial (Daño oxidativo por ROS)', callbacks)}
          />
        )}
      </group>

      {/* 14 Explicit GSH Tripeptides (Glu-Cys-Gly + Golden -SH Active Thiol) */}
      <group ref={gshTripeptideRef}>
        {gshNodes.map((pos, idx) => (
          <group key={idx} position={[pos.x, pos.y, pos.z]}>
            <mesh
              position={[-0.14, -0.05, 0]}
              {...makePointerProps('gsh', 'Glutatión reducido GSH (Glu–Cys–Gly)', callbacks)}
            >
              <sphereGeometry args={[0.11, 10, 8]} />
              <meshStandardMaterial color={EDITORIAL_COLORS.gshShield} roughness={0.4} />
            </mesh>
            <mesh
              position={[0.02, 0.04, 0]}
              {...makePointerProps('gsh', 'Glutatión reducido GSH (Cisteína)', callbacks)}
            >
              <sphereGeometry args={[0.125, 10, 8]} />
              <meshStandardMaterial color={EDITORIAL_COLORS.gshShield} roughness={0.4} />
            </mesh>
            <mesh position={[-0.04, -0.13, 0.06]}>
              <sphereGeometry args={[0.1, 10, 8]} />
              <meshStandardMaterial color={EDITORIAL_COLORS.gshShield} roughness={0.4} />
            </mesh>
            <mesh
              position={[0.22, 0.08, 0.06]}
              {...makePointerProps('gsh', 'Grupo tiol activo (–SH) blanco de Ag⁺', callbacks)}
            >
              <sphereGeometry args={[0.095, 12, 10]} />
              <meshStandardMaterial color={EDITORIAL_COLORS.folateHead} roughness={0.32} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Entering Ag+ Cations */}
      <group ref={agIonsRef}>
        {agEntryOrigins.map((_, idx) => (
          <mesh
            key={idx}
            material={materials.silverSatin}
            {...makePointerProps('ag_ion', 'Ion Plata (Ag⁺ · Secuestro del tiol –SH)', callbacks)}
          >
            <sphereGeometry args={[0.13, 14, 10]} />
          </mesh>
        ))}
      </group>

      {/* Ag-S Covalent Sequestration Bridges */}
      <group ref={agSBridgesRef}>
        {gshNodes.map((_, idx) => (
          <mesh
            key={idx}
            visible={false}
            {...makePointerProps('gsh', 'Complejo bloqueado Ag–SG (Escudo inactivado)', callbacks)}
          >
            <cylinderGeometry args={[0.036, 0.036, 0.26, 8]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* 5 Outer GSH Thiol Padlock Shields */}
      <group ref={padlocksRef}>
        {padlockPositions.map((pos, idx) => (
          <group key={idx} position={pos}>
            <mesh
              {...makePointerProps(
                'gsh',
                'Escudo antioxidante GSH (Bloqueo tiol –SH por Ag⁺)',
                callbacks
              )}
            >
              <boxGeometry args={[0.52, 0.42, 0.18]} />
              <meshStandardMaterial
                color={EDITORIAL_COLORS.gshShield}
                roughness={0.36}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <torusGeometry args={[0.18, 0.048, 10, 20, Math.PI]} />
              <meshStandardMaterial
                color={EDITORIAL_COLORS.gshShield}
                roughness={0.36}
                metalness={0.3}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 36 Inner Cristae Phospholipids Oxidized by ROS */}
      <group ref={cristaeLipidsRef}>
        {cristaeLipids.map((pos, idx) => (
          <mesh
            key={idx}
            position={[pos.x, pos.y, pos.z]}
            {...makePointerProps(
              'mito_cristae',
              'Fosfolípido de cresta mitocondrial (Peroxidación lipídica)',
              callbacks
            )}
          >
            <sphereGeometry args={[0.095, 10, 8]} />
            <meshStandardMaterial color={EDITORIAL_COLORS.lipidHead} roughness={0.38} />
          </mesh>
        ))}
      </group>

      {/* 36 Fiery ROS Radicals Erupting from ETC Complexes */}
      <group ref={rosBurstRef}>
        {Array.from({ length: 36 }, (_, idx) => (
          <mesh
            key={idx}
            {...makePointerProps(
              'ros',
              'Ráfaga intracristal de ROS (O₂•⁻ / H₂O₂ / •OH)',
              callbacks
            )}
          >
            <sphereGeometry args={[0.105, 12, 10]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? EDITORIAL_COLORS.rosHot : EDITORIAL_COLORS.rosRadical}
              emissive="#9a3412"
              emissiveIntensity={0.5}
              roughness={0.32}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------------
 * SET 08: Mitochondrial Collapse, Cytochrome c & Caspase 9 -> 3 Apoptosis
 * -------------------------------------------------------------------------- */
function Set08Apoptosis({
  localT,
  xrayMode,
  materials,
  callbacks,
}: {
  localT: number;
  xrayMode: boolean;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}) {
  const mitoGeos = useGlbGeometries(MODEL_PATHS.mitochondrion);
  const apopGeos = useGlbGeometries(MODEL_PATHS.apoptosomeCell);

  const cellGroupRef = useRef<THREE.Group>(null);
  const poreRef = useRef<THREE.Mesh>(null);
  const cytStreamRef = useRef<THREE.Group>(null);
  const wheelARef = useRef<THREE.Mesh>(null);
  const wheelBRef = useRef<THREE.Mesh>(null);
  const bodiesRef = useRef<THREE.Group>(null);

  const cytTargets = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        start: new THREE.Vector3(-1.85, -0.35, 0.45),
        end: (i % 2 === 0 ? new THREE.Vector3(1.6, 1.05, 0.4) : new THREE.Vector3(3.1, -1.0, -0.4)).add(
          new THREE.Vector3(Math.sin(i) * 0.45, Math.cos(i) * 0.45, 0)
        ),
        offset: i / 18,
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
    const apopT = smoothstep(0.05, 0.95, localT);

    if (cellGroupRef.current) {
      const shrink = 1 - apopT * 0.14;
      cellGroupRef.current.scale.setScalar(shrink);
    }

    if (poreRef.current) {
      poreRef.current.rotation.z = t * 0.7;
    }

    if (wheelARef.current && wheelBRef.current) {
      wheelARef.current.rotation.z = t * 0.35;
      wheelBRef.current.rotation.z = -t * 0.3;
      const wheelScale = 0.45 + smoothstep(0.08, 0.48, localT) * 0.55;
      wheelARef.current.scale.setScalar(wheelScale);
      wheelBRef.current.scale.setScalar(wheelScale);
    }

    if (cytStreamRef.current) {
      cytStreamRef.current.children.forEach((child, idx) => {
        const cfg = cytTargets[idx];
        const flow = (t * 0.38 + cfg.offset) % 1;
        child.position.lerpVectors(cfg.start, cfg.end, flow);
        child.position.y += Math.sin(flow * Math.PI) * 0.95;
      });
    }

    if (bodiesRef.current) {
      const bAppear = smoothstep(0.45, 0.95, localT);
      bodiesRef.current.children.forEach((child, idx) => {
        child.visible = localT > 0.42;
        child.scale.setScalar(0.25 + bAppear * 0.75);
        child.position.copy(bodyDirs[idx]).multiplyScalar(0.68 + bAppear * 0.32);
        child.position.y += Math.sin(t * 1.0 + idx) * 0.1;
      });
    }
  });

  return (
    <group>
      <group ref={cellGroupRef}>
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
      </group>

      {/* Oxidatively collapsed mitochondrion releasing Cytochrome c */}
      <group position={[-2.5, -0.9, 0]} scale={0.5} rotation={[0, 0, 0.22]}>
        {mitoGeos['Mito_Outer_Cutaway'] && (
          <mesh
            geometry={mitoGeos['Mito_Outer_Cutaway']}
            material={materials.mitoOuter}
            visible={xrayMode}
            {...makePointerProps('mito_cristae', 'Mitocondria colapsada (ΔΨm perdido)', callbacks)}
          />
        )}
        {mitoGeos['Mito_Cristae_Inner'] && (
          <mesh geometry={mitoGeos['Mito_Cristae_Inner']} material={materials.tumorCell} />
        )}
        <mesh
          ref={poreRef}
          position={[1.35, 1.1, 0.85]}
          rotation={[0.4, 0.4, 0]}
          {...makePointerProps('cytc', 'Poro de permeabilidad mPTP (Salida de Citocromo c)', callbacks)}
        >
          <torusGeometry args={[0.72, 0.16, 14, 28]} />
          <meshStandardMaterial color="#c084fc" roughness={0.32} metalness={0.18} />
        </mesh>
      </group>

      {apopGeos['Apoptosome_Wheel'] && (
        <>
          <mesh
            ref={wheelARef}
            geometry={apopGeos['Apoptosome_Wheel']}
            material={materials.apoptosome}
            position={[1.6, 1.05, 0.4]}
            {...makePointerProps('apoptosome', 'Complejo activo Caspasa 9 → Caspasa 3', callbacks)}
          />
          <mesh
            ref={wheelBRef}
            geometry={apopGeos['Apoptosome_Wheel']}
            material={materials.apoptosome}
            position={[3.1, -1.0, -0.4]}
            {...makePointerProps('apoptosome', 'Apoptosoma ejecutor Caspasa 3', callbacks)}
          />
        </>
      )}

      <group ref={cytStreamRef}>
        {cytTargets.map((_, idx) => (
          <mesh key={idx} {...makePointerProps('cytc', 'Citocromo c en tránsito al citosol', callbacks)}>
            <sphereGeometry args={[0.135, 12, 10]} />
            <meshStandardMaterial color={EDITORIAL_COLORS.cytC} roughness={0.3} metalness={0.15} />
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
            <sphereGeometry args={[0.48 + (idx % 3) * 0.12, 22, 18]} />
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
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 2:
      return (
        <Set02RosemaryCorona
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 3:
      return (
        <Set03EmbeddedNanogel
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          agConcentration={props.agConcentration}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 4:
      return (
        <Set04TumorInjection
          localT={props.localT}
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          agConcentration={props.agConcentration}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 5:
      return (
        <Set05TissueInteraction
          localT={props.localT}
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 6:
      return (
        <Set06EndocytosisEscape
          localT={props.localT}
          xrayMode={props.xrayMode}
          ligandMode={props.ligandMode}
          agConcentration={props.agConcentration}
          rosRate={props.rosRate}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 7:
      return (
        <Set07MitochondrialStress
          localT={props.localT}
          xrayMode={props.xrayMode}
          agConcentration={props.agConcentration}
          rosRate={props.rosRate}
          pulseBoost={props.pulseBoost}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
    case 8:
      return (
        <Set08Apoptosis
          localT={props.localT}
          xrayMode={props.xrayMode}
          materials={props.materials}
          callbacks={props.callbacks}
        />
      );
  }
}
