import React, { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ currentImage, onImageChange, label = "Foto de Perfil" }) => {
  const [preview, setPreview] = useState(currentImage || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB');
      return;
    }

    // Converter para base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreview(base64String);
      onImageChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
  };

  return (
    <div className="image-upload">
      <label className="image-upload-label">{label}</label>
      <div className="image-upload-container">
        <div className="image-preview">
          {preview ? (
            <img src={preview} alt="Preview" className="preview-image" />
          ) : (
            <div className="preview-placeholder">
              <span>📷</span>
              <p>Nenhuma foto</p>
            </div>
          )}
        </div>
        <div className="image-upload-actions">
          <input
            type="file"
            id="image-upload-input"
            accept="image/*"
            onChange={handleFileChange}
            className="image-upload-input"
          />
          <label htmlFor="image-upload-input" className="btn-upload">
            {preview ? 'Trocar Foto' : 'Escolher Foto'}
          </label>
          {preview && (
            <button type="button" className="btn-remove" onClick={handleRemove}>
              Remover
            </button>
          )}
        </div>
      </div>
      <p className="image-upload-hint">Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB</p>
    </div>
  );
};

export default ImageUpload;
