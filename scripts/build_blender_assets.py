"""
Headless Blender 5.3 asset generator for Nanomedicine Editorial Lab.
Builds unified 'Scientific Editorial Biomolecular' meshes across all 9 Sets,
saves editable .blend files locally under Blender/models/, and exports clean
glTF 2.0 (.glb) assets to exports/glb/ and web-app/public/models/.
"""

import math
from pathlib import Path
import random
import bpy
import bmesh
from mathutils import Matrix, Vector

ROOT_DIR = Path(__file__).resolve().parent.parent
BLENDER_MODELS_DIR = ROOT_DIR / "Blender" / "models"
EXPORTS_GLB_DIR = ROOT_DIR / "exports" / "glb"
WEB_MODELS_DIR = ROOT_DIR / "web-app" / "public" / "models"


def ensure_dirs() -> None:
    for d in (BLENDER_MODELS_DIR, EXPORTS_GLB_DIR, WEB_MODELS_DIR):
        d.mkdir(parents=True, exist_ok=True)


def clear_scene() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)


def set_smooth(mesh: bpy.types.Mesh) -> None:
    for poly in mesh.polygons:
        poly.use_smooth = True


def make_pbr_material(
    name: str,
    color: tuple[float, float, float, float],
    metallic: float = 0.0,
    roughness: float = 0.4,
    coat: float = 0.0,
    transmission: float = 0.0,
    alpha: float = 1.0,
) -> bpy.types.Material:
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness
        if "Coat Weight" in bsdf.inputs:
            bsdf.inputs["Coat Weight"].default_value = coat
        if "Transmission Weight" in bsdf.inputs:
            bsdf.inputs["Transmission Weight"].default_value = transmission
        if "Alpha" in bsdf.inputs:
            bsdf.inputs["Alpha"].default_value = alpha
    if alpha < 0.99:
        mat.blend_method = "BLEND" if hasattr(mat, "blend_method") else "OPAQUE"
    return mat


def create_object_from_bmesh(
    name: str,
    bm: bmesh.types.BMesh,
    material: bpy.types.Material | None = None,
    smooth: bool = True,
) -> bpy.types.Object:
    mesh = bpy.data.meshes.new(name + "_Mesh")
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    if smooth:
        set_smooth(mesh)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    if material:
        obj.data.materials.append(material)
    return obj


def add_tube_segment(
    bm: bmesh.types.BMesh,
    points: list[Vector],
    radius_start: float,
    radius_end: float | None = None,
    segments: int = 8,
    cap_ends: bool = True,
) -> None:
    if radius_end is None:
        radius_end = radius_start
    if len(points) < 2:
        return

    rings = []
    n_pts = len(points)
    prev_up = Vector((0, 0, 1))

    for idx, pt in enumerate(points):
        if idx == 0:
            tangent = (points[1] - points[0]).normalized()
        elif idx == n_pts - 1:
            tangent = (points[-1] - points[-2]).normalized()
        else:
            tangent = (points[idx + 1] - points[idx - 1]).normalized()

        if tangent.length < 1e-6:
            tangent = Vector((0, 1, 0))

        if abs(tangent.dot(prev_up)) > 0.95:
            prev_up = Vector((1, 0, 0)) if abs(tangent.x) < 0.9 else Vector((0, 1, 0))

        side = tangent.cross(prev_up).normalized()
        up = side.cross(tangent).normalized()
        prev_up = up

        t = idx / (n_pts - 1)
        r = radius_start * (1.0 - t) + radius_end * t

        ring_verts = []
        for s in range(segments):
            ang = (2.0 * math.pi * s) / segments
            offset = (side * math.cos(ang) + up * math.sin(ang)) * r
            ring_verts.append(bm.verts.new(pt + offset))
        rings.append(ring_verts)

    for i in range(len(rings) - 1):
        r0 = rings[i]
        r1 = rings[i + 1]
        for s in range(segments):
            s_next = (s + 1) % segments
            bm.faces.new((r0[s], r0[s_next], r1[s_next], r1[s]))

    if cap_ends:
        bm.faces.new(rings[0][::-1])
        bm.faces.new(rings[-1])


