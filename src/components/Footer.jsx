export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white text-center py-4 mt-8">
      <p className="text-sm">
        © {new Date().getFullYear()} Result Hub | Designed by VIKTECHZ
      </p>
      <p className="text-xs text-gray-300">
        Disclaimer: This website provides information only. Verify official details from respective sites.
      </p>
    </footer>
  );
}
