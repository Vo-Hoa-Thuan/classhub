import './Footer.scss'

function Footer({shippCompanys,payments,ewallets}) {
    return (
    <footer>
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <p>Copyright © 2025 <a href="/" target='_blank'>Class Hub</a> Company. All rights reserved.<br></br>
          Design: <span>2T Team</span></p>
        </div>
      </div>
      <div className="container row">
        <div className="col-lg-4">
          <h6 className='mb-2 title'>Ngân Hàng Liên Kết</h6>
         <div className='img-brand-ship'>
         {payments && payments.map((item)=>(
         <img key={item._id} src={item.imageUrl} alt={item.name}/>
         ))}
         </div>
        </div>
        <div className="col-lg-4">
          <h6 className='mb-2 title'>Ví Điện Tử</h6>
         <div className='img-brand-ship'>
         {ewallets && ewallets.map((item)=>(
         <img key={item._id} src={item.imageUrl} alt={item.name}/>
         ))}
         </div>
        </div>
        <div className="col-lg-4">
         <h6 className='mb-2 title'>Đơn Vị Vận Chuyển</h6>
        <div className='img-brand-ship'>
         {shippCompanys && shippCompanys.map((item)=>(
         <img key={item._id} src={item.imageUrl} alt={item.name}/>
         ))}
         </div>
        </div>
      </div>
    </div>
  </footer>
  );
}

export default Footer;