def add_sphere_to_bmesh(
    bm: bmesh.types.BMesh,
    center: Vector,
    radius: float,
    subdivisions: int = 1,
    scale: Vector | None = None,
) -> None:
    mat = Matrix.Translation(center)
    if scale is not None:
        mat = mat @ Matrix.Diagonal((scale.x, scale.y, scale.z, 1.0))
    bmesh.ops.create_icosphere(bm, subdivisions=subdivisions, radius=radius, matrix=mat)


def save_and_export(asset_name: str) -> None:
    blend_path = BLENDER_MODELS_DIR / f"{asset_name}.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))

    for out_dir in (EXPORTS_GLB_DIR, WEB_MODELS_DIR):
        glb_path = out_dir / f"{asset_name}.glb"
        bpy.ops.export_scene.gltf(
            filepath=str(glb_path),
            export_format="GLB",
            use_selection=False,
            export_apply=True,
            export_materials="EXPORT",
            export_normals=True,
            export_cameras=False,
            export_lights=False,
        )
    print(f"[OK] Exported {asset_name}.glb")


# ---------------------------------------------------------------------------
# 1. AgNP Core (Satin Micro-Faceted Metallic Silver Sphere)
# ---------------------------------------------------------------------------
def build_agnp_core() -> None:
    clear_scene()
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=3, radius=1.0)
    for v in bm.verts:
        n = v.co.normalized()
        # Subtle crystalline micro-faceting synthesis (Q428xXm + _sg-8F2)
        facet = 1.0 + 0.014 * math.sin(n.x * 9.0) * math.cos(n.y * 9.0) * math.sin(n.z * 9.0)
        v.co = n * facet

    mat_silver = make_pbr_material(
        "MAT_Silver_Satin",
        (0.88, 0.91, 0.94, 1.0),
        metallic=0.84,
        roughness=0.25,
    )
    create_object_from_bmesh("AgNP_Core", bm, mat_silver, smooth=True)
    save_and_export("agnp_core")


# ---------------------------------------------------------------------------
# 2. Rosemary Phytochemical Corona (Dense Organic Brush + Active Tips + 3/4 Cut)
# ---------------------------------------------------------------------------
def build_rosemary_corona() -> None:
    clear_scene()
    mat_strand = make_pbr_material(
        "MAT_Rosemary_Strand",
        (0.28, 0.59, 0.47, 1.0),
        metallic=0.04,
        roughness=0.58,
    )
    mat_tip = make_pbr_material(
        "MAT_Rosemary_Tip",
        (0.81, 0.64, 0.34, 1.0),
        metallic=0.06,
        roughness=0.50,
    )

    def build_variant(cutaway: bool, suffix: str) -> None:
        bm_strands = bmesh.new()
        bm_tips = bmesh.new()
        rng = random.Random(42)
        count = 110
        golden = math.pi * (3.0 - math.sqrt(5.0))

        for i in range(count):
            y = 1.0 - (i / float(count - 1)) * 2.0
            r_xz = math.sqrt(max(0.0, 1.0 - y * y))
            theta = golden * i
            dir_v = Vector((math.cos(theta) * r_xz, y, math.sin(theta) * r_xz)).normalized()

            # Clean 3/4 cutaway window in front-right-upper octant
            if cutaway and dir_v.x > 0.05 and dir_v.z > 0.05 and dir_v.y > -0.25:
                continue

            tangent_a = dir_v.cross(Vector((0, 1, 0)) if abs(dir_v.y) < 0.9 else Vector((1, 0, 0))).normalized()
            tangent_b = dir_v.cross(tangent_a).normalized()
            swirl_ang = rng.uniform(0, 2.0 * math.pi)
            bend = (tangent_a * math.cos(swirl_ang) + tangent_b * math.sin(swirl_ang)) * rng.uniform(0.08, 0.17)

            pts = []
            strand_len = rng.uniform(0.32, 0.44)
            for s in range(5):
                t = s / 4.0
                p = dir_v * (0.98 + t * strand_len) + bend * math.sin(t * math.pi * 0.85)
                pts.append(p)

            add_tube_segment(bm_strands, pts, 0.032, 0.022, segments=6, cap_ends=True)
            add_sphere_to_bmesh(bm_tips, pts[-1], 0.052 if i % 3 == 0 else 0.042, subdivisions=1)

        create_object_from_bmesh(f"Corona_Strands_{suffix}", bm_strands, mat_strand, smooth=True)
        create_object_from_bmesh(f"Corona_Tips_{suffix}", bm_tips, mat_tip, smooth=True)

    build_variant(cutaway=False, suffix="Full")
    build_variant(cutaway=True, suffix="Cutaway")
    save_and_export("rosemary_corona")


