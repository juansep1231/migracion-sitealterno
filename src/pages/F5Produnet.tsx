import React from 'react';
import F5Layout from '../components/f5produnet/f5Content'; // Asegúrate de que la ruta sea correcta
import F5Content from '../components/f5produnet/f5Content';

const Quito = "UIO";
const Guayaquil = "GYE";

const F5Produnet: React.FC = () => {
  return (
    <>
      <F5Content ubicacion={Guayaquil} /> {/* Usa el componente aquí */}
    </>
  );
};

export default F5Produnet;
