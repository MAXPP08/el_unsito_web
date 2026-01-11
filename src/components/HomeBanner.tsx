// src/components/HomeBanner.tsx (AJUSTADO)
import React from 'react';
import Image from 'next/image';

const HomeBanner = () => {
  return (
    // CAMBIO CLAVE: Quitamos mb-8 para eliminar el espacio excesivo
    <div className="relative w-full h-80 overflow-hidden"> 
      {/* Imagen de Fondo... */}
      <Image
        src="/banner1.jpg" 
        alt=""
        layout="fill"
        objectFit="cover"
        quality={80}
        priority 
        className="brightness-50"
      />
      
      {/* Contenido del Banner... */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4 z-10">
  {/* <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight">
    EL UNSITO
  </h1> */}

  {/* <p className="text-xl md:text-2xl font-semibold uppercase tracking-wider">
    NOTICIAS, AVISOS, CONVOCATORIAS, EVENTOS
  </p> */}
</div>

    </div>
  );
};

export default HomeBanner;