# ---------------------------------------------------------------------------
# 3. Folic Acid Targeting Ligands (Radial Stalks + Terminal Pteridine Rings)
# ---------------------------------------------------------------------------
def build_folate_ligands() -> None:
    clear_scene()
    mat_stalk = make_pbr_material(
        "MAT_Folate_Stalk",
        (0.49, 0.61, 0.56, 1.0),
        metallic=0.04,
        roughness=0.55,
    )
    mat_head = make_pbr_material(
        "MAT_Folate_Head",
        (0.92, 0.70, 0.04, 1.0),
        metallic=0.10,
        roughness=0.38,
        coat=0.25,
    )

    bm_stalks = bmesh.new()
    bm_heads = bmesh.new()
    count = 14
    golden = math.pi * (3.0 - math.sqrt(5.0))

    for i in range(count):
        y = 1.0 - (i / float(count - 1)) * 2.0
        r_xz = math.sqrt(max(0.0, 1.0 - y * y))
        theta = golden * (i + 3)
        dir_v = Vector((math.cos(theta) * r_xz, y, math.sin(theta) * r_xz)).normalized()

        tangent = dir_v.cross(Vector((0, 1, 0)) if abs(dir_v.y) < 0.9 else Vector((1, 0, 0))).normalized()
        pts = [
            dir_v * 1.25,
            dir_v * 1.48 + tangent * 0.06,
            dir_v * 1.72 - tangent * 0.03,
            dir_v * 1.92,
        ]
        add_tube_segment(bm_stalks, pts, 0.030, 0.024, segments=6, cap_ends=True)

        # Terminal pteridine ring approximation (torus-like ring of 8 spheres + central bead)
        ring_center = dir_v * 2.00
        side_a = tangent
        side_b = dir_v.cross(side_a).normalized()
        for k in range(8):
            ang = (2.0 * math.pi * k) / 8.0
            pos = ring_center + (side_a * math.cos(ang) + side_b * math.sin(ang)) * 0.11
            add_sphere_to_bmesh(bm_heads, pos, 0.048, subdivisions=1)
        add_sphere_to_bmesh(bm_heads, dir_v * 1.88, 0.055, subdivisions=1)

    create_object_from_bmesh("Folate_Stalks", bm_stalks, mat_stalk, smooth=True)
    create_object_from_bmesh("Folate_Heads", bm_heads, mat_head, smooth=True)
    save_and_export("folate_ligands")


