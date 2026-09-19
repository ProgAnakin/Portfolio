import { useEffect, useMemo, useState } from 'react';
import { CanvasTexture, InstancedMesh, Object3D, SRGBColorSpace, type Texture } from 'three';

/** How high the room is, and where the pendant is screwed to. */
export const CEILING_Y = 4.0;

/** The ceiling plane, in world units: width, depth, and where its middle is. */
const PLANE = { w: 22, d: 11, x: 0.3, z: -0.6 };

/** Where the recessed runs sit, in world x. They read as the room's grain. */
const RUNS = [-6.6, -3.3, 0, 3.3, 6.6];

/**
 * The ceiling.
 *
 * The room had none: the pendant's flex ran up and simply stopped in mid-air,
 * which is the one thing that tells a viewer a room is a backdrop.
 *
 * It is a flush plaster ceiling with recessed linear runs in it — the language
 * of a room built to show products rather than to be looked at, which is what
 * this shop is. The runs are real geometry rather than paint, because at this
 * camera angle they converge, and that convergence is the only depth cue the
 * top of the frame has. They are on night output: the shop is shut, the
 * display lighting is what is on, and a blazing ceiling would say otherwise.
 *
 * The plane is lit by its own emissive map rather than by a lamp. Every
 * practical in this shop points down; a ceiling lit correctly from below would
 * be black, and adding an uplighter to fix it would cost arithmetic in every
 * lit pixel of the room to brighten a band at the top of it.
 */
function paintPlaster(): Texture | null {
  if (typeof document === 'undefined') return null;
  const w = 1024;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#9aa2a7';
  ctx.fillRect(0, 0, w, h);

  // Flush panel joints: a grid you find rather than notice.
  ctx.strokeStyle = 'rgba(96, 104, 110, 0.45)';
  ctx.lineWidth = 1;
  const step = w / 10;
  for (let x = step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
    ctx.stroke();
  }
  for (let y = step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
    ctx.stroke();
  }

  // The channels the runs are recessed into, and the wash each one throws on
  // the plaster either side of it.
  for (const x of RUNS) {
    const u = ((x - (PLANE.x - PLANE.w / 2)) / PLANE.w) * w;
    const wash = ctx.createLinearGradient(u - 34, 0, u + 34, 0);
    wash.addColorStop(0, 'rgba(226, 240, 248, 0)');
    wash.addColorStop(0.5, 'rgba(226, 240, 248, 0.18)');
    wash.addColorStop(1, 'rgba(226, 240, 248, 0)');
    ctx.fillStyle = wash;
    ctx.fillRect(u - 34, 0, 68, h);

    ctx.fillStyle = '#31383d';
    ctx.fillRect(u - 5, 0, 10, h);
    ctx.fillStyle = 'rgba(12, 16, 19, 0.7)';
    ctx.fillRect(u - 5, 0, 3, h);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
}

/**
 * The tubes in the channels.
 *
 * Five identical objects that differ by one number, so: one instanced draw
 * call, the same as the till's keypad.
 */
function Runs() {
  const mesh = useMemo(() => {
    const dummy = new Object3D();
    return { dummy };
  }, []);

  const attach = (node: InstancedMesh | null) => {
    if (!node) return;
    RUNS.forEach((x, i) => {
      mesh.dummy.position.set(x, CEILING_Y - 0.028, PLANE.z);
      mesh.dummy.updateMatrix();
      node.setMatrixAt(i, mesh.dummy.matrix);
    });
    node.instanceMatrix.needsUpdate = true;
  };

  return (
    <instancedMesh ref={attach} args={[undefined, undefined, RUNS.length]} frustumCulled={false}>
      <boxGeometry args={[0.1, 0.02, PLANE.d - 0.6]} />
      <meshStandardMaterial
        color="#c9d6de"
        emissive="#cfe0ea"
        emissiveIntensity={0.5}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

export function Ceiling() {
  const [plaster, setPlaster] = useState<Texture | null>(null);

  useEffect(() => {
    const made = paintPlaster();
    setPlaster(made);
    return () => made?.dispose();
  }, []);

  return (
    <group>
      <mesh position={[PLANE.x, CEILING_Y, PLANE.z]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PLANE.w, PLANE.d]} />
        {plaster ? (
          <meshStandardMaterial
            key={plaster.uuid}
            map={plaster}
            emissiveMap={plaster}
            emissive="#838b90"
            emissiveIntensity={0.24}
            roughness={0.92}
          />
        ) : (
          <meshStandardMaterial key="bare" color="#6b7175" roughness={0.92} />
        )}
      </mesh>

      <Runs />

      {/* A shadow gap where the wall meets the ceiling. Coving would have been
          the other answer, and the wrong one: this room is tile, plaster and
          light, and a moulding is the one thing in that list that is decoration
          rather than construction. */}
      <mesh position={[PLANE.x, CEILING_Y - 0.055, -1.855]}>
        <boxGeometry args={[PLANE.w, 0.11, 0.05]} />
        <meshBasicMaterial color="#14181b" />
      </mesh>
    </group>
  );
}
