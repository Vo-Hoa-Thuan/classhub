function DetailVideo({id,img, video}) {
    return ( 
        <div className="row">
        {/* <!-- ***** Featured Start ***** --> */}
        <div className="col-lg-12">
          <div className="feature-banner header-text">
            <div className="row">
              <div className="col-lg-4">
              <div className="img_banner_detail">
                <img src={img} alt="" style={{borderRadius: '23px'}}/>
              </div>
              </div>
              <div className="col-lg-8">
                <div className="thumb">
                <div className="ratio ratio-16x9">
                  <iframe src={video} title="YouTube video" allowFullScreen></iframe>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- ***** Featured End ***** --> */}
      </div>
     );
}

export default DetailVideo;