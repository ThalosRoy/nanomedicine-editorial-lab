import type {
  LigandMode,
  MoleculeId,
  MoleculeInfo,
  SetMetadata,
  TelemetrySnapshot,
} from '../types/simulation';

export const PUBLIC_SHARE_URL =
  'https://thalosroy.github.io/nanomedicine-editorial-lab/';

export const SPEED_OPTIONS = [0.5, 1.0, 1.5, 2.0] as const;

export const SETS_DATA: SetMetadata[] = [
  {
    id: 0,
    shortCode: 'SET 00',
    shortLabel: 'Entorno',
    title: 'Entorno Editorial Científico y Familias de Materiales',
    badge: 'CALIBRACIÓN ESTUDIO',
    badgeTone: 'teal',
    isProposedMechanism: false,
    defaultMol: 'editorial_studio',
    camera: { position: [0, 3.8, 17.8], target: [0, -0.2, 0] },
  },
  {
    id: 1,
    shortCode: 'SET 01',
    shortLabel: 'Matriz',
    title: 'Arquitectura Polimérica: Red Porosa de Nanocelulosa',
    badge: 'NANOCELULOSA 3D',
    badgeTone: 'teal',
    isProposedMechanism: false,
    defaultMol: 'nanocellulose',
    camera: { position: [6.8, 2.8, 10.2], target: [0, -0.15, 0] },
  },
  {
    id: 2,
    shortCode: 'SET 02',
    shortLabel: 'Corona',
    title: 'AgNP con Corona Fitoquímica de Romero (Rosmarinus officinalis)',
    badge: 'CORONA ORGÁNICA',
    badgeTone: 'teal',
    isProposedMechanism: false,
    defaultMol: 'rosemary_corona',
    camera: { position: [4.8, 2.1, 6.8], target: [0, -0.1, 0] },
  },
  {
    id: 3,
    shortCode: 'SET 03',
    shortLabel: 'Nanogel',
    title: 'Sistema Nanogel Embebido (Modelo Protagonista)',
    badge: 'SISTEMA COMPLETO',
    badgeTone: 'teal',
    isProposedMechanism: false,
    defaultMol: 'nanocellulose',
    camera: { position: [7.0, 2.9, 10.5], target: [0, -0.15, 0] },
  },
  {
    id: 4,
    shortCode: 'SET 04',
    shortLabel: 'Inyección',
    title: 'Inyección Local Pseudoplástica y Microambiente Warburg (pH 6.2–6.8)',
    badge: 'INYECCIÓN · pH WARBURG',
    badgeTone: 'amber',
    isProposedMechanism: false,
    defaultMol: 'syringe_gel',
    camera: { position: [0.6, 2.8, 20.5], target: [-0.2, 0.9, 0] },
  },
  {
    id: 5,
    shortCode: 'SET 05',
    shortLabel: 'Ligandos',
    title: 'Interacción Tisular y Direccionamiento a Receptores FR-α',
    badge: 'DIANA FR-α',
    badgeTone: 'amber',
    isProposedMechanism: true,
    defaultMol: 'folate_np',
    camera: { position: [0.4, 2.2, 15.6], target: [0, -0.3, 0] },
  },
  {
    id: 6,
    shortCode: 'SET 06',
    shortLabel: 'Endocitosis',
    title: 'Endocitosis (Clatrina/Dinamina) y Escape Endosómico',
    badge: 'ESCAPE ENDOSOMAL',
    badgeTone: 'orange',
    isProposedMechanism: true,
    defaultMol: 'endosome_escape',
    camera: { position: [1.6, 2.2, 15.0], target: [0.2, 0.1, 0] },
  },
  {
    id: 7,
    shortCode: 'SET 07',
    shortLabel: 'Mitocondria',
    title: 'Interior Mitocondrial: Secuestro de GSH por Ag⁺ y Estrés ROS',
    badge: 'BLOQUEO GSH / ROS',
    badgeTone: 'orange',
    isProposedMechanism: true,
    defaultMol: 'gsh',
    camera: { position: [0.5, 1.8, 14.2], target: [0, 0, 0] },
  },
  {
    id: 8,
    shortCode: 'SET 08',
    shortLabel: 'Apoptosis',
    title: 'Colapso Mitocondrial, Citocromo c y Apoptosis (Caspasa 9 → 3)',
    badge: 'APOPTOSIS ACTIVA',
    badgeTone: 'plum',
    isProposedMechanism: true,
    defaultMol: 'apoptosome',
    camera: { position: [1.0, 2.2, 18.8], target: [0, -0.1, 0] },
  },
];

