import { useState, useEffect } from 'react';
import { adminApi, categoryApi } from '../../api';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '', is_available: true });

  const fetchProducts = () => {
    adminApi.getProducts().then(res => setProducts(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    categoryApi.getAll().then(res => setCategories(res.data));
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', category_id: categories[0]?.id || '', is_available: true });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({ name: product.name, description: product.description || '', price: product.price, category_id: product.category_id, is_available: product.is_available });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined) data.append(k, v); });

      if (editing) {
        data.append('_method', 'PUT');
        await adminApi.updateProduct(editing.id, data);
        toast.success('Product updated!');
      } else {
        await adminApi.createProduct(data);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Product deleted!');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="admin-crud-page">
      <div className="crud-header">
        <h1>Products</h1>
        <button className="btn-primary" onClick={openCreate}><FiPlus /> Add Product</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Category</th><th>Price</th><th>Orders</th><th>Rating</th><th>Available</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category?.name}</td>
              <td>{formatPrice(p.price)}</td>
              <td>{p.order_count}</td>
              <td>⭐ {Number(p.avg_rating).toFixed(1)}</td>
              <td><span className={`badge ${p.is_available ? 'badge-green' : 'badge-red'}`}>{p.is_available ? 'Yes' : 'No'}</span></td>
              <td className="action-cell">
                <button className="icon-btn edit" onClick={() => openEdit(p)}><FiEdit /></button>
                <button className="icon-btn delete" onClick={() => handleDelete(p.id)}><FiTrash2 /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Price (IDR)</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input type="checkbox" checked={form.is_available} onChange={e => setForm({ ...form, is_available: e.target.checked })} />
                  Available
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
