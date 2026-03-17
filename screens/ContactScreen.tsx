import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { whatsAppUrl } from '../src/lib/whatsapp';

const CATEGORIAS = ['Liga 1', 'Liga 2', 'Liga 3', 'Liga 4'] as const;
const TIPOS_CONSULTA = [
  'Inscripción a torneo',
  'Consulta general',
  'Problema con ranking',
  'Otro',
] as const;

const CONTACT_EMAIL = 'contacto@greektennis.com';
const SEDES = ['Club Greek Tennis – Sede Central', 'Sede Norte', 'Sede Sur'];

const inputBase =
  'w-full rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[#111318] dark:text-white placeholder:text-[#616f89] dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all px-4 py-3 text-sm';

interface ContactScreenProps {
  setScreen?: (screen: string) => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipoConsulta, setTipoConsulta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = [
    nombre && `Nombre: ${nombre}`,
    email && `Email: ${email}`,
    telefono && `Tel: ${telefono}`,
    categoria && `Categoría: ${categoria}`,
    tipoConsulta && `Consulta: ${tipoConsulta}`,
    mensaje && `Mensaje: ${mensaje}`,
  ]
    .filter(Boolean)
    .join('\n') || 'Hola, quisiera hacer una consulta.';

  return (
    <div className="px-4 md:px-10 lg:px-40 flex justify-center py-8 flex-grow">
      <div className="w-full max-w-[640px] flex flex-col gap-8">
        {/* Header */}
        <section className="text-center md:text-left">
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111318] dark:text-white">
            Contacto
          </h1>
          <p className="mt-2 text-[#616f89] dark:text-gray-400 text-base">
            ¿Querés sumarte a un torneo o tenés alguna consulta?
          </p>
        </section>

        {/* Form card */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            {submitted ? (
              <div className="py-8 text-center">
                <p className="text-lg font-semibold text-[#111318] dark:text-white">
                  Tu consulta fue enviada correctamente. Te responderemos a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="contact-nombre" className="block text-sm font-semibold text-[#111318] dark:text-white mb-1.5">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-nombre"
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={inputBase}
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-[#111318] dark:text-white mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputBase}
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-telefono" className="block text-sm font-semibold text-[#111318] dark:text-white mb-1.5">
                    Teléfono <span className="text-[#616f89] dark:text-gray-500 text-xs font-normal">(opcional)</span>
                  </label>
                  <input
                    id="contact-telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className={inputBase}
                    placeholder="+54 11 1234-5678"
                  />
                </div>
                <div>
                  <label htmlFor="contact-categoria" className="block text-sm font-semibold text-[#111318] dark:text-white mb-1.5">
                    Categoría
                  </label>
                  <select
                    id="contact-categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className={inputBase}
                  >
                    <option value="">Seleccionar liga</option>
                    {CATEGORIAS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-tipo" className="block text-sm font-semibold text-[#111318] dark:text-white mb-1.5">
                    Tipo de consulta
                  </label>
                  <select
                    id="contact-tipo"
                    value={tipoConsulta}
                    onChange={(e) => setTipoConsulta(e.target.value)}
                    className={inputBase}
                  >
                    <option value="">Seleccionar</option>
                    {TIPOS_CONSULTA.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-mensaje" className="block text-sm font-semibold text-[#111318] dark:text-white mb-1.5">
                    Mensaje
                  </label>
                  <textarea
                    id="contact-mensaje"
                    rows={4}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className={`${inputBase} resize-y min-h-[100px]`}
                    placeholder="Escribí tu consulta..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl py-3.5 px-4 bg-primary hover:bg-primary-hover text-white font-bold text-base transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                >
                  Enviar consulta
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Extra contact options */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[#111318] dark:text-white">
            O contactanos directo
          </h2>

          {/* WhatsApp — destacado */}
          <a
            href={whatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full rounded-xl border-2 border-green-500 dark:border-green-500 bg-green-500/10 dark:bg-green-500/10 hover:bg-green-500/20 dark:hover:bg-green-500/20 p-4 transition-colors"
          >
            <div className="flex items-center justify-center size-12 rounded-full bg-green-500 text-white shrink-0">
              <MessageCircle className="w-6 h-6" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#111318] dark:text-white">WhatsApp</p>
              <p className="text-sm text-[#616f89] dark:text-gray-400">Escribinos y te respondemos al instante</p>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-4 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-4 transition-colors"
          >
            <div className="flex items-center justify-center size-12 rounded-full bg-gray-200 dark:bg-gray-700 text-[#616f89] dark:text-gray-400 shrink-0">
              <Mail className="w-6 h-6" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#111318] dark:text-white">Email</p>
              <p className="text-sm text-primary break-all">{CONTACT_EMAIL}</p>
            </div>
          </a>

          {/* Sedes */}
          <div className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center size-12 rounded-full bg-gray-200 dark:bg-gray-700 text-[#616f89] dark:text-gray-400 shrink-0">
                <MapPin className="w-6 h-6" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#111318] dark:text-white mb-2">Sedes</p>
                <ul className="space-y-1 text-sm text-[#616f89] dark:text-gray-400">
                  {SEDES.map((sede) => (
                    <li key={sede}>{sede}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
