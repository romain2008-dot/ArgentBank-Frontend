import Features from "../../components/Features/Features";
import "./Home.css";

function Home() {
  return (
    <main>
      <div className="banner">
        <section className="banner-content">
          <h2 className="sr-only">Promoted Content</h2>
          <p className="subtitle">No fees.</p>
          <p className="subtitle">No minimum deposit.</p>
          <p className="subtitle">High interest rates.</p>
          <p className="text">Open a savings account with Argent Bank today!</p>
        </section>
      </div>
      <Features />
    </main>
  );
}

export default Home;
