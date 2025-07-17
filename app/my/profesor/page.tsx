import Image from "next/image";
import Link from "next/link";

export default function VistaProfesor() {
  return (
    <>
      <h1>Bienvenido profesor</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Ingresar notas parcial MIC</h5>
          <p className="card-text">
            Notas correspondiente al modulo integrador de Auditoria e Ingeniería
            en control de gestión.
          </p>
          <Link href="/my/profesor/evaluaciones" className="btn btn-primary">
            Acceder
          </Link>
        </div>
      </div>
    </>
  );
}
