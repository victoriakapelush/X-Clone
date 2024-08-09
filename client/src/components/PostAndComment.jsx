/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '../styles/replies.css';

function PostAndComment({ reply, formattedTime }) {
    
    return (
        <div className='flex-column popup-reply-post'>
            <div className='flex-row comment-hover'>
                <div className='pic-vertical-line-box flex-column'>
                    {reply.post && reply.post.user.profile && <img className='profile-pic no-bottom-margin' src={`http://localhost:3000/uploads/${reply.post.user.profile.profilePicture}`} />}
                    <div className='vertical-line-reply'></div>
                </div>
                <div className='reply-summary-post flex-column'>
                    {reply.post && reply.post.user.profile && <span>{reply.post.user.profile.updatedName} <span className='reply-replying-to'>@{reply.post.user.formattedUsername} · {reply.post.time}</span></span>}
                    {reply.post && (
                            <span className='reply-post-text'>{reply.post.text}</span>
                        )}
                    {reply.post && (
                            <img
                                className='reply-post-text reply-post-image'
                                src={`http://localhost:3000/uploads/${reply.post.image}`}
                            />
                    )}
                    {reply.post && (
                            <img
                                className='reply-post-text reply-post-gif'
                                src={reply.post.gif}
                            />
                    )}                        
                    {reply.post && <span className='reply-replying-to'>Replying to <span className='replying-to-blue'>@{reply.post.user.formattedUsername}</span></span>}
                </div>
            </div>
            <div className='flex-row horizontal-line-replies-section comment-hover'>
                <div className='pic-vertical-line-box flex-column'>
                    <img className='profile-pic no-bottom-margin' src={`http://localhost:3000/uploads/${reply.user.profile.profilePicture}`} />
                </div>
                <div className='reply-summary-post flex-column'>
                    <span>{reply.user.profile.updatedName} <span className='reply-replying-to'>@{reply.user.formattedUsername} · {formattedTime}</span></span>
                    {/* Check for text */}
                    {reply.text && (
                            <span className='reply-post-text'>{reply.text}</span>
                        )}
                    {/* Check for image */}
                    {reply.image && (
                            <img
                                className='reply-post-text reply-post-image'
                                src={`http://localhost:3000/uploads/${reply.image}`}
                            />
                    )}
                    {/* Check for GIF */}
                    {reply.gif && (
                            <img
                                className='reply-post-text reply-post-gif'
                                src={reply.gif}
                            />
                    )}                        
                </div>
            </div>
        </div>
    );
}

export default PostAndComment;