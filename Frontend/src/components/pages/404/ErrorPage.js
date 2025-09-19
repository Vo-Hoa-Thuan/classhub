import { Button, Result } from "antd";
import {useNavigate} from 'react-router-dom'
function ErrorPage() {
  const navigate = useNavigate();
  const handleBackHome = (e) =>{
    e.preventDefault();
    navigate('/');
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button onClick={handleBackHome} type="primary">Về trang chủ</Button>}
    />
  );
}

export default ErrorPage;
