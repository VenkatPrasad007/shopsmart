export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4
                    hover:shadow-md transition-shadow duration-200 flex flex-col">

      {/* Product Image Placeholder */}
      <div className="w-full h-40 bg-gray-100 rounded-lg mb-4
                      flex items-center justify-center text-4xl">
        🛍️
      </div>

      {/* Category Badge */}
      <span className="text-xs font-medium px-2 py-1 bg-blue-50
                       text-blue-600 rounded-full w-fit mb-2">
        {product.categoryName || 'Uncategorized'}
      </span>

      {/* Product Info */}
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 flex-1">
        {product.name}
      </h3>

      {product.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {product.description}
        </p>
      )}

      {/* Price and Stock */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-gray-900">
          ₹{product.price?.toLocaleString('en-IN')}
        </span>
        <span className={`text-xs ${product.stockQuantity > 0
          ? 'text-green-600' : 'text-red-500'}`}>
          {product.stockQuantity > 0
            ? `${product.stockQuantity} in stock`
            : 'Out of stock'}
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(product)}
        disabled={product.stockQuantity === 0}
        className="w-full py-2 bg-blue-600 text-white text-sm
                   font-medium rounded-lg hover:bg-blue-700
                   transition-colors disabled:opacity-50
                   disabled:cursor-not-allowed"
      >
        {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}