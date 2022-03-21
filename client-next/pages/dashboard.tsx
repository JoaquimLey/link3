import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ButtonLogin from '../components/buttons'
import { Logo } from '../components/icons/logo'
import Layout from '../components/layout'
import { useEffect, useState } from 'react'
import { useNear } from '../context/near'
import Link from 'next/link'





const Dashboar: NextPage = () => {
  const { accountId, isLoggedIn, login, logout, show } = useNear();
  const handleLoginClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      show();
    }
  };
  return (
    <Layout>
      <Head>
        <title>Link3</title>
        <meta name="description" content="A linktree alternative built on NEAR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" flex flex-col justify-center items-center space-y-10 h-screen">
        <Link href="/">
          <a>
            <Logo className="w-80 aspect-square rounded-full " />
          </a>
        </Link>
      </main>

      <footer className="">

      </footer>
    </Layout>
  )
}

export default Dashboar
