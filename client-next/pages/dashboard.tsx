import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ButtonLogin from '../components/buttons'
import Layout from '../components/layout'
import Hub from '../components/dashboard/hub'
import LinkForm from '../components/dashboard/link_form'

const Dashboar: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Link3</title>
        <meta name="description" content="A linktree alternative built on NEAR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" flex justify-evenly space-x-10">
        <Hub />
        <LinkForm />
      </main>

      <footer className="">

      </footer>
    </Layout>
  )
}

export default Dashboar
