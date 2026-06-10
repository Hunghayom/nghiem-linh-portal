import React from 'react';
import { useAuth } from '../context/AuthContext';

function Sidebar({ activeTab, setActiveTab }) {
    const { currentUser, currentRole, logout } = useAuth();
    const isTeacher = currentRole === 'teacher';

    // Trích xuất ký tự viết tắt đầu tiên của tên người dùng để làm ảnh đại diện hình tròn hình học
    const userInitials = currentUser?.name
        ? currentUser.name.split(' ').pop().substring(0, 2).toUpperCase()
        : 'NL';

    return (
        <aside className="sidebar">
            {/* KHU VỰC GÓC BÊN TRÁI: HIỂN THỊ ẢNH VÀ TÊN NGƯỜI DÙNG THỰC TẾ ĐANG ĐĂNG NHẬP */}
            <div className="sidebar-brand-container" style={{ paddingBottom: '24px' }}>
                <div className="hanai-robot-avatar" style={{ border: '3px solid var(--primary)', backgroundColor: 'var(--primary-light)' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                        {userInitials}
                    </div>
                </div>
                <div className="robot-brand-text" style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px', wordBreak: 'break-word', padding: '0 8px' }}>
                    {currentUser?.name || 'Nghiêm Linh User'}
                </div>
                <div className="user-title-badge" style={{ marginTop: '8px' }}>
                    {currentRole === 'admin' && 'Quản trị viên'}
                    {currentRole === 'manager' && 'Quản lý'}
                    {currentRole === 'sales' && 'Chuyên viên Sale'}
                    {currentRole === 'teacher' && 'Giáo viên'}
                </div>
            </div>

            <nav className="sidebar-menu">
                <div className="menu-label">Giảng dạy</div>
                <div className={`menu-item ${activeTab === 'classes' ? 'active' : ''}`} onClick={() => setActiveTab('classes')}>
                    <i className="fa-solid fa-school"></i><span>Quản lý Lớp học</span>
                </div>
                <div className={`menu-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
                    <i className="fa-solid fa-square-poll-vertical"></i><span>BC Lớp</span>
                </div>
                <div className={`menu-item ${activeTab === 'my-class' ? 'active' : ''}`} onClick={() => setActiveTab('my-class')}>
                    <i className="fa-solid fa-chalkboard-user"></i><span>Lớp của tôi</span>
                </div>

                {!isTeacher && (
                    <>
                        <div className="menu-label">Quản lý trung tâm</div>

                        <div className={`menu-item ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>
                            <i className="fa-solid fa-user-group"></i><span>CRM & Khách hàng</span>
                        </div>
                        <div className={`menu-item ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>
                            <i className="fa-solid fa-chart-line"></i><span>Quản lý Sale</span>
                        </div>
                        <div className={`menu-item ${activeTab === 'care' ? 'active' : ''}`} onClick={() => setActiveTab('care')}>
                            <i className="fa-solid fa-heart-pulse"></i><span>Chăm sóc Học viên</span>
                        </div>
                        <div className={`menu-item ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>
                            <i className="fa-solid fa-user-tie"></i><span>Thông tin Giáo viên</span>
                        </div>

                        <div className={`menu-item ${activeTab === 'tas' ? 'active' : ''}`} onClick={() => setActiveTab('tas')}>
                            <i className="fa-solid fa-user-graduate"></i><span>Thông tin Trợ giảng</span>
                        </div>

                        <div className={`menu-item ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>
                            <i className="fa-solid fa-wallet"></i><span>Tài chính & Doanh thu</span>
                        </div>
                    </>
                )}
            </nav>

            <div className="sidebar-logout" onClick={logout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Đăng xuất</span>
            </div>
        </aside>
    );
}

export default Sidebar;