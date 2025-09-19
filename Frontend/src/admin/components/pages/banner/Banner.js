import BannerTable from "../../childrencomponents/banner/BannerTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import './Banner.scss';


function Banner() {
    
    return ( 
        <DefaultLayout>
        <BannerTable></BannerTable>
        </DefaultLayout>
     );
}

export default Banner;