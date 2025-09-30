import { NavLink } from "react-router-dom";

function BlogDetailItem({id,topic,title,author, dateCreate,comments,shortDesc, desc, image}) {
  const createdAt = new Date(dateCreate);
  const formattedDate = createdAt.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }); 

  return ( 
        <div className="col-lg-12">
          <div className="blog-post">
            <div className="blog-up-content">
              <div className="blog-thumb">
                  <img src={image} alt=""/>
                </div>
            <div className="title-info-content">
              <span>{topic}</span>
              <NavLink to={`/blog-detail/${id}`}>
                <h4 className="title">{title}</h4>
              </NavLink>
              <ul className="post-info">
                <li><a href="#">{author} |</a></li>
                <li><a href="#">{formattedDate} |</a></li>
              </ul>
            </div>
            </div>
            <div className="down-content">
              <h6 className="title short-desc-blog">{shortDesc}</h6><br></br>
              <div dangerouslySetInnerHTML={{__html: desc}}></div>
              <div className="post-options">
                <div className="row">
                  <div className="col-6">
                    <ul className="post-tags">
                      <li><i className="fa fa-tags"></i></li>
                      <li><a href="#">{topic}</a></li>
                    </ul>
                  </div>
                  <div className="col-6">
                    <ul className="post-share">
                      <li><i className="fa fa-share-alt"></i></li>
                      <li><a href="#">Facebook</a>,</li>
                      <li><a href="#"> Twitter</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
     );
}

export default BlogDetailItem;
