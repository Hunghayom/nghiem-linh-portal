import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
});

export function DataProvider({ children }) {
    const [customers, setCustomers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [tas, setTas] = useState([]);
    const [classes, setClasses] = useState([]);

    // 1. Chỉ nạp dữ liệu TỪNG MỤC một lần duy nhất khi khởi tạo hệ thống (Có dependency array [] trống)
    useEffect(() => {
        // Nạp khách hàng CRM
        api.get('/customers')
            .then(res => setCustomers(res.data))
            .catch(() => console.log("Chưa thể nạp dữ liệu khách hàng."));

        // Nạp giáo viên
        api.get('/users/role/teacher')
            .then(res => setTeachers(res.data))
            .catch(() => {
                // Dự phòng nếu API role trả về cấu hình khác
                api.get('/users').then(res => setTeachers(res.data.filter(u => u.role === 'teacher'))).catch(() => {});
            });

        // Nạp lớp học
        api.get('/classes')
            .then(res => setClasses(res.data))
            .catch(() => console.log("Chưa thể nạp dữ liệu lớp học."));
    }, []);

    // 2. Các hàm thêm mới dữ liệu an toàn (Dùng callback để tránh lỗi lặp / mất dữ liệu cũ)
    const addCustomer = async (newCustomer) => {
        setCustomers(prev => [newCustomer, ...prev]);
        return { success: true };
    };

    const addTeacher = async (newTeacher) => {
        try {
            const res = await api.post('/auth/register', {
                ...newTeacher,
                username: newTeacher.phone,
                password: '123',
                role: 'teacher'
            });
            setTeachers(prev => [...prev, res.data]);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const addClass = (newClass) => {
        setClasses(prev => [newClass, ...prev]);
    };

    return (
        <DataContext.Provider value={{ 
            customers, 
            setCustomers, 
            addCustomer,
            teachers, 
            setTeachers, 
            addTeacher,
            classes, 
            setClasses, 
            addClass,
            tas,
            setTas
        }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData phải được đặt bên trong DataProvider');
    }
    return context;
};
