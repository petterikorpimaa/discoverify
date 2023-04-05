import React, { useState, useEffect } from 'react';

import styles from '../styles/search.module.scss';

type Props = {
  setSearchTerms: Function;
};

const SearchInput = (props: Props) => {
  const { setSearchTerms } = props;

  const onEnterPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      const inputElement = event.target as HTMLInputElement;
      setSearchTerms(inputElement.value);
    }
  };

  return (
    <div className={styles['search__input']}>
      <input type="search" name="similar-artist-search" id="similar-artist-search" autoComplete="on" placeholder="Search similar artists" onKeyDown={(e) => onEnterPress(e)} />
    </div>
  );
};

export default SearchInput;