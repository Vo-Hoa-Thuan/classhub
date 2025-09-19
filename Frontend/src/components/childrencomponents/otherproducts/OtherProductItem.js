import { Link } from "react-router-dom";

function OtherProductItem({id,img,name,author,star, download}) {
    return ( 
        <div className="col-lg-6">
            <div className="item">
                <Link to={`/product-detail/${id}`} onClick={()=>window.location.reload()}><img src={img} alt="" className="templatemo-item"/>
                <h4 className="title">{name}</h4><span>{author}</span></Link>
                <ul>
                <li><i className="fa fa-star"></i> {star}</li>
                <li><i className="fa fa-download"></i> {download}</li>
                </ul>
            </div>
        </div>
     );
}

export default OtherProductItem;