import { useContext, useState } from 'react';
import ProductItem from '../productcomponents/listproducts/ProductItem'
import { ToastContainer, toast } from 'react-toastify';
import { getCartLocalStorage, setCartLocalStorage } from '../../../store/CartLocalStorage';
import { CartCountContext } from '../../../store/CartCountContext';

function SearchProducts({keyword,data}) {
    const cartCountContext = useContext(CartCountContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [pageNum, setPageNum] = useState(1);
    const notify = () => toast.success("Thêm thành công!");
    const [cart, setCart] = useState(() => {
        const cartData = getCartLocalStorage();
        return cartData ? cartData : [];
      });

    const addToCart = (product) => {
        notify();
        const productIndex = cart.findIndex((item) => item.id === product.id);
        if(productIndex >= 0) {
          const updatedCart = [...cart];
          updatedCart[productIndex].quantity += 1;
          setCart(updatedCart);
          setCartLocalStorage(updatedCart);
          console.log(product);
        } else {
        const updatedCart = [...cart, product];
        cartCountContext.cartCountUp();
        setCart(updatedCart);
        setCartLocalStorage(updatedCart);
        console.log(product);
        }
      };
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
      const totalPages = Math.ceil(data.length / itemsPerPage);
        const handlePrevPage = (e) => {
            e.preventDefault();
            setCurrentPage(prevPage => prevPage <= 1 ? prevPage : prevPage - 1);
            setPageNum(prevPage => prevPage <= 1 ? prevPage : prevPage - 1);
        };
        
        const handleNextPage = (e) => {
            e.preventDefault();
            setCurrentPage(prevPage => prevPage >= totalPages ? prevPage : prevPage + 1);
            setPageNum(prevPage => prevPage >= totalPages ? prevPage : prevPage + 1);
        };

    return ( 
    <>
        <div className="col-md-9 container-search-result">
          <div className="heading-filter">
            <h4>Kết quả tìm kiếm của "{keyword}"</h4>
          </div>
          <div className="padding"></div>
          <div className="row">
            <div className="col-sm-6">
              <div className="btn-group">
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                  Sắp xếp theo <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" role="menu">
                  <li><a href="#">Name</a></li>
                  <li><a href="#">Date</a></li>
                  <li><a href="#">View</a></li>
                  <li><a href="#">Rating</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row most-popular mode-bar">
            {currentItems && currentItems.map((app) => (
              <ProductItem
                inline={3}
                key={app._id}
                id={app._id}
                image={app.imageUrl}
                name={app.name}
                price={app.price}
                saleOff={app.saleOff}
                purchased={app.purchased}
                software={app.software}
                onClick={addToCart}
              ></ProductItem>
            ))}
            <div className="col-lg-12">
                <div className="main-button">
                    <a onClick={handlePrevPage} href="#product"><i className="fa fa-angle-double-left"></i></a>
                    <a href="#product">{pageNum}</a>
                    <a onClick={handleNextPage} href="#product"><i className="fa fa-angle-double-right"></i></a>
                </div>
            </div>
        </div>
        </div>
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
    </>
     );
}

export default SearchProducts;