import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

export interface Pedido {
  id: string;
  texto: string;
  estado?: "pendiente" | "en-cocina" | "listo" | "entregado";
  creado: any;
}

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const q = query(collection(db, "pedidos"), orderBy("creado", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Pedido[];
      setPedidos(datos);
    });
    return () => unsubscribe();
  }, []);

  async function agregarPedido(texto: string) {
    await addDoc(collection(db, "pedidos"), {
      texto,
      estado: "pendiente",
      creado: serverTimestamp(),
    });
  }

  async function actualizarEstado(id: string, nuevoEstado: Pedido["estado"]) {
    const ref = doc(db, "pedidos", id);
    await updateDoc(ref, { estado: nuevoEstado });
  }

  return { pedidos, agregarPedido, actualizarEstado };
}
