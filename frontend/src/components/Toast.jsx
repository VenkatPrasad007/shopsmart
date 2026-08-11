export default function Toast({ message, type = 'success', onClose }) {
  const colors = {
    success: 'bg-green-500',
    error:   'bg-red-500',
    info:    'bg-blue-500',
  };

  const icons = {
    success: '✓',
    error:   '✕',
    info:    'ℹ',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3
                     px-4 py-3 rounded-lg text-white shadow-lg text-sm
                     ${colors[type]}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        ×
      </button>
    </div>
  );
}