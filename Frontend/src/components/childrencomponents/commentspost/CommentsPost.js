import './CommentsPost.scss'

function CommentsPost() {
    return ( 
        <div className="comments-post-container">
            {/* <!-- Comment Area Start --> */}
                    <div className="comment_area clearfix mt-70">
                        <h4 className="title">COMMENTS</h4>

                        <ol>
                            {/* <!-- Single Comment Area --> */}
                            <li className="single_comment_area bd_comment">
                                {/* <!-- Comment Content --> */}
                                <div className="comment-content d-flex">
                                    {/* <!-- Comment Author --> */}
                                    <div className="comment-author">
                                        <img src="img/bg-img/b7.jpg" alt="author"/>
                                    </div>
                                    {/* <!-- Comment Meta --> */}
                                    <div className="comment-meta">
                                        <h4 className="post-date">March 12</h4>
                                        <h6 className="post-author title">William James</h6>
                                        <p>Efficitur lorem sed tempor. Integer aliquet tempor cursus. Nullam vestibulum convallis risus vel condimentum. Nullam auctor lorem in libero luctus, vel volutpat quam tincidunt.</p>
                                        <a href="#" className="comment-reply">Reply</a>
                                    </div>
                                </div>
                                <ol className="children">
                                    <li className="single_comment_area children_reply">
                                        {/* <!-- Comment Content --> */}
                                        <div className="comment-content d-flex">
                                            {/* <!-- Comment Author --> */}
                                            <div className="comment-author">
                                                <img src="img/bg-img/b7.jpg" alt="author"/>
                                            </div>
                                            {/* <!-- Comment Meta --> */}
                                            <div className="comment-meta">
                                                <h4 className="post-date">March 12</h4>
                                                <h6 className="post-author title">William James</h6>
                                                <p>Efficitur lorem sed tempor. Integer aliquet tempor cursus. Nullam vestibulum convallis risus vel condimentum. Nullam auctor lorem in libero luctus, vel volutpat quam tincidunt.</p>
                                                <a href="#" className="comment-reply">Reply</a>
                                            </div>
                                        </div>
                                    </li>
                                </ol>
                            </li>

                            {/* <!-- Single Comment Area --> */}
                            <li className="single_comment_area">
                                {/* <!-- Comment Content --> */}
                                <div className="comment-content d-flex">
                                    {/* <!-- Comment Author --> */}
                                    <div className="comment-author">
                                        <img src="img/bg-img/b7.jpg" alt="author"/>
                                    </div>
                                    {/* <!-- Comment Meta --> */}
                                    <div className="comment-meta">
                                        <h4 className="post-date">March 12</h4>
                                        <h6 className="post-author title">William James</h6>
                                        <p>Efficitur lorem sed tempor. Integer aliquet tempor cursus. Nullam vestibulum convallis risus vel condimentum. Nullam auctor lorem in libero luctus, vel volutpat quam tincidunt.</p>
                                        <a href="#" className="comment-reply">Reply</a>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div>

                    <div className="post-a-comment-area mt-70">
                        <h4 className='title'>Leave a reply</h4>
                        {/* <!-- Reply Form --> */}
                        <form action="#" method="post">
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="group">
                                        <input type="text" name="name" id="name" placeholder='Nhập tên của bạn' required/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="group">
                                        <input type="email" name="email" id="email" placeholder='Nhập Email' required/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="group">
                                        <textarea name="message" id="message" placeholder='Nhập bình luận của bạn' required></textarea>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn original-btn">Reply</button>
                                </div>
                            </div>
                        </form>
                    </div>
        </div>
     );
}

export default CommentsPost;