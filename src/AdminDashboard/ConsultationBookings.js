import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import styles from './ConsultationBookings.module.css';
import config from '../config';

const ConsultationBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentProof, setSelectedPaymentProof] = useState('');

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${config.API_BASE_URL}/api/consultations/bookings`;
      if (filter !== 'all') {
        url += `?status=${filter.toUpperCase()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); 

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/consultations/bookings/${id}/approve`, {
        method: 'PUT'
      });
      
      if (!response.ok) throw new Error('Failed to approve booking');
      
      toast.success('Booking approved successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/consultations/bookings/${id}/reject`, {
        method: 'PUT'
      });
      
      if (!response.ok) throw new Error('Failed to reject booking');
      
      toast.success('Booking rejected successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(bookings.map(booking => ({
      'ID': booking.id,
      'Name': booking.name,
      'Email': booking.email,
      'Phone': booking.phone,
      'Service': booking.consultation.title,
      'Price': booking.consultation.price,
      'DOB': booking.dob,
      'Time': booking.time,
      'Place of Birth': booking.placeOfBirth,
      'Questions': booking.questions,
      'Status': booking.status,
      'Booking Date': new Date(booking.bookingDate).toLocaleString('en-IN')
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
    XLSX.writeFile(workbook, 'Consultation_Bookings.xlsx');
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm) ||
      booking.consultation.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && booking.status === filter.toUpperCase();
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Consultation Bookings</h2>
        <div className={styles.actions}>
          <div className={styles.searchFilter}>
            <div className={styles.search}>
              <input
                type="text"
                placeholder="Search bookings..."
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
          <p>Loading bookings...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Details</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map(booking => (
                  <tr key={booking.id}>
                    <td className={styles.compactCell}>#{booking.id}</td>
                    <td className={styles.compactCell}>
                      <div className={styles.customer}>
                        <div className={styles.avatar}>
                          {booking.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className={styles.smallText}>{booking.name}</strong>
                          <p className={styles.smallText}>{booking.email}</p>
                          <p className={styles.smallText}>{booking.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.compactCell}>
                      <strong className={styles.smallText}>{booking.consultation.title}</strong>
                      <p className={styles.smallText}>₹{booking.consultation.price}</p>
                    </td>
                    <td className={styles.compactCell}>
                      <div className={styles.details}>
                        <p className={styles.smallText}><strong>DOB:</strong> {booking.dob}</p>
                        <p className={styles.smallText}><strong>Time:</strong> {booking.time}</p>
                        <p className={styles.smallText}><strong>Place:</strong> {booking.placeOfBirth}</p>
                        {booking.questions && (
                          <p className={`${styles.questions} ${styles.smallText}`}>
                            <strong>Questions:</strong> {booking.questions.substring(0, 30)}...
                          </p>
                        )}
                      </div>
                    </td>
                    <td className={styles.compactCell}>
                      {booking.paymentProofUrl ? (
                        <button
                          onClick={() => {
                            setSelectedPaymentProof(`${config.API_BASE_URL}/uploads/consultation_payments/${booking.paymentProofUrl}`);
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
                      <span className={`${styles.status} ${styles[booking.status.toLowerCase()]} ${styles.smallText}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className={styles.compactCell}>
                      <span className={styles.smallText}>
                        {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className={styles.compactCell}>
                      <div className={styles.actionButtons}>
                        {booking.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleApprove(booking.id)}
                              className={`${styles.approveBtn} ${styles.smallText}`}
                            >
                              <i className="bi bi-check-circle"></i> Approve
                            </button>
                            <button 
                              onClick={() => handleReject(booking.id)}
                              className={`${styles.rejectBtn} ${styles.smallText}`}
                            >
                              <i className="bi bi-x-circle"></i> Reject
                            </button>
                          </>
                        )}
                        {(booking.status === 'APPROVED' || booking.status === 'REJECTED') && (
                          <button 
                            className={`${styles.viewBtn} ${styles.smallText}`}
                            onClick={() => {/* View details logic */}}
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
                    No bookings found
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

export default ConsultationBookings;