import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ProductItem({id,image, name, price, saleOff, purchased, onClick,inline,software}) {
    const navigate = useNavigate();
    const priceSale = parseInt(price) - (parseInt(price)*((parseInt(saleOff)/100)));
    const product = {
        id:id ,
        image:image,
        name:name,
        price:price,
        priceSale:priceSale,
        purchased:purchased,
        quantity: 1,
    }
    const handleDownload = () => {

      }
    const handleAddToCart = () => {
        navigate('/login');
    }
    return ( 
        <div className={`${inline === 3 ? 'col-lg-4' : 'col-lg-3'} col-sm-6`}>
            <div className="item mode-page item-list-product">
                <Link to={`/product-detail/${id}`}>
                    <img src={image} alt=""/>
                    <h4 className='title'>{name}<br></br>
                    <li><span className="original-price">{price ? price.toLocaleString('vi-VN') : price}₫</span></li>
                    <li>{priceSale.toLocaleString('vi-VN')}₫</li> 
                    </h4>
                </Link>
                { software ?
                    <>
                    <ul>
                    <li className='title'><i className='bx bxs-discount'></i> {saleOff}%</li>
                    <li className='title'><i className="fa fa-download"></i> {purchased}</li>
                    </ul>
                    <div className='btn_featured'>
                    <button onClick={handleDownload} className='mode-page'>Download</button>
                    </div>
                    </>
                    :
                    <>
                    <ul>
                    <li className='title'><i className='bx bxs-discount'></i> {saleOff}%</li>
                    <li><i className="fa-solid fa-cart-plus"></i> {purchased}</li> 
                    </ul>
                    {localStorage.getItem('user') ?
                    <div className='btn_featured'>
                    <button onClick={()=>onClick(product,image)} className='mode-page'>Thêm Vào Giỏ</button>
                    </div> 
                    :
                    <div className='btn_featured'>
                    <button onClick={handleAddToCart} className='mode-page'>Thêm Vào Giỏ</button>
                    </div> 
                    }
                    
                    </>
                }
            </div>
        </div>
     );
}

export default ProductItem;