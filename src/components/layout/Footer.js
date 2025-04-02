const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-700/30 bg-slate-800 p-4 text-center text-sm text-slate-400 w-full">
      <p>
        © {new Date().getFullYear()} Setflow 자산관리 시스템. 모든 권리 보유.
      </p>
    </footer>
  );
};

export default Footer;
