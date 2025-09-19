import TopDownloaded from '../topdownloaded/TopDownloaded';
import FeaturedApp from '../featuredapp/FeaturedApp'

function BannerApps({appList}) {
    return ( 
        <div className="row container_featured_apps">
        {/* <!-- ***** Featured App Start ***** --> */}
             <FeaturedApp
               appList={appList}
             />
             <TopDownloaded
              appList={appList}
             />
        {/* <!-- ***** Featured App End ***** --> */}
      </div>
     );
}

export default BannerApps;