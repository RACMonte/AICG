import React from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  return (
    <div>
      <h1>Inicio de sesión</h1>
      <div className="d-flex gap-2">
        <Link href="/my/profesor">
          <button type="button" className="btn btn-primary">Profesor</button>
        </Link>
        <Link href="/my/contraparte">
          <button type="button" className="btn btn-info">Contraparte</button>
        </Link>
        <Link href="/my/admin">
          <button type="button" className="btn btn-success">Administrador</button>
        </Link>
      </div>
    </div>
  );
}
