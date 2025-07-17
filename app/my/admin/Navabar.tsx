'use client'
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

const NavbarP = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "General", href: "/my/admin/evaluaciones" },
    { label: "Rubricas", href: "/my/admin/rubricas" },
    { label: "Modulos", href: "/my/admin/modulos" },
    { label: "Evidencias", href: "/my/admin/evidencias" },
    { label: "Cerrar Sesión", href: "/login" },
  ];

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" href="#">GEM</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li className="nav-item" key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive ? "active disabled text-secondary" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    aria-disabled={isActive}
                    tabIndex={isActive ? -1 : 0}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarP;
