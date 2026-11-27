import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { SETS_DATA } from '../../config/setsData';
import {
  createEditorialMaterials,
  createStudioEnvironment,
} from '../../materials/editorialMaterials';
import type {
  CameraPreset,
  LigandMode,
  MoleculeId,
  SetId,
} from '../../types/simulation';
import type { InteractionCallbacks } from './glbHelpers';
import { SetScenes } from './SetScenes';

interface EditorialViewportProps {
  activeSet: SetId;
  localT: number;
  xrayMode: boolean;
  autoRotate: boolean;
  ligandMode: LigandMode;
  agConcentration: number;
  rosRate: number;
  pulseBoost: number;
  pulseTrigger: number;
  resetTrigger: number;
  onSelectMolecule: (id: MoleculeId) => void;
}

function computeResponsiveCamera(
  preset: CameraPreset,
  width: number,
  height: number
): { position: THREE.Vector3; target: THREE.Vector3 } {
  const aspect = width / Math.max(1, height);
  const distScale = THREE.MathUtils.clamp(1.18 / aspect, 1.0, 2.32);
  const yShift = aspect < 0.85 ? -0.45 : 0;

  const target = new THREE.Vector3(
    preset.target[0],
    preset.target[1] + yShift,
    preset.target[2]
  );
  const baseTarget = new THREE.Vector3(...preset.target);
  const offset = new THREE.Vector3(...preset.position)
    .sub(baseTarget)
    .multiplyScalar(distScale);
  const position = target.clone().add(offset);

  return { position, target };
}

function StudioRig({
  activeSet,
  autoRotate,
  pulseTrigger,
  resetTrigger,
}: {
  activeSet: SetId;
  autoRotate: boolean;
  pulseTrigger: number;
  resetTrigger: number;
}) {
  const { camera, size } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const pulseState = useRef({ active: false, scale: 1, opacity: 0 });

  const targetCamPos = useRef(new THREE.Vector3(...SETS_DATA[activeSet].camera.position));
  const targetLookAt = useRef(new THREE.Vector3(...SETS_DATA[activeSet].camera.target));
  const isTransitioning = useRef(false);
  const hasMountedRef = useRef(false);
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    const fitted = computeResponsiveCamera(
      SETS_DATA[activeSet].camera,
      size.width,
      size.height
    );
    targetCamPos.current.copy(fitted.position);
    targetLookAt.current.copy(fitted.target);

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      camera.position.copy(fitted.position);
      if (controlsRef.current) {
        controlsRef.current.target.copy(fitted.target);
        controlsRef.current.update();
      }
      isTransitioning.current = false;
    } else {
      isTransitioning.current = true;
    }
    pauseUntilRef.current = performance.now() + 2200;
  }, [activeSet, resetTrigger, size.width, size.height, camera]);

  useEffect(() => {
    if (pulseTrigger > 0) {
      pulseState.current = { active: true, scale: 0.8, opacity: 0.65 };
    }
  }, [pulseTrigger]);

  useFrame((_, delta) => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate && performance.now() > pauseUntilRef.current;
    }

    if (isTransitioning.current && controlsRef.current) {
      const alpha = 1 - Math.exp(-delta * 5.2);
      camera.position.lerp(targetCamPos.current, alpha);
      controlsRef.current.target.lerp(targetLookAt.current, alpha);
      controlsRef.current.update();
      if (
        camera.position.distanceTo(targetCamPos.current) < 0.04 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.04
      ) {
        isTransitioning.current = false;
      }
    }

    if (pulseRingRef.current) {
      const ps = pulseState.current;
      if (ps.active) {
        ps.scale += delta * 7.5;
        ps.opacity -= delta * 1.1;
        pulseRingRef.current.visible = ps.opacity > 0;
        pulseRingRef.current.scale.setScalar(ps.scale);
        pulseRingRef.current.lookAt(camera.position);
        const mat = pulseRingRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, ps.opacity);
        if (ps.opacity <= 0) {
          ps.active = false;
        }
      } else {
        pulseRingRef.current.visible = false;
      }
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.07}
        minDistance={3.0}
        maxDistance={55.0}
        autoRotate={autoRotate}
        autoRotateSpeed={0.16}
        onStart={() => {
          isTransitioning.current = false;
        }}
      />

      {/* Unified Set 00 3-Point Scientific Editorial Lighting */}
      <hemisphereLight args={['#e2e8f0', '#111b2b', 0.75]} />
      <directionalLight
        position={[-9, 12, 10]}
        intensity={1.35}
        color="#fffdf9"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[5, 2, 13]} intensity={0.6} color="#dbeafe" />
      <directionalLight position={[10, -5, -11]} intensity={0.72} color="#a5f3fc" />

      <mesh ref={pulseRingRef} visible={false}>
        <ringGeometry args={[0.5, 0.66, 48]} />
        <meshBasicMaterial
          color="#5ec2cc"
          side={THREE.DoubleSide}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

export function EditorialViewport({
  activeSet,
  localT,
  xrayMode,
  autoRotate,
  ligandMode,
  agConcentration,
  rosRate,
  pulseBoost,
  pulseTrigger,
  resetTrigger,
  onSelectMolecule,
}: EditorialViewportProps) {
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(
    null
  );
  const materials = useMemo(() => createEditorialMaterials(), []);
  const envTexRef = useRef<THREE.Texture | null>(null);

  const initialCameraPos = useMemo<[number, number, number]>(() => {
    if (typeof window === 'undefined') return SETS_DATA[0].camera.position;
    const fitted = computeResponsiveCamera(
      SETS_DATA[0].camera,
      window.innerWidth,
      window.innerHeight
    );
    return [fitted.position.x, fitted.position.y, fitted.position.z];
  }, []);

  useEffect(() => {
    return () => {
      envTexRef.current?.dispose();
    };
  }, []);

  const callbacks: InteractionCallbacks = useMemo(
    () => ({
      onSelectMolecule,
      onHoverInfo: (label, clientX = 0, clientY = 0) => {
        if (!label) {
          setTooltip(null);
        } else {
          setTooltip({ label, x: clientX, y: clientY });
        }
      },
    }),
    [onSelectMolecule]
  );

  return (
    <div
      className="canvas-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: initialCameraPos, fov: 40, near: 0.1, far: 180 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.06,
        }}
        onCreated={({ gl, scene }) => {
          const tex = createStudioEnvironment(gl);
          envTexRef.current = tex;
          scene.environment = tex;
        }}
        onPointerMissed={() => setTooltip(null)}
      >
        <StudioRig
          activeSet={activeSet}
          autoRotate={autoRotate}
          pulseTrigger={pulseTrigger}
          resetTrigger={resetTrigger}
        />
        <Suspense fallback={null}>
          <SetScenes
            activeSet={activeSet}
            localT={localT}
            xrayMode={xrayMode}
            ligandMode={ligandMode}
            agConcentration={agConcentration}
            rosRate={rosRate}
            pulseBoost={pulseBoost}
            materials={materials}
            callbacks={callbacks}
          />
        </Suspense>
      </Canvas>

      {tooltip && (
        <div
          className="obsidian-panel"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y - 12,
            transform: 'translate(-50%, -100%)',
            zIndex: 30,
            pointerEvents: 'none',
            padding: '0.35rem 0.65rem',
            borderRadius: '0.5rem',
            fontSize: '0.7rem',
            maxWidth: '16rem',
          }}
        >
          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{tooltip.label}</div>
          <div className="font-mono-tech" style={{ fontSize: '0.58rem', color: '#a0ced8' }}>
            Clic para ver ficha molecular
          </div>
        </div>
      )}
    </div>
  );
}
