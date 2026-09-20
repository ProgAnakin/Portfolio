import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * What the shop does when the room will not open.
 *
 * The 3D scene is a lazily-fetched chunk that builds textures, compiles
 * shaders and talks to a GPU driver — four ways to fail that no amount of
 * typing prevents: a chunk that 404s after a redeploy, a context lost on a
 * laptop waking from sleep, a driver that rejects a shader. Until now every
 * one of them ended the same way, with `Suspense` showing `null` forever and
 * a visitor looking at a blank page.
 *
 * The drawn shop is already a complete version of this site — that was the
 * point of building it — so it is also the right thing to fall back to. A
 * recruiter who hits a bad deploy gets the whole portfolio, silently, instead
 * of nothing.
 *
 * A class component because that is still the only way to catch a render
 * error in React.
 */
export class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // No reporting endpoint by design — this site talks to nobody. The console
    // is where whoever is debugging it will be looking.
    console.error('[shop] the room failed to open; falling back to the drawing', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
