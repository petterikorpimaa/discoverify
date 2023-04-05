import { useRouter } from 'next/router';

import { searchSpotifyArtists, getSpotifyArtistTopTracks } from '@/helpers/api-util';

import { delay } from '@/helpers/util';

import styles from '../styles/search.module.scss';

type Artist = {
  name: string;
  url: string;
};

type Props = {
  artist: Artist;
  accessToken: string;
};

const SearchResultsItem = (props: Props) => {
  const { artist, accessToken } = props;

  const router = useRouter();

  const getSpotifyArtistId = async (artistName: string) => {
    return searchSpotifyArtists(artistName, accessToken).then((data) => {
      const allFoundArtists = data?.artists?.items || [];
      const bestMatchArtist = allFoundArtists[0];
      const bestMatchArtistId = bestMatchArtist?.id;

      if (bestMatchArtistId) {
        return bestMatchArtistId;
      }
    });
  };

  const visitArtistSpotifyPage = async (event: React.MouseEvent) => {
    const artistNameElement = event.target as HTMLElement;
    const artistElement = artistNameElement.closest('.search-results-item') as HTMLElement;
    const artistName = artistElement?.dataset?.artist;

    if (artistName) {
      searchSpotifyArtists(artistName, accessToken).then((data) => {
        const allFoundArtists = data?.artists?.items || [];
        const bestMatchArtist = allFoundArtists.find((artist: Artist) => artist.name === artistName) || allFoundArtists[0];
        const bestMatchArtistURI = bestMatchArtist?.uri;

        if (bestMatchArtistURI) {
          router.push(bestMatchArtistURI);
        }
      });
    }
  };

  const handleArtistItemClick = async (event: React.MouseEvent) => {
    const clickedElement = event.target as HTMLElement;
    const artistElement = event.currentTarget as HTMLElement;

    // Toggle detail visibility on click. Prevent toggle when clickin on icons.
    if (!clickedElement.classList.contains(styles['icon'])) {
      const artistDetailsElement = artistElement.querySelector('.artist-details') as HTMLElement;
      const tracklistElement = artistDetailsElement.querySelector('.tracklist') as HTMLElement;
      const tracklistHeadingElement = artistDetailsElement.querySelector('.tracklist-heading') as HTMLElement;
      const trackListPopulated = artistElement?.dataset?.tracklistPopulated;

      // Toggle open class for the main artist element
      artistElement.classList.toggle(styles['open']);

      const detailsHeight = artistDetailsElement.scrollHeight;

      if (artistElement.classList.contains(styles['open'])) {
        artistDetailsElement.style.height = `${detailsHeight}px`;

        if (trackListPopulated === 'false' && tracklistHeadingElement) {
          // Show loading indicator
          tracklistHeadingElement.classList.add(styles['loading']);
        }

        // Wait for the expand animation to finish
        delay(200).then(() => {
          artistDetailsElement.style.height = `auto`;

          if (trackListPopulated === 'false') {
            // Update the data attribute for loaded tracklists. No need to load them again.
            artistElement.dataset.tracklistPopulated = 'true';
            const artistName = artistElement?.dataset?.artist;

            const trackElements = artistElement.querySelectorAll('.artist-tracklist-item') as NodeListOf<HTMLLinkElement>;

            if (artistName && trackElements.length) {
              getSpotifyArtistId(artistName).then((artistId) => {
                getSpotifyArtistTopTracks(artistId, accessToken).then((data) => {
                  const topTracks = data?.tracks || [];

                  if (topTracks.length) {
                    tracklistElement.classList.add(styles['loaded']);

                    trackElements.forEach((trackElement: HTMLLinkElement, index: number) => {
                      trackElement.href = topTracks[index].uri;
                      trackElement.innerText = topTracks[index].name;
                      trackElement.dataset.id = topTracks[index].id;

                      trackElement.classList.add(styles['show']);

                      if (tracklistHeadingElement) {
                        // Hide loading indicator
                        tracklistHeadingElement.classList.remove(styles['loading']);
                      }
                    });
                  }
                });
              });
            }
          }

        });
      } else {
        artistDetailsElement.style.height = `${detailsHeight}px`;

        // Wait one millisecond after setting the initial height so the collapse animation works correctly
        delay(1).then(() => {
          // Collapse details area
          artistDetailsElement.style.height = '0px';
        });
      }
    }
  };

  const addArtistToSearch = (event: React.MouseEvent) => {
    const artistNameElement = event.target as HTMLElement;
    const artistElement = artistNameElement.closest('.search-results-item') as HTMLElement;
    const clickedArtistName = artistElement?.dataset?.artist;

    const searchInput = document.querySelector('#similar-artist-search') as HTMLInputElement;
    const searchInputValues = searchInput.value;
    const searchInputSimplified = searchInputValues.split(',').map(value => value.toLowerCase().trim());

    if (clickedArtistName && !searchInputSimplified.includes(clickedArtistName.toLowerCase())) {
      searchInput.value = searchInputValues + ', ' + clickedArtistName;
      searchInput.focus();
    }
  };

  return (
    <div className={`${styles['search-results__item']} search-results-item`} data-artist={artist.name} data-tracklist-populated="false" onClick={(e) => handleArtistItemClick(e)}>
      <div className={styles['artist-label-container']}>
        <span className={`${styles['artist-name']} label`}>{artist.name}</span>

        <div className={styles['label-icons']}>
          <a href={artist.url} target="_blank" className={`${styles['icon']} ${styles['icon--lastfm']}`}></a>
          <div className={`${styles['icon']} ${styles['icon--spotify']}`} onClick={(e) => visitArtistSpotifyPage(e)}></div>
          <div className={`${styles['icon']} ${styles['icon--add']}`} onClick={(e) => addArtistToSearch(e)}></div>
        </div>
      </div>

      <div className={`${styles['artist-details']} artist-details`}>
        <div  className={styles['artist-tracklist-container']}>
          <div className={`${styles['artist-tracklist-heading']} tracklist-heading`}>Top tracks</div>
          <div className={`${styles['artist-tracklist']} tracklist`}>
            <a href="#" className={`${styles['artist-tracklist__item']} artist-tracklist-item`}>&nbsp;</a>
            <a href="#" className={`${styles['artist-tracklist__item']} artist-tracklist-item`}>&nbsp;</a>
            <a href="#" className={`${styles['artist-tracklist__item']} artist-tracklist-item`}>&nbsp;</a>
            <a href="#" className={`${styles['artist-tracklist__item']} artist-tracklist-item`}>&nbsp;</a>
            <a href="#" className={`${styles['artist-tracklist__item']} artist-tracklist-item`}>&nbsp;</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsItem;