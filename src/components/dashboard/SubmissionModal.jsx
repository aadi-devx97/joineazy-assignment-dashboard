import { useState } from "react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

function SubmissionModal({ isOpen, onClose, onConfirm, assignmentTitle }) {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    setConfirmed(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-title"
        className="bg-surface text-ink w-full max-w-md rounded-2xl border border-border shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-5">
          <div className="w-11 h-11 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center">
            <AlertCircle size={23} />
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="p-2 rounded-lg hover:bg-canvas"
          >
            <X size={19} />
          </button>
        </div>

        <h2 id="submission-title" className="text-xl font-semibold">
          Confirm your submission
        </h2>

        <p className="text-sm text-muted mt-2">
          Have you completed and submitted{" "}
          <strong className="text-ink">{assignmentTitle}</strong>?
        </p>

        <label className="flex items-start gap-3 mt-6 p-4 bg-canvas border border-border rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 accent-[#66745A]"
          />

          <span className="text-sm">
            Yes, I confirm that I have completed and submitted this assignment.
          </span>
        </label>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-canvas"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!confirmed}
            onClick={handleConfirm}
            className="px-4 py-2.5 rounded-lg bg-olive text-white text-sm font-medium hover:bg-olive-dark disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm Submission
          </button>
        </div>
      </section>
    </div>
  );
}

export default SubmissionModal;