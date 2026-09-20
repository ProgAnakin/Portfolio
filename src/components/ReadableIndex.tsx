import { contacts, menu, profile } from '../data/profile';
import { projects, statusLabel } from '../data/projects';

/**
 * The same content the shop shows, as plain semantic HTML.
 *
 * The scene is a drawing and the detail sheets only exist once opened, so this
 * is what a crawler indexes and what a screen reader can read straight through.
 * Links are not tab stops — the products on the shelves are the real controls —
 * but they are followable, and the text is identical to what is on screen.
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
      <p>
        Open to {profile.openTo.roles.join(', ')} roles in{' '}
        {profile.openTo.markets.join(', ')}.
      </p>
      {profile.proof.length > 0 && (
        <ul>
          {profile.proof.map((item) => (
            <li key={item.label}>
              {item.value} — {item.label}
            </li>
          ))}
        </ul>
      )}

      <h2>Projects</h2>
      {projects.map((project) => (
        <article key={project.id}>
          <h3>
            {project.name} — {project.tagline}
          </h3>
          <p>Status: {statusLabel[project.status]}.</p>
          <p>{project.description}</p>
          <p>Role: {project.role}</p>
          <p>Built with: {project.stack.join(', ')}.</p>
          {project.links.length > 0 && (
            <ul>
              {project.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer" tabIndex={-1}>
                    {project.name} — {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}

      <h2>Contact</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.href ? (
              <a href={contact.href} rel="noreferrer" tabIndex={-1}>
                {contact.label}: {contact.value}
              </a>
            ) : (
              <span>
                {contact.label}: {contact.value}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
