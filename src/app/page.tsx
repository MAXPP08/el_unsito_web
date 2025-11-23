import { redirect } from 'next/navigation';

export default function Home() {
  // Esta función se ejecuta en el servidor e inmediatamente
  // redirige al usuario a la ruta /login
  redirect('/login');
}