/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '../styles/replies.css';
import { Link, useParams } from 'react-router-dom';

function PostAndComment({ reply, formattedTime }) {

    console.log('REPLY', reply)

    return (
        <div className='flex-column popup-reply-post'>
            <Link to={`/${reply.post?.user.formattedUsername}/status/${reply.post?._id}`}>            
                <div className='flex-row comment-hover'>
                    <div className='pic-vertical-line-box flex-column'>
                        {reply.post && reply.post.user.profile && <img className='profile-pic no-bottom-margin' src={`http://localhost:3000/uploads/${reply.post.user.profile.profilePicture}`} />}
                        <div className='vertical-line-reply'></div>
                    </div>
                    <div className='reply-summary-post flex-column'>
                        {reply.post && reply.post.user.profile && <span> {reply.post.user.profile.updatedName} <span className='reply-replying-to'> @{reply.post.user.formattedUsername} · {reply.post.time}</span></span>}
                        {reply.post.text && (
                                <span className='reply-post-text'>{reply.post.text}</span>
                            )}
                        {reply.post.image && (
                                <img
                                    className='reply-post-text reply-post-image'
                                    src={`http://localhost:3000/uploads/${reply.post.image}`}
                                />
                        )}
                        {reply.post.gif && (
                                <img
                                    className='reply-post-text reply-post-gif'
                                    src={reply.post.gif}
                                />
                        )}                        
                        {reply.post && reply.post.user && <span className='reply-replying-to'>Replying to <Link to={`/profile/${reply.post.user.formattedUsername}`} className='replying-to-blue'> @{reply.post.user.formattedUsername}</Link></span>}
                    </div>
                </div>
            </Link>
            {reply.post?.totalReplies && reply.post?.totalReplies.map((replyItem) => (
                <Link key={replyItem._id} to={`/post/${reply.post?.user.formattedUsername}/status/${replyItem._id}`}>
                    <div className='flex-row horizontal-line-replies-section comment-hover'>
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