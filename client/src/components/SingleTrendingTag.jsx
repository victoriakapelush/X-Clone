/* eslint-disable react/prop-types */

const SingleTrendingTag = ({ tag }) => {

  return (
    <div>
      <div className="trending-hashtag-container trending-tag flex-column">
        <span className="trending-name">#{tag.tag} · trending</span>
        <span className="trending-hashtag trendingtag-post-limit">
          {tag.randomPost.text}
        </span>
        <span className="trending-number-posts">{tag.postCount} posts</span>
      </div>
    </div>
  );
};

export default SingleTrendingTag;
