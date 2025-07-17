import React from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
export default function PaginaInicio() {
  return (
    <div>
      <h1>Pagina de Inicio</h1>
      <div className="d-flex gap-2">
        <Link href="/login">
          <button type="button" className="btn btn-primary">Inicio de Sesion</button>
        </Link>
      </div>
    </div>
  );
}