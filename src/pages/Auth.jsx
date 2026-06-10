import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Auth() {
    const { login, register, resetPassword } = useAuth();
    const [authMode, setAuthMode] = useState('login');
    const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'teacher' });
    const [errorMsg, setErrorMsg] = useState('');

    // State đếm ngược 5 giây
    const [countdown, setCountdown] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (authMode === 'login') {
            const res = await login(formData.username, formData.password);
            if (!res.success) setErrorMsg(res.message);
        }
        else if (authMode === 'register') {
            if (!formData.username || !formData.password || !formData.name) {
                return setErrorMsg('Vui lòng hoàn thiện đầy đủ Họ tên, Tên đăng nhập và Mật khẩu!');
            }

            const res = await register(formData.name, formData.username, formData.password, formData.role);
            if (res.success) {
                // Kích hoạt hiệu ứng đếm ngược 5 giây
                setCountdown(5);
            } else {
                setErrorMsg(res.message);
            }
        }
        else if (authMode === 'forgot') {
            const res = await resetPassword(formData.username);
            if (res.success) {
                alert(res.message);
                setAuthMode('login');
            } else {
                setErrorMsg(res.message);
            }
        }
    };

    // Hook xử lý đếm ngược thời gian chuyển trang
    useEffect(() => {
        if (countdown === null) return;

        if (countdown === 0) {
            setAuthMode('login');
            setCountdown(null);
            setFormData({ name: '', username: '', password: '', role: 'teacher' });
            return;
        }

        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '40px', boxShadow: 'var(--shadow-lg)', backgroundColor: 'white', borderRadius: '16px' }}>

                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>Ngoại ngữ Nghiêm Linh</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
                        {authMode === 'login' ? 'Đăng nhập cổng quản trị & giảng dạy trung tâm' : authMode === 'register' ? 'Đăng ký tài khoản nhân sự / phân quyền mới' : 'Khôi phục mật khẩu tài khoản nhân sự'}
                    </p>
                </div>

                {countdown !== null ? (
                    <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--success)', fontWeight: '800', marginBottom: '12px' }}>Đăng ký thành công!</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tài khoản của bạn đã được khởi tạo trên hệ thống.</p>
                        <p style={{ color: 'var(--primary)', fontWeight: '700', marginTop: '16px' }}>Tự động chuyển về trang Đăng nhập sau {countdown} giây...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {errorMsg && (
                            <div style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger-text)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', textAlign: 'center', border: '1px solid rgba(239,68,68,0.15)' }}>
                                {errorMsg}
                            </div>
                        )}

                        {authMode === 'register' && (
                            <>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>CHỨC VỤ / VAI TRÒ HỆ THỐNG (*)</label>
                                    <select name="role" className="form-control" value={formData.role} onChange={handleInputChange} style={{ fontWeight: '600' }}>
                                        <option value="teacher">Giáo viên (Teacher Portal)</option>
                                        <option value="sales">Chuyên viên Tư vấn (Sales)</option>
                                        <option value="manager">Quản lý Phân hệ</option>
                                        {/* Đã xóa vai trò Admin khỏi mục đăng ký theo yêu cầu */}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>HỌ VÀ TÊN (*)</label>
                                    <input type="text" name="name" className="form-control" placeholder="Ví dụ: Đoàn Đăng Khoa" value={formData.name} onChange={handleInputChange} />
                                </div>
                            </>
                        )}

                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>TÊN ĐĂNG NHẬP (*)</label>
                            <input type="text" name="username" className="form-control" placeholder="Nhập ID tài khoản nhân sự" value={formData.username} onChange={handleInputChange} required />
                        </div>

                        {authMode !== 'forgot' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>MẬT KHẨU (*)</label>
                                    {authMode === 'login' && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }} onClick={() => { setAuthMode('forgot'); setErrorMsg(''); }}>Quên mật khẩu?</span>
                                    )}
                                </div>
                                <input type="password" name="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ padding: '14px', marginTop: '10px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', letterSpacing: '0.02em' }}>
                            {authMode === 'login' ? 'XÁC NHẬN ĐĂNG NHẬP' : authMode === 'register' ? 'HOÀN TẤT ĐĂNG KÝ' : 'YÊU CẦU CẤP LẠI MẬT KHẨU'}
                        </button>
                    </form>
                )}

                {countdown === null && (
                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        {authMode === 'login' ? (
                            <span>Nhân sự mới? <strong style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }} onClick={() => { setAuthMode('register'); setErrorMsg(''); }}>Đăng ký tài khoản tại đây</strong></span>
                        ) : (
                            <span>Quay lại cổng làm việc? <strong style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }} onClick={() => { setAuthMode('login'); setErrorMsg(''); }}>Đăng nhập</strong></span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Auth;