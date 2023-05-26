import { Route, Routes } from 'react-router-dom';
import styles from './app.module.css';
import Footer from './components/ui/Footer';
import Navbar from './components/ui/Navbar.jsx';
import Homepage from './pages/Homepage.jsx';

const App = () => {
    return (
        <div className="App">
            <Navbar />
            <div className={styles.mainBody}>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
};

export default App;

