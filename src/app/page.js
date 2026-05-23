export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <h1>
          ADVANCED RESEARCH <span>PEPTIDES</span>
        </h1>
        <p>Premium Quality. For Research Purposes Only.</p>

        <div className="buttons">
          <button className="btn-primary">Shop Now</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </section>

      <section className="products">
        <h2>Featured Peptides</h2>
        <div className="grid">
          <div className="card">Product 1</div>
          <div className="card">Product 2</div>
          <div className="card">Product 3</div>
        </div>
      </section>
    </main>
  );
}