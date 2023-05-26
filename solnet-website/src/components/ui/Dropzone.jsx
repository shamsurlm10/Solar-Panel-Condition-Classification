import PublishIcon from '@mui/icons-material/Publish';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './dropzone.module.css';

const Dropzone = ({ handleSelect }) => {
    const onDrop = useCallback((acceptedFiles) => {
        handleSelect(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div {...getRootProps()} className={styles.dropZoneContainer}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the image here ...</p>
            ) : (
                <div>
                    <p>
                        Drag and drop solar panel image here, or click to
                        select image
                    </p>
                    <PublishIcon className={styles.icon} />
                </div>
            )}
        </div>
    );
};

Dropzone.propTypes = {
    handleSelect: PropTypes.func.isRequired,
};

export default Dropzone;