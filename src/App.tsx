import { profile } from './data/profile';

export default function App() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-paper-100 text-2xl">{profile.shopName}</h1>
      <p className="text-paper-500 mt-2 max-w-prose">{profile.standfirst}</p>
    </main>
  );
}
