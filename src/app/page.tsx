import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/dashboard');
  return null; // redirect() is a server-side function, so this component won't render.
}
