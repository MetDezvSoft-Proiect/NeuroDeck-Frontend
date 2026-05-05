import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onFilesSelect, files }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        // Adăugăm fișierele noi peste cele deja selectate anterior
        onFilesSelect((prevFiles) => [...prevFiles, ...acceptedFiles]);
      }
    },
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true, // Permite mai multe documente simultan
    noClick: false,
    noKeyboard: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''} ${files.length > 0 ? 'has-file' : ''}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="drop-msg">🎯 Lasă PDF-urile aici!</p>
      ) : (
        <>
          <div className="drop-icon">📄</div>
          <p className="drop-msg">Trage unul sau mai multe PDF-uri <strong>aici</strong></p>
          <p className="drop-sub">sau dă click pentru a selecta fișierele</p>
        </>
      )}
    </div>
  );
};

export default Dropzone;