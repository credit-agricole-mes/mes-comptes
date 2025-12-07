export default function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-gray-100 hover:bg-gray-200 p-6 rounded-2xl flex flex-col items-center justify-center transition"
    >
      <Icon className="w-12 h-12 text-gray-700 mb-3" />
      <span className="text-gray-800 font-bold text-center">{label}</span>
    </button>
  );
}