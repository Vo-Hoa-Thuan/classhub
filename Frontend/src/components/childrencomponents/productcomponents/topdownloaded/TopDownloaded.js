import TopDownloadedItem from "./TopDownloadedItem";
import Images from "../../../../assets/img/Image";
import './TopDownloaded.scss'

function TopDownloaded({appList}) {

    return ( 
        <div className="col-lg-4">
          <div className="top-downloaded mode-bar">
            <div className="heading-section">
              <h4><em>Top</em> Downloaded</h4>
            </div>
            <ul>
            {appList && appList.map((app) => (
              <TopDownloadedItem
                id={app._id}
                image={app.imageUrl}
                name={app.name}
                author='VNSIM'
                star='4.9'
                downloaded={app.purchased}
              />
            ))}
            </ul>
            {/* <div className="text-button">
              <a href="profile.html">Xem Tất Cả</a>
            </div> */}
          </div>
        </div>
     );
}

export default TopDownloaded;