export const MOLECULE_INFO: Record<MoleculeId, MoleculeInfo> = {
  editorial_studio: {
    id: 'editorial_studio',
    tag: 'Set 00 · Estándar Visual',
    title: 'Síntesis Scientific Editorial Biomolecular',
    desc: 'Estándar único de materiales satinados, hidrogeles refractivos, cortes transversales 3/4 y paleta desaturada aplicado de forma uniforme desde el nanogel hasta la apoptosis.',
    accentColor: '#a0ced8',
  },
  nanocellulose: {
    id: 'nanocellulose',
    tag: 'Vehículo Polimérico',
    title: 'Matriz Porosa de Nanocelulosa',
    desc: 'Fibrillas continuas entrelazadas con nodos de entrecruzamiento y cavidades porosas definidas dentro de una envoltura de hidrogel translúcido. Inmoviliza las AgNPs funcionalizadas y permite flujo pseudoplástico en inyección.',
    accentColor: '#5ec2cc',
  },
  ag0_core: {
    id: 'ag0_core',
    tag: 'Núcleo Metálico',
    title: 'Nanopartícula de Plata (Ag⁰)',
    desc: 'Reservorio sólido de plata metálica alojado en los poros de la matriz polimérica y estabilizado por la corona vegetal. Permanece estable a pH 7.4 y experimenta disolución oxidativa al acidificarse el endosoma.',
    accentColor: '#e2e8f0',
  },
  rosemary_corona: {
    id: 'rosemary_corona',
    tag: 'Recubrimiento Fitoquímico',
    title: 'Corona de Rosmarinus officinalis',
    desc: 'Capa orgánica densa de fitoquímicos de romero con grupos funcionales –COOH y –OH unida al núcleo de plata. Evita la agregación metálica y se protona frente al descenso de pH tumoral y endosomal.',
    accentColor: '#4f9476',
  },
  folate_np: {
    id: 'folate_np',
    tag: 'Variante en AgNP',
    title: 'Ácido Fólico en Núcleo/Corona de AgNP',
    desc: 'Variante opcional conjugada directamente sobre las nanopartículas de plata recubiertas (el nanogel externo de nanocelulosa no lleva ácido fólico). Facilita el reconocimiento selectivo de receptores FR-α tumorales.',
    accentColor: '#eab308',
  },
  base_np: {
    id: 'base_np',
    tag: 'Formulación Base',
    title: 'AgNP con Corona Nativa (Sin Ligando)',
    desc: 'Partícula funcionalizada únicamente con su corona fitoquímica vegetal, depositada localmente mediante la matriz de nanocelulosa como control comparativo frente a la variante +Folato.',
    accentColor: '#94a3b8',
  },
  syringe_gel: {
    id: 'syringe_gel',
    tag: 'Administración Localizada',
    title: 'Inyección Pseudoplástica In Situ',
    desc: 'Al presionar el émbolo, la red de nanocelulosa fluye de forma pseudoplástica a través de la cánula metálica y recupera su estructura hidratada dentro del intersticio tumoral, evitando fuga sistémica.',
    accentColor: '#5ec2cc',
  },
  healthy_tissue: {
    id: 'healthy_tissue',
    tag: 'Control Fisiológico',
    title: 'Tejido Sano Circundante',
    desc: 'Epitelio organizado en homeostasis con pH extracelular neutro (7.4), donde el recubrimiento fitoquímico de las AgNPs conserva su estabilidad y evita toxicidad prematura.',
    accentColor: '#3b7a9e',
  },
  warburg_tumor: {
    id: 'warburg_tumor',
    tag: 'Microambiente Tumoral',
    title: 'Esferoide Tumoral y Efecto Warburg',
    desc: 'Masa celular heterogénea con glucólisis aeróbica elevada que acidifica el intersticio adyacente (pH 6.2–6.8 por acumulación de lactato y protones H⁺), activando la liberación local de AgNPs.',
    accentColor: '#a44c58',
  },
  vessel_branch: {
    id: 'vessel_branch',
    tag: 'Irrigación Tumoral',
    title: 'Vasculatura Angiogénica Tortuosa',
    desc: 'Red microvascular irregular que irriga el esferoide tumoral y delimita el microambiente intersticial donde permanece retenido el depósito de nanogel.',
    accentColor: '#ad2936',
  },
  fr_alpha: {
    id: 'fr_alpha',
    tag: 'Diana en Membrana (Propuesto)',
    title: 'Receptor Trimérico de Folato (FR-α)',
    desc: 'Complejo receptor transmembrana sobreexpresado en tumores epiteliales que captura con alta afinidad las AgNPs funcionalizadas con ácido fólico previo a la invaginación.',
    accentColor: '#bf3b3b',
  },
  lipid_bilayer: {
    id: 'lipid_bilayer',
    tag: 'Barrera Celular',
    title: 'Bicapa Fosfolipídica Plasmática',
    desc: 'Doble hoja lipídica anfipática que restringe la difusión pasiva de nanopartículas hidrofílicas, requiriendo internalización activa por invaginación vesicular.',
    accentColor: '#5ec2cc',
  },
  clathrin: {
    id: 'clathrin',
    tag: 'Mecanismo Propuesto · CME',
    title: 'Canasta de Clatrina y Collar de Dinamina',
    desc: 'Los trisqueliones de clatrina curvan la bicapa en una vesícula, mientras el collar helicoidal de dinamina se posiciona en el plano de la membrana y estrangula el cuello hasta sellar y liberar el endosoma al citosol.',
    accentColor: '#5ec2cc',
  },
  vatpase: {
    id: 'vatpase',
    tag: 'Mecanismo Propuesto · Endosoma',
    title: 'Acidificación Endosomal por V-ATPasa',
    desc: 'Bombas de protones V-ATPasa reducen el pH endosomal hacia 4.5, protonando los grupos carboxilo de la corona de romero y exponiendo la superficie metálica Ag⁰.',
    accentColor: '#f6bc72',
  },
  endosome_escape: {
    id: 'endosome_escape',
    tag: 'Mecanismo Propuesto · Escape',
    title: 'Peroxidación Lipídica y Escape Endosómico',
    desc: 'La disolución oxidativa del núcleo de plata (Ag⁰ → Ag⁺) genera radicales ROS locales que peroxidan la bicapa endosómica, abriendo brechas físicas para la salida de iones Ag⁺ al citosol.',
    accentColor: '#ea580c',
  },
  ag_ion: {
    id: 'ag_ion',
    tag: 'Especie Activa (Propuesta)',
    title: 'Iones de Plata Bioactivos (Ag⁺)',
    desc: 'Cationes metálicos con elevada afinidad química por grupos tiol (–SH). Al ingresar a la matriz mitocondrial forman complejos Ag–SG con el glutatión, desactivando el escudo antioxidante.',
    accentColor: '#a0ced8',
  },
  gsh: {
    id: 'gsh',
    tag: 'Secuestro Antioxidante (Propuesto)',
    title: 'Glutatión Reducido (GSH) y Grupo Tiol –SH',
    desc: 'Tripéptido antioxidante intracelular (Glu–Cys–Gly) cuyo grupo sulfhidrilo activo (–SH, en dorado) es secuestrado directamente por iones Ag⁺ mediante enlaces Ag–S, dejando la mitocondria indefensa.',
    accentColor: '#6b8f71',
  },
  etc_complex: {
    id: 'etc_complex',
    tag: 'Cadena Respiratoria (Propuesta)',
    title: 'Complejos ETC en Crestas Mitocondriales',
    desc: 'Complejos proteicos de la cadena de transporte de electrones embebidos en las crestas internas. Tras el bloqueo del GSH por Ag⁺, la fuga electrónica dispara una ráfaga aguda de ROS.',
    accentColor: '#d9a14a',
  },
  ros: {
    id: 'ros',
    tag: 'Estrés Oxidativo (Propuesto)',
    title: 'Especies Reactivas de Oxígeno (ROS)',
    desc: 'Radicales oxidantes (O₂•⁻, H₂O₂, •OH) acumulados en el interior mitocondrial que peroxidan fosfolípidos de las crestas, fragmentan el ADNmt y colapsan el potencial ΔΨm.',
    accentColor: '#b4823e',
  },
  mito_cristae: {
    id: 'mito_cristae',
    tag: 'Organelo Blanco (Propuesto)',
    title: 'Crestas Mitocondriales y ADNmt',
    desc: 'Ultraestructura energética interna expuesta en corte 3/4. La peroxidación lipídica de las crestas y el daño oxidativo del anillo de ADN mitocondrial preceden a la apertura del poro de permeabilidad.',
    accentColor: '#4fb3bf',
  },
  cytc: {
    id: 'cytc',
    tag: 'Señal Pro-Apoptótica (Propuesta)',
    title: 'Translocación de Citocromo c',
    desc: 'Tras el colapso de ΔΨm, el Citocromo c escapa desde el espacio intermembrana mitocondrial hacia el citosol a través del poro de membrana externa para ensamblar el apoptosoma.',
    accentColor: '#d8b4fe',
  },
  apoptosome: {
    id: 'apoptosome',
    tag: 'Desenlace Propuesto · Apoptosis',
    title: 'Cascada Caspasa 9 → Caspasa 3',
    desc: 'Complejos heptaméricos activadores de caspasas ejecutoras que conducen a la fragmentación ordenada de la célula tumoral en cuerpos apoptóticos sellados, sin necrosis inflamatoria.',
    accentColor: '#7c3f58',
  },
};