# ---------------------------------------------------------------------------
# 4. Nanocellulose Matrix (Continuous Interwoven Fibrils + Hydrogel Cutaway)
# ---------------------------------------------------------------------------
def build_nanocellulose_matrix() -> None:
    clear_scene()
    mat_fibril = make_pbr_material(
        "MAT_Nanocellulose_Fibril",
        (0.58, 0.89, 0.93, 1.0),
        metallic=0.05,
        roughness=0.34,
        coat=0.2,
    )
    mat_node = make_pbr_material(
        "MAT_Nanocellulose_Node",
        (0.31, 0.70, 0.75, 1.0),
        metallic=0.08,
        roughness=0.36,
    )
    mat_shell = make_pbr_material(
        "MAT_Hydrogel_Shell",
        (0.35, 0.76, 0.80, 1.0),
        metallic=0.02,
        roughness=0.16,
        coat=0.65,
        transmission=0.25,
        alpha=0.26,
    )

    R = 3.55
    ag_pockets = [
        Vector((0.0, 0.0, 0.0)),
        Vector((1.20, 0.80, 1.05)),
        Vector((-1.45, 1.05, 0.65)),
        Vector((1.50, -1.05, -0.75)),
        Vector((-0.95, -1.35, 1.15)),
        Vector((-1.25, 0.15, -1.55)),
        Vector((0.45, 1.65, -1.05)),
        Vector((1.75, 0.55, -0.95)),
    ]

    # Generate multi-shell porous nodes respecting AgNP cavities
    nodes: list[Vector] = []
    shells = [(16, R * 0.48), (34, R * 0.86)]
    golden = math.pi * (3.0 - math.sqrt(5.0))
    for s_idx, (cnt, rad) in enumerate(shells):
        for i in range(cnt):
            y = 1.0 - (i / float(cnt - 1)) * 2.0
            r_xz = math.sqrt(max(0.0, 1.0 - y * y))
            theta = golden * (i + s_idx * 7)
            pos = Vector((math.cos(theta) * r_xz, y, math.sin(theta) * r_xz)) * rad
            for ag_p in ag_pockets:
                diff = pos - ag_p
                clearance = R * 0.25
                if diff.length < clearance:
                    if diff.length < 1e-4:
                        diff = Vector((0, 1, 0))
                    pos = ag_p + diff.normalized() * (clearance * 1.08)
            if pos.length > R * 0.94:
                pos = pos.normalized() * (R * 0.94)
            nodes.append(pos)

    # Build graph edges avoiding AgNP pockets
    edges: list[tuple[int, int]] = []
    conn = [0] * len(nodes)
    seen_pairs = set()
    for i in range(len(nodes)):
        dists = []
        for j in range(len(nodes)):
            if i == j:
                continue
            d = (nodes[i] - nodes[j]).length
            if R * 0.24 < d < R * 0.68:
                dists.append((d, j))
        dists.sort()
        for _, j in dists:
            if conn[i] >= 4 or conn[j] >= 4:
                continue
            key = (min(i, j), max(i, j))
            if key in seen_pairs:
                continue
            mid = (nodes[i] + nodes[j]) * 0.5
            if any((mid - ag_p).length < R * 0.18 for ag_p in ag_pockets):
                continue
            seen_pairs.add(key)
            conn[i] += 1
            conn[j] += 1
            edges.append((i, j))

    def is_cutaway_octant(v: Vector) -> bool:
        return v.x > 0.15 and v.z > 0.15 and v.y > -0.35

    def build_matrix_variant(cutaway: bool, suffix: str) -> None:
        bm_fib = bmesh.new()
        bm_nod = bmesh.new()

        for idx, n_pos in enumerate(nodes):
            if cutaway and is_cutaway_octant(n_pos):
                continue
            add_sphere_to_bmesh(bm_nod, n_pos, R * 0.026, subdivisions=1)

        for i, j in edges:
            p0, p1 = nodes[i], nodes[j]
            if cutaway and (is_cutaway_octant(p0) or is_cutaway_octant(p1)):
                continue
            mid = (p0 + p1) * 0.5
            ctrl = mid + (mid.normalized() * (R * 0.045) if mid.length > 1e-4 else Vector((0, 0.1, 0)))
            pts = []
            for s in range(6):
                t = s / 5.0
                # Quadratic Bezier
                pt = p0 * ((1 - t) ** 2) + ctrl * (2 * (1 - t) * t) + p1 * (t ** 2)
                pts.append(pt)
            add_tube_segment(bm_fib, pts, R * 0.011, R * 0.011, segments=6, cap_ends=True)

        create_object_from_bmesh(f"Matrix_Fibrils_{suffix}", bm_fib, mat_fibril, smooth=True)
        create_object_from_bmesh(f"Matrix_Nodes_{suffix}", bm_nod, mat_node, smooth=True)

    build_matrix_variant(cutaway=False, suffix="Full")
    build_matrix_variant(cutaway=True, suffix="Cutaway")

    # Outer hydrated hydrogel shell (Full & 3/4 Cutaway with wall thickness)
    bm_shell_full = bmesh.new()
    bmesh.ops.create_uvsphere(bm_shell_full, u_segments=44, v_segments=28, radius=R)
    for v in bm_shell_full.verts:
        n = v.co.normalized()
        ripple = 1.0 + 0.012 * math.sin(n.x * 7.0 + n.y * 5.0) * math.cos(n.z * 6.0)
        v.co = n * (R * ripple)
    create_object_from_bmesh("Hydrogel_Shell_Full", bm_shell_full, mat_shell, smooth=True)

    # 3/4 cutaway hydrogel shell built cleanly via grid UV patch excluding front-right octant
    bm_shell_cut = bmesh.new()
    u_steps = 36
    v_steps = 24
    verts_grid = []
    for iv in range(v_steps + 1):
        phi = (math.pi * iv) / v_steps
        row = []
        for iu in range(u_steps + 1):
            # Cover 260 degrees leaving 100-degree front inspection window
            theta = (0.38 * math.pi) + (1.44 * math.pi) * (iu / u_steps)
            n = Vector((
                math.sin(phi) * math.sin(theta),
                math.cos(phi),
                math.sin(phi) * math.cos(theta),
            ))
            ripple = 1.0 + 0.012 * math.sin(n.x * 7.0 + n.y * 5.0) * math.cos(n.z * 6.0)
            row.append(bm_shell_cut.verts.new(n * (R * ripple)))
        verts_grid.append(row)

    for iv in range(v_steps):
        for iu in range(u_steps):
            v00 = verts_grid[iv][iu]
            v10 = verts_grid[iv + 1][iu]
            v11 = verts_grid[iv + 1][iu + 1]
            v01 = verts_grid[iv][iu + 1]
            bm_shell_cut.faces.new((v00, v10, v11, v01))

    obj_shell_cut = create_object_from_bmesh("Hydrogel_Shell_Cutaway", bm_shell_cut, mat_shell, smooth=True)
    solidify = obj_shell_cut.modifiers.new(name="ShellThickness", type="SOLIDIFY")
    solidify.thickness = 0.07
    solidify.offset = -1.0

    save_and_export("nanocellulose_matrix")


