import Image from 'next/image'
import Header from '@/components/header'
import Game from '@/components/game'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className='h-screen w-screen overflow-y-auto overflow-x-hidden'>
      <Header />
      <Game />
      <Footer />
    </div>
  )
}
