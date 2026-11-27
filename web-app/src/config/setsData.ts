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
    camera: { position: [0, 3.2, 13.5], target: [0, 0.2, 0] },
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
    camera: { position: [4.8, 2.8, 9.2], target: [0, 0, 0] },
  },
  {
    id: 2,
    shortCode: 'SET 02',
    shortLabel: 'AgNPs',
    title: 'Nanopartículas de Plata (Ag⁰) · Núcleo Metálico Satinado',
    badge: 'NÚCLEO Ag⁰',
    badgeTone: 'teal',
    isProposedMechanism: false,
    defaultMol: 'ag0_core',
    camera: { position: [2.8, 1.4, 5.4], target: [0, 0, 0] },
  },
  {
    id: 3,
    shortCode: 'SET 03',
    shortLabel: 'Corona',
    title: 'Corona Fitoquímica de Romero (Rosmarinus officinalis)',
    badge: 'CORONA ORGÁNICA',
    badgeTone: 'teal',
    isProposedMechanism: false,
    defaultMol: 'rosemary_corona',
    camera: { position: [3.2, 1.8, 5.6], target: [0, 0, 0] },
  },
  {
    id: 4,
    shortCode: 'SET 04',
    shortLabel: 'Nanogel',
    title: 'Sistema Nanogel Embebido (Modelo Protagonista)',
    badge: 'SISTEMA COMPLETO',
    badgeTone: 'teal',
    isProposedMechanism: false,
    defaultMol: 'nanocellulose',
    camera: { position: [5.4, 3.1, 9.6], target: [0, 0, 0] },
  },
  {
    id: 5,
    shortCode: 'SET 05',
    shortLabel: 'Microamb.',
    title: 'Microambiente Tumoral y Efecto Warburg (pH 6.2–6.8)',
    badge: 'pH WARBURG',
    badgeTone: 'amber',
    isProposedMechanism: false,
    defaultMol: 'warburg_tumor',
    camera: { position: [1.5, 2.2, 14.5], target: [-0.4, 0, 0] },
  },
  {
    id: 6,
    shortCode: 'SET 06',
    shortLabel: 'Ligandos',
    title: 'Interacción Tisular y Direccionamiento a Receptores FR-α',
    badge: 'DIANA FR-α',
    badgeTone: 'amber',
    isProposedMechanism: true,
    defaultMol: 'folate_np',
    camera: { position: [0.4, 1.8, 11.8], target: [0, -0.4, 0] },
  },
  {
    id: 7,
    shortCode: 'SET 07',
    shortLabel: 'Endocitosis',
    title: 'Endocitosis (Clatrina) y Escape Endosómico (Ag⁰ → Ag⁺)',
    badge: 'ESCAPE ENDOSOMAL',
    badgeTone: 'orange',
    isProposedMechanism: true,
    defaultMol: 'endosome_escape',
    camera: { position: [3.4, 2.2, 11.4], target: [0.3, -0.2, 0] },
  },
  {
    id: 8,
    shortCode: 'SET 08',
    shortLabel: 'Apoptosis',
    title: 'Estrés Oxidativo Mitocondrial y Apoptosis (Caspasa 9 → 3)',
    badge: 'APOPTOSIS ACTIVA',
    badgeTone: 'plum',
    isProposedMechanism: true,
    defaultMol: 'apoptosome',
    camera: { position: [4.2, 2.5, 13.6], target: [0.2, -0.1, 0] },
  },
];

