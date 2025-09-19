function TopicPosts({topic}) {
    return ( 
        <div className="col-lg-12">
            <div className="sidebar-item categories">
            <div className="sidebar-heading">
                <h4 className='title'>Topic</h4>
            </div>
            <div className="content">
                <ul>
                {topic.map((item)=>
                    <li key={item._id}><a href="#">{item.title}</a></li>
                )}
                </ul>
            </div>
            </div>
        </div>
     );
}

export default TopicPosts;