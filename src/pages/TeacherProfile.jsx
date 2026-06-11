import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
});

function TeacherProfile() {
    const { teachers, addTeacher, setTeachers } = useData();
    
    // --- STATE QUẢN LÝ ---
    const [formInput, setFormInput] = useState({ name: '', email: '', phone: '', experience: '', fee: '', address: '', status: 'Đang dạy' });
    const [editingTeacher, setEditingTeacher] = useState(null); // Quản lý object đang sửa
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);
    
    const [visibleColumns, setVisibleColumns] = useState({
        email: true, experience: true, fee: true, address: false, status: true
    });

    const optionalColumnsConfig = [
        { key: 'email', label: 'Email', icon: 'fa-envelope' },
        { key: 'experience', label: 'Kinh nghiệm', icon: 'fa-book' },
        { key: 'fee', label: 'Lương/Buổi', icon: 'fa-wallet' },
        { key: 'address', label: 'Địa chỉ', icon: 'fa-location-dot' },
        { key: 'status', label: 'Trạng thái', icon: 'fa-user-check' }
    ];

    // --- CÁC HÀM XỬ LÝ ---
    const toggleColumn = (key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));

    const handleInputChange = (e) => setFormInput({ ...formInput, [e.target.name]: e.target.value });

    // Lưu mới
    const handleSaveTeacher = async (e) => {
        e.preventDefault();
        if (!formInput.name || !formInput.phone) {
            alert('Vui lòng nhập Họ tên và Số điện thoại!');
            return;
        }
        const result = await addTeacher(formInput);
        if (result && result.success) {
            alert('Hệ thống: Lưu hồ sơ giáo viên thành công!');
            setFormInput({ name: '', email: '', phone: '', experience: '', fee: '', address: '', status: 'Đang dạy' });
        }
    };

    // Lưu chỉnh sửa
    const handleSaveEdit = async () => {
        try {
            await api.put(`/users/${editingTeacher.id}`, editingTeacher);
            setTeachers(teachers.map(t => t.id === editingTeacher.id ? editingTeacher : t));
            setEditingTeacher(null);
            alert('Hệ thống: Cập nhật thông tin thành công!');
        } catch (err) { 
            alert('Lỗi: Không thể cập nhật thông tin!'); 
        }
    };

    const handleDeleteTeacher = async (id) => {
        if (window.confirm('Cảnh báo: Bạn có chắc chắn muốn xóa giáo viên này?')) {
            try {
                await api.delete(`/users/${id}`);
                setTeachers(teachers.filter(t => t.id !== id));
                alert('Hệ thống: Đã xóa giáo viên!');
            } catch (err) { alert('Lỗi xóa dữ liệu!'); }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* 1. FORM TIẾP NHẬN */}
            <div className="card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '24px', color: 'var(--primary)', borderLeft: '4px solid var(--primary)', paddingLeft: '12px' }}>
                    <i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i> Tiếp nhận giáo viên
                </h3>
                <form onSubmit={handleSaveTeacher} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <input className="form-control" name="name" placeholder="Họ và tên" value={formInput.name} onChange={handleInputChange} required />
                    <input className="form-control" name="email" placeholder="Email" value={formInput.email} onChange={handleInputChange} />
                    <input className="form-control" name="phone" placeholder="Số điện thoại" value={formInput.phone} onChange={handleInputChange} required />
                    <div style={{ gridColumn: 'span 2' }}>
                        <input className="form-control" name="experience" placeholder="Học vấn & Kinh nghiệm" value={formInput.experience} onChange={handleInputChange} />
                    </div>
                    <input className="form-control" name="fee" placeholder="Lương/Buổi" value={formInput.fee} onChange={handleInputChange} />
                    <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>LƯU THÔNG TIN</button>
                </form>
            </div>

            {/* 2. BẢNG DỮ LIỆU CÓ CÔNG CỤ TÙY CHỈNH */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                
                {/* THANH CÔNG CỤ STICKY */}
                <div style={{ position: 'sticky', top: '0', zIndex: '20', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
                    <button type="button" onClick={() => setIsPanelExpanded(!isPanelExpanded)} style={{ background: isPanelExpanded ? '#4f46e5' : '#fff', color: isPanelExpanded ? '#fff' : '#4f46e5', border: '1px solid #4f46e5', padding: '6px 16px', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '0.8rem' }}>
                        {isPanelExpanded ? 'Đóng bảng chọn' : 'Tùy chỉnh cột'}
                    </button>
                    {isPanelExpanded && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '12px' }}>
                            {optionalColumnsConfig.map(col => (
                                <label key={col.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', backgroundColor: visibleColumns[col.key] ? '#eef2ff' : '#f8fafc', border: visibleColumns[col.key] ? '1px solid #4f46e5' : '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', color: visibleColumns[col.key] ? '#4f46e5' : '#475569' }}>
                                    <input type="checkbox" checked={visibleColumns[col.key]} onChange={() => toggleColumn(col.key)} />
                                    <i className={`fa-solid ${col.icon}`}></i> {col.label}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f8fafc', fontSize: '0.75rem', color: '#64748b' }}>
                            <tr>
                                <th style={{ padding: '16px 24px' }}>HỌ TÊN</th>
                                <th style={{ padding: '16px' }}>SĐT</th>
                                {visibleColumns.email && <th style={{ padding: '16px' }}>EMAIL</th>}
                                {visibleColumns.experience && <th style={{ padding: '16px' }}>KINH NGHIỆM</th>}
                                {visibleColumns.fee && <th style={{ padding: '16px' }}>LƯƠNG</th>}
                                {visibleColumns.address && <th style={{ padding: '16px' }}>ĐỊA CHỈ</th>}
                                {visibleColumns.status && <th style={{ padding: '16px' }}>TRẠNG THÁI</th>}
                                <th style={{ padding: '16px', textAlign: 'center' }}>THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers && teachers.map((t) => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        {editingTeacher?.id === t.id ? <input className="form-control" value={editingTeacher.name} onChange={e => setEditingTeacher({...editingTeacher, name: e.target.value})} /> : t.name}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        {editingTeacher?.id === t.id ? <input className="form-control" value={editingTeacher.phone} onChange={e => setEditingTeacher({...editingTeacher, phone: e.target.value})} /> : t.phone}
                                    </td>
                                    {visibleColumns.email && <td style={{ padding: '16px' }}>{editingTeacher?.id === t.id ? <input className="form-control" value={editingTeacher.email} onChange={e => setEditingTeacher({...editingTeacher, email: e.target.value})} /> : t.email}</td>}
                                    {visibleColumns.experience && <td style={{ padding: '16px' }}>{editingTeacher?.id === t.id ? <input className="form-control" value={editingTeacher.experience} onChange={e => setEditingTeacher({...editingTeacher, experience: e.target.value})} /> : t.experience}</td>}
                                    {visibleColumns.fee && <td style={{ padding: '16px' }}>{editingTeacher?.id === t.id ? <input className="form-control" value={editingTeacher.fee} onChange={e => setEditingTeacher({...editingTeacher, fee: e.target.value})} /> : t.fee}</td>}
                                    {visibleColumns.address && <td style={{ padding: '16px' }}>{editingTeacher?.id === t.id ? <input className="form-control" value={editingTeacher.address} onChange={e => setEditingTeacher({...editingTeacher, address: e.target.value})} /> : t.address}</td>}
                                    {visibleColumns.status && <td style={{ padding: '16px' }}>{editingTeacher?.id === t.id ? <input className="form-control" value={editingTeacher.status} onChange={e => setEditingTeacher({...editingTeacher, status: e.target.value})} /> : t.status}</td>}
                                    
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            {editingTeacher?.id === t.id ? (
                                                <button onClick={handleSaveEdit} style={{ border: 'none', background: 'none', color: '#22c55e', cursor: 'pointer' }}><i className="fa-solid fa-floppy-disk"></i></button>
                                            ) : (
                                                <button onClick={() => setEditingTeacher(t)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><i className="fa-solid fa-pen"></i></button>
                                            )}
                                            <button onClick={() => handleDeleteTeacher(t.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TeacherProfile;
