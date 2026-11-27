import { useCallback, useEffect, useMemo, useState } from 'react';
import { EditorialViewport } from './components/canvas/EditorialViewport';
import { ObsidianHud } from './components/hud/ObsidianHud';
import { QRModal } from './components/hud/QRModal';
import {
  SETS_DATA,
  SPEED_OPTIONS,
  computeTelemetry,
} from './config/setsData';
import type { LigandMode, MoleculeId, SetId } from './types/simulation';

const TOTAL_SETS = SETS_DATA.length; // 9 Sets: 00 - 08
const SET_SPAN = 100 / TOTAL_SETS;

export function App() {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loopSet, setLoopSet] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [xrayMode, setXrayMode] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [ligandMode, setLigandMode] = useState<LigandMode>('base');
  const [agConcentration, setAgConcentration] = useState(0.65);
  const [rosRate, setRosRate] = useState(0.6);
  const [pulseBoost, setPulseBoost] = useState(0);
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedMolOverride, setSelectedMolOverride] = useState<{
    set: SetId;
    mol: MoleculeId;
  } | null>(null);
  const [panelsHidden, setPanelsHidden] = useState(false);
  const [mobileSheet, setMobileSheet] = useState<'left' | 'right' | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  const activeSet = Math.min(
    TOTAL_SETS - 1,
    Math.floor(Math.max(0, Math.min(99.999, progress)) / SET_SPAN)
  ) as SetId;

  const localT = Math.max(
    0,
    Math.min(1, (progress - activeSet * SET_SPAN) / SET_SPAN)
  );

  const selectedMol =
    selectedMolOverride && selectedMolOverride.set === activeSet
      ? selectedMolOverride.mol
      : SETS_DATA[activeSet].defaultMol;

  // Simulation loop
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;

      if (isPlaying) {
        const mult = SPEED_OPTIONS[speedIdx];
        setProgress((prev) => {
          const next = prev + 1.85 * mult * dt;
          if (loopSet) {
            const curIdx = Math.min(TOTAL_SETS - 1, Math.floor(prev / SET_SPAN));
            const minP = curIdx * SET_SPAN;
            const maxP = (curIdx + 1) * SET_SPAN - 0.05;
            return next >= maxP ? minP : next;
          }
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
      }

      setPulseBoost((prev) => (prev > 0 ? Math.max(0, prev - dt * 22) : 0));
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, loopSet, speedIdx]);

  const handleSelectSet = useCallback(
    (setId: SetId) => {
      setProgress(setId * SET_SPAN + SET_SPAN * 0.12);
      setSelectedMolOverride(null);
      if (setId === 5 && ligandMode === 'base') {
        setLigandMode('compare');
      }
    },
    [ligandMode]
  );

  const handlePrevSet = useCallback(() => {
    const prev = Math.max(0, activeSet - 1) as SetId;
    handleSelectSet(prev);
  }, [activeSet, handleSelectSet]);

  const handleNextSet = useCallback(() => {
    const next = Math.min(TOTAL_SETS - 1, activeSet + 1) as SetId;
    handleSelectSet(next);
  }, [activeSet, handleSelectSet]);

  const handleSelectMolecule = useCallback(
    (id: MoleculeId) => {
      setSelectedMolOverride({ set: activeSet, mol: id });
      if (window.innerWidth < 900) {
        setMobileSheet('right');
      } else {
        setPanelsHidden(false);
      }
    },
    [activeSet]
  );

  const handlePulse = useCallback(() => {
    setPulseBoost(100);
    setPulseTrigger((c) => c + 1);
  }, []);

  const handleReset = useCallback(() => {
    setProgress(0);
    setIsPlaying(true);
    setLoopSet(false);
    setSpeedIdx(0);
    setXrayMode(true);
    setAutoRotate(true);
    setLigandMode('base');
    setAgConcentration(0.65);
    setRosRate(0.6);
    setSelectedMolOverride(null);
    setResetTrigger((c) => c + 1);
  }, []);

  const telemetry = useMemo(
    () => computeTelemetry(activeSet, localT, agConcentration, rosRate, ligandMode),
    [activeSet, localT, agConcentration, rosRate, ligandMode]
  );

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <EditorialViewport
        activeSet={activeSet}
        localT={localT}
        xrayMode={xrayMode}
        autoRotate={autoRotate}
        ligandMode={ligandMode}
        agConcentration={agConcentration}
        rosRate={rosRate}
        pulseBoost={pulseBoost}
        pulseTrigger={pulseTrigger}
        resetTrigger={resetTrigger}
        onSelectMolecule={handleSelectMolecule}
      />

      <ObsidianHud
        activeSet={activeSet}
        progress={progress}
        isPlaying={isPlaying}
        loopSet={loopSet}
        speedIdx={speedIdx}
        xrayMode={xrayMode}
        autoRotate={autoRotate}
        ligandMode={ligandMode}
        agConcentration={agConcentration}
        rosRate={rosRate}
        selectedMol={selectedMol}
        telemetry={telemetry}
        panelsHidden={panelsHidden}
        mobileSheet={mobileSheet}
        onSelectSet={handleSelectSet}
        onProgressChange={setProgress}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onPrevSet={handlePrevSet}
        onNextSet={handleNextSet}
        onCycleSpeed={() => setSpeedIdx((i) => (i + 1) % SPEED_OPTIONS.length)}
        onToggleLoop={() => setLoopSet((l) => !l)}
        onToggleXray={() => setXrayMode((x) => !x)}
        onPulse={handlePulse}
        onToggleRotate={() => setAutoRotate((r) => !r)}
        onReset={handleReset}
        onOpenQr={() => setQrOpen(true)}
        onTogglePanels={() => setPanelsHidden((h) => !h)}
        onSetLigandMode={setLigandMode}
        onSetAgConc={setAgConcentration}
        onSetRosRate={setRosRate}
        onSelectMolecule={handleSelectMolecule}
        onSetMobileSheet={setMobileSheet}
      />

      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </main>
  );
}

export default App;
