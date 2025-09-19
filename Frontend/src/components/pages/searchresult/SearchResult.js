import SearchProducts from "../../childrencomponents/searchproducts/SearchProduct";
import Default from "../../layout/default/Default";
import './SearchResult.scss'
import { useEffect, useState } from 'react';
import axios from 'axios'
import { api } from "../../../api";
import SearchBlogs from "../../childrencomponents/searchblogs/SearchBlogs";
import { Slider} from 'antd';


function SearchResult() {
    const params = new URLSearchParams(window.location.search);
    const keyword = {search: params.get('keyword')}
    const [value, setValue] = useState(50000000);
    const [view, setView] = useState('product');
    const [data, setData] = useState([]);
    const [dataFill, setDataFill] = useState([]);
    const [search, setSearch] = useState(keyword.search);
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [selectedBtnCategory, setSelectedCategory] = useState('product');

    const handleCheckboxChange = (value) => {
        if (value === selectedCheckbox) {
        setSelectedCheckbox(null);
        } else {
        setSelectedCheckbox(value);
        }
        if (value === 'application') {
                const newdata = data.filter((product) => product.software === true);
                setDataFill(newdata);
        }
        if (value === 'hardware') {
            const newdata = data.filter((product) => product.software === false);
            setDataFill(newdata);
        }
    };

    useEffect(()=>{
        getData('/product/search');
      },[]);

    useEffect(() => {
        const updatedParams = new URLSearchParams();
        updatedParams.set('keyword', search);
        window.history.replaceState({}, '', `?${updatedParams.toString()}`);
      }, [search]);

  const handleChangePrice = (value) => {
    setValue(value);
    const filteredProducts = data.filter((product) => product.price <= value);
    setDataFill(filteredProducts);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(selectedBtnCategory === 'blog') {
        getData('/blog/search');
        setView('blog');
    }
    if(selectedBtnCategory === 'product') {
        getData('/product/search');
        setView('product');
    }
  }
const handleChangeCategory = (e,s) => {
    e.preventDefault();
    setSelectedCategory(s);
    if(s === 'product') {
        setView('product');
        getData('/product/search')
    }
    if(s === 'blog') {
        setView('blog');
        getData('/blog/search')
    }
}
  const getData = async(url) => {
    keyword.search = search;
   await axios.post(api+`${url}`,keyword)
        .then((response)=>{
            console.log(response.data);
            const newData = response.data.filter((item) => item.status === true);
            setData(newData);
            setDataFill(newData);
        })
        .catch((err)=>{
          console.log(err);
          setView('error');
        });
  }
    return ( 
        <Default 
        searchOff={true}
        >
    <div className="row">
    <div className="col-md-12">
    <div className="grid search">
    <div className="grid-body mode-bar">
    <div className="search-bar">
    <form className='container-search-form'>
        <div className="inner-form">
        <div className="input-field">
            <input id="search" type="text" value={search} placeholder="Tìm gì đó..." onChange={(e) => setSearch(e.target.value)}/>
        </div>
            <button onClick={handleSearch} className="btn-search" type="button"><i className='bx bx-search'></i></button>
        </div>
        <span className="info">Bạn cần tìm: Thiết bị, Ứng dụng, Bài viết,...</span>
        <div className="container-category-btn">
            <button 
            className={`btn-category ${selectedBtnCategory==='product'? 'active-btn-search':null}`}
            onClick={(e) => handleChangeCategory(e,'product')}
            >Sản Phẩm</button>
            <button
            className={`btn-category ${selectedBtnCategory==='blog'? 'active-btn-search':null}`}
            onClick={(e) => handleChangeCategory(e,'blog')}
            >Tin Tức</button>
        </div>
    </form>
    </div>
    <div className="row">
    <div className="col-md-3">
    {selectedBtnCategory === 'product'&&
    <div>
        <div className="heading-filter">
            <h4>Danh mục</h4>
        </div>
        <div className="checkbox">
            <label>
              <input
                type="checkbox"
                className="icheck"
                checked={selectedCheckbox === 'application'}
                onChange={() => handleCheckboxChange('application')}
              />
              Application
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                className="icheck"
                checked={selectedCheckbox === 'hardware'}
                onChange={() => handleCheckboxChange('hardware')}
              />
              Thiết bị phần cứng
            </label>
          </div>
        <div className="padding mb-4"></div>
    </div>
    }
    <div className="heading-filter">
        <h4>Ngày tạo</h4>
    </div>
    Từ
    <div className="input-group date form_date" data-date="2014-06-14T05:25:07Z" data-date-format="dd-mm-yyyy" data-link-field="dtp_input1">
    <input type="date" className="form-control"/>
    </div>
    Đến
    <div className="input-group date form_date" data-date="2014-06-14T05:25:07Z" data-date-format="dd-mm-yyyy" data-link-field="dtp_input2">
    <input type="date" className="form-control"/>
    </div>

    <div className="padding mb-4"></div>

    {selectedBtnCategory === 'product'&& <>
        <div className="heading-filter">
            <h4>Theo giá</h4>
        </div>
        Khoảng từ <div id="price1">0</div> đến <div id="price2">{value.toLocaleString('vi-VN')}</div>
          <Slider 
          defaultValue={30}
          min={100000}
          max={50000000}
          step={500}
          value={value}
          onChange={handleChangePrice}
          />
    </>}
    </div>
    {view === 'blog' &&
    <SearchBlogs
        keyword={search}
        data={dataFill}
    />}
    {view === 'product' &&
    <SearchProducts
    keyword={search}
    data = {dataFill}
    ></SearchProducts>
    }
    {view === 'error' &&
    <div className="col-md-9 container-search-result">
    <div className="heading-filter">
        <h4>Không có kết quả nào phù hợp với "{search}"</h4>
    </div>
    </div>
    }
    </div>
    </div>
    </div>
    </div>
    </div>
        </Default>
     );
}

export default SearchResult;