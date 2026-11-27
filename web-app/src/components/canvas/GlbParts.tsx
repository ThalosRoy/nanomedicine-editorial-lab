import type { EditorialMaterialSet } from '../../materials/editorialMaterials';
import {
  MODEL_PATHS,
  makePointerProps,
  useGlbGeometries,
  type InteractionCallbacks,
} from './glbHelpers';

interface EditorialAgNPUnitProps {
  scale?: number;
  position?: [number, number, number];
  cutawayCorona?: boolean;
  withFolate?: boolean;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}

export function EditorialAgNPUnit({
  scale = 1,
  position = [0, 0, 0],
  cutawayCorona = false,
  withFolate = false,
  materials,
  callbacks,
}: EditorialAgNPUnitProps) {
  const coreGeos = useGlbGeometries(MODEL_PATHS.agnpCore);
  const coronaGeos = useGlbGeometries(MODEL_PATHS.rosemaryCorona);
  const folateGeos = useGlbGeometries(MODEL_PATHS.folateLigands);

  const strandGeo = cutawayCorona
    ? coronaGeos['Corona_Strands_Cutaway']
    : coronaGeos['Corona_Strands_Full'];
  const tipGeo = cutawayCorona
    ? coronaGeos['Corona_Tips_Cutaway']
    : coronaGeos['Corona_Tips_Full'];
  const folateStalkGeo = cutawayCorona
    ? folateGeos['Folate_Stalks_Cutaway']
    : folateGeos['Folate_Stalks_Full'];
  const folateHeadGeo = cutawayCorona
    ? folateGeos['Folate_Heads_Cutaway']
    : folateGeos['Folate_Heads_Full'];

  return (
    <group position={position} scale={scale}>
      {coreGeos['AgNP_Core'] && (
        <mesh
          geometry={coreGeos['AgNP_Core']}
          material={materials.silverSatin}
          castShadow
          receiveShadow
          {...makePointerProps('ag0_core', 'Núcleo metálico de plata (Ag⁰)', callbacks)}
        />
      )}
      {strandGeo && (
        <mesh
          geometry={strandGeo}
          material={materials.rosemaryStrand}
          {...makePointerProps(
            'rosemary_corona',
            'Corona fitoquímica de romero (–COOH / –OH)',
            callbacks
          )}
        />
      )}
      {tipGeo && (
        <mesh
          geometry={tipGeo}
          material={materials.rosemaryTip}
          {...makePointerProps(
            'rosemary_corona',
            'Grupos fitoquímicos activos (Rosmarinus officinalis)',
            callbacks
          )}
        />
      )}
      {withFolate && folateStalkGeo && (
        <mesh
          geometry={folateStalkGeo}
          material={materials.folateStalk}
          {...makePointerProps(
            'folate_np',
            'Espaciador molecular de Ácido Fólico en AgNP',
            callbacks
          )}
        />
      )}
      {withFolate && folateHeadGeo && (
        <mesh
          geometry={folateHeadGeo}
          material={materials.folateHead}
          {...makePointerProps(
            'folate_np',
            'Ligando de Ácido Fólico en AgNP (Diana: FR-α)',
            callbacks
          )}
        />
      )}
    </group>
  );
}

interface NanocelluloseScaffoldProps {
  scale?: number;
  cutaway?: boolean;
  materials: EditorialMaterialSet;
  callbacks: InteractionCallbacks;
}

export function NanocelluloseScaffold({
  scale = 1,
  cutaway = true,
  materials,
  callbacks,
}: NanocelluloseScaffoldProps) {
  const matrixGeos = useGlbGeometries(MODEL_PATHS.nanocelluloseMatrix);

  const fibrilGeo = cutaway
    ? matrixGeos['Matrix_Fibrils_Cutaway']
    : matrixGeos['Matrix_Fibrils_Full'];
  const nodeGeo = cutaway
    ? matrixGeos['Matrix_Nodes_Cutaway']
    : matrixGeos['Matrix_Nodes_Full'];
  const shellGeo = cutaway
    ? matrixGeos['Hydrogel_Shell_Cutaway']
    : matrixGeos['Hydrogel_Shell_Full'];

  return (
    <group scale={scale}>
      {fibrilGeo && (
        <mesh
          geometry={fibrilGeo}
          material={materials.nanocelluloseFibril}
          {...makePointerProps(
            'nanocellulose',
            'Red fibrilar porosa de Nanocelulosa',
            callbacks
          )}
        />
      )}
      {nodeGeo && (
        <mesh
          geometry={nodeGeo}
          material={materials.nanocelluloseNode}
          {...makePointerProps(
            'nanocellulose',
            'Nodos de entrecruzamiento polimérico',
            callbacks
          )}
        />
      )}
      {shellGeo && (
        <mesh
          geometry={shellGeo}
          material={materials.hydrogelShell}
          {...makePointerProps(
            'nanocellulose',
            cutaway ? 'Envoltura hidratada (Corte 3/4)' : 'Envoltura hidratada de hidrogel',
            callbacks
          )}
        />
      )}
    </group>
  );
}
