import Board from '@/components/board/Board'
import ViewNavbar from '@/components/shared/ViewNavbar'
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import Image from 'next/image'
import Link from 'next/link';

export default async function Home() {
  const user: User | null = await currentUser();

  const userOnDatabase = await fetchUser({userId: user?.id});

  return (
    <div className='flex flex-col'>
      <Link href={`/projects`}>
        View Projects
      </Link>
    </div>
  )
}
