import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ButtonLogin from '../components/buttons'
import { Logo } from '../components/icons/logo'
import Layout from '../components/layout'
import { useEffect, useState } from 'react'
import { useNear } from '../context/near'





const Home: NextPage = () => {
  const { accountId, isLoggedIn, wallet, login, logout, show } = useNear();
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

        <div>
          <h1>Hello Context</h1>
          <h2>isLoggedIn: {isLoggedIn ? "login" : "logout"}</h2>
          <div className='flex flex-col space-y-4'>
            <button onClick={login}>Login</button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </main>

      <footer className="">

      </footer>
    </Layout>
  )
}

export default Home
