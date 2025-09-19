import { Link } from 'react-router-dom';
import './HelpBar.scss'

function HelpBar() {
    return ( 
        <div className="help-bar">
        {/* <!-- ***** Start Stream Start ***** -->*/}
        <div className="col-lg-12">
          <div className="heading-section">
            <h4>Luôn Sẵn Sàng <em>Hỗ Trợ Bạn</em> </h4>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="item">
                <div className="icon">
                  <img src="https://firebasestorage.googleapis.com/v0/b/upload-img-db8c6.appspot.com/o/support.png?alt=media&token=a053a2ae-1f9c-4215-b243-97b521fb42a9" alt="" style={{maxWidth: '60px', borderRadius: '50%'}}/>
                </div>
                <h4 className='title'>Hỗ trợ mọi lúc mọi nơi</h4>
                <p>Miễn phí cài đặt, triển khai, nâng cấp và hỗ trợ. Rẻ hơn một ly trà đá mỗi ngày.</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="item">
                <div className="icon">
                  <img src="https://firebasestorage.googleapis.com/v0/b/upload-img-db8c6.appspot.com/o/hand.png?alt=media&token=238a97e2-93f8-48af-aa50-6cfca0051b2f" alt="" style={{maxWidth: '60px', borderRadius: '50%'}}/>
                </div>
                <h4 className='title'>Bảo hành phần mềm trọn đời</h4>
                <p>Miễn phí cài đặt, triển khai, nâng cấp và hỗ trợ. Rẻ hơn một ly trà đá mỗi ngày.</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="item">
                <div className="icon">
                  <img src="https://firebasestorage.googleapis.com/v0/b/upload-img-db8c6.appspot.com/o/repair-tools.png?alt=media&token=cac033a0-a400-441b-8067-9200ec43bdfe" alt="" style={{maxWidth: '60px', borderRadius: '50%'}}/>
                </div>
                <h4 className='title'>Cài đặt và hướng dẫn sử dụng</h4>
                <p>Miễn phí cài đặt, triển khai, nâng cấp và hỗ trợ. Rẻ hơn một ly trà đá mỗi ngày.</p>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="main-button">
                <Link to='/service'>Tới Trang Dịch Vụ</Link>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- ***** Start Stream End ***** --> */}
      </div>
     );
}

export default HelpBar;
