import { useCallback } from 'react';

const usePostGenerateLink = () => {
  // Function to generate the post URL
  const generatePostLink = useCallback((postId, username) => {
    return `${window.location.origin}/post/${username}/status/${postId}`;
  }, []);

  return {
    generatePostLink,
  };
};

export default usePostGenerateLink;