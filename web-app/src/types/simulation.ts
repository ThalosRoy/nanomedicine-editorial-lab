export type SetId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type LigandMode = 'base' | 'folate' | 'compare';

export type MoleculeId =
  | 'editorial_studio'
  | 'nanocellulose'
  | 'ag0_core'
  | 'rosemary_corona'
  | 'folate_np'
  | 'base_np'
  | 'syringe_gel'
  | 'healthy_tissue'
  | 'warburg_tumor'
  | 'vessel_branch'
  | 'fr_alpha'
  | 'lipid_bilayer'
  | 'clathrin'
  | 'vatpase'
  | 'endosome_escape'
  | 'ag_ion'
  | 'gsh'
  | 'etc_complex'
  | 'ros'
  | 'mito_cristae'
  | 'cytc'
  | 'apoptosome';

export interface MoleculeInfo {
  id: MoleculeId;
  tag: string;
  title: string;
  desc: string;
  accentColor: string;
}

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
}

export interface SetMetadata {
  id: SetId;
  shortCode: string;
  shortLabel: string;
  title: string;
  badge: string;
  badgeTone: 'teal' | 'amber' | 'orange' | 'plum';
  isProposedMechanism: boolean;
  defaultMol: MoleculeId;
  camera: CameraPreset;
}

export interface TelemetrySnapshot {
  ph: string;
  deltaPsiMv: number;
  gshPercent: number;
  rosPercent: number;
  agReleasePercent: number;
  stateLabel: string;
  stateTone: 'teal' | 'amber' | 'orange' | 'plum';
}
