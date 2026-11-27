import type { ReactNode } from 'react';
import {
  IDENTIFIER_CHIPS,
  MOLECULE_INFO,
  SETS_DATA,
  SPEED_OPTIONS,
} from '../../config/setsData';
import type {
  LigandMode,
  MoleculeId,
  SetId,
  TelemetrySnapshot,
} from '../../types/simulation';

interface ObsidianHudProps {
  activeSet: SetId;
  progress: number;
  isPlaying: boolean;
  loopSet: boolean;
  speedIdx: number;
  xrayMode: boolean;
  autoRotate: boolean;
  ligandMode: LigandMode;
  agConcentration: number;
  rosRate: number;
  selectedMol: MoleculeId;
  telemetry: TelemetrySnapshot;
  panelsHidden: boolean;
  mobileSheet: 'left' | 'right' | null;
  onSelectSet: (setId: SetId) => void;
  onProgressChange: (p: number) => void;
  onTogglePlay: () => void;
  onPrevSet: () => void;
  onNextSet: () => void;
  onCycleSpeed: () => void;
  onToggleLoop: () => void;
  onToggleXray: () => void;
  onPulse: () => void;
  onToggleRotate: () => void;
  onReset: () => void;
  onOpenQr: () => void;
  onTogglePanels: () => void;
  onSetLigandMode: (m: LigandMode) => void;
  onSetAgConc: (v: number) => void;
  onSetRosRate: (v: number) => void;
  onSelectMolecule: (id: MoleculeId) => void;
  onSetMobileSheet: (sheet: 'left' | 'right' | null) => void;
}

