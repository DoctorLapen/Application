interface ConfirmModalProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm h-auto bg-white border border-gray-300 shadow-lg rounded-2xl p-6 flex flex-col justify-between">
        {/* Сообщение */}
        <p className="text-center mb-6 text-gray-700">{message}</p>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>

          <button
            onClick={onCancel}
            className="w-full border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};