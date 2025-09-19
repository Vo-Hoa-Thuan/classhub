import { Link } from "react-router-dom";

function FeaturedAppItem({id,image, name, price, saleOff, downloaded}) {
    return ( 
        <div className='item'>
            <Link to={`/product-detail/${id}`}>
                <div className="thumb">
                    <img src={image} alt=""/>
                    <div className="hover-effect">
                    <h6>Xem ngay</h6>
                    </div>
                </div>
            </Link>
            <Link to={`/product-detail/${id}`}><h4 className='title'>{name}<br></br><span>{price.toLocaleString('vi-VN')}₫</span></h4></Link>
            <ul>
                <li className='title'><i className='bx bxs-discount'></i> {saleOff}%</li>
                <li className='title'><i className="fa fa-download"></i> {downloaded}</li>
            </ul>
            <div className='btn_featured'>
            <Link to={`/product-detail/${id}`}>Download</Link>
            </div>
        </div>
     );
}

export default FeaturedAppItem;