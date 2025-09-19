import Home from '../components/pages/home/HomePage'
import ProductsPage from '../components/pages/products/ProductsPage'
import BlogsPage from '../components/pages/blog/BlogsPage'
import ProfilePage from '../components/pages/profile/ProfilePage'
import ProductDetailsPage from '../components/pages/productdetail/ProductDetailsPage'
import BlogDetailPage from '../components/pages/blogdetail/BlogDetailPage'
import Login from '../components/pages/login/Login'
import SignUp from '../components/pages/signup/SignUp'
import Cart from '../components/pages/cart/Cart'
import SearchResult from '../components/pages/searchresult/SearchResult'
import Topic from '../admin/components/pages/topic/Topic'
import CheckOut from '../components/pages/checkout/CheckOut'
import Order from '../components/pages/order/Order'
import ConfirmPayment from '../components/pages/confirmpayment/ConfirmPayment'
import ConfirmAppDownload from '../components/pages/confirmpayment/ConfirmAppDownload'
import DetailOrderUser from '../components/pages/detailorder/DetailOrderUser'
import ExportOrder from '../components/pages/detailorder/ExportOrder'
import Service from '../components/pages/service/Service'
import BlogManagement from '../components/pages/blogmanagement/BlogManagement'
import CreateBlog from '../components/pages/blogmanagement/CreateBlog'
import UpdateBlogBlogger from '../components/pages/blogmanagement/UpdateBlog'

//Error
import ErrorPage from '../components/pages/404/ErrorPage'

//Admin
import Dashboard from '../admin/components/pages/dashboard/Dashboard'
import Banner from '../admin/components/pages/banner/Banner'
import Product from '../admin/components/pages/product/Product'
import Blog from '../admin/components/pages/blog/Blog'
import Role from '../admin/components/pages/role/Role'
import ShippingCompany from '../admin/components/pages/shippingcompany/ShippingCompany'
import Payment from '../admin/components/pages/payment/Payment'
import Orders from '../admin/components/pages/orders/Orders'
import OrdersNew from '../admin/components/pages/orders/OrdersNew'
import OrdersShipping from '../admin/components/pages/orders/OrdersShipping'
import OrdersCancel from '../admin/components/pages/orders/OrdersCancel'
import DetailOrder from '../admin/components/pages/orders/DetailOrder'
import DownloadApp from '../admin/components/pages/downloadapp/DownloadApp'
import DetailDownloadApp from '../admin/components/pages/downloadapp/DetailDownloadApp'
import AdminProfile from '../admin/components/pages/adminprofile/AdminProfile'
import Customers from '../admin/components/pages/customer/Customers'
import DetailCustomer from '../admin/components/pages/customer/DetailCustomer'

//CRUD Product
import AddProduct from '../admin/components/pages/crudproduct/AddProduct'
import UpdateProduct from '../admin/components/pages/crudproduct/UpdateProduct'
//CRUD Banner
import AddBanner from '../admin/components/pages/crudbanner/AddBanner'
import UpdateBanner from '../admin/components/pages/crudbanner/UpdateBanner'
//CRUD Blog
import AddBlog from '../admin/components/pages/crudblog/AddBlog'
import UpdateBlog from '../admin//components/pages/crudblog/UpdateBlog'

//CRUD Topic
import AddTopic from '../admin/components/pages/crudtopic/AddTopic'
import UpdateTopic from '../admin/components/pages/crudtopic/UpdateTopic'

//CRUD Shipping Company
import UpdateShipCompany from '../admin/components/pages/crudshippingcompany/Update'
import AddShipCompany from '../admin/components/pages/crudshippingcompany/Add'

//CRUD Payment
import AddPayment from '../admin/components/pages/crudpayment/AddPayment'
import UpdatePayment from '../admin/components/pages/crudpayment/UpdatePayment'

//CHANGE ROLE
import ChangeRole from '../admin/components/pages/role/ChangeRole'


const publicRouter = [

//ROUTE CLIENT
{path:'/',component:Home},
{path:'/products',component:ProductsPage},
{path:'/blogs',component:BlogsPage},
{path:'/cart',component:Cart},
{path:'/check-out',component:CheckOut},
{path:'/order/:id',component:Order},
{path:'/search-result',component:SearchResult},
{path:'/profile/:id',component:ProfilePage},
{path:'/login',component:Login},
{path:'/sign-up',component:SignUp},
{path:'/confirm-payment',component:ConfirmPayment},
{path:'/confirm-app-payment',component:ConfirmAppDownload},
{path:'/user/detail-order/:id',component:DetailOrderUser},
{path:'/export-order',component:ExportOrder},
{path:'/service',component:Service},

//Error Page
{path:'/404-page',component:ErrorPage},

//BLOG MANAGEMENT
{path:'/blog-management',component:BlogManagement},
{path:'/blog-create',component:CreateBlog},
{path:'/blog-update/:id',component:UpdateBlogBlogger},

//ROUTE ADMIN
{path:'/admin/dashboard',component:Dashboard},
{path:'/admin/banner',component:Banner},
{path:'/admin/product',component:Product},
{path:'/admin/blog',component:Blog},
{path:'/admin/topic',component:Topic},
{path:'/admin/role',component:Role},
{path:'/admin/ship-company',component:ShippingCompany},
{path:'/admin/payment',component:Payment},
{path:'/admin/download-app',component:DownloadApp},
{path:'/admin/profile/:id',component:AdminProfile},
{path:'/admin/detail-download-app/:id',component:DetailDownloadApp},
{path:'/admin/customers',component:Customers},
{path:'/admin/details-customer/:id',component:DetailCustomer},

//ORDER ADMIN
{path:'/admin/orders',component:Orders},
{path:'/admin/orders-new',component:OrdersNew},
{path:'/admin/orders-cancel',component:OrdersCancel},
{path:'/admin/orders-shipping',component:OrdersShipping},
{path:'/admin/detail-order/:id',component:DetailOrder},

//CRUD PRODUCT
{path:'/admin/product/add',component:AddProduct},
{path:'/admin/product/update/:id',component:UpdateProduct},

//CRUD BANNER
{path:'/admin/banner/add',component:AddBanner},
{path:'/admin/banner/update/:id',component:UpdateBanner},

//CRUD BLOG
{path:'/admin/blog/add',component:AddBlog},
{path:'/admin/blog/update/:id',component:UpdateBlog},

//CRUD TOPIC
{path:'/admin/topic/add',component:AddTopic},
{path:'/admin/topic/update/:id',component:UpdateTopic},

//CRUD SHIPPING COMPANY
{path:'/admin/ship-company/add',component:AddShipCompany},
{path:'/admin/ship-company/update/:id',component:UpdateShipCompany},

//CRUD PAYMENT
{path:'/admin/payment/add',component:AddPayment},
{path:'/admin/payment/update/:id',component:UpdatePayment},

//CHANGE ROLE
{path:'/admin/role/change/:id',component:ChangeRole},

//DETAIL
{path:'/product-detail/:id',component:ProductDetailsPage},
{path:'/blog-detail/:id',component:BlogDetailPage},
]

const privateRouter = [

]

export {publicRouter, privateRouter}