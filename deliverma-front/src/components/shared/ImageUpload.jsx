import { useState } from "react"
import { FaArrowRightArrowLeft, FaFolder, FaHourglass, FaX } from "react-icons/fa6";

export const ImageUpload = ({ label = 'photo', value, onChange, folder = 'general'}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    
    const handleFileChange = async(e) => {
        const file = e.target.files[0];
        if(!file) return;

        //validation coté client
        if(!file.type.startsWith('image/')){
            setError('Le fichier doit etre une image (jpg, png, webp...)');
            return;
        }
        if(file.size > 5 * 1024 * 1024){
            setError('L\'image ne doit pas dépasser 5 Mo');
            return;
        }
        setError('');
        setUploading(true);
        try{
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);
            const response = await fetch(
                'http://localhost:8080/api/v1/upload/image',
                {
                    method : 'POST',
                    credentials : 'include',
                    body : formData
                }
            );
            if(!response.ok){
                console.log("response: ",response);
                const err = await response.json();
                throw new Error(err.error || "Échec de l'upload ");
            }
            const data = await response.json();
            onChange(data.url);
        }catch(err){
            setError(err.message || "Erreur lors de l'upload");
        }finally{
            setUploading(false);
            e.target.value = '';
        }
    }

    const handleRemove = () => {
        onChange('');
    }

    return(
        <div className="form-group">
            <label>{label}</label>
            {/* Prévisualisation à partir de value récuperée de cloudinary */}
            {value && (
                <div className="image-preview-container">
                    <img 
                        src={value}
                        alt="Aperçu"
                        className="image-preview"
                        onError={e => e.target.style.display = 'none'} 
                    />
                    <button
                        type="button"
                        className="image-remove-btn"
                        onClick={handleRemove}
                        title="Supprimer l'image"
                    >
                        <FaX/>
                    </button>
                </div>
            )}
            {/*Zone d'upload */}
            <div className="image-upload-zone">
                <label className={`image-upload-label ${
                    uploading ? 'uploading' : ''
                }`}>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange = {handleFileChange}
                        disabled = {uploading}
                        hidden
                    />
                    {uploading ? <><FaHourglass/> Upload en cours...</>
                            : value ? <><FaArrowRightArrowLeft/> Changer l'image</>
                                    : <><FaFolder/>  Choisir une image</>
                    }
                </label>
                <input
                    type="text"
                    className="image-url-input"
                    placeholder="Ou coller une URL directement..."
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            </div>
            {error && <span className="field-error">{error}</span>}
            {value && (
                <span style={{ fontSize: '.7rem', color: '#64748B',
                    wordBreak: 'break-all', display: 'block',
                    marginTop: '.25rem' }}>
                    {value}
                </span>
            )}
        </div>
    )

     
}