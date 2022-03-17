import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ButtonLogin from '../components/buttons'
import { Logo } from '../components/icons/logo'
import Layout from '../components/layout'
import { useEffect, useState } from 'react'





const Home: NextPage = () => {
  useState(() => {
    const [isOpen, setIsOpen] = useState(false)
  })
  useEffect(() => {
    const doMyAxiosCall = async () => {
      const cenas = require("../components/near.tsx")
      console.log(await cenas.default())
    }

    // This will only be executed on the client
    doMyAxiosCall();
  }, [])


  return (
    <Layout>
      <Head>
        <title>Link3</title>
        <meta name="description" content="A linktree alternative built on NEAR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" flex flex-col justify-center items-center space-y-10 h-screen">
        <Logo className="w-80 aspect-square rounded-full " />
        <ButtonLogin isLoading={false} isLoggedIn={false} className='w-40' />
      </main>

      <footer className="">

      </footer>
    </Layout>
  )
}

export default Home