# ---------------------------------------------------------------------------
# 5. Tumor Microenvironment (Bumpy Tumor Spheroid + Angiogenic Vessel + Healthy)
# ---------------------------------------------------------------------------
def build_tumor_microenv() -> None:
    clear_scene()
    mat_tumor = make_pbr_material(
        "MAT_Tumor_Cell",
        (0.64, 0.30, 0.35, 1.0),
        metallic=0.02,
        roughness=0.48,
        coat=0.18,
    )
    mat_vessel = make_pbr_material(
        "MAT_Angiogenic_Vessel",
        (0.68, 0.16, 0.21, 1.0),
        metallic=0.02,
        roughness=0.40,
        coat=0.25,
    )
    mat_healthy = make_pbr_material(
        "MAT_Healthy_Tissue",
        (0.23, 0.48, 0.62, 1.0),
        metallic=0.02,
        roughness=0.46,
        coat=0.15,
    )

    # Tumor spheroid cluster (bumpy organic cells from -MFD6qUP)
    bm_tumor = bmesh.new()
    rng = random.Random(101)
    for i in range(24):
        ang = i * 2.39996
        rad = 1.65 + (i % 5) * 0.62
        cx = 2.6 + math.cos(ang) * rad * 0.95
        cy = math.sin(ang) * rad * 0.78
        cz = math.sin(i * 1.7) * 1.65
        if math.hypot(cx - 2.4, cy) < 1.85 and cz > -0.5:
            continue
        sub_bm = bmesh.new()
        bmesh.ops.create_icosphere(sub_bm, subdivisions=2, radius=0.72 + (i % 3) * 0.10)
        for v in sub_bm.verts:
            n = v.co.normalized()
            bump = 1.0 + 0.11 * math.sin(n.x * 6.0 + i) * math.cos(n.y * 6.0) + 0.06 * math.sin(n.z * 9.0)
            v.co = Vector((cx, cy, cz)) + n * (0.76 * bump)
        mesh_tmp = bpy.data.meshes.new("tmp_t")
        sub_bm.to_mesh(mesh_tmp)
        sub_bm.free()
        bm_tumor.from_mesh(mesh_tmp)
        bpy.data.meshes.remove(mesh_tmp)
    create_object_from_bmesh("Tumor_Spheroid_Cluster", bm_tumor, mat_tumor, smooth=True)

    # Branching angiogenic blood vessel
    bm_vessel = bmesh.new()
    main_pts = [
        Vector((-1.5, -2.9, 1.4)),
        Vector((0.6, -2.5, 1.8)),
        Vector((2.5, -1.7, 2.0)),
        Vector((4.6, -0.5, 1.4)),
        Vector((5.9, 1.1, 0.2)),
    ]
    add_tube_segment(bm_vessel, main_pts, 0.22, 0.16, segments=10, cap_ends=True)
    branch_a = [
        Vector((2.4, -1.7, 2.0)),
        Vector((2.8, -0.2, 2.3)),
        Vector((3.4, 1.5, 1.7)),
        Vector((4.1, 2.6, 0.7)),
    ]
    add_tube_segment(bm_vessel, branch_a, 0.15, 0.07, segments=8, cap_ends=True)
    branch_b = [
        Vector((3.5, -1.1, 1.7)),
        Vector((4.8, -1.8, 0.9)),
        Vector((5.7, -2.4, -0.3)),
    ]
    add_tube_segment(bm_vessel, branch_b, 0.13, 0.06, segments=8, cap_ends=True)
    create_object_from_bmesh("Vessel_Branch", bm_vessel, mat_vessel, smooth=True)

    # Ordered healthy epithelium on the left (pH 7.4 control)
    bm_healthy = bmesh.new()
    for ix in range(3):
        for iy in range(4):
            for iz in range(2):
                center = Vector((-6.8 + ix * 1.38, -2.1 + iy * 1.40, -0.7 + iz * 1.38))
                add_sphere_to_bmesh(bm_healthy, center, 0.62, subdivisions=2, scale=Vector((1.0, 0.90, 0.94)))
    create_object_from_bmesh("Healthy_Epithelium", bm_healthy, mat_healthy, smooth=True)

    save_and_export("tumor_microenv")


