import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, HelpCircle, Info, Globe } from 'lucide-react';
import OlympiaLogo from './assets/olympia_logo.png';

const LoginPage = () => {
const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Función para manejar los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí ya verás los datos reales en la consola
        console.log('Iniciando sesión con:', formData);
        
	navigate('/admin');
        
    };

    return (
        <div
            className="min-h-screen flex flex-col bg-gray-100 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2076&auto=format&fit=crop")' }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <header className="relative z-10 flex justify-between items-center p-4 bg-white/90 shadow-sm">
                <div className="flex items-center gap-2">
                    <img src={OlympiaLogo} alt="Olympia Logo" className="h-10 w-auto object-contain" />
                    <span className="font-bold text-xl text-blue-900 tracking-wider">OLYMPIA</span>
                </div>
                <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
                    <button className="hover:text-blue-600 flex items-center gap-1"><HelpCircle size={16}/> Ayuda</button>
                    <button className="hover:text-blue-600 flex items-center gap-1"><Info size={16}/> Sobre Nosotros</button>
                    <button className="hover:text-blue-600 flex items-center gap-1"><Globe size={16}/> Idiomas</button>
                </nav>
            </header>

            <main className="relative z-10 flex-grow flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <div className="flex flex-col items-center mb-6">
                        <img src={OlympiaLogo} alt="Olympia Logo Central" className="h-24 w-auto mb-3 object-contain" />
                        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">INICIAR SESIÓN</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="tuemail@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 transition-colors">
                            INICIAR SESIÓN
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative flex justify-center text-sm border-t border-gray-300 pt-4">
                            <span className="px-2 bg-white text-gray-500 absolute -top-3">O ingresa con:</span>
                        </div>
                        <div className="mt-4 flex justify-center gap-4">
                            <button className="bg-white border border-gray-300 p-2 rounded-full hover:bg-gray-50 shadow-sm">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-6 w-6" alt="Google"/>
                            </button>
                            <button className="bg-white border border-gray-300 p-2 rounded-full hover:bg-gray-50 shadow-sm">
                                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="h-6 w-6" alt="Facebook"/>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;