import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../context/DataContext';

const api = axios.create({ baseURL: 'http://localhost:8081/api' });

function TeacherProfile() {
    const { teachers, addTeacher } = useData();

    const [formInput, setFormInput] = useState({
        name: '', experience: '', email: '', phone: '', address: '', salary: '', status: 'Đang dạy'
    });

    const [tas, setTas] = useState([]);
    const [taForm, setTaForm] = useState({ name: '', email: '', phone: '', education: '', level: '' });

    // Tải danh sách trợ giảng từ database
    useEffect(() => {
        api.get('/users/role/ta').then(res => setTas(res.data)).catch(console.error);
    }, []);

    const handleSaveTeacher = (e) => {
        e.preventDefault();
        addTeacher(formInput);
        setFormInput({ name: '', experience: '', email: '', phone: '', address: '', salary: '', status: 'Đang dạy' });
    };

    const handleSaveTA = async (e) => {
        e.preventDefault();
        try {
            // Gửi dữ liệu đăng ký trợ giảng vào bảng users
            const res = await api.post('/auth/register', {
                ...taForm, role: 'ta', username: taForm.phone, password: '123'
            });
            setTas([...tas, res.data]);
            setTaForm({ name: '', email: '', phone: '', education: '', level: '' });
            alert('Lưu thông tin Trợ giảng lên CSDL thành công!');
        } catch (error) {
            alert('Lỗi khởi tạo tài khoản TA!');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', color: 'var(--primary)' }}><i className="fa-solid fa-folder-plus"></i> Tiếp nhận giáo viên</h3>
                <form onSubmit={handleSaveTeacher} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div><label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Họ và tên</label><input type="text" className="form-control" value={formInput.name} onChange={(e) => setFormInput({ ...formInput, name: e.target.value })} required /></div>
                    <div><label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Lương (VNĐ) / Buổi</label><input type="number" className="form-control" value={formInput.salary} onChange={(e) => setFormInput({ ...formInput, salary: e.target.value })} required /></div>
                    <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px' }}>Lưu thông tin giáo viên</button>
                    </div>
                </form>
            </div>

            {/* BẢNG GIÁO VIÊN */}
            {/* ...(Giữ nguyên bảng dữ liệu teachers ánh xạ xuống UI như cũ)... */}

            <div className="card" style={{ padding: '24px', borderTop: '4px solid #10b981' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', color: '#10b981' }}><i className="fa-solid fa-user-graduate"></i> Tiếp nhận thông tin Trợ giảng (TA)</h3>
                <form onSubmit={handleSaveTA} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div><label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Họ & Tên</label><input type="text" className="form-control" value={taForm.name} onChange={(e) => setTaForm({ ...taForm, name: e.target.value })} required /></div>
                    <div><label style={{ fontSize: '0.8rem', fontWeight: '700' }}>SĐT (Dùng làm ID)</label><input type="text" className="form-control" value={taForm.phone} onChange={(e) => setTaForm({ ...taForm, phone: e.target.value })} required /></div>
                    <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button type="submit" className="btn" style={{ padding: '12px 32px', backgroundColor: '#10b981', color: 'white', borderRadius: '8px' }}>Lưu thông tin Trợ giảng</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TeacherProfile;