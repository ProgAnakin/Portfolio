/**
 * The shopkeeper, drawn as a silhouette with a rim light rather than a face.
 *
 * Deliberately featureless: a flat cartoon likeness of a real person is worse
 * than none, and the amber edge from the pendant does more for the mood than
 * eyes would. Cropped at the waist — the counter takes care of the rest.
 */
export function Shopkeeper({ className }: { className?: string }) {
  // A face in shadow: warm, dark, and no lighter than the wood around it.
  const skin = 'color-mix(in oklab, var(--color-oak-300) 70%, var(--color-ink-900))';

  return (
    <svg viewBox="0 0 180 210" className={className} aria-hidden="true" focusable="false">
      <g filter="url(#rough)">
        {/* Shoulders and torso — the black shirt. */}
        <path d="M26 210c2-40 18-60 44-68h40c26 8 42 28 44 68z" fill="var(--color-ink-900)" />
        {/* Where the shirt catches the lamp. */}
        <path d="M110 142c26 8 42 28 44 68h-16c-2-34-14-52-34-60z" fill="var(--color-ink-700)" />

        {/* Neck */}
        <path d="M79 122h22v20q-11 8-22 0z" fill={skin} />
        <path d="M79 122h22v9q-11 6-22 0z" fill="var(--color-ink-900)" opacity="0.5" />

        {/* Head */}
        <ellipse cx="90" cy="88" rx="31" ry="35" fill={skin} />

        {/* Curls — overlapping circles, deliberately uneven. */}
        <g fill="var(--color-ink-900)">
          <circle cx="67" cy="64" r="16" />
          <circle cx="87" cy="54" r="18" />
          <circle cx="108" cy="62" r="16" />
          <circle cx="119" cy="78" r="13" />
          <circle cx="59" cy="82" r="13" />
          <circle cx="95" cy="66" r="15" />
          <circle cx="75" cy="70" r="14" />
          <circle cx="119" cy="93" r="9" />
          <circle cx="61" cy="96" r="8" />
        </g>
      </g>

      {/* Rim light: the pendant is up and to the right, so it catches the
          outside of the curls, the jaw and the shoulder. The path traces the
          silhouette itself — a stroke floating beside it reads as a hoop. */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#rough)">
        <path
          d="M103 45Q124 52 130 72Q132 86 125 95"
          stroke="var(--color-amber-300)"
          strokeWidth="3.4"
          opacity="0.9"
        />
        <path
          d="M119 100Q117 111 106 119"
          stroke="var(--color-amber-300)"
          strokeWidth="2.6"
          opacity="0.55"
        />
        <path
          d="M111 150Q138 166 145 210"
          stroke="var(--color-amber-300)"
          strokeWidth="3"
          opacity="0.45"
        />
      </g>

    </svg>
  );
}
