import React, { useState } from 'react';
import { CustomerHistoryAndReviews } from '../components/CustomerHistoryAndReviews';
import { Reservation } from '../types/restaurant';
import { EInvoiceModal } from '../components/common/EInvoiceModal';
import { useRestaurant } from '../context/RestaurantContext';

interface Props {
  onSelectReservation: (res: Reservation) => void;
  onOpenEmailModal: () => void;
}

export const CustomerHistoryPage: React.FC<Props> = ({ onSelectReservation, onOpenEmailModal }) => {
  const { menuItems } = useRestaurant();
  const [selectedInvoiceRes, setSelectedInvoiceRes] = useState<Reservation | null>(null);

  return (
    <div className="space-y-6">
      <CustomerHistoryAndReviews
        onSelectReservation={(res) => {
          onSelectReservation(res);
          setSelectedInvoiceRes(res);
        }}
        onOpenEmailModal={onOpenEmailModal}
      />

      {selectedInvoiceRes && (
        <EInvoiceModal
          isOpen={!!selectedInvoiceRes}
          onClose={() => setSelectedInvoiceRes(null)}
          reservation={selectedInvoiceRes}
          menuItems={menuItems}
        />
      )}
    </div>
  );
};
