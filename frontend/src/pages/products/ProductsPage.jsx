import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../../api/productApi';
import { orderApi } from '../../api/orderApi';
import ProductCard from '../../components/ProductCard';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { toast, showToast, hideToast } = useToast();

  // ── Declare functions BEFORE useEffect ──────────────────

  const fetchCategories = useCallback(async () => {
  try {
    const response = await productApi.getCategories();
    // Handle both array and paginated response
    const data = response.data;
    setCategories(Array.isArray(data) ? data : data.content || []);
  } catch (err) {
    console.error('Failed to fetch categories', err);
    setCategories([]);
  }
}, []);

const fetchProducts = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    let response;

    if (activeCategory) {
      response = await productApi.getByCategory(activeCategory, page);
    } else {
      response = await productApi.getAll(page);
    }

    const data = response.data;
    // Handle both array and paginated response
    if (Array.isArray(data)) {
      setProducts(data);
      setTotalPages(1);
    } else {
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    }
  } catch (err) {
    setError('Failed to load products. Is the backend running?');
    setProducts([]);
  } finally {
    setLoading(false);
  }
}, [activeCategory, page]);

  // ── useEffect AFTER functions ────────────────────────────

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Handlers ────────────────────────────────────────────

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      fetchProducts();
      return;
    }
    try {
      setLoading(true);
      const response = await productApi.search(search.trim(), 0);
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await orderApi.addToCart({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
      });
      showToast(`${product.name} added to cart!`);
    } catch (err) {
      showToast('Failed to add to cart', 'error');
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
    setPage(0);
    setSearch('');
  };

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-500 text-sm mt-1">
          {products.length} products found
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300
                     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white text-sm
                     font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); fetchProducts(); }}
            className="px-4 py-2.5 border border-gray-300 text-gray-600
                       text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      <div className="flex gap-6">
        {/* Category Sidebar */}
        <aside className="w-48 flex-shrink-0">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm">
            Categories
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm
                transition-colors ${!activeCategory
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm
                  transition-colors ${activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-blue-600
                              border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-blue-600 text-white
                           rounded-lg text-sm hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try a different search or category
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2
                              lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg
                               text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg
                               text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}