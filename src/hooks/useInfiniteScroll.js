import { useEffect, useCallback } from 'react';

const useInfiniteScroll = (callback, hasMore, isFetching) => {
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight) {
      if (hasMore && !isFetching) {
        callback();
      }
    }
  }, [callback, hasMore, isFetching]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
};

export default useInfiniteScroll;