export const MOLECULE_INFO: Record<MoleculeId, MoleculeInfo> = {
  editorial_studio: {
    id: 'editorial_studio',
    tag: 'Set 00 · Estándar Visual',
    title: 'Síntesis Scientific Editorial Biomolecular',
    formula: '5 Familias Maestras PBR · Iluminación de 3 Puntos',
    desc: 'Estándar único de materiales satinados, hidrogeles refractivos, cortes transversales 3/4 y paleta desaturada aplicado de forma uniforme en los 9 sets.',
    impact:
      'Garantiza coherencia morfológica y lectura científica clara desde la nanoescala hasta el nivel celular.',
    accentColor: '#a0ced8',
  },
  nanocellulose: {
    id: 'nanocellulose',
    tag: 'Vehículo Polimérico',
    title: 'Matriz Porosa de Nanocelulosa',
    formula: 'Red fibrilar 3D entrelazada · Hidrogel hidratado',
    desc: 'Fibrillas continuas entrelazadas con nodos de entrecruzamiento y cavidades porosas definidas dentro de una envoltura de hidrogel translúcido.',
    impact:
      'Inmoviliza las AgNPs funcionalizadas, aporta comportamiento pseudoplástico y permite retención local en el tumor.',
    accentColor: '#5ec2cc',
  },
  ag0_core: {
    id: 'ag0_core',
    tag: 'Núcleo Metálico',
    title: 'Nanopartícula de Plata (Ag⁰)',
    formula: 'Núcleo metálico satinado micro-facetado (~17.5 nm)',
    desc: 'Reservorio sólido de plata metálica alojado en las cavidades de la matriz polimérica y estabilizado por la corona vegetal.',
    impact:
      'Permanece estable a pH fisiológico (7.4) y experimenta disolución oxidativa controlada al acidificarse el endosoma.',
    accentColor: '#e2e8f0',
  },
  rosemary_corona: {
    id: 'rosemary_corona',
    tag: 'Recubrimiento Fitoquímico',
    title: 'Corona de Rosmarinus officinalis',
    formula: 'Cadenas orgánicas en cepillo · Grupos –COOH y –OH',
    desc: 'Capa orgánica densa de fitoquímicos de romero con terminaciones bioactivas unida a la superficie de cada AgNP.',
    impact:
      'Previene la agregación metálica y se protona frente al descenso de pH tumoral y endosomal, exponiendo el núcleo Ag⁰.',
    accentColor: '#4f9476',
  },
  folate_np: {
    id: 'folate_np',
    tag: 'Variante de Funcionalización',
    title: 'Ligandos Superficiales de Ácido Fólico',
    formula: 'Cadenas radiales + Anillo pteridina → Diana FR-α',
    desc: 'Variante opcional conjugada con moléculas de ácido fólico orientadas hacia receptores celulares sobreexpresados.',
    impact:
      'Incrementa la afinidad y captura selectiva en células tumorales con alta densidad de receptores de folato FR-α.',
    accentColor: '#eab308',
  },
  base_np: {
    id: 'base_np',
    tag: 'Formulación Base',
    title: 'AgNP con Corona Nativa (Sin Ligando)',
    formula: 'Ag⁰ + Corona Fitoquímica de Romero',
    desc: 'Partícula funcionalizada únicamente con su corona fitoquímica vegetal, depositada localmente mediante la matriz de nanocelulosa.',
    impact:
      'Sirve como control comparativo frente a la variante funcionalizada con ácido fólico.',
    accentColor: '#94a3b8',
  },
  healthy_tissue: {
    id: 'healthy_tissue',
    tag: 'Control Fisiológico',
    title: 'Tejido Sano Circundante',
    formula: 'pH extracelular 7.4 · Arquitectura ordenada',
    desc: 'Epitelio organizado en homeostasis con pH neutro donde el recubrimiento fitoquímico conserva su estabilidad.',
    impact:
      'Minimiza la liberación prematura de iones Ag⁺ fuera del microambiente tumoral.',
    accentColor: '#3b7a9e',
  },
  warburg_tumor: {
    id: 'warburg_tumor',
    tag: 'Microambiente Tumoral',
    title: 'Esferoide Tumoral y Efecto Warburg',
    formula: 'pH 6.2 – 6.8 · Acidez intersticial por lactato/H⁺',
    desc: 'Masa celular heterogénea con glucólisis aeróbica incrementada que acidifica el espacio extracelular adyacente.',
    impact:
      'Actúa como estímulo fisiopatológico para la respuesta del nanogel y la liberación local de AgNPs.',
    accentColor: '#a44c58',
  },
  vessel_branch: {
    id: 'vessel_branch',
    tag: 'Irrigación Tumoral',
    title: 'Vasculatura Angiogénica Tortuosa',
    formula: 'Red microvascular irregular tumoral',
    desc: 'Vasos sanguíneos ramificados que irrigan el esferoide tumoral y delimitan el intersticio donde permanece el depósito.',
    impact:
      'Contextualiza la administración localizada frente al aclaramiento sistémico.',
    accentColor: '#ad2936',
  },
  fr_alpha: {
    id: 'fr_alpha',
    tag: 'Diana en Membrana (Propuesto)',
    title: 'Receptor Trimérico de Folato (FR-α)',
    formula: 'Proteína transmembrana · Afinidad por folato',
    desc: 'Complejo receptor de membrana con bolsillo extracelular sobreexpresado en múltiples líneas tumorales epiteliales.',
    impact:
      'Media el acoplamiento específico de la variante +Folato previo a la invaginación endocítica.',
    accentColor: '#bf3b3b',
  },
  lipid_bilayer: {
    id: 'lipid_bilayer',
    tag: 'Barrera Celular',
    title: 'Bicapa Fosfolipídica Plasmática',
    formula: 'Doble hoja anfipática · Cabezas polares + Colas',
    desc: 'Membrana selectiva de doble capa que restringe la difusión pasiva directa de nanopartículas hidrofílicas.',
    impact:
      'Exige internalización activa por invaginación vesicular para acceder al compartimento intracelular.',
    accentColor: '#5ec2cc',
  },
  clathrin: {
    id: 'clathrin',
    tag: 'Mecanismo Propuesto · CME',
    title: 'Canasta de Clatrina y Collar de Dinamina',
    formula: 'Endocitosis mediada por clatrina (~80–100 nm)',
    desc: 'Red poliédrica de trisqueliones de clatrina que curva la membrana y anillo contráctil de dinamina que escinde la vesícula.',
    impact:
      'Internaliza las AgNPs recubiertas hacia la ruta endosómica temprana.',
    accentColor: '#5ec2cc',
  },
  vatpase: {
    id: 'vatpase',
    tag: 'Mecanismo Propuesto · Endosoma',
    title: 'Acidificación Endosomal por V-ATPasa',
    formula: 'pH 7.4 → 4.5 · Protonación –COO⁻ → –COOH',
    desc: 'Bombas de protones V-ATPasa acidifican el lumen endosomal, debilitando los enlaces de la corona de romero sobre el núcleo Ag⁰.',
    impact:
      'Desprende la cubierta fitoquímica y expone la superficie metálica al entorno oxidante ácido.',
    accentColor: '#f6bc72',
  },
  endosome_escape: {
    id: 'endosome_escape',
    tag: 'Mecanismo Propuesto · Escape',
    title: 'Peroxidación Lipídica y Escape Endosómico',
    formula: '4Ag⁰ + O₂ + 4H⁺ → 4Ag⁺ + 2H₂O + ROS',
    desc: 'La disolución oxidativa del núcleo de plata genera radicales ROS locales que peroxidan la membrana endosómica.',
    impact:
      'Fractura la integridad vesicular y libera iones Ag⁺ bioactivos directamente al citosol.',
    accentColor: '#ea580c',
  },
  ag_ion: {
    id: 'ag_ion',
    tag: 'Especie Citosólica (Propuesta)',
    title: 'Iones de Plata Bioactivos (Ag⁺)',
    formula: 'Alta afinidad por grupos tiol (–SH)',
    desc: 'Cationes liberados tras la disolución oxidativa endosomal que difunden hacia el citosol y la mitocondria.',
    impact:
      'Se coordinan con residuos sulfhidrilo del glutatión reducido (GSH), neutralizando la defensa antioxidante.',
    accentColor: '#a0ced8',
  },
  gsh: {
    id: 'gsh',
    tag: 'Escudo Antioxidante (Propuesto)',
    title: 'Glutatión Reducido (GSH)',
    formula: 'Secuestro Ag⁺ + –SH → Complejo Ag–SG',
    desc: 'Principal amortiguador redox celular representado como candados protectores alrededor de la mitocondria.',
    impact:
      'Su agotamiento deja expuestas las crestas mitocondriales y el ADNmt al estrés oxidativo.',
    accentColor: '#6b8f71',
  },
  ros: {
    id: 'ros',
    tag: 'Estrés Oxidativo (Propuesto)',
    title: 'Especies Reactivas de Oxígeno (ROS)',
    formula: 'O₂•⁻ · H₂O₂ · •OH → Daño lipídico y ADNmt',
    desc: 'Acumulación aguda de radicales oxidantes tras el bloqueo del escudo GSH.',
    impact:
      'Peroxida lípidos mitocondriales y desencadena la caída del potencial de membrana ΔΨm.',
    accentColor: '#b4823e',
  },
  mito_cristae: {
    id: 'mito_cristae',
    tag: 'Organelo Blanco (Propuesto)',
    title: 'Mitocondria, Crestas y ADN Mitocondrial',
    formula: 'Pérdida de ΔΨm (-180 mV → Colapso)',
    desc: 'Corte 3/4 de la membrana externa exponiendo crestas internas y el anillo de ADN mitocondrial bajo agresión oxidativa.',
    impact:
      'La permeabilización de la membrana externa habilita la salida de Citocromo c.',
    accentColor: '#4fb3bf',
  },
  cytc: {
    id: 'cytc',
    tag: 'Señal Pro-Apoptótica (Propuesta)',
    title: 'Translocación de Citocromo c',
    formula: 'Espacio intermembrana → Citosol',
    desc: 'Liberación de moléculas de Citocromo c desde la mitocondria colapsada hacia complejos citosólicos.',
    impact:
      'Activa el ensamblaje del apoptosoma como punto de no retorno hacia la muerte celular.',
    accentColor: '#d8b4fe',
  },
  apoptosome: {
    id: 'apoptosome',
    tag: 'Desenlace Propuesto · Apoptosis',
    title: 'Cascada Caspasa 9 → Caspasa 3',
    formula: 'Citocromo c → Apoptosoma → Caspasa 9 → 3',
    desc: 'Complejos heptaméricos activadores de caspasas ejecutoras acompañados de fragmentación ordenada en cuerpos apoptóticos.',
    impact:
      'Representa conceptualmente una muerte celular programada limpia sin lisis necrótica inflamatoria.',
    accentColor: '#7c3f58',
  },
};

