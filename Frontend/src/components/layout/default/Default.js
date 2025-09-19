import Footer from "../footer/Footer";
import Header from "../header/Header";
import axios from "axios";
import { api, api_auth} from "../../../api";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../store/ThemeContext";

function Default({children,searchOff}) {
  const themeContext = useContext(ThemeContext);
  themeContext.setTheme(localStorage.getItem("theme"));
  const [shippCompanys,setShippCompanys] = useState()
  const [payments,setPayments] = useState()
  const [ewallets,setEwallets] = useState()
  const navigate = useNavigate();
  const [token,setToken] = useState(() => {
    const data = localStorage.getItem('token');
    return data ? data : '';
  });

  useEffect(() => {
    axios.get(api+'/shipping-company')
      .then(response => {
        setShippCompanys( response.data.filter((item) => item.status===true));
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get(api+'/payment/client')
      .then(response => {
        const payments = response.data.filter((item) => item.isbank === true & item.status===true);
        const ewallets = response.data.filter((item) => item.isbank === false & item.status===true);
        setPayments(payments);
        setEwallets(ewallets);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if(token){
      const headers = {
        token: `Bearer ${token}`,
        };
      axios.post(api_auth+'/check-token',null,{headers})
      .then(response => {
        console.log('checktoken:',response.status);
      })
      .catch(error => {
        console.log(error);
        console.log('Error:',error.response.status)
        if(error.response.status===403){
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
    }
  }, [token]);

    return ( 
        <div className={`${themeContext.theme==='dark' ? 'layout-default':'layout-light'}`}>
        <Header
        themeContext={themeContext}
        searchOff={searchOff}
        ></Header>
    <div className={`container ${themeContext.theme==='light' && 'light-mode'}`}>
    <div className="row">
      <div className="col-lg-12">
        <div className="page-content mode-page" id="modePage">
            {children}
        </div>
      </div>
    </div>
  </div>
        <Footer
          shippCompanys={shippCompanys}
          payments={payments}
          ewallets={ewallets}
        />
    </div> 
     );
}

export default Default;