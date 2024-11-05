import React from 'react';
import F5Content from '../components/f5produnet/f5Content';

const ciudades = ["Quito", "Guayaquil"];


const F5Produnet: React.FC = () => {
  return (
    <>
      <F5Content ubicacion={ciudades} />
    </>
  );
};

export default F5Produnet;
