import { useState } from 'react';
import './DialogSearch.scss'

function DialogSearch({view}) {
    const [search, setSearch] = useState('')

    const handleCloseDialogSearch = ()=>{
        const close = document.getElementById('dialog_search')
        close.classList.remove('view_dialog')
    }

    const handleSearch = (e) => {
      e.preventDefault();
      sessionStorage.setItem("search",search);
    }

    return ( 
          <div className={`dialog_search ${view ? 'view_dialog' : ''}`} id='dialog_search'>
          <div className='close_search_dialog' onClick={handleCloseDialogSearch}>
            <i className='bx bx-x'></i>
            </div>
            <form>
              <div className="inner-form">
                <div className="input-field first-wrap">
                  <div className="icon_search_dialog">
                  <i className='bx bx-search'></i>
                  </div>
                  <input id="search" type="text" placeholder="Tìm gì đó..." onChange={(e) => setSearch(e.target.value)}/>
                </div>
                <div className="input-field second-wrap">
                  <button onClick={handleSearch} className="btn-search" type="button">Tìm</button>
                </div>
              </div>
              <span className="info">Bạn cần tìm: Thiết bị, Ứng dụng, Bài viết,...</span>
            </form>
          </div>
     );
}

export default DialogSearch;