function TonePill({
  tone,
  children,
}: {
  tone: 'teal' | 'amber' | 'orange' | 'plum';
  children: ReactNode;
}) {
  const styles: Record<typeof tone, { bg: string; color: string; border: string }> = {
    teal: {
      bg: 'rgba(94, 139, 148, 0.20)',
      color: '#a0ced8',
      border: 'rgba(160, 206, 216, 0.35)',
    },
    amber: {
      bg: 'rgba(180, 130, 62, 0.22)',
      color: '#f6bc72',
      border: 'rgba(246, 188, 114, 0.38)',
    },
    orange: {
      bg: 'rgba(234, 88, 12, 0.24)',
      color: '#fdba74',
      border: 'rgba(251, 146, 60, 0.42)',
    },
    plum: {
      bg: 'rgba(124, 63, 88, 0.34)',
      color: '#f0abfc',
      border: 'rgba(192, 132, 252, 0.4)',
    },
  };
  const s = styles[tone];
  return (
    <span
      className="font-mono-tech"
      style={{
        fontSize: '0.6rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '0.15rem 0.45rem',
        borderRadius: '9999px',
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export function ObsidianHud(props: ObsidianHudProps) {
  const setMeta = SETS_DATA[props.activeSet];
  const molInfo = MOLECULE_INFO[props.selectedMol];

  return (
    <>
      {/* TOP HEADER BAR */}
      <header className="hud-header">
        <div className="hud-brand">
          <div className="hud-brand-icon" aria-hidden="true">
            ⬡
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 className="hud-brand-title">Nanomedicine Editorial Lab</h1>
            <div className="hud-brand-sub">
              <TonePill tone={props.telemetry.stateTone}>
                {props.telemetry.stateLabel}
              </TonePill>
              {setMeta.isProposedMechanism && (
                <TonePill tone="amber">Mecanismo Propuesto</TonePill>
              )}
              <span className="hud-hide-sm" style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                Nanocelulosa · AgNPs · <em>Rosmarinus officinalis</em>
              </span>
            </div>
          </div>
        </div>

        <div className="hud-actions">
          <button
            type="button"
            className={`hud-btn ${props.xrayMode ? 'hud-btn-active' : ''}`}
            onClick={props.onToggleXray}
            title="Alternar corte 3/4 de inspección interna"
          >
            <span>◎</span>
            <span className="hud-hide-md">Corte 3/4</span>
          </button>

          <button
            type="button"
            className="hud-btn hud-btn-amber"
            onClick={props.onPulse}
            title="Enviar impulso cinético"
          >
            <span>⚡</span>
            <span className="hud-hide-md">Impulso</span>
          </button>

          <button
            type="button"
            className={`hud-btn ${props.autoRotate ? 'hud-btn-active' : ''}`}
            onClick={props.onToggleRotate}
            title="Alternar rotación 360°"
          >
            <span>↻</span>
            <span className="hud-hide-lg">Rotar</span>
          </button>

          <button
            type="button"
            className="hud-btn hud-hide-xs"
            onClick={props.onReset}
            title="Restablecer cámara y simulación"
          >
            ↺
          </button>

          <button
            type="button"
            className="hud-btn hud-btn-qr"
            onClick={props.onOpenQr}
            title="Código QR para abrir en celulares del salón"
          >
            <span>⊞</span>
            <span>QR Salón</span>
          </button>

          <button
            type="button"
            className="hud-btn hud-desktop-only"
            onClick={props.onTogglePanels}
            title="Mostrar / Ocultar paneles laterales"
          >
            {props.panelsHidden ? 'Mostrar HUD' : 'Ocultar HUD'}
          </button>
        </div>
      </header>

      {/* MOBILE FLOATING SHEET TRIGGERS */}
      <div className="hud-mobile-pills">
        <button
          type="button"
          className="obsidian-panel hud-pill-btn"
          onClick={() => props.onSetMobileSheet(props.mobileSheet === 'left' ? null : 'left')}
        >
          <span className="dot-teal" />
          <span>Telemetría y Controles</span>
        </button>
        <button
          type="button"
          className="obsidian-panel hud-pill-btn"
          onClick={() => props.onSetMobileSheet(props.mobileSheet === 'right' ? null : 'right')}
        >
          <span>Ficha Molecular</span>
          <span className="dot-amber" />
        </button>
      </div>

      {props.mobileSheet && (
        <div
          className="hud-mobile-backdrop"
          onClick={() => props.onSetMobileSheet(null)}
        />
      )}

      {/* LEFT PANEL: VARIANT + KINETICS + TELEMETRY + IDENTIFIER CHIPS */}
      <aside
        className={`obsidian-panel hud-left-panel ${
          props.panelsHidden ? 'hud-left-hidden' : ''
        } ${props.mobileSheet === 'left' ? 'mobile-open' : ''}`}
      >
        <div className="panel-header">
          <div className="panel-title-row">
            <span className="dot-teal" />
            <span className="font-mono-tech panel-heading">
              Parámetros &amp; Telemetría
            </span>
          </div>
          <button
            type="button"
            className="panel-close-mobile"
            onClick={() => props.onSetMobileSheet(null)}
          >
            ✕
          </button>
        </div>

        {/* Ligand Functionalization Variant */}
        <div>
          <div className="font-mono-tech micro-label">
            Variante de Funcionalización
          </div>
          <div className="segmented-3">
            {(['base', 'folate', 'compare'] as LigandMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`seg-btn ${props.ligandMode === mode ? 'seg-btn-active' : ''}`}
                onClick={() => props.onSetLigandMode(mode)}
              >
                {mode === 'base' ? 'Base' : mode === 'folate' ? '+Folato' : 'Ambas'}
              </button>
            ))}
          </div>
        </div>

        {/* Conceptual Kinetic Sliders */}
        <div className="section-divider">
          <div className="slider-row">
            <div className="slider-head">
              <span>Concentración Ag⁺</span>
              <span className="font-mono-tech" style={{ color: '#a0ced8' }}>
                {Math.round(props.agConcentration * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              value={Math.round(props.agConcentration * 100)}
              onChange={(e) => props.onSetAgConc(Number(e.target.value) / 100)}
              className="obsidian-slider"
            />
          </div>

          <div className="slider-row">
            <div className="slider-head">
              <span>Tasa de ROS (Conceptual)</span>
              <span className="font-mono-tech" style={{ color: '#f6bc72' }}>
                {Math.round(props.rosRate * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              value={Math.round(props.rosRate * 100)}
              onChange={(e) => props.onSetRosRate(Number(e.target.value) / 100)}
              className="obsidian-slider slider-amber"
            />
          </div>
        </div>

        {/* Live Telemetry Readouts */}
        <div className="section-divider">
          <div className="telemetry-grid font-mono-tech">
            <div className="telem-box">
              <span className="telem-k">pH Local</span>
              <span className="telem-v">{props.telemetry.ph}</span>
            </div>
            <div className="telem-box">
              <span className="telem-k">ΔΨm</span>
              <span className="telem-v">{props.telemetry.deltaPsiMv} mV</span>
            </div>
            <div className="telem-box">
              <span className="telem-k">GSH</span>
              <span className="telem-v" style={{ color: '#aad0ae' }}>
                {props.telemetry.gshPercent}%
              </span>
            </div>
            <div className="telem-box">
              <span className="telem-k">ROS</span>
              <span className="telem-v" style={{ color: '#f6bc72' }}>
                {props.telemetry.rosPercent}%
              </span>
            </div>
          </div>
          <div className="progress-track-thin">
            <div
              className="progress-fill-ros"
              style={{ width: `${props.telemetry.rosPercent}%` }}
            />
          </div>
        </div>

        {/* Color-Coded Identifier Chips */}
        <div className="section-divider">
          <div className="font-mono-tech micro-label">
            Identificadores Moleculares
          </div>
          <div className="chip-grid">
            {IDENTIFIER_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`ident-chip ${
                  props.selectedMol === chip.id ? 'ident-chip-active' : ''
                }`}
                onClick={() => props.onSelectMolecule(chip.id)}
              >
                <span className="chip-dot" style={{ background: chip.color }} />
                <span className="chip-text">{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: MOLECULAR INSPECTOR CARD */}
      <aside
        className={`obsidian-panel hud-right-panel ${
          props.panelsHidden ? 'hud-right-hidden' : ''
        } ${props.mobileSheet === 'right' ? 'mobile-open' : ''}`}
      >
        <div className="panel-header">
          <span
            className="font-mono-tech"
            style={{
              fontSize: '0.62rem',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              padding: '0.2rem 0.5rem',
              borderRadius: '0.4rem',
              background: 'rgba(94, 139, 148, 0.22)',
              color: '#a0ced8',
              border: '1px solid rgba(160, 206, 216, 0.3)',
            }}
          >
            {molInfo.tag}
          </span>
          <button
            type="button"
            className="panel-close-mobile"
            onClick={() => props.onSetMobileSheet(null)}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            width: '26px',
            height: '3px',
            borderRadius: '9999px',
            background: molInfo.accentColor,
          }}
        />

        <h2 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
          {molInfo.title}
        </h2>

        <div
          className="font-mono-tech"
          style={{
            fontSize: '0.66rem',
            color: '#a0ced8',
            background: '#07090e',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            borderRadius: '0.5rem',
            padding: '0.4rem 0.55rem',
          }}
        >
          {molInfo.formula}
        </div>

        <p style={{ margin: 0, fontSize: '0.73rem', color: '#cbd5e1', lineHeight: 1.48 }}>
          {molInfo.desc}
        </p>

        <div
          style={{
            background: 'rgba(7, 9, 14, 0.72)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '0.55rem',
            padding: '0.55rem',
          }}
        >
          <div
            className="font-mono-tech"
            style={{
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#f6bc72',
              marginBottom: '0.2rem',
            }}
          >
            Función en el Modelo
          </div>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#e2e8f0', lineHeight: 1.4 }}>
            {molInfo.impact}
          </p>
        </div>

        <div
          className="font-mono-tech"
          style={{
            fontSize: '0.6rem',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span className="dot-teal" />
          <span>Toca o haz clic en cualquier estructura 3D</span>
        </div>
      </aside>

      {/* BOTTOM TIMELINE DOCK (ALL 9 SETS: 00 - 08) */}
      <section className="hud-bottom-dock">
        <div className="obsidian-panel hud-bottom-card">
          <div className="timeline-controls">
            <div className="timeline-left">
              <button
                type="button"
                className="ctrl-btn hud-hide-xs"
                onClick={props.onPrevSet}
                title="Set anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className="ctrl-btn ctrl-play"
                onClick={props.onTogglePlay}
                title="Reproducir / Pausar"
              >
                {props.isPlaying ? '❚❚' : '▶'}
              </button>
              <button
                type="button"
                className="ctrl-btn hud-hide-xs"
                onClick={props.onNextSet}
                title="Siguiente Set"
              >
                ›
              </button>
              <button
                type="button"
                className="ctrl-pill font-mono-tech"
                onClick={props.onCycleSpeed}
                title="Velocidad de reproducción"
              >
                {SPEED_OPTIONS[props.speedIdx].toFixed(1)}×
              </button>
              <button
                type="button"
                className={`ctrl-pill font-mono-tech hud-hide-md ${
                  props.loopSet ? 'hud-btn-active' : ''
                }`}
                onClick={props.onToggleLoop}
                title="Repetir set actual en bucle"
              >
                Bucle: {props.loopSet ? 'ON' : 'OFF'}
              </button>

              <div className="stage-heading">
                <span className="font-mono-tech stage-code-badge">
                  {setMeta.shortCode}
                </span>
                <span className="stage-title-text">{setMeta.title}</span>
              </div>
            </div>

            <span className="font-mono-tech progress-pct">
              {Math.round(props.progress)}%
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={props.progress}
            onChange={(e) => props.onProgressChange(Number(e.target.value))}
            className="obsidian-slider"
            style={{ marginBottom: '0.45rem' }}
          />

          <div className="sets-strip no-scrollbar">
            {SETS_DATA.map((st) => {
              const active = st.id === props.activeSet;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => props.onSelectSet(st.id)}
                  className={`set-card ${active ? 'set-card-active' : ''}`}
                >
                  <div className="font-mono-tech set-card-code">
                    {st.shortCode}
                    {st.isProposedMechanism ? ' · PROP.' : ''}
                  </div>
                  <div className="set-card-label">{st.shortLabel}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* EDITORIAL FOOTER */}
      <footer className="hud-footer font-mono-tech">
        <span>SCIENTIFIC EDITORIAL BIOMOLECULAR · NANOGEL NANOCELULOSA–AgNPs–ROMERO</span>
        <span className="hud-hide-xs" style={{ color: '#a0ced8' }}>
          VISUALIZACIÓN CONCEPTUAL · SETS 00–08
        </span>
      </footer>
    </>
  );
}
