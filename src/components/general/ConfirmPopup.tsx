import React from "react";
import { TriangleAlert } from "lucide-react";

interface ConfirmPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <div className="flex items-start gap-3">
          <div className="bg-red-300 rounded-full p-2">
            <TriangleAlert className="text-red-700 w-8 h-8" />
          </div>
          <div>
            <div className="text-xl font-semibold mb-4">Confirmación</div>
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
