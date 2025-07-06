import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import styles from './EReportBookings.module.css';
import config from '../config';

const EReportBookings = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentProof, setSelectedPaymentProof] = useState('');

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${config.API_BASE_URL}/api/ereports/purchases`;
      if (filter !== 'all') {
        url += `?status=${filter.toUpperCase()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch purchases');
      
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/ereports/purchases/${id}/approve`, {
        method: 'PUT'
      });
      
      if (!response.ok) throw new Error('Failed to approve purchase');
      
      toast.success('Purchase approved successfully');
      fetchPurchases();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/ereports/purchases/${id}/reject`, {
        method: 'PUT'
      });
      
      if (!response.ok) throw new Error('Failed to reject purchase');
      
      toast.success('Purchase rejected successfully');
      fetchPurchases();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(purchases.map(purchase => ({
      'ID': purchase.id,
      'Name': purchase.name,
      'Email': purchase.email,
      'Phone': purchase.phone,
      'Report': purchase.ereport.title,
      'Price': purchase.amountPaid,
      'DOB': purchase.dob,
      'Birth Time': purchase.birthTime,
      'Birth Place': purchase.birthPlace,
      'Questions': purchase.specificQuestions,
      'Status': purchase.status,
      'Purchase Date': new Date(purchase.purchaseDate).toLocaleString('en-IN')
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'EReportPurchases');
    XLSX.writeFile(workbook, 'EReport_Purchases.xlsx');
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.phone.includes(searchTerm) ||
      purchase.eReport.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && purchase.status === filter.toUpperCase();
  });

  


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>E-Report Purchases</h2>
        <div className={styles.actions}>
          <div className={styles.searchFilter}>
            <div className={styles.search}>
              <input
                type="text"
                placeholder="Search purchases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="bi bi-search"></i>
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filter}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button 
            onClick={exportToExcel}
            className={styles.exportBtn}
          >
            <i className="bi bi-file-earmark-excel"></i> Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading purchases...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Report</th>
                <th>Details</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td className={styles.compactCell}>#{purchase.id}</td>
                    <td className={styles.compactCell}>
                      <div className={styles.customer}>
                        <div className={styles.avatar}>
                          {purchase.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className={styles.smallText}>{purchase.name}</strong>
                          <p className={styles.smallText}>{purchase.email}</p>
                          <p className={styles.smallText}>{purchase.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.compactCell}>
  <strong className={styles.smallText}>
    { purchase.ereport.title}
  </strong>
  <p className={styles.smallText}>₹{purchase.amountPaid}</p>
</td>
                    <td className={styles.compactCell}>
                      <div className={styles.details}>
                        <p className={styles.smallText}><strong>DOB:</strong> {purchase.dob}</p>
                        <p className={styles.smallText}><strong>Time:</strong> {purchase.birthTime}</p>
                        <p className={styles.smallText}><strong>Place:</strong> {purchase.birthPlace}</p>
                        {purchase.specificQuestions && (
                          <p className={`${styles.questions} ${styles.smallText}`}>
                            <strong>Questions:</strong> {purchase.specificQuestions.substring(0, 30)}...
                          </p>
                        )}
                      </div>
                    </td>
                    <td className={styles.compactCell}>
                      {purchase.paymentProofUrl ? (
                        <button
                          onClick={() => {
                            setSelectedPaymentProof(`${config.API_BASE_URL}/uploads/ereport_payments/${purchase.paymentProofUrl}`);
                            setShowPaymentModal(true);
                          }}
                          className={`${styles.viewProofBtn} ${styles.smallText}`}
                        >
                          <i className="bi bi-receipt"></i> View
                        </button>
                      ) : (
                        <span className={`${styles.noProof} ${styles.smallText}`}>No proof</span>
                      )}
                    </td>
                    <td className={styles.compactCell}>
                      <span className={`${styles.status} ${styles[purchase.status.toLowerCase()]} ${styles.smallText}`}>
                        {purchase.status}
                      </span>
                    </td>
                    <td className={styles.compactCell}>
                      <span className={styles.smallText}>
                        {new Date(purchase.purchaseDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className={styles.compactCell}>
                      <div className={styles.actionButtons}>
                        {purchase.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleApprove(purchase.id)}
                              className={`${styles.approveBtn} ${styles.smallText}`}
                            >
                              <i className="bi bi-check-circle"></i> Approve
                            </button>
                            <button 
                              onClick={() => handleReject(purchase.id)}
                              className={`${styles.rejectBtn} ${styles.smallText}`}
                            >
                              <i className="bi bi-x-circle"></i> Reject
                            </button>
                          </>
                        )}
                        {(purchase.status === 'APPROVED' || purchase.status === 'REJECTED') && (
                          <button 
                            className={`${styles.viewBtn} ${styles.smallText}`}
                          >
                            <i className="bi bi-eye"></i> View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className={styles.noData}>
                    <i className="bi bi-exclamation-circle"></i>
                    No purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Proof Modal */}
      {showPaymentModal && (
        <div className={styles.paymentModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Payment Proof</h3>
              <button 
                className={styles.closeModalBtn}
                onClick={() => setShowPaymentModal(false)}
              >
                &times;
              </button>
            </div>
            <div className={styles.imageContainer}>
              <img 
                src={selectedPaymentProof} 
                alt="Payment Proof" 
                className={styles.paymentImage}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = `${process.env.PUBLIC_URL}/image-not-found.png`;
                }}
              />
            </div>
            <div className={styles.modalFooter}>
              <a 
                href={selectedPaymentProof} 
                download 
                className={styles.downloadBtn}
              >
                <i className="bi bi-download"></i> Download
              </a>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowPaymentModal(false)}
              >
                <i className="bi bi-x"></i> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EReportBookings;