import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
});

function TeacherProfile() {
    const { teachers, addTeacher } = useData();

    // Khởi tạo state cho form tiếp nhận giáo viên
    const [formInput, setFormInput] = useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        fee: '',
        address: '',
        status: 'Đang dạy'
    });

    // Hàm xử lý thay đổi dữ liệu trong form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormInput(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm xử lý khi bấm Lưu thông tin
    const handleSaveTeacher = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu đầu vào
        if (!formInput.name || !formInput.phone) {
            alert('Hệ thống: Vui lòng nhập đầy đủ Họ tên và Số điện thoại của giáo viên!');
            return;
        }

        try {
            // Gọi hàm addTeacher từ DataContext (đã xử lý logic API ở file DataContext.jsx)
            const result = await addTeacher({
                ...formInput,
                role: 'teacher',
                username: formInput.phone,
                password: '123456'
            });

            if (result && result.success) {
                alert('Hệ thống: Lưu thông tin hồ sơ giáo viên thành công vào cơ sở dữ liệu!');
                // Reset form sau khi lưu thành công
                setFormInput({
                    name: '', email: '', phone: '', experience: '', fee: '', address: '', status: 'Đang dạy'
                });
            } else {
                alert('Lỗi hệ thống: Không thể lưu thông tin giáo viên. Vui lòng kiểm tra lại kết nối hoặc thông tin SĐT!');
            }
        } catch (error) {
            console.error("Lỗi khi gọi API lưu giáo viên:", error);
            alert('Lỗi nghiêm trọng: Có sự cố khi kết nối tới Server.');
        }
    };

    // Hàm xử lý xóa giáo viên
    const handleDeleteTeacher = async (id) => {
        // Hộp thoại xác nhận trước khi xóa
        if (window.confirm('Cảnh báo: Bạn có chắc chắn muốn xóa giáo viên này khỏi hệ thống không? Hành động này không thể hoàn tác.')) {
            try {
                await api.delete(`/users/${id}`);
                alert('Hệ thống: Đã xóa thông tin giáo viên thành công!');
                // Tải lại trang để cập nhật danh sách (hoặc có thể dùng setTeachers từ context)
                window.location.reload();
            } catch (error) {
                console.error("Lỗi khi xóa giáo viên:", error);
                alert('Lỗi: Không thể xóa giáo viên. Vui lòng đảm bảo Backend đã có API DELETE /users/{id}');
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', animation: 'fadeIn 0.3s ease-out' }}>

            {/* TIÊU ĐỀ TRANG */}
            <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>Thông tin Giáo viên</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Quản lý thông tin cơ bản, học vấn và trạng thái công tác của nhân sự</p>
            </div>

            {/* PHẦN 1: FORM TIẾP NHẬN GIÁO VIÊN */}
            <div className="card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '24px', color: 'var(--primary)', borderLeft: '4px solid var(--primary)', paddingLeft: '12px' }}>
                    <i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i> Tiếp nhận giáo viên / Nhập thông tin nhân sự
                </h3>

                <form onSubmit={handleSaveTeacher} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div>
                        <label className="form-label">Họ và tên (*)</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Ví dụ: Điệp Mạnh"
                            value={formInput.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label">Email cá nhân</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="teacher@nghiemlinh.edu.vn"
                            value={formInput.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="form-label">Số điện thoại (*)</label>
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            placeholder="09xxxxxxxx"
                            value={formInput.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Học vấn & Kinh nghiệm giảng dạy</label>
                        <input
                            type="text"
                            name="experience"
                            className="form-control"
                            placeholder="Chứng chỉ HSK, thâm niên dạy..."
                            value={formInput.experience}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="form-label">Mức học phí (VNĐ) / Buổi dạy</label>
                        <input
                            type="number"
                            name="fee"
                            className="form-control"
                            placeholder="350000"
                            value={formInput.fee}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Nơi ở hiện tại (CCCD)</label>
                        <input
                            type="text"
                            name="address"
                            className="form-control"
                            placeholder="Địa chỉ thường trú..."
                            value={formInput.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="form-label">Trạng thái nhân sự</label>
                        <select name="status" className="form-control" value={formInput.status} onChange={handleInputChange}>
                            <option value="Đang dạy">Đang dạy</option>
                            <option value="Tạm nghỉ">Tạm nghỉ</option>
                            <option value="Đã nghỉ">Đã nghỉ</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '14px 40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
                            LƯU THÔNG TIN GIÁO VIÊN
                        </button>
                    </div>
                </form>
            </div>

            {/* PHẦN 2: BẢNG DANH SÁCH GIÁO VIÊN */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                        <i className="fa-solid fa-table-list" style={{ marginRight: '8px' }}></i> Bảng hiển thị thông tin nhân sự giáo viên chi tiết
                    </h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'white', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            <tr>
                                <th style={{ padding: '16px 24px' }}>STT</th>
                                <th>Tên Họ và Tên</th>
                                <th>Học vấn và kinh nghiệm</th>
                                <th>Học phí / Buổi</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers && teachers.map((t, index) => (
                                <tr key={t.id || index} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: '700' }}>{index + 1}</td>
                                    <td>
                                        <strong style={{ color: '#1e3a8a', display: 'block', fontSize: '0.95rem' }}>{t.name}</strong>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.email || 'No Email'} | <i className="fa-solid fa-phone" style={{ fontSize: '0.7rem' }}></i> {t.phone}</span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '300px' }}>{t.experience || 'Chưa cập nhật'}</td>
                                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                                        {t.fee ? `${parseInt(t.fee).toLocaleString('vi-VN')} VND` : '350.000 VND'}
                                    </td>
                                    <td>
                                        <span style={{
                                            backgroundColor: t.status === 'Đang dạy' ? '#dcfce7' : '#fee2e2',
                                            color: t.status === 'Đang dạy' ? '#166534' : '#b91c1c',
                                            padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800'
                                        }}>
                                            {t.status || 'Đang dạy'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            <button title="Chỉnh sửa" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#475569' }}>
                                                <i className="fa-solid fa-pen" style={{ fontSize: '0.8rem' }}></i>
                                            </button>
                                            <button
                                                title="Xóa nhân sự"
                                                onClick={() => handleDeleteTeacher(t.id)}
                                                style={{ background: '#fee2e2', border: '1px solid #fecaca', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#b91c1c' }}
                                            >
                                                <i className="fa-solid fa-trash" style={{ fontSize: '0.8rem' }}></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!teachers || teachers.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        <i className="fa-solid fa-inbox" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
                        Chưa có dữ liệu giáo viên trong hệ thống.
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeacherProfile;
