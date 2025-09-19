import { useState } from "react";
import { Link } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';

import DefaultLayout from "../../layout/default/DefaultLayout";
import axios from "axios";
import { api} from "../../../../api";
import Toast,{notifySuccess, notifyError} from "../../../../components/toast/Toast";

function AddTopic() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState(true);
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : '';
    });
    const headers = {
      token: `Bearer ${token}`,
      };
    const topic = {
        title: title,
        desc: desc,
        status: status,
    }
    const clearInput = () => {
        setTitle("");
        setDesc("");
        setStatus(false);
      }
    const handleAddTopic =  async(e) =>{
        e.preventDefault();
        if( !title ||!desc){
          notifyError("Thông tin không được để trống!");
        } else {
            console.log(topic);
            await axios.post(api +'/topic', topic, { headers })
            .then(response => {
              notifySuccess("Thêm topic thành công!");
                setTimeout(function() {
                    clearInput();
                  }, 2000);
            })
            .catch(error => {
            console.log(error);
            });
        }
    }
    return ( 
        <DefaultLayout>
        <div className="container-fluid pt-4 px-4">
            <div className="row">
            <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 id="titleTable" className="card-title text-dark upcase">Thêm Mới Banner</h4>
                    <p className="card-description"> Thêm mới banner cho website của bạn.</p>
                    <form onSubmit={handleAddTopic} className="forms-sample">
                    <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputName">Tên Banner</label>
                            <div className="col-sm-9">
                              <input 
                              type="text" 
                              id="inputName" 
                              value={title}
                              className="form-control" 
                              onChange={(e)=>setTitle(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputStatus">Hiển Thị Banner</label>
                            <div className="col-sm-9">
                            <button 
                            className={`toggle-btn ${status ? "active" : ""}`} 
                            onClick={(e) => {e.preventDefault(); setStatus(!status);}}>
                                <div className="slider"></div>
                            </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="form-group row">
                        <label htmlFor="inputDesc">Mô Tả Topic</label>
                        <textarea value={desc} 
                        onChange={(e)=>setDesc(e.target.value)}
                        className="form-control"
                        ></textarea>
                      </div>
                        </div>
                      </div>
                      <div className="action-form">
                          <button type="submit" className="btn btn-success">Thêm</button>
                          <Link to='/admin/product' className="btn btn-light">Cancel</Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <Toast/>
        </DefaultLayout>
     );
}

export default AddTopic;