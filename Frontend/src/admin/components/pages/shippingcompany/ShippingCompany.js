import ShippingCompanyTable from "../../childrencomponents/shippingcompanytable/ShippingCompanyTable";
import DefaultLayout from "../../layout/default/DefaultLayout";

function ShippingCompany() {
    return ( 
        <DefaultLayout>
            <ShippingCompanyTable></ShippingCompanyTable>
        </DefaultLayout>
     );
}

export default ShippingCompany;