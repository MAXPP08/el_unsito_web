// src/lib/storage-service.ts
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file: File): Promise<string> => {
  if (!file) throw new Error("No se proporcionó ningún archivo");

  // Creamos un nombre único
  const fileName = `publicaciones/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, fileName);

  // Subir
  await uploadBytes(storageRef, file);

  // Obtener URL
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};