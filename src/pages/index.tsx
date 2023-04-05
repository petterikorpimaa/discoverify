import Head from 'next/head';

import { useState } from 'react';

import SearchInput from '@/components/SearchInput';
import SearchResults from '@/components/SearchResults';

import styles from '../styles/Home.module.scss';
import stylesSearch from '../styles/search.module.scss';

export default function Home() {
  const [searchTerms, setSearchTerms] = useState<string>('');

  return (
    <>
      <Head>
        <title>Discoverify</title>
        <meta name="description" content="Discover new artists" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles['logo-container']}>
          <div className={styles.logo}></div>
        </div>
        <div className={stylesSearch.search}>
          <SearchInput setSearchTerms={setSearchTerms} />
          <SearchResults searchTerms={searchTerms} />
        </div>
      </main>
    </>
  )
}
