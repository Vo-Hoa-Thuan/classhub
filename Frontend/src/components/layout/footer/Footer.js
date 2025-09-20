import Images from '../../../assets/img/Image';
import './Footer.scss'

function Footer({shippCompanys,payments,ewallets}) {
    return (
    <footer>
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <p>Copyright © 2025 <a href="/" target='_blank'>Class Hub</a> Company. All rights reserved.<br></br>
          Design: <a href="https://tiedun46.github.io/user-ntd/?fbclid=IwAR0Ok-RhFfeWl-VavA3D7f9Pz3emFDr0vF21egsoKHBeeS5dbMzd0xdVYOY" target="_blank" rel="noreferrer">Dung Nguyen</a></p>
        </div>
      </div>
      <div className="container row">
        <div className="col-lg-4">
          <p><h6 className='mb-2 title'>Ngân Hàng Liên Kết</h6>
         <div className='img-brand-ship'>
         {payments && payments.map((item)=>(
         <img key={item._id} src={item.imageUrl} alt={item.name}/>
         ))}
         </div>
         </p>
        </div>
        <div className="col-lg-4">
          <p><h6 className='mb-2 title'>Ví Điện Tử</h6>
         <div className='img-brand-ship'>
         {ewallets && ewallets.map((item)=>(
         <img key={item._id} src={item.imageUrl} alt={item.name}/>
         ))}
         </div>
         </p>
        </div>
        <div className="col-lg-4">
         <p><h6 className='mb-2 title'>Đơn Vị Vận Chuyển</h6>
        <div className='img-brand-ship'>
         {shippCompanys && shippCompanys.map((item)=>(
         <img key={item._id} src={item.imageUrl} alt={item.name}/>
         ))}
         </div>
         </p>
        </div>
      </div>
    </div>
  </footer>
  );
}

export default Footer;