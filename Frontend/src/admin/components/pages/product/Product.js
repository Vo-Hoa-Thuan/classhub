import DefaultLayout from "../../layout/default/DefaultLayout";

import './Product.scss'
import ProductTable from "../../childrencomponents/producttable/ProductTable";
import SoftwareTable from "../../childrencomponents/softwaretable/SoftwareTable";

function Product() {

    return ( 
        <DefaultLayout>
            <ProductTable></ProductTable>
            <SoftwareTable></SoftwareTable>
        </DefaultLayout>
     );
}

export default Product;