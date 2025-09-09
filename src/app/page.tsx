import { redirect } from 'next/navigation';

export default function Home() {
  // By default, redirect to the login page.
  // The actual dashboard will be in /dashboard
  redirect('/login');
}
