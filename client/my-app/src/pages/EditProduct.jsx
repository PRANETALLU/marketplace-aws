import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct, uploadProductImage } from "../services/products/api";
import { Spinner } from "react-bootstrap";

const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
  });
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(productId);
        if (!product) {
          setError("Product not found.");
          setLoading(false);
          return;
        }
        setFields({
          productName: product.productName || "",
          description: product.description || "",
          price: product.price != null ? String(product.price) : "",
          category: product.category || "",
          quantity: product.quantity != null ? String(product.quantity) : "",
        });
        setCurrentImageUrl(product.imageUrl || "");
      } catch {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        ...fields,
        price: Number(fields.price),
        quantity: Number(fields.quantity),
      };

      if (imageFile) {
        const { imageKey, imageUrl } = await uploadProductImage(imageFile);
        payload.imageKey = imageKey;
        payload.imageUrl = imageUrl;
      }

      await updateProduct(productId, payload);
      setSuccess(true);
      setTimeout(() => navigate(`/product/${productId}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .edit-product-wrapper {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(-45deg, #0d6efd, #0a58ca, #3b82f6, #60a5fa);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          padding: 6rem 1.5rem 3rem;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .edit-product-card {
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 2.5rem;
          width: 100%;
          max-width: 700px;
          animation: fadeInUp 0.6s ease-out;
        }

        .edit-product-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 2rem;
        }

        .edit-form-label {
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.4rem;
          font-size: 0.9rem;
          display: block;
        }

        .edit-form-input {
          width: 100%;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: white;
          outline: none;
        }

        .edit-form-input:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
        }

        .edit-save-btn {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          border: none;
          border-radius: 12px;
          padding: 0.9rem 2rem;
          font-weight: 700;
          font-size: 1rem;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.4);
          cursor: pointer;
        }

        .edit-save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(13, 110, 253, 0.5);
        }

        .edit-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .edit-cancel-btn {
          background: transparent;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.9rem 2rem;
          font-weight: 700;
          font-size: 1rem;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-cancel-btn:hover {
          border-color: #0d6efd;
          color: #0d6efd;
        }

        .edit-alert {
          border-radius: 12px;
          padding: 0.85rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .edit-alert-error {
          background: #fef2f2;
          border: 1.5px solid #fca5a5;
          color: #dc2626;
        }

        .edit-alert-success {
          background: #f0fdf4;
          border: 1.5px solid #86efac;
          color: #16a34a;
        }

        .edit-image-preview {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }

        .edit-upload-box {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 1.25rem;
          text-align: center;
          cursor: pointer;
          background: #f8fafc;
          transition: border-color 0.2s;
          flex: 1;
        }

        .edit-upload-box:hover { border-color: #0d6efd; }
      `}</style>

      <div className="edit-product-wrapper">
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
            <Spinner animation="border" style={{ color: "white", width: "3rem", height: "3rem" }} />
          </div>
        ) : error && !fields.productName ? (
          <div className="edit-product-card">
            <p style={{ color: "#dc2626", fontWeight: 600 }}>{error}</p>
            <button className="edit-cancel-btn" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        ) : (
          <div className="edit-product-card">
            <h1 className="edit-product-title">Edit Product</h1>

            {error && <div className="edit-alert edit-alert-error">{error}</div>}
            {success && <div className="edit-alert edit-alert-success">Product updated! Redirecting…</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="edit-form-label">Product Name *</label>
                  <input
                    className="edit-form-input"
                    name="productName"
                    value={fields.productName}
                    onChange={handleField}
                    required
                    placeholder="e.g. Wireless Headphones"
                  />
                </div>
                <div className="col-sm-3">
                  <label className="edit-form-label">Price (USD) *</label>
                  <input
                    className="edit-form-input"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={fields.price}
                    onChange={handleField}
                    required
                    placeholder="29.99"
                  />
                </div>
                <div className="col-sm-3">
                  <label className="edit-form-label">Quantity *</label>
                  <input
                    className="edit-form-input"
                    name="quantity"
                    type="number"
                    min="0"
                    value={fields.quantity}
                    onChange={handleField}
                    required
                    placeholder="10"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="edit-form-label">Category *</label>
                  <input
                    className="edit-form-input"
                    name="category"
                    value={fields.category}
                    onChange={handleField}
                    required
                    placeholder="Electronics, Fashion, Books…"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="edit-form-label">Description *</label>
                  <input
                    className="edit-form-input"
                    name="description"
                    value={fields.description}
                    onChange={handleField}
                    required
                    placeholder="Brief product description"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="edit-form-label">Product Image</label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                  {(preview || currentImageUrl) && (
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <img
                        src={preview || currentImageUrl}
                        alt="Preview"
                        className="edit-image-preview"
                      />
                      {preview && (
                        <button
                          type="button"
                          onClick={() => { setImageFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                          style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", border: "none", color: "#fff", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer" }}
                        >✕</button>
                      )}
                    </div>
                  )}
                  <div
                    className="edit-upload-box"
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
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      {preview ? "Replace image" : currentImageUrl ? "Upload a new image" : "Click or drag to upload"}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#cbd5e1", marginTop: "0.25rem" }}>JPEG, PNG, WebP, GIF · optional</div>
                  </div>
                  <input ref={fileRef} type="file" accept={ACCEPTED} style={{ display: "none" }} onChange={handleImage} />
                </div>
              </div>

              <div className="d-flex gap-3 flex-wrap">
                <button type="submit" className="edit-save-btn" disabled={saving}>
                  {saving ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" />{imageFile ? "Uploading…" : "Saving…"}</>
                  ) : "Save Changes"}
                </button>
                <button type="button" className="edit-cancel-btn" onClick={() => navigate(`/product/${productId}`)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default EditProduct;
