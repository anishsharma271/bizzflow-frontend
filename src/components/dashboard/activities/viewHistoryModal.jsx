import React, { useEffect, useState } from 'react';
import axios from 'axios'; // or use Redux if you're already using it

const ViewHistoryModal = ({ customerId, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/api/transactions/${customerId}`);
        setHistory(res.data); // Expecting array of { type, amount, createdAt }
      } catch (err) {
        console.error("Error fetching history", err);
      }
    };
    fetchHistory();
  }, [customerId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-lg max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Transaction History</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
        </div>

        {history.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((txn, index) => (
              <li key={index} className="border p-3 rounded-md flex justify-between items-center">
                <div>
                  <div className="font-medium capitalize">{txn.type}</div>
                  <div className="text-sm text-gray-500">{new Date(txn.createdAt).toLocaleString()}</div>
                </div>
                <div className={`text-right font-bold ${txn.type === 'supply' ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{txn.amount}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewHistoryModal;
