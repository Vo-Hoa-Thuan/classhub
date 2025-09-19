import { useParams } from "react-router-dom";
import DetailsContent from "../../childrencomponents/detailscontent/DetailsContent";
import OtherProducts from "../../childrencomponents/otherproducts/OtherProducts";
import Default from "../../layout/default/Default";
import './ProductDetailsPage.scss'
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../../api";

function ProductDetailsPage() {
  const { id } = useParams();
  const [product,setProduct] = useState();
  useEffect(()=>{
    axios.get(api +`/product/${id}`)
            .then(response => {
                console.log(response.data);
                setProduct(response.data)
            })
            .catch(error => {
            console.log(error);
            });
  },[])
  
    return ( 
       <Default>
       <DetailsContent
        product={product}
       />
       <OtherProducts/>
       </Default>
     );
}

export default ProductDetailsPage;