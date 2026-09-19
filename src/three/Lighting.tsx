import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { SpotLight as SpotLightImpl } from 'three';
import { palette } from './tokens';
import { pendulum, PENDANT_DROP } from './pendulum';

/**
 * The shop lights itself.
 *
 * Every light here is a fixture that exists in the scene: the strip under each
 * shelf lip and the pendant over the counter. There is no fill light and no
 * downloaded studio HDRI — the environment is built from the shop's own strip
 * lights, so anything chrome reflects *this room* and not a generic photo
 * studio. That reflection is most of what separates this from a default
 * three.js scene.
 */
export function Lighting({ shelfY, shelfX }: { shelfY: number[]; shelfX: number }) {
  const amber = palette.amber300();
  const warm = palette.amber400();
  const pendant = useRef<SpotLightImpl>(null);

  // The pendant's light goes where the pendant goes. Geometry that swings over
  // a pool of light nailed to the counter is the tell that gives a room away.
  useFrame(() => {
    if (!pendant.current) return;
    pendant.current.position.set(
      1.7 + Math.sin(pendulum.tiltZ) * PENDANT_DROP,
      2.5 - (1 - Math.cos(pendulum.tiltZ)) * PENDANT_DROP * 0.5,
      1.7 - Math.sin(pendulum.tiltX) * PENDANT_DROP,
    );
  });

  return (
    <>
      {/* Just enough ambient to keep the shadows from going pure black. */}
      <ambientLight intensity={0.22} color={palette.ink700()} />

      {/* The strips. One per shelf, pointing down at the stock below. */}
      {shelfY.map((y, i) => (
        <rectAreaLight
          key={i}
          position={[shelfX, y - 0.05, 0.34]}
          rotation={[-Math.PI / 2, 0, 0]}
          width={4.2}
          height={0.62}
          intensity={i === 0 ? 5.6 : 4.8}
          color={amber}
        />
      ))}

      {/* The pendant over the counter, off to the right. */}
      <spotLight
        ref={pendant}
        position={[1.7, 2.5, 1.7]}
        angle={0.62}
        penumbra={0.85}
        intensity={40}
        distance={12}
        decay={2}
        color={warm}
      />

      {/* A cold sliver from the street, so the amber has something to be warm
          against. Without it the whole scene is one temperature and reads flat. */}
      <directionalLight position={[-7, 3.4, 4]} intensity={0.62} color="#5f7d94" />

      {/* Just enough front fill to keep the counter props from going to
          silhouette. Kept cool so it never competes with the practicals. */}
      <pointLight position={[1.4, 2.4, 5.2]} intensity={5} distance={14} decay={1.9} color="#9fb3c2" />
      <pointLight position={[-2.6, 2.2, 4.4]} intensity={3.4} distance={12} decay={1.9} color="#8aa0b0" />
      {/* A soft key on the person behind the counter, and on the props in
          front of them. Without it the only face in the room is a silhouette,
          which is the opposite of the job.

          This used to be two lamps a few centimetres apart doing almost the
          same thing. Every light in a scene is arithmetic in every lit pixel
          of it, so two that overlap are worth merging even when neither is
          expensive on its own. */}
      <pointLight position={[2.6, 2.05, 2.15]} intensity={8.4} distance={4.8} decay={2} color={palette.amber200()} />

      <Environment resolution={128}>
        {shelfY.map((y, i) => (
          <Lightformer
            key={i}
            form="rect"
            intensity={2.4}
            color={amber}
            position={[shelfX, y, 1.2]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[4.6, 0.42, 1]}
          />
        ))}
        <Lightformer form="circle" intensity={3} color={warm} position={[3.1, 2.4, 1.6]} scale={1.1} />
        <Lightformer form="rect" intensity={0.5} color="#4d6879" position={[-6, 2, 3]} scale={[3, 4, 1]} />
      </Environment>
    </>
  );
}