# ---------------------------------------------------------------------------
# 6. Trimeric Transmembrane Folate Receptor (FR-alpha)
# ---------------------------------------------------------------------------
def build_receptor_fra() -> None:
    clear_scene()
    mat_rec = make_pbr_material(
        "MAT_FR_Alpha",
        (0.75, 0.23, 0.23, 1.0),
        metallic=0.04,
        roughness=0.42,
        coat=0.22,
    )
    bm = bmesh.new()
    # Transmembrane anchor stalk
    add_tube_segment(
        bm,
        [Vector((0, -0.55, 0)), Vector((0, -0.10, 0)), Vector((0, 0.35, 0))],
        0.15,
        0.18,
        segments=10,
        cap_ends=True,
    )
    # 3 asymmetric globular extracellular lobes forming binding cleft (OWKi__S)
    for k in range(3):
        ang = (2.0 * math.pi * k) / 3.0
        lobe_pos = Vector((math.cos(ang) * 0.24, 0.56, math.sin(ang) * 0.24))
        add_sphere_to_bmesh(bm, lobe_pos, 0.24, subdivisions=2, scale=Vector((1.0, 1.15, 0.92)))
        top_pos = Vector((math.cos(ang) * 0.30, 0.78, math.sin(ang) * 0.30))
        add_sphere_to_bmesh(bm, top_pos, 0.14, subdivisions=1)

    create_object_from_bmesh("Receptor_FR_Alpha", bm, mat_rec, smooth=True)
    save_and_export("receptor_fra")


# ---------------------------------------------------------------------------
# 7. Clathrin Polyhedral Cage + Dynamin Collar
# ---------------------------------------------------------------------------
def build_clathrin_cage() -> None:
    clear_scene()
    mat_clathrin = make_pbr_material(
        "MAT_Clathrin_Triskelion",
        (0.36, 0.76, 0.80, 1.0),
        metallic=0.06,
        roughness=0.36,
        coat=0.25,
    )
    mat_dynamin = make_pbr_material(
        "MAT_Dynamin_Collar",
        (0.85, 0.63, 0.29, 1.0),
        metallic=0.12,
        roughness=0.38,
    )

    bm_tmp = bmesh.new()
    bmesh.ops.create_icosphere(bm_tmp, subdivisions=1, radius=2.0)

    bm_struts = bmesh.new()
    bm_hubs = bmesh.new()
    for v in bm_tmp.verts:
        add_sphere_to_bmesh(bm_hubs, v.co, 0.11, subdivisions=1)
    for e in bm_tmp.edges:
        p0 = e.verts[0].co
        p1 = e.verts[1].co
        mid = (p0 + p1) * 0.5
        ctrl = mid.normalized() * 2.02
        add_tube_segment(bm_struts, [p0, ctrl, p1], 0.045, 0.045, segments=6, cap_ends=False)
    bm_tmp.free()

    create_object_from_bmesh("Clathrin_Struts", bm_struts, mat_clathrin, smooth=True)
    create_object_from_bmesh("Clathrin_Hubs", bm_hubs, mat_clathrin, smooth=True)

    # Helical dynamin constriction collar
    bm_dyn = bmesh.new()
    dyn_pts = []
    for i in range(36):
        t = i / 35.0
        ang = t * math.pi * 2.6
        dyn_pts.append(Vector((math.cos(ang) * 1.12, (t - 0.5) * 0.28, math.sin(ang) * 1.12)))
    add_tube_segment(bm_dyn, dyn_pts, 0.11, 0.11, segments=10, cap_ends=True)
    create_object_from_bmesh("Dynamin_Collar", bm_dyn, mat_dynamin, smooth=True)

    save_and_export("clathrin_cage")


