import { useState } from "react";
import { apiDarna } from "../services/api";
import axios from "axios";

export default function UploadLocal({ onUpload }) {
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);

    const fd = new FormData();
    fd.append("file", file);

    try {
      setUploading(true);
      setProgress(0);

      const res = await apiDarna.post("/upload/file", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total) return;
          setProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      const { publicUrl } = res.data;
      onUpload(publicUrl);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div>
      <label className="font-semibold block">Ajouter une image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="mt-2"
      />
      {preview && (
        <div className="mt-2 flex gap-2 items-center">
          <img
            src={preview}
            alt="preview"
            className="w-20 h-20 object-cover rounded border"
          />
          <div>
            {uploading ? (
              <div>Uploading... {progress}%</div>
            ) : (
              <div>Ready to upload</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
