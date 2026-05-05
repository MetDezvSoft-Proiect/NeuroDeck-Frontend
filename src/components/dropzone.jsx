import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onFileSelect, hasFile }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) onFileSelect(acceptedFiles[0]);
    },
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''} ${hasFile ? 'has-file' : ''}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="drop-msg">🎯 Lasă PDF-ul aici!</p>
      ) : hasFile ? (
        <p className="drop-msg">✅ Fișier selectat. Trage altul pentru a înlocui.</p>
      ) : (
        <>
          <div className="drop-icon">📄</div>
          <p className="drop-msg">Trage PDF-ul <strong>aici</strong></p>
          <p className="drop-sub">sau dă click pentru a selecta fișierul</p>
        </>
      )}
    </div>
  );
};

export default Dropzone;
