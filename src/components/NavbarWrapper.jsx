"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Show AdminNavbar if route starts with /admin
  const isAdmin = pathname.startsWith("/admin");

  return isAdmin ? <AdminNavbar /> : <Navbar />;
}