# ---------------------------------------------------------------------------
# 8. Mitochondrion Editorial (3/4 Cutaway Outer Shell + Cristae + mtDNA)
# ---------------------------------------------------------------------------
def build_mitochondrion_editorial() -> None:
    clear_scene()
    mat_outer = make_pbr_material(
        "MAT_Mito_Outer",
        (0.24, 0.54, 0.58, 1.0),
        metallic=0.04,
        roughness=0.28,
        coat=0.35,
        alpha=0.45,
    )
    mat_cristae = make_pbr_material(
        "MAT_Mito_Cristae",
        (0.31, 0.70, 0.75, 1.0),
        metallic=0.05,
        roughness=0.34,
        coat=0.2,
    )
    mat_mtdna = make_pbr_material(
        "MAT_Mito_DNA",
        (0.85, 0.63, 0.29, 1.0),
        metallic=0.08,
        roughness=0.38,
    )

    # Outer membrane with clean front cutaway window (z > 0.35 & y > -0.3)
    bm_outer = bmesh.new()
    u_steps = 44
    v_steps = 28
    grid = []
    for iv in range(v_steps + 1):
        phi = (math.pi * iv) / v_steps
        row = []
        for iu in range(u_steps + 1):
            theta = (0.40 * math.pi) + (1.42 * math.pi) * (iu / u_steps)
            nx = math.cos(phi)
            ny = math.sin(phi) * math.cos(theta)
            nz = math.sin(phi) * math.sin(theta)
            x = nx * 6.1
            y = ny * 2.85 + math.sin(x * 0.25) * 0.30
            z = nz * 2.85
            row.append(bm_outer.verts.new(Vector((x, y, z))))
        grid.append(row)

    for iv in range(v_steps):
        for iu in range(u_steps):
            bm_outer.faces.new((grid[iv][iu], grid[iv + 1][iu], grid[iv + 1][iu + 1], grid[iv][iu + 1]))

    obj_outer = create_object_from_bmesh("Mito_Outer_Cutaway", bm_outer, mat_outer, smooth=True)
    sol = obj_outer.modifiers.new(name="MitoThickness", type="SOLIDIFY")
    sol.thickness = 0.10
    sol.offset = -1.0

    # Inner folded cristae
    bm_cristae = bmesh.new()
    bmesh.ops.create_uvsphere(bm_cristae, u_segments=72, v_segments=40, radius=1.0)
    for v in bm_cristae.verts:
        rx = v.co.x * 5.45
        ry = v.co.y * 2.25
        rz = v.co.z * 2.25
        ang = math.atan2(rz, ry)
        fold = max(0.0, math.sin(rx * 2.35) * math.cos(ang * 3.0)) * 0.90
        r_scale = 1.0 - fold * 0.38
        ry = ry * r_scale + math.sin(rx * 0.25) * 0.28
        rz *= r_scale
        v.co = Vector((rx, ry, rz))
    create_object_from_bmesh("Mito_Cristae_Inner", bm_cristae, mat_cristae, smooth=True)

    # Circular mitochondrial DNA double helix
    bm_dna = bmesh.new()
    pts_a, pts_b = [], []
    for i in range(73):
        t = (i / 72.0) * 2.0 * math.pi
        r_loop = 1.25 + math.cos(t * 10.0) * 0.16
        pts_a.append(Vector((r_loop * math.cos(t) - 1.1, math.sin(t * 10.0) * 0.16, r_loop * math.sin(t))))
        r_loop_b = 1.25 + math.cos(t * 10.0 + math.pi) * 0.16
        pts_b.append(Vector((r_loop_b * math.cos(t) - 1.1, math.sin(t * 10.0 + math.pi) * 0.16, r_loop_b * math.sin(t))))
    add_tube_segment(bm_dna, pts_a, 0.042, 0.042, segments=6, cap_ends=False)
    add_tube_segment(bm_dna, pts_b, 0.042, 0.042, segments=6, cap_ends=False)
    create_object_from_bmesh("Mito_MtDNA_Helix", bm_dna, mat_mtdna, smooth=True)

    save_and_export("mitochondrion_editorial")


