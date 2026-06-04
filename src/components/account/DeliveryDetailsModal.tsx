import { X } from 'lucide-react';
import DeliveryDetailsForm from './DeliveryDetailsForm';
import type { DeliveryDetails } from '@/types/customer';
import { getDeliveryFromUser } from '@/lib/delivery';
import { useAuth } from '@/contexts/AuthContext';

interface DeliveryDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (delivery: DeliveryDetails) => void | Promise<void>;
  title?: string;
  subtitle?: string;
  saving?: boolean;
  submitLabel?: string;
}

const DeliveryDetailsModal = ({
  open,
  onClose,
  onSave,
  title = 'Delivery details',
  subtitle = 'Add your delivery info so we can prefill WhatsApp checkout and track your order.',
  saving = false,
  submitLabel = 'Continue to WhatsApp',
}: DeliveryDetailsModalProps) => {
  const { user } = useAuth();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white border border-black max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-black px-4 py-4">
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase">{title}</h2>
            <p className="text-[10px] font-bold text-black/50 mt-1 leading-relaxed max-w-xs">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <DeliveryDetailsForm
            initial={getDeliveryFromUser(user)}
            onSubmit={onSave}
            submitLabel={submitLabel}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailsModal;
