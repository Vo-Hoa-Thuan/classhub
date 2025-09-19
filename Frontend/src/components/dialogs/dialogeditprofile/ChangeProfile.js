import axios from "axios";
import { useEffect, useState } from "react";
import { api} from "../../../api";
import {notifySuccess,notifyError} from "../../toast/Toast"; 

function ChangeProfile({data,id,setDialogActive}) {
    const [fullname,setFullName] = useState();
    const [phone,setPhone] = useState();
    const [email,setEmail] = useState();
    const [birth,setBirth] = useState();
    const [gender,setGender] = useState();
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : '';
      });
      const headers = {
        token: `Bearer ${token}`,
        };

    //Sate để nhận địa chỉ:
    const [detailAddress,setDetailAddress] = useState('');
    const [commune,setCommune] = useState('');
    const [district,setDistrict] = useState('');
    const [city,setCity] = useState('');

    //Api tỉnh thành VN
    const api_province_url = 'https://provinces.open-api.vn/api/?depth=1'
    const [citys, setCitys] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes,setCommunes] = useState('');

    useEffect(() => {
            setFullName(data.fullname);
            setPhone(data.phone);
            setEmail(data.email);
            setGender(data.gender);
            const address = data.address;
            const parts = address.split(", ");
            setDetailAddress(parts[0]);
            setCommune(parts[1]);
            setDistrict(parts[2]);
            setCity(parts[3]);
            // Chuyển đổi chuỗi đầu vào sang kiểu Date
            const inputDate = new Date(data.birth);
            // Lấy các thông tin ngày, tháng và năm từ kiểu Date
            const day = inputDate.getDate().toString().padStart(2, '0');
            const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
            const year = inputDate.getFullYear();
            // Chuyển đổi sang chuỗi định dạng mong muốn
            const outputDateString = `${year}-${month}-${day}`;
            setBirth(outputDateString);
      },[data]);

      useEffect(() => {
        axios.get(api_province_url)
                .then(response => {
                    let citys = [];
                    response.data.map((item)=>{
                            citys.push({
                            name: item.name,
                            code: item.code,
                            codename: item.codename
                        });
                    })
                    setCitys(citys);
                })
                .catch(error => {
                console.log(error);
                });
         },[]);
    
    const handleChangeCity = async(code)=>{
        const codeCity = code;
        const cityname = citys.filter((item) => item.code === parseInt(codeCity));
        setCity(cityname[0].name);
        await axios.get(`https://provinces.open-api.vn/api/p/${codeCity}?depth=3`)
        .then(response => {
            console.log(response.data.districts);
            setDistricts(response.data.districts);
        })
        .catch(error => {
        console.log(error);
        });
    }

    const handleChangeDistrict = async(code) =>{
        const codeDistrict = code;
        const districtname = districts.filter((item) => item.code === parseInt(codeDistrict));
        setDistrict(districtname[0].name);
        await axios.get(`https://provinces.open-api.vn/api/d/${codeDistrict}?depth=2`)
        .then(response => {
            console.log(response.data.wards);
            setCommunes(response.data.wards)
        })
        .catch(error => {
        console.log(error);
        });
    }

    const handleChangeCommunes = (code) =>{
        const codeCommunes = code;
        const communeCode = communes.filter((item) => item.code === parseInt(codeCommunes));
        setCommune(communeCode[0].name);
    }
    const handleUpdateProfile = async(e) => {
        e.preventDefault();
        if(!fullname || !phone ||!birth ||!gender ||!detailAddress ||!commune ||!district ||!city){
            notifyError('Thông tin không được để trống. Kiểm tra lại!');
        } else {
            const user = data && data.phone=== phone ? {
                fullname: fullname,
                birth: birth,
                gender:gender,
                address: null
            } : {
                fullname: fullname,
                phone: phone,
                birth: birth,
                gender:gender,
                address: null
            }
            try {
            const address = `${detailAddress}, ${commune}, ${district}, ${city}`;
            user.address = address;
            console.log(user);
            await axios.put(api +`/user/update/${id}`, user, { headers});
                notifySuccess('Đã lưu thông tin thành công!');
                const userLocal = JSON.parse(localStorage.getItem('user'));
                userLocal.fullname = fullname;
                if(user.phone) userLocal.phone = user.phone;
                userLocal.birth = birth;
                userLocal.gender = gender;
                userLocal.address = address;
                localStorage.setItem('user',JSON.stringify(userLocal));
            } catch (error) {
                console.log(error);  
                if (error.response.data === 'Phone number already exists!') {
                    notifyError("Số điện thoại đã được đăng ký, vui lòng sử dụng số khác!")
                }else notifyError('Đã có lỗi xảy ra!');
            }
        }
    }
    return ( 
        <div className="card-body">
            {/* CHANGE PROFILE */}
                <div className="row gutters">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="fullName">Họ và Tên</label>
                <input 
                value={fullname} 
                type="text" 
                className="form-control" id="fullName" 
                onChange={(e)=>setFullName(e.target.value)}
                placeholder="Enter full name"/>
                </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="eMail">Email</label>
                <input type="email" 
                defaultValue={email}
                className="form-control" 
                disabled
                readOnly
                id="eMail" 
                placeholder="Enter email ID"/>
                </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input 
                type="text" 
                className="form-control" 
                id="phone" 
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                placeholder="Enter phone number"/>
                </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="birth">Ngày sinh</label>
                <input 
                type="date"
                value={birth}
                onChange={(e)=>setBirth(e.target.value)}
                className="form-control" 
                id="birth" 
                placeholder="Day of Birth"
                />
                </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                    <label htmlFor="gender">Giới tính</label>
                    <select 
                    value={gender}
                    onChange={(e)=>setGender(e.target.value)}
                    className="form-control" 
                    id="gender"
                    >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                    </select>
                </div>
                </div>
                </div>
                <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <h6 className="mt-3 mb-2 text-pink">Địa chỉ</h6>
                </div>
                {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="zIp">Tỉnh/Thành Phố</label>
                <input type="text" 
                value={city}
                onChange={(e)=>setCity(e.target.value)}
                className="form-control" 
                id="zIp" placeholder="Nhập tỉnh/thành phố"/>
                </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="sTate">Quận/Huyện</label>
                <input type="text" 
                value={district}
                onChange={(e)=>setDistrict(e.target.value)}
                className="form-control" 
                id="sTate" placeholder="Nhập quận/huyện"/>
                </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="ciTy">Phường/Xã</label>
                <input type="text"
                value={commune}
                onChange={(e)=>setCommune(e.target.value)} 
                className="form-control" id="ciTy" 
                placeholder="Nhập tên đường..."/>
                </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="Street">Địa chị cụ thể (Số nhà, tên đường, khu,...)</label>
                <input type="text" 
                value={detailAddress}
                onChange={(e)=>setDetailAddress(e.target.value)}
                className="form-control" 
                id="Street" placeholder="Nhập số nhà..."/>
                </div>
                </div> */}

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="Street">Tỉnh/Thành Phố</label>
                <select className="form-control"
                onChange={(e)=>handleChangeCity(e.target.value)}
                >
                <option>{city}</option>
                    {citys && citys.map((item)=>(
                        <option key={item.code} value={item.code}>{item.name}</option>
                    ))}
                </select>
                </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="Street">Quận/Huyện</label>
                <select className="form-control"
                onChange={(e)=>handleChangeDistrict(e.target.value)}
                >
                <option>{district}</option>
                    {districts && districts.map((item)=>(
                        <option key={item.code} value={item.code}>{item.name}</option>
                    ))}
                </select>
                </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="Street">Phường/Xã</label>
                <select className="form-control"
                onChange={(e)=>handleChangeCommunes(e.target.value)}
                >
                <option>{commune}</option>
                    {communes && communes.map((item)=>(
                        <option key={item.code} value={item.code}>{item.name}</option>
                    ))}
                </select>
                </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                <label htmlFor="Street">Địa chị cụ thể (Số nhà, tên đường, khu,...)</label>
                <input type="text" 
                value={detailAddress}
                onChange={(e)=>setDetailAddress(e.target.value)}
                className="form-control" 
                id="Street" placeholder="Nhập số nhà..."/>
                </div>
                </div>

                </div>
                <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="text-right">
                <button onClick={handleUpdateProfile} type="button" id="submit" name="submit" className="btn btn-success">Sửa thông tin</button>
                <button onClick={(e)=>{e.preventDefault();setDialogActive(false);}} type="button" id="submit" name="submit" className="btn btn-secondary">Thoát</button>
                </div>
                </div>
                </div>
            </div>
     );
}

export default ChangeProfile;