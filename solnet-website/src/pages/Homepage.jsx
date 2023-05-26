import AutorenewIcon from '@mui/icons-material/Autorenew';
import ClearIcon from '@mui/icons-material/Clear';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import {
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import Dropzone from '../components/ui/Dropzone';

const Homepage = () => {
    const initialState = {
        image: '',
        lux: '',
        temp: '',
        time: 0,
    };
    const initialErrorState = {
        lux: '',
        temp: '',
        time: '',
        image: '',
    };
    const initialResultState = {
        label: '',
        power: 0,
    };

    const [state, setState] = useState(initialState);
    const [errorState, setErrorState] = useState(initialErrorState);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(initialResultState);

    const handleClearImage = () => {
        setState({
            ...state,
            image: '',
        });
    };

    const handleClearAll = () => {
        setState(initialState);
        setErrorState(initialErrorState);
        setIsLoading(false);
    };

    const validateEntries = () => {
        const lux = Number(state.lux);
        const temp = Number(state.temp);
        const time = Number(state.time);

        const ERROR_MSG = 'Invalid input. Please enter a valid number.';

        setErrorState({
            ...errorState,
            lux: lux ? '' : ERROR_MSG,
            temp: temp ? '' : ERROR_MSG,
            time: time ? '' : ERROR_MSG,
        });
    };

    const handleImageSelect = (file) => {
        if (!file) {
            return;
        }
        const ALLOWED_EXT = ['jpg', 'jpeg', 'png'];

        const fileNameArr = file.name.split('.');
        const fileExt = fileNameArr[fileNameArr.length - 1];

        if (!ALLOWED_EXT.includes(fileExt.toLowerCase())) {
            return;
        }

        setState({
            ...state,
            image: file,
        });
    };

    const resetAll = () => {
        setState(initialState);
        setErrorState(initialErrorState);
        setResult(initialResultState);
        setIsLoading(false);
    };

    const sendFile = () => {
        setIsLoading(true);
        validateEntries();

        if (!state.image) {
            setErrorState({
                ...errorState,
                image: 'Image is required',
            });
            setIsLoading(false);
            return;
        }

        if (state.lux && state.temp && state.time) {
            let formData = new FormData();
            formData.append('time', state.time);
            formData.append('lux', state.lux);
            formData.append('temp', state.temp);
            formData.append('file', state.image);

            const url = 'http://192.168.0.107:5000/predict';
            axios
                .post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => response.data)
                .then((data) => {
                    if (data.label === null) {
                        const error = new Error('Invalid inputs');
                        error.status = '400';
                        throw error;
                    }
                    setResult({
                        label: data.label,
                        power: data.power,
                    });
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error.message);
                    setIsLoading(false);
                });
        }
    };

    return (
        <>
            <div className="banner-img">
                <Container
                    maxWidth="xl"
                    style={{ minHeight: '250px', padding: '2rem' }}
                >
                    <Typography
                        variant="h1"
                        color="#fff"
                        fontFamily="Arial"
                        fontWeight="bold"
                    >
                        Predict power effortlessly with no risks involved.
                    </Typography>
                    <Grid container>
                        <Typography
                            variant="p"
                            color="#fff"
                            sx={{ maxWidth: '950px' }}
                        >
                            Upload an image of a solar panel and provide data on
                            lux, temperature, and time to determine whether the
                            panel is covered in dust, clean, has waterdrop, or
                            is in shadow and measure its power output.
                        </Typography>
                    </Grid>
                </Container>
            </div>
            <Container maxWidth="xl">
                {state.image && result.label ? (
                    <Container maxWidth="xl" style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                display: 'flex',
                                margin: '1.5rem',
                            }}
                        >
                            <img
                                src={URL.createObjectURL(state.image)}
                                alt="Image"
                                style={{
                                    height: '500px',
                                    marginLeft: 'auto',
                                }}
                            />
                            <div style={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 'bold',
                                        textTransform: 'capitalize',
                                        fontSize: '5rem',
                                        color: '#1565c0',
                                    }}
                                >
                                    {result.label}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        textTransform: 'capitalize',
                                        fontSize: '2.5rem',
                                    }}
                                >
                                    Power: {result.power}
                                </Typography>
                                <Button
                                    variant="text"
                                    color="error"
                                    size="large"
                                    onClick={resetAll}
                                    sx={{ paddingLeft: 15, paddingRight: 15 }}
                                >
                                    Reset Values
                                </Button>
                            </div>
                        </div>
                    </Container>
                ) : (
                    <Grid container style={{ marginTop: '1rem' }}>
                        <Grid
                            xl={6}
                            md={6}
                            sm={12}
                            xs={12}
                            sx={{ paddingRight: 2 }}
                        >
                            {state.image ? (
                                <>
                                    <Button
                                        variant="text"
                                        color="error"
                                        fullWidth
                                        sx={{ mb: 1 }}
                                        onClick={handleClearImage}
                                        disabled={isLoading}
                                    >
                                        <ClearIcon
                                            fontSize="small"
                                            sx={{ mr: 1 }}
                                        />
                                        <span>Clear Image</span>
                                    </Button>
                                    <div
                                        style={{
                                            textAlign: 'center',
                                        }}
                                    >
                                        <img
                                            src={URL.createObjectURL(
                                                state.image
                                            )}
                                            alt="Image"
                                            style={{
                                                height: '500px',
                                                marginLeft: 'auto',
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Dropzone
                                        handleSelect={handleImageSelect}
                                    />
                                    {errorState.image && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                paddingLeft: 2,
                                                color: '#D63F2F',
                                            }}
                                        >
                                            {errorState.image}
                                        </Typography>
                                    )}
                                </>
                            )}
                        </Grid>
                        <Grid
                            xl={6}
                            md={6}
                            sm={12}
                            xs={12}
                            sx={{ paddingLeft: 2 }}
                        >
                            <Stack spacing={2}>
                                <TextField
                                    required
                                    id="lux"
                                    label="LUX Value"
                                    variant="outlined"
                                    name="lux"
                                    value={state.lux}
                                    placeholder="Enter the LUX value"
                                    onChange={(e) => {
                                        setState({
                                            ...state,
                                            lux: e.target.value,
                                        });
                                    }}
                                    error={!!errorState.lux}
                                    helperText={errorState.lux}
                                />
                                <TextField
                                    required
                                    id="temp"
                                    label="Temperature"
                                    variant="outlined"
                                    name="temp"
                                    value={state.temp}
                                    placeholder="Enter the temperature"
                                    onChange={(e) => {
                                        setState({
                                            ...state,
                                            temp: e.target.value,
                                        });
                                    }}
                                    error={!!errorState.temp}
                                    helperText={errorState.temp}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="time-label-select">
                                        Time
                                    </InputLabel>
                                    <Select
                                        required
                                        labelId="time-label-select"
                                        id="time-select"
                                        value={state.time}
                                        label="Time"
                                        name="time"
                                        onChange={(e) => {
                                            setState({
                                                ...state,
                                                time: e.target.value,
                                            });
                                        }}
                                        error={!!errorState.time}
                                    >
                                        <MenuItem value={0} disabled>
                                            Select the time
                                        </MenuItem>
                                        <MenuItem value={1}>Morning</MenuItem>
                                        <MenuItem value={2}>Noon</MenuItem>
                                        <MenuItem value={3}>Afternoon</MenuItem>
                                    </Select>
                                    {errorState.time && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                paddingLeft: 2,
                                                color: '#D63F2F',
                                            }}
                                        >
                                            {errorState.time}
                                        </Typography>
                                    )}
                                </FormControl>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    {isLoading ? (
                                        <Button variant="contained" disabled>
                                            <AutorenewIcon
                                                fontSize="small"
                                                sx={{ mr: 1 }}
                                            />
                                            <span>Processing</span>
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={sendFile}
                                        >
                                            <TaskAltIcon
                                                fontSize="small"
                                                sx={{ mr: 1 }}
                                            />
                                            <span>Submit</span>
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        onClick={handleClearAll}
                                        disabled={isLoading}
                                    >
                                        <ClearIcon
                                            fontSize="small"
                                            sx={{ mr: 1 }}
                                        />
                                        <span>Clear</span>
                                    </Button>
                                </div>
                            </Stack>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </>
    );
};

export default Homepage;
