import { Link } from "react-router-dom";

function TopDownloadedItem({id,image, name, author, star, downloaded}) {
    return ( 
        <li className="item-app-topdown">
            <Link to={`/product-detail/${id}`}>
                <img src={image} alt="" className="templatemo-item"/>
                <h4 className='title name-app'>{name}</h4>
            </Link>
            <h6 className='title'>{author}</h6>
            <span className='title'><i className="fa fa-star" style={{color: 'yellow'}}></i> {star}</span>
            <span className='title'><i className="fa fa-download" style={{color: '#ec6090'}}></i> {downloaded}</span>
            <div className="download">
            <Link to={`/product-detail/${id}`}>
             <a href="#home"><i className="fa fa-download mode-page"></i></a>
             </Link>
            </div>
        </li>
     );
}

export default TopDownloadedItem;