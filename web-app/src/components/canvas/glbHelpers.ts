import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { MoleculeId } from '../../types/simulation';

export const MODEL_PATHS = {
  agnpCore: './models/agnp_core.glb',
  rosemaryCorona: './models/rosemary_corona.glb',
  folateLigands: './models/folate_ligands.glb',
  nanocelluloseMatrix: './models/nanocellulose_matrix.glb',
  tumorMicroenv: './models/tumor_microenv.glb',
  receptorFra: './models/receptor_fra.glb',
  clathrinCage: './models/clathrin_cage.glb',
  mitochondrion: './models/mitochondrion_editorial.glb',
  apoptosomeCell: './models/apoptosome_cell.glb',
} as const;

Object.values(MODEL_PATHS).forEach((path) => {
  useGLTF.preload(path);
});

export interface InteractionCallbacks {
  onSelectMolecule: (id: MoleculeId) => void;
  onHoverInfo: (label: string | null, clientX?: number, clientY?: number) => void;
}

export function makePointerProps(
  molId: MoleculeId,
  label: string,
  callbacks: InteractionCallbacks
) {
  return {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = 'pointer';
      callbacks.onHoverInfo(label, e.clientX, e.clientY);
    },
    onPointerMove: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      callbacks.onHoverInfo(label, e.clientX, e.clientY);
    },
    onPointerOut: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = 'grab';
      callbacks.onHoverInfo(null);
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      callbacks.onSelectMolecule(molId);
    },
  };
}

export function useGlbGeometries(path: string): Record<string, THREE.BufferGeometry> {
  const gltf = useGLTF(path);
  return useMemo(() => {
    const map: Record<string, THREE.BufferGeometry> = {};
    gltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) {
          map[obj.name] = mesh.geometry;
        }
      }
    });
    return map;
  }, [gltf]);
}
