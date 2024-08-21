import { useCallback } from 'react';

const useGenerateLink = () => {
  // Function to generate the post URL
  const generatePostLink = useCallback((postId, username) => {
    return `${window.location.origin}/${username}/status/${postId}`;
  }, []);

  return {
    generatePostLink,
  };
};

export default useGenerateLink;