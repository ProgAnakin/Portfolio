import { menu, profile } from '../data/profile';

/**
 * The few things the page says only in pictures.
 *
 * This used to be the whole site again in plain HTML — every project, every
 * link, every contact — because the scene was a drawing and the detail sheets
 * only existed once opened. The casebook below the shop is that now, as real
 * visible content, so repeating it here would make a crawler read the same
 * paragraphs twice and a screen reader announce every project two times over.
 *
 * What is left is what genuinely has no text form anywhere else: the menu
 * board over the counter, which is set dressing on a wide screen and not
 * rendered at all below `lg`.
 */
export function ReadableIndex() {
  return (
    <div className="sr-only">
      <h2>About {profile.name}</h2>
      <p>{profile.standfirst}</p>
      <ul>
        {menu.map((item) => (
          <li key={item.name}>
            {item.name} — {item.note}
          </li>
        ))}
      </ul>
      <p>Languages: {profile.languages.join(', ')}.</p>
    </div>
  );
}
