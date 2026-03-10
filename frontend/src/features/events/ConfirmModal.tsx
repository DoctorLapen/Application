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

      <div className="
        w-full
        max-w-sm
        bg-white
        border
        shadow-2xl
        rounded-2xl
        p-6
      ">

        <p className="text-center mb-6 text-gray-700">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            onClick={onConfirm}
            className="
              w-full
              bg-red-600
              hover:bg-red-700
              text-white
              py-2.5
              rounded-lg
              font-medium
            "
          >
            Delete
          </button>

          <button
            onClick={onCancel}
            className="
              w-full
              border
              py-2.5
              rounded-lg
              hover:bg-gray-100
            "
          >
            Cancel
          </button>

        </div>
      </div>

    </div>
  );
};