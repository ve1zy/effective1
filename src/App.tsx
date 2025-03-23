import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Routes from "./routes";

const App = () => {
  return (
    <div>
      <Header />
      <main>
        <Routes />
      </main>
      <Footer />
    </div>
  );
};

export default App;