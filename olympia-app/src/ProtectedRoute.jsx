import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Busca la llave en el almacenamiento del navegador
    const isAuth = localStorage.getItem('olympia_token');

    // Si no hay llave, lo patea al Login
    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    // Si hay llave, lo deja pasar a la ruta que solicitó
    return <Outlet />;
};

export default ProtectedRoute;
