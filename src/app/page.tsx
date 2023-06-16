import Image from 'next/image'
import Header from '@/components/header'
import Game from '@/components/game'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className='bg-gray-800 h-screen w-screen'>
      <Header />
      <Game />
      <Footer />
    </div>
  )
}
