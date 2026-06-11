import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
});

function TeacherProfile() {
    const { teachers, addTeacher, setTeachers } = useData();
    const [formInput, setFormInput] = useState({ name: '', email: '', phone: '', experience: '', fee: '', address: '', status: 'Đang dạy' });
    
    // State cho tùy chỉnh cột
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({ email: true, experience: true, fee: true, address: false, status: true });
    const [editingTeacher, setEditingTeacher] = useState(null);

    const toggleColumn = (key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSaveTeacher = async (e) => {
        e.preventDefault();
        const result = await addTeacher(formInput);
        if (result && result.success) {
            alert('Hệ thống: Lưu hồ sơ giáo viên thành công!');
            setFormInput({ name: '', email: '', phone: '', experience: '', fee: '', address: '', status: 'Đang dạy' });
        }
    };

    const handleUpdateTeacher = async () => {
        try {
            await api.put(`/users/${editingTeacher.id}`, editingTeacher);
            setTeachers(teachers.map(t => t.id === editingTeacher.id ? editingTeacher : t));
            setEditingTeacher(null);
            alert('Cập nhật thông tin thành công!');
        } catch (err) { alert('Lỗi cập nhật!'); }
    };

    const handleDeleteTeacher = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
            try {
                await api.delete(`/users/${id}`);
                setTeachers(teachers.filter(t => t.id !== id));
                alert('Đã xóa giáo viên!');
            } catch (err) { alert('Lỗi xóa dữ liệu!'); }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* FORM TIẾP NHẬN (Giữ nguyên) */}
            <div className="card" style={{ padding: '32px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '24px', color: 'var(--primary)', borderLeft: '4px solid var(--primary)', paddingLeft: '12px' }}>
                    Tiếp nhận giáo viên
                </h3>
                <form onSubmit={handleSaveTeacher} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <input className="form-control" name="name" placeholder="Họ và tên" value={formInput.name} onChange={e => setFormInput({...formInput, name: e.target.value})} required />
                    <input className="form-control" name="email" placeholder="Email" value={formInput.email} onChange={e => setFormInput({...formInput, email: e.target.value})} />
                    <input className="form-control" name="phone" placeholder="Số điện thoại" value={formInput.phone} onChange={e => setFormInput({...formInput, phone: e.target.value})} required />
                    <div style={{ gridColumn: 'span 2' }}>
                        <input className="form-control" name="experience" placeholder="Học vấn & Kinh nghiệm" value={formInput.experience} onChange={e => setFormInput({...formInput, experience: e.target.value})} />
                    </div>
                    <input className="form-control" name="fee" placeholder="Học phí/buổi" value={formInput.fee} onChange={e => setFormInput({...formInput, fee: e.target.value})} />
                    <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>LƯU GIÁO VIÊN</button>
                </form>
            </div>

            {/* THANH TÙY CHỈNH CỘT (Sticky & Căn trái) */}
            <div style={{ position: 'sticky', top: '0', zIndex: '20', backgroundColor: '#ffffff', padding: '16px', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => setIsPanelExpanded(!isPanelExpanded)} style={{ background: isPanelExpanded ? '#4f46e5' : 'white', color: isPanelExpanded ? 'white' : '#4f46e5', border: '1px solid #4f46e5', padding: '6px 16px', borderRadius: '6px', fontWeight: '800', cursor: 'pointer' }}>
                        {isPanelExpanded ? 'Đóng bảng chọn' : 'Tùy chỉnh cột'}
                    </button>
                    {isPanelExpanded && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setVisibleColumns({email: true, experience: true, fee: true, address: true, status: true})} style={{ padding: '6px 12px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px' }}>Chọn tất cả</button>
                            <button onClick={() => setVisibleColumns({email: false, experience: false, fee: false, address: false, status: false})} style={{ padding: '6px 12px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px' }}>Bỏ chọn</button>
                        </div>
                    )}
                </div>
                {isPanelExpanded && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                        {Object.keys(visibleColumns).map(key => (
                            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', color: visibleColumns[key] ? '#4f46e5' : '#475569' }}>
                                <input type="checkbox" checked={visibleColumns[key]} onChange={() => toggleColumn(key)} />
                                {key.toUpperCase()}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', fontSize: '0.8rem', color: '#64748b', textAlign: 'left' }}>
                            <th style={{ padding: '16px' }}>STT</th>
                            <th style={{ padding: '16px' }}>HỌ TÊN</th>
                            <th style={{ padding: '16px' }}>SĐT</th>
                            {visibleColumns.email && <th style={{ padding: '16px' }}>EMAIL</th>}
                            {visibleColumns.experience && <th style={{ padding: '16px' }}>KINH NGHIỆM</th>}
                            {visibleColumns.fee && <th style={{ padding: '16px' }}>LƯƠNG/BUỔI</th>}
                            {visibleColumns.address && <th style={{ padding: '16px' }}>ĐỊA CHỈ</th>}
                            {visibleColumns.status && <th style={{ padding: '16px' }}>TRẠNG THÁI</th>}
                            <th style={{ padding: '16px', textAlign: 'center' }}>THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((t, idx) => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '16px' }}>{idx + 1}</td>
                                <td style={{ padding: '16px', fontWeight: '700' }}>
                                    {editingTeacher?.id === t.id ? <input value={editingTeacher.name} onChange={e => setEditingTeacher({...editingTeacher, name: e.target.value})} /> : t.name}
                                </td>
                                <td style={{ padding: '16px' }}>{t.phone}</td>
                                {visibleColumns.email && <td style={{ padding: '16px' }}>{t.email}</td>}
                                {visibleColumns.experience && <td style={{ padding: '16px' }}>{t.experience}</td>}
                                {visibleColumns.fee && <td style={{ padding: '16px' }}>{t.fee}</td>}
                                {visibleColumns.address && <td style={{ padding: '16px' }}>{t.address}</td>}
                                {visibleColumns.status && <td style={{ padding: '16px' }}>{t.status}</td>}
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    {editingTeacher?.id === t.id ? (
                                        <button onClick={handleUpdateTeacher} style={{ color: 'green', cursor: 'pointer', border: 'none', background: 'none' }}><i className="fa-solid fa-floppy-disk"></i></button>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            <button onClick={() => setEditingTeacher(t)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><i className="fa-solid fa-pen"></i></button>
                                            <button onClick={() => handleDeleteTeacher(t.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><i className="fa-solid fa-trash"></i></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TeacherProfile;
