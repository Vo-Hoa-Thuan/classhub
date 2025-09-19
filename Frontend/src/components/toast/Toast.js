import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toast() {
    return ( 
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
     );
}
export default Toast;

const notifySuccess = (message) => toast.success(message);
const notifyWarning = (warn) => toast.warning(warn);
const notifyError = (err) => toast.error(err);
export {notifySuccess,notifyWarning,notifyError}