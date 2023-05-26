import SolarPowerIcon from '@mui/icons-material/SolarPower';
import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './navbar.module.css';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="sticky" className={styles.navbar}>
            <Container maxWidth="xl">
                <Toolbar onClick={() => navigate('/')}
                        sx={{ flexGrow: 1, cursor: 'pointer' }}>
                        <SolarPowerIcon sx={{ mr: 1 }} />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            Solar Panel Power Prediction
                        </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
