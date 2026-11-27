# Directrices Científicas y Mecanismo Propuesto

## 1. Principios de Rigor y Transparencia Científica

1. **Separación entre arquitectura del material y mecanismo biológico propuesto:**
   * **Sets 01–04 (Arquitectura del Material):** Representan la estructura física conceptual del nanogel de nanocelulosa con AgNPs y corona fitoquímica de *Rosmarinus officinalis* (y su variante con ligandos de Ácido Fólico).
   * **Sets 05–08 (Microambiente y Cascada Intracelular):** Representan el microambiente fisiopatológico y un **mecanismo de acción propuesto** en nanomedicina oncológica. En la interfaz web se identifica explícitamente como `MECANISMO PROPUESTO / SIMULACIÓN CONCEPTUAL`.
2. **No invención de datos experimentales:**
   * Los parámetros dinámicos del HUD (`pH`, `ΔΨm`, `% GSH`, `% ROS`, `% Ag⁺`) son variables conceptuales normalizadas o rangos fisiológicos de referencia (ej. `pH 7.4` fisiológico, `pH 6.2–6.8` intersticio tumoral Warburg, `pH ~4.5` lumen endosomal) hasta incorporar datos experimentales propios.

---

## 2. Secuencia Bioquímica del Mecanismo Propuesto (`Sets 05–08`)

```mermaid
flowchart TD
    S4["Set 04: Nanogel de Nanocelulosa + AgNPs + Corona de Romero\n(Variante Base vs. Variante +Folato)"] --> S5["Set 05: Microambiente Tumoral\nEfecto Warburg (pH 6.2 - 6.8)"]
    S5 --> S6["Set 06: Interacción con Membrana Celular\nAcoplamiento a receptores triméricos FR-α"]
    S6 --> S7A["Set 07a: Endocitosis Mediada por Clatrina (CME)\nCanasta de Clatrina + Escisión por Dinamina"]
    S7A --> S7B["Set 07b: Acidificación Endosomal\nBombas V-ATPasa (pH ~4.5) → Protonación de corona"]
    S7B --> S7C["Set 07c: Escape Endosómico\nDisolución oxidativa (Ag⁰ → Ag⁺) + Peroxidación lipídica"]
    S7C --> S8A["Set 08a: Estrés Oxidativo Mitocondrial\nBloqueo de Glutatión (GSH) por Ag⁺ → Explosión de ROS"]
    S8A --> S8B["Set 08b: Apoptosis\nCaída de ΔΨm → Liberación de Citocromo c → Caspasa 9 → Caspasa 3"]
```
