/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '../styles/replies.css';
import { Link, useParams } from 'react-router-dom';
import UseNewPostHook from './UseNewPostHook'

function PostAndComment({ reply, formattedTime }) {
    const { postData, bookmarkedStates, handleBookmark, likedStates, handleLike, getPost } = UseNewPostHook();

    return (
        <div className='flex-column popup-reply-post horizontal-line-replies-section'>
            <Link to={`/${reply.postUser.formattedUsername}/status/${reply._id}`}>            
                <div className='flex-row comment-hover'>
                    <div className='pic-vertical-line-box flex-column'>
                        {reply.postUser && reply.postUser.profile && <img className='profile-pic no-bottom-margin' src={`http://localhost:3000/uploads/${reply.postUser.profile.profilePicture}`} />}
                        <div className='vertical-line-reply'></div>
                    </div>
                    <div className='reply-summary-post flex-column'>
                        {reply.postUser && reply.postUser.profile && <span> {reply.postUser.profile.updatedName} <span className='reply-replying-to'> @{reply.postUser.formattedUsername} · {reply.time}</span></span>}
                        {reply && reply.text && (
                                <span className='reply-post-text'>{reply.text}</span>
                            )}
                        {reply && reply.image && (
                                <img
                                    className='reply-post-text reply-post-image'
                                    src={`http://localhost:3000/uploads/${reply.image}`}
                                />
                        )}
                        {reply && reply.gif && (
                                <img
                                    className='reply-post-text reply-post-gif'
                                    src={reply.gif}
                                />
                        )}                        
                        {reply && reply.postUser && <span className='reply-replying-to'>Replying to <Link to={`/profile/${reply.postUser.formattedUsername}`} className='replying-to-blue'> @{reply.postUser.formattedUsername}</Link></span>}
                    </div>
                </div>
            </Link>
            {reply && reply.replies.map((replyItem) => (
                <Link key={replyItem._id} to={`/post/${reply.postUser.formattedUsername}/status/${replyItem._id}`}>
                    <div className='flex-row comment-hover'>
                    <div className='pic-vertical-line-box flex-column'>
                        <img className='profile-pic no-bottom-margin' src={`http://localhost:3000/uploads/${replyItem.user?.profile?.profilePicture}`} />
                    </div>
                    <div className='reply-summary-post flex-column'>
                        <span>{replyItem.user?.profile.updatedName} <span className='reply-replying-to'>@{replyItem.user?.formattedUsername} · {formattedTime}</span></span>
                        {replyItem.text && (
                        <span className='reply-post-text'>{replyItem.text}</span>
                        )}
                        {replyItem.image && (
                        <img
                            className='reply-post-text reply-post-image'
                            src={`http://localhost:3000/uploads/${replyItem.image}`}
                        />
                        )}
                        {replyItem.gif && (
                        <img
                            className='reply-post-text reply-post-gif'
                            src={replyItem.gif}
                        />
                        )}
                    </div>
                    </div>
                </Link>
                ))}
        </div>
    );
}

export default PostAndComment;