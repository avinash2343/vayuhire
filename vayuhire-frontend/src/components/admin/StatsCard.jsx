export default function StatsCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="bg-white rounded-lg border p-6 flex items-center shadow-sm">
      <div className={`p-4 rounded-full mr-4 ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
