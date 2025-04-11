import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Routes from "./routes";
import styles from "./App.module.scss";

const App = () => {
  return (
    <div className={styles.appContainer}>
      <Header />
      <main className={styles.mainContent}>
        <Routes />
      </main>
      <Footer />
    </div>
  );
};

export default App;
