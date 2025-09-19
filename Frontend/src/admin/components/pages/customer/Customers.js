import CustomerTable from '../../childrencomponents/customertable/CustomerTable';
import DefaultLayout from '../../layout/default/DefaultLayout'

function Customers() {
    return ( 
        <DefaultLayout>
        <CustomerTable/>
        </DefaultLayout>
     );
}

export default Customers;