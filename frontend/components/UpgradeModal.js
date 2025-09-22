// upgrademodal.js
import { useRouter } from "next/router";

export default function UpgradeModal({ message, onClose }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm">
        <h2 className="text-xl font-bold mb-3">Upgrade Required</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push("/pricing")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Upgrade Now
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
