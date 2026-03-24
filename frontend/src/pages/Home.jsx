import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi, categoryApi } from '../api';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiArrowRight } from 'react-icons/fi';

export default function Home() {
  const [recommended, setRecommended] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productApi.getRecommended(),
      categoryApi.getAll(),
    ]).then(([recRes, catRes]) => {
      setRecommended(recRes.data);
      setCategories(catRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const categoryEmojis = { 'Main Course': '🍛', 'Beverages': '🥤', 'Desserts': '🍰', 'Snacks': '🍟', 'Specials': '⭐' };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Delicious Food,<br />
            <span className="highlight">Delivered Fresh</span>
          </h1>
          <p className="hero-subtitle">
            Explore our handcrafted menu with fresh ingredients and authentic flavors. Order now and enjoy!
          </p>
          <div className="hero-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search for your favorite food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search && (window.location.href = `/menu?search=${search}`)}
            />
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">17+</span><span>Menu Items</span></div>
            <div className="stat"><span className="stat-num">500+</span><span>Orders Served</span></div>
            <div className="stat"><span className="stat-num">4.7</span><span>Avg Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-circle"></div>
          <div className="hero-emoji">🍽️</div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-header">
          <h2>Browse Categories</h2>
          <Link to="/menu" className="see-all">See All <FiArrowRight /></Link>
        </div>
        <div className="category-grid">
          {categories.map(cat => (
            <Link to={`/menu?category=${cat.id}`} key={cat.id} className="category-card">
              <span className="category-emoji">{categoryEmojis[cat.name] || '🍴'}</span>
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.products_count} items</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="recommended-section">
        <div className="section-header">
          <h2>🔥 Recommended For You</h2>
          <Link to="/menu" className="see-all">View Menu <FiArrowRight /></Link>
        </div>
        <div className="product-grid">
          {recommended.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
