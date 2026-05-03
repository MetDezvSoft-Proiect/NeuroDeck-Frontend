import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onFileSelect }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => onFileSelect(acceptedFiles[0]),
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    return (
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <p>Trage PDF-ul aici sau dă click pentru selecție</p>
        </div>
    );
};

export default Dropzone;