export const IDENTIFIER_CHIPS: { id: MoleculeId; label: string; color: string }[] = [
  { id: 'nanocellulose', label: 'Nanogel / Red', color: '#5ec2cc' },
  { id: 'rosemary_corona', label: 'Corona Romero', color: '#4f9476' },
  { id: 'folate_np', label: 'Ácido Fólico', color: '#eab308' },
  { id: 'syringe_gel', label: 'Inyección', color: '#a0ced8' },
  { id: 'clathrin', label: 'Clatrina / Din.', color: '#5ec2cc' },
  { id: 'gsh', label: 'GSH (–SH)', color: '#6b8f71' },
  { id: 'ros', label: 'Estrés ROS', color: '#b4823e' },
  { id: 'apoptosome', label: 'Caspasa 9→3', color: '#c084fc' },
];

export function computeTelemetry(
  stageIdx: number,
  localT: number,
  agConc: number,
  rosRate: number,
  ligandMode: LigandMode
): TelemetrySnapshot {
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // Sets 00..03: Editorial calibration & material architecture
  if (stageIdx <= 3) {
    return {
      ph: '7.4',
      deltaPsiMv: -180,
      gshPercent: 98,
      rosPercent: 4,
      agReleasePercent: stageIdx === 3 ? Math.round(agConc * 10) : 0,
      stateLabel: stageIdx === 0 ? 'CALIBRACIÓN EDITORIAL' : 'ESTABLE · pH 7.4',
      stateTone: 'teal',
    };
  }

  // Set 04: Syringe Injection & Warburg tumor microenvironment
  if (stageIdx === 4) {
    const phVal = 7.4 - localT * 1.05;
    return {
      ph: phVal.toFixed(1),
      deltaPsiMv: -176,
      gshPercent: 94,
      rosPercent: Math.round(8 + localT * 10),
      agReleasePercent: Math.round(localT * agConc * 28),
      stateLabel: 'INYECCIÓN · pH WARBURG',
      stateTone: 'amber',
    };
  }

  // Set 05: FR-alpha Targeting
  if (stageIdx === 5) {
    return {
      ph: '6.4',
      deltaPsiMv: -172,
      gshPercent: 90,
      rosPercent: 16,
      agReleasePercent: Math.round(agConc * 32),
      stateLabel: ligandMode === 'folate' ? 'DIANA FR-α ACTIVA' : 'ACOPLAMIENTO EN MEMBRANA',
      stateTone: 'amber',
    };
  }

  // Set 06: Endocytosis (Clathrin/Dynamin) & Endosomal Escape
  if (stageIdx === 6) {
    const phVal = 6.4 - localT * 1.9;
    const escapeFactor = clamp((localT - 0.55) / 0.45, 0, 1);
    return {
      ph: phVal.toFixed(1),
      deltaPsiMv: Math.round(-170 + escapeFactor * 28),
      gshPercent: Math.round(88 - escapeFactor * 26 * agConc),
      rosPercent: Math.round(20 + localT * 42 * rosRate),
      agReleasePercent: Math.round(32 + escapeFactor * 68 * agConc),
      stateLabel:
        localT < 0.36
          ? 'ENDOCITOSIS CME'
          : localT < 0.66
            ? 'ACIDIFICACIÓN pH 4.5'
            : 'ESCAPE ENDOSOMAL',
      stateTone: localT < 0.36 ? 'teal' : localT < 0.66 ? 'amber' : 'orange',
    };
  }

  // Set 07: Explicit Intracristal Mitochondria (GSH sequestration + ROS burst)
  if (stageIdx === 7) {
    const seq = clamp(localT * 1.45 * agConc, 0, 1);
    const rosBurst = clamp((localT - 0.28) * 1.4 * (0.5 + rosRate * 0.5), 0, 1);
    return {
      ph: '7.1',
      deltaPsiMv: Math.round(-150 + rosBurst * 95),
      gshPercent: Math.round(clamp(78 - seq * 74, 4, 100)),
      rosPercent: Math.round(clamp(32 + rosBurst * 66, 15, 98)),
      agReleasePercent: Math.round(75 + agConc * 25),
      stateLabel: localT < 0.48 ? 'SECUESTRO GSH (Ag–S)' : 'RÁFAGA ROS INTRACRISTAL',
      stateTone: 'orange',
    };
  }

  // Set 08: Mitochondrial collapse, Cytochrome c & Caspase 9 -> 3 Apoptosis
  const apop = clamp(localT, 0, 1);
  return {
    ph: '7.0',
    deltaPsiMv: Math.round(-55 + apop * 42),
    gshPercent: Math.round(clamp(8 - apop * 6, 2, 20)),
    rosPercent: Math.round(clamp(82 + apop * 15 * rosRate, 60, 99)),
    agReleasePercent: 100,
    stateLabel: 'APOPTOSIS · CASPASA 9→3',
    stateTone: 'plum',
  };
}
