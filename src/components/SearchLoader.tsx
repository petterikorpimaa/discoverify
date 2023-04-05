import styles from '../styles/search.module.scss';

const SearchLoader = () => {
  return (
    <div className={styles['search-loader']}>
      <div className={styles['search-loader__waves']}></div>
      <div className={styles['search-loader__waves']}></div>
      <div className={styles['search-loader__waves']}></div>
    </div>
  );
};

export default SearchLoader;