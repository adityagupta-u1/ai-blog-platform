import { Upload } from 'lucide-react';
import React from 'react';



export default function MediaUploader(
    {onFieldStateChange}:
    {
        onFieldStateChange:(...event: unknown[]) => void;
    }
) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFieldStateChange(file);
    }
    };


  return (
    <>
        <label htmlFor="file-upload" className="relative flex gap-1">
           Upload Image
            <Upload />
        </label>
        <input 
            id="file-upload" 
            type="file" 
            accept="image/*"  
            className='hidden absolute top-0 left-0' 
            onChange={handleFileChange} 
            />

    </>
  )
}
