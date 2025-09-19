import { Link, useNavigate } from 'react-router-dom';
import './PopularList.scss'

function PopularItem({id,image, name, price, saleOff, downloaded}) {
  const navigate = useNavigate()
  const priceSale = parseInt(price) - (parseInt(price)*((parseInt(saleOff)/100)));
  const handleDownload = (e) =>{
    e.preventDefault();
    navigate(`/product-detail/${id}`)
  }
    return ( 
        <div className="">
        <div className="item mode-page item-list-product">
          <Link to={`/product-detail/${id}`}>
            <img src={image} alt=""/>
            <h4 className='title'>{name}<br></br>
              <li><span className="original-price">{price.toLocaleString('vi-VN')}₫</span></li>
              <li>{priceSale.toLocaleString('vi-VN')}₫</li> 
            </h4>
          </Link>
          <ul>
            <li className='title'><i className='bx bxs-discount'></i> {saleOff}%</li>
            <li className='title'><i className="fa fa-download"></i> {downloaded}</li>
          </ul>
            <div className='btn_featured'>
            <button onClick={handleDownload} className='mode-page'>Download</button>
            </div> 
        </div>
      </div>
     );
}

export default PopularItem;