import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Button, Container, Divider, Grid, Typography } from '@mui/material';
import styles from './footer.module.css';

const Footer = () => {
    return (
        <div className={styles.footerHolder}>
            <Container maxWidth="xl" sx={{ padding: 4 }}>
                <Grid container>
                    <Grid md={6}>
                        <Typography variant="p" color="#333">
                            <strong>Solar Panel Power Prediction</strong>
                            <Typography
                                variant="h6"
                                style={{ fontSize: '0.8rem' }}
                            >
                                Supervisor: Dr Md. Sawkat Ali
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid md={6}>
                        <div className={styles.aboutUs}>
                            <Typography fontWeight="bold">ABOUT US</Typography>
                            <Divider sx={{ marginBottom: 1 }} />
                            <Button
                                variant="text"
                                href="https://www.linkedin.com/in/shamsurlm10/"
                                target="_blank"
                            >
                                <LinkedInIcon
                                    fontSize="small"
                                    sx={{ marginRight: 1 }}
                                />
                                <span>Md. Shamsur Rahman</span>
                            </Button>
                            <Button
                                variant="text"
                                href="https://www.linkedin.com/in/anmol-sara-7044b0221/"
                                target="_blank"
                            >
                                <LinkedInIcon
                                    fontSize="small"
                                    sx={{ marginRight: 1 }}
                                />
                                <span>Anika Anmol Sara</span>
                            </Button>
                            <Button
                                variant="text"
                                href="https://www.linkedin.com/in/fahria-khan-niti/"
                                target="_blank"
                            >
                                <LinkedInIcon
                                    fontSize="small"
                                    sx={{ marginRight: 1 }}
                                />
                                <span>Fahria Khan Niti</span>
                            </Button>
                            <Button variant="text" href="#" target="_blank">
                                <LinkedInIcon
                                    fontSize="small"
                                    sx={{ marginRight: 1 }}
                                />
                                <span>Oshin Rahman</span>
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Footer;
