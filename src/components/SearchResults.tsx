import React, { useState, useEffect } from 'react';

import { getSpotifyAccessToken } from '@/helpers/spotify-util';

import SearchLoader from './SearchLoader';
import SearchResultsItem from './SearchResultsItem';

import styles from '../styles/search.module.scss';

type Props = {
  searchTerms: string;
};

type LoadArtistsParams = {
  search?: string;
  showMore?: boolean;
  limit?: number;
};

type ArtistOccurences = {
  [key: string]: number;
};

type Artist = {
  name: string;
  url: string;
};

const SearchResults = (props: Props) => {
  const { searchTerms } = props;

  const lastFmApiKey = process.env.LASTFM_API_KEY;

  const [lfmData, updateLfmData] = useState<any>({});
  const [lfmDataMore, updateLfmDataMore] = useState<any>({});
  const [isLoading, updateIsLoading] = useState<boolean>(false);
  const [isLoadingMore, updateIsLoadingMore] = useState<boolean>(false);
  const [hideLoadMoreButton, setHideLoadMoreButton] = useState<boolean>(false);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string>('');

  const updateSpotifyAccessToken = async () => {
    const spotifyAccessTokenFromStorage = getSpotifyAccessToken();

    if (!spotifyAccessToken && spotifyAccessTokenFromStorage) {
      setSpotifyAccessToken(spotifyAccessTokenFromStorage);
    }
  };

  useEffect(() => {
    updateSpotifyAccessToken();
  });

  const loadArtists = ({ search = '', showMore = false, limit = 5 }: LoadArtistsParams) => {
    const separatedArtistsSearch = search.match(/(".*?"|[^\s",][^",]+[^\s",])(?=\s*,|\s*$)/g) || [];
    const artistsSearch = separatedArtistsSearch.map(artist => artist.toLowerCase().trim().replace(/\"/g, '')).filter(artist => artist.length);
    let foundArtists: Artist[] = [];

    if (artistsSearch.length && lastFmApiKey) {
      if (showMore) {
        updateIsLoadingMore(true);
      } else {
        updateIsLoading(true);
      }

      const promises = [];
      for (const artistName of artistsSearch) {
        promises.push(
          fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artistName)}&api_key=${lastFmApiKey}&format=json`)
            .then(response => response.json())
        );
      }

      Promise.all(promises).then((artists) => {
        for (const artistData of artists) {
          if (artistData) {
            if (showMore) {
              updateIsLoadingMore(true);
            } else {
              updateIsLoading(true);
            }

            const similarArtists = artistData?.similarartists?.artist || [];

            if (similarArtists) {
              foundArtists = foundArtists.concat(similarArtists);
            }
          }
        }

        // Filter out searched artists
        foundArtists = foundArtists.filter((artist: Artist) => !artistsSearch.includes(artist.name.toLowerCase()));

        // Get artist by occurences
        const artistOccurences: ArtistOccurences = {};
        foundArtists.map((artist: Artist) => {
          if (artistOccurences[artist.name]) {
            artistOccurences[artist.name] += 1;
          } else {
            artistOccurences[artist.name] = 1;
          }
        });

        // Remove duplicates
        foundArtists = foundArtists.filter((value, index, self) => index === self.findIndex((t) => t.name === value.name));

        // Sort artists by occurences
        foundArtists = [...foundArtists].sort((a: any, b: any) => artistOccurences[a.name] > artistOccurences[b.name] ? -1 : 1);

        // Limit artists to 5
        foundArtists = foundArtists.slice(0, limit);

        if (showMore) {
          updateIsLoadingMore(false);
        } else {
          updateIsLoading(false);
        }

        if (showMore) {
          updateLfmDataMore({ artists: foundArtists });
          setHideLoadMoreButton(true);
        } else {
          updateLfmData({ artists: foundArtists });
          setHideLoadMoreButton(false);
        }
      });
    }
  };

  useEffect(() => {
    updateLfmData({});
    updateLfmDataMore({});

    loadArtists({ search: searchTerms, showMore: false });
  }, [searchTerms, lastFmApiKey]);

  const loadMoreArtists = () => {
    loadArtists({ search: searchTerms, showMore: true, limit: 45 });
  };

  const similarArtists = lfmData?.artists;
  let similarArtistsMore = lfmDataMore?.artists;

  if (similarArtistsMore) {
    similarArtistsMore = similarArtistsMore.filter((artist: Artist) => !similarArtists.map((artist: Artist) => artist.name).includes(artist.name));
  }

  if (isLoading) {
    return <SearchLoader />;
  }

  if (searchTerms && similarArtists?.length === 0) {
    return <div className={styles['search-results__error']}>{`Similar artists weren't found`}</div>;
  }

  if (lfmData.error) {
    return <div className={styles['search-results__error']}>{lfmData.message}</div>;
  }

  if (!similarArtists) {
    return <></>;
  }

  return (
    <>
      <div className={styles['search-results']}>
        {similarArtists.map((artist: Artist, index: number) => (
          <SearchResultsItem key={index} artist={artist} accessToken={spotifyAccessToken} />
        ))}

        {similarArtistsMore?.map((artist: Artist, index: number) => (
          <SearchResultsItem key={index} artist={artist} accessToken={spotifyAccessToken} />
        ))}
      </div>

      {similarArtists?.length && !hideLoadMoreButton ? (
        <div className={styles['search-results__load-more']}>
          <button className={isLoadingMore ? (styles.loading) : ''} onClick={() => loadMoreArtists()}>Load more</button>
        </div>
      ) : ''}
    </>
  );

};

export default SearchResults;