# ---------------------------------------------------------------------------
# 9. Apoptosome Cell (3/4 Cutaway Bumpy Cell Cortex + Apoptosome Complex)
# ---------------------------------------------------------------------------
def build_apoptosome_cell() -> None:
    clear_scene()
    mat_cell = make_pbr_material(
        "MAT_Apoptotic_Cell",
        (0.42, 0.23, 0.36, 1.0),
        metallic=0.02,
        roughness=0.40,
        coat=0.28,
        alpha=0.30,
    )
    mat_apop = make_pbr_material(
        "MAT_Apoptosome_Caspase",
        (0.75, 0.52, 0.98, 1.0),
        metallic=0.14,
        roughness=0.34,
        coat=0.2,
    )

    bm_cell = bmesh.new()
    u_steps = 40
    v_steps = 26
    R = 6.2
    grid = []
    for iv in range(v_steps + 1):
        phi = (math.pi * iv) / v_steps
        row = []
        for iu in range(u_steps + 1):
            theta = (0.42 * math.pi) + (1.42 * math.pi) * (iu / u_steps)
            n = Vector((
                math.sin(phi) * math.sin(theta),
                math.cos(phi),
                math.sin(phi) * math.cos(theta),
            ))
            bump = 1.0 + 0.045 * math.sin(n.x * 5.0) * math.cos(n.y * 5.0)
            row.append(bm_cell.verts.new(n * (R * bump)))
        grid.append(row)

    for iv in range(v_steps):
        for iu in range(u_steps):
            bm_cell.faces.new((grid[iv][iu], grid[iv + 1][iu], grid[iv + 1][iu + 1], grid[iv][iu + 1]))

    obj_cell = create_object_from_bmesh("Cell_Cortex_Cutaway", bm_cell, mat_cell, smooth=True)
    sol = obj_cell.modifiers.new(name="CellWall", type="SOLIDIFY")
    sol.thickness = 0.14
    sol.offset = -1.0

    # 7-spoked Apoptosome wheel (Cytochrome c + Apaf-1 + Caspase 9 -> 3)
    bm_apop = bmesh.new()
    add_sphere_to_bmesh(bm_apop, Vector((0, 0, 0)), 0.42, subdivisions=2)
    for k in range(7):
        ang = (2.0 * math.pi * k) / 7.0
        dir_v = Vector((math.cos(ang), math.sin(ang), 0.0))
        add_tube_segment(bm_apop, [dir_v * 0.25, dir_v * 1.08], 0.085, 0.065, segments=8, cap_ends=True)
        add_sphere_to_bmesh(bm_apop, dir_v * 1.15, 0.21, subdivisions=2)
    create_object_from_bmesh("Apoptosome_Wheel", bm_apop, mat_apop, smooth=True)

    save_and_export("apoptosome_cell")


def main() -> None:
    ensure_dirs()
    build_agnp_core()
    build_rosemary_corona()
    build_folate_ligands()
    build_nanocellulose_matrix()
    build_tumor_microenv()
    build_receptor_fra()
    build_clathrin_cage()
    build_mitochondrion_editorial()
    build_apoptosome_cell()
    print("[DONE] All 9 unified Scientific Editorial assets built and exported.")


if __name__ == "__main__":
    main()
