import { useState, useRef } from "react";
import { createProduct } from "../services/products/api";

const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif";

const CreateProductForm = ({ onProductCreated }) => {
  const [fields, setFields] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const fileRef = useRef(null);

  const handleField = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    setError("");
  };

  const resetForm = () => {
    setFields({ productName: "", description: "", price: "", category: "", quantity: "" });
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        ...fields,
        price: Number(fields.price),
        quantity: Number(fields.quantity),
      };
      const newProduct = await createProduct(payload, imageFile);
      onProductCreated(newProduct);
      setSuccess(true);
      resetForm();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "0.75rem 1rem", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10, padding: "0.75rem 1rem", color: "#16a34a", fontSize: "0.875rem", marginBottom: "1rem" }}>
          Product listed successfully!
        </div>
      )}

      <div className="row g-3">
        <div className="col-sm-6">
          <label className="mp-label">Product Name *</label>
          <input className="mp-input" name="productName" value={fields.productName} onChange={handleField} required placeholder="e.g. Wireless Headphones" />
        </div>
        <div className="col-sm-3">
          <label className="mp-label">Price (USD) *</label>
          <input className="mp-input" name="price" type="number" min="0" step="0.01" value={fields.price} onChange={handleField} required placeholder="29.99" />
        </div>
        <div className="col-sm-3">
          <label className="mp-label">Quantity *</label>
          <input className="mp-input" name="quantity" type="number" min="1" value={fields.quantity} onChange={handleField} required placeholder="10" />
        </div>
        <div className="col-sm-6">
          <label className="mp-label">Category *</label>
          <input className="mp-input" name="category" value={fields.category} onChange={handleField} required placeholder="Electronics, Fashion, Books…" />
        </div>
        <div className="col-sm-6">
          <label className="mp-label">Description *</label>
          <input className="mp-input" name="description" value={fields.description} onChange={handleField} required placeholder="Brief product description" />
        </div>

        {/* Image upload */}
        <div className="col-12">
          <label className="mp-label">Product Image</label>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            {preview && (
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img src={preview} alt="Preview" style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 10, border: "1.5px solid var(--border)" }} />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                  style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", border: "none", color: "#fff", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >✕</button>
              </div>
            )}
            <div
              style={{ flex: "1 1 200px", border: "2px dashed var(--border)", borderRadius: 10, padding: "1rem", textAlign: "center", cursor: "pointer", background: "var(--surface-2)", transition: "border-color 0.15s" }}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  setImageFile(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>📷</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {preview ? "Replace image" : "Click or drag to upload"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
                JPEG, PNG, WebP, GIF · optional
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED}
              style={{ display: "none" }}
              onChange={handleImage}
            />
          </div>
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn-primary-mp"
            disabled={loading}
            style={{ minWidth: 140 }}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status" />{imageFile ? "Uploading…" : "Creating…"}</>
            ) : "Create Listing"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateProductForm;