export const IDENTIFIER_CHIPS: { id: MoleculeId; label: string; color: string }[] = [
  { id: 'nanocellulose', label: 'Nanogel / Red', color: '#5ec2cc' },
  { id: 'ag0_core', label: 'AgNP (Ag⁰)', color: '#e2e8f0' },
  { id: 'rosemary_corona', label: 'Corona Romero', color: '#4f9476' },
  { id: 'folate_np', label: 'Ácido Fólico', color: '#eab308' },
  { id: 'clathrin', label: 'Clatrina (CME)', color: '#5ec2cc' },
  { id: 'endosome_escape', label: 'Escape Endos.', color: '#ea580c' },
  { id: 'gsh', label: 'Escudo GSH', color: '#6b8f71' },
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

  if (stageIdx <= 4) {
    return {
      ph: '7.4',
      deltaPsiMv: -180,
      gshPercent: 98,
      rosPercent: 4,
      agReleasePercent: stageIdx === 4 ? Math.round(agConc * 12) : 0,
      stateLabel: stageIdx === 0 ? 'CALIBRACIÓN EDITORIAL' : 'ESTABLE · pH 7.4',
      stateTone: 'teal',
    };
  }

  if (stageIdx === 5) {
    const phVal = 7.4 - localT * 1.05;
    return {
      ph: phVal.toFixed(1),
      deltaPsiMv: -176,
      gshPercent: 94,
      rosPercent: Math.round(8 + localT * 10),
      agReleasePercent: Math.round(localT * agConc * 28),
      stateLabel: 'ENTORNO WARBURG',
      stateTone: 'amber',
    };
  }

  if (stageIdx === 6) {
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

  if (stageIdx === 7) {
    const phVal = 6.4 - localT * 1.9;
    const escapeFactor = clamp((localT - 0.55) / 0.45, 0, 1);
    return {
      ph: phVal.toFixed(1),
      deltaPsiMv: Math.round(-170 + escapeFactor * 28),
      gshPercent: Math.round(88 - escapeFactor * 26 * agConc),
      rosPercent: Math.round(20 + localT * 42 * rosRate),
      agReleasePercent: Math.round(32 + escapeFactor * 68 * agConc),
      stateLabel: localT < 0.36 ? 'ENDOCITOSIS CME' : localT < 0.66 ? 'ACIDIFICACIÓN pH 4.5' : 'ESCAPE ENDOSOMAL',
      stateTone: localT < 0.36 ? 'teal' : localT < 0.66 ? 'amber' : 'orange',
    };
  }

  // Set 08: Mitochondrial stress -> Apoptosis
  const stress = clamp(localT * (0.65 + rosRate * 0.35), 0, 1);
  return {
    ph: '7.1',
    deltaPsiMv: Math.round(-140 + stress * 124),
    gshPercent: Math.round(clamp(64 - stress * 62 * agConc, 2, 100)),
    rosPercent: Math.round(clamp(48 + stress * 50 * rosRate, 15, 99)),
    agReleasePercent: Math.round(85 + agConc * 15),
    stateLabel: localT < 0.45 ? 'BLOQUEO GSH / ROS' : 'APOPTOSIS · CASPASA 9→3',
    stateTone: localT < 0.45 ? 'orange' : 'plum',
  };
}
