# Síntesis Visual Unificada — Nanomedicine Editorial Lab

Este documento define el estándar visual único (**"Scientific Editorial Biomolecular"**) que unifica los **9 Sets (`Set 00` – `Set 08`)** a partir del análisis conjunto de las 11 imágenes de referencia del proyecto.

> **Principio rector:** No se utiliza un estilo distinto por sección. Todo el modelado 3D, los cortes transversales (*cutaways*), los shaders PBR y la iluminación de estudio comparten una misma media visual cohesiva desde el nanogel hasta la apoptosis.

---

## 1. Rasgos Extraídos de las 11 Referencias

1. **Red porosa tipo Voronoi y jaula polimérica continua:** Estructuras esféricas con cavidades porosas definidas formadas por filamentos tubulares entrelazados y nodos de unión.
2. **Envoltura de hidrogel translúcida con corte 3/4:** Cáscara hidratada cian-turquesa refractiva que envuelve a las fibrillas internas y permite inspección interior mediante apertura limpia en 3/4.
3. **Núcleo metálico satinado (`Ag⁰`):** Plata metálica con micro-facetado sutil y acabado satinado de estudio (ni espejo cromado ni plástico plano).
4. **Corona fitoquímica en cepillo con puntas activas:** Cepillo denso de cadenas orgánicas curvas recubriendo la nanopartícula metálica con grupos terminales funcionales contrastantes (`–OH` / `–COOH`) y opción de apertura en corte 3/4.
5. **Ligandos radiales y acoplamiento en bicapa lipídica:** Cadenas moleculares radiales con anillos terminales interactuando con receptores transmembrana triméricos (`FR-α`) insertos en una bicapa fosfolipídica explícita de doble hoja con curvatura endocítica.
6. **Microambiente tumoral heterogéneo:** Esferoide celular orgánico con relieve irregular y vasculatura angiogénica ramificada en contraste con tejido sano ordenado.
7. **Ultraestructura celular en corte 3/4:** Córtex orgánico con espesor de pared definido, citoplasma translúcido, citoesqueleto filamentoso y organelos internos (mitocondrias con crestas y complejos macromoleculares).

---

## 2. Las 5 Familias Maestras de Materiales y Geometría

| Familia | Geometría Unificada | Parámetros PBR Editorial | Sets donde aplica |
| :--- | :--- | :--- | :--- |
| **1. Matriz de Nanocelulosa Hidratada** | Filamentos tubulares continuos entrelazados + nodos de cruce + corteza de hidrogel con corte 3/4 | Hidrogel: `#4fb3bf`, transmisión/clearcoat suave, opacidad `0.22` · Fibras: `#8be0e8`, `roughness 0.34` | `00`, `01`, `04`, `06` |
| **2. Plata Metálica Satinada (`Ag⁰` / `Ag⁺`)** | Icosfera subdividida con micro-facetado cristalino sutil y sombreado suave | `#e2e8f0`, `metalness 0.82`, `roughness 0.25`, reflejos suaves de estudio | `00`, `02`, `03`, `04`, `06`, `07`, `08` |
| **3. Corona Fitoquímica y Ligandos** | Hebras curvas orgánicas (`#4f9476`) + nodos activos (`#cfa358`) con corte 3/4 + tallos y anillos de Ácido Fólico (`#eab308`) | Acabado botánico semimate (`roughness 0.56–0.64`, `metalness 0.04`) | `00`, `01`, `03`, `04`, `06`, `07` |
| **4. Biomembranas y Organelos en Corte** | Cortices orgánicos con desplazamiento sutil, espesor de corte 3/4 y bicapa fosfolipídica explícita (cabezas + colas) | Membranas semi-translúcidas (`clearcoat 0.30`), mitocondria en tonos cian/terracota/ciruela según estado redox | `00`, `05`, `06`, `07`, `08` |
| **5. Proteínas y Señalización Bioquímica** | Complejos triméricos (`FR-α`), jaula poliédrica de Clatrina, collar de Dinamina, bombas V-ATPasa, escudos `GSH`, especies `ROS`, `Citocromo c` y complejo `Caspasa 9 → 3` | Paleta desaturada **Obsidian Molecular HUD** (`#5e8b94` plata, `#b4823e` ROS, `#6b8f71` GSH, `#7c3f58` Citocromo c) | `00`, `06`, `07`, `08` |

---

## 3. Estándar Común de Iluminación y Entorno (`Set 00`)

* **Fondo WebGL:** Gradiente radial profundo Obsidian Void (`#07090e` → `#0d1624`).
* **Iluminación de estudio:** Entorno PMREM procedural de 3 *softboxes* + luz clave blanco cálido (`#fffdf9`), relleno cian frío (`#99d5df`) y contraluz *rim light* hielo (`#bceaf4`) con *tone mapping* ACES Filmic.
