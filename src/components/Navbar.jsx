export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">LOGO</div>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Shop</a>
        <a href="#">Categories</a>
        <a href="#">Blog</a>
        <a href="#">Contact</a>
      </div>

      <div className="nav-actions">
        <span>🔍</span>
        <span>🛒</span>
        <span>Login</span>
      </div>
    </nav>
  );
}