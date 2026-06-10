import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, ShieldAlert, ArrowLeft } from 'lucide-react';

const FormPersonal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: '',
    rol: '2' // 2 = Promover a Organizador, 4 = Revocar a Capitán
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCargando(true);

    try {
      const resp = await fetch("http://localhost/olympia-backend/usuarios/guardar_colaborador.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dni: formData.dni,
          rol: formData.rol
        })
      });
      const res = await resp.json();

      if (res.status === "success") {
        setSuccess(
          formData.rol === '2'
            ? `¡Usuario con DNI ${formData.dni} promovido a Organizador con éxito!`
            : `¡Privilegios revocados con éxito para el DNI ${formData.dni} (restablecido a Capitán)!`
        );
        setFormData({ dni: '', rol: '2' });
      } else {
        setError(res.mensaje || "Error al procesar la solicitud.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor PHP.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

      {/* Botón de volver inteligente */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver</span>
      </button>

      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-md relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-orange-500/10 p-3.5 rounded-2xl border border-orange-500/20 text-orange-400 mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent uppercase tracking-tight">
            Gestión de Privilegios
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            Promueve a un capitán registrado al rol de Organizador del sistema, o revoca sus privilegios para regresarlo a Capitán.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              DNI del Usuario
            </label>
            <input
              type="number"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
              placeholder="Ej. 33333333"
              className="block w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-100 text-xs transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Acción a Realizar
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-200 text-xs cursor-pointer bg-no-repeat bg-right"
            >
              <option value="2">Promover a Organizador</option>
              <option value="4">Revocar a Capitán (Quitar Privilegios)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/10 active:scale-[0.98] transition-all disabled:opacity-55"
          >
            {cargando ? 'Procesando...' : 'Aplicar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPersonal;
