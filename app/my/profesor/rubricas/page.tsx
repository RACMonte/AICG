import RubricasImg from "app/resources/Rubricas.jpg";
import Link from "next/link";
const cardstyle = {
  width: "18rem",
};
export default function Modulos() {
  return (
    <>
      <div className="card" style={cardstyle}>
        <img src={RubricasImg.src} className="card-img-top" alt="" />
        <div className="card-body">
          <h5 className="card-title">Rubrica modulo MDIC</h5>
          <p className="card-text">
            Rubrica sobre el informe de practica de modulos de desempeño
          </p>
          <Link href="#" className="btn btn-primary">
            Abrir
          </Link>
        </div>
        <div className="card" style={cardstyle}>
          <div className="card-body">
            <h5 className="card-title">Subir Rúbrica</h5>
            <p className="card-text">Selecciona la rubrica que quieres subir</p>
            <Link href="#" className="btn btn-primary">
              Subir
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
