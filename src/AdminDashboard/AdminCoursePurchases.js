import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Tag, Modal, message } from 'antd';
import * as XLSX from 'xlsx';
import config from '../config';
import styles from './AdminCoursePurchases.module.css';

const AdminCoursePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterStatus === 'all' 
        ? `${config.API_BASE_URL}/api/admin/course-purchases`
        : `${config.API_BASE_URL}/api/admin/course-purchases?status=${filterStatus}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      message.error('Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/course-purchases/${id}/approve`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        message.success('Purchase approved successfully');
        fetchPurchases();
      } else {
        message.error('Failed to approve purchase');
      }
    } catch (error) {
      message.error('Error approving purchase');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/course-purchases/${id}/reject`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        message.success('Purchase rejected successfully');
        fetchPurchases();
      } else {
        message.error('Failed to reject purchase');
      }
    } catch (error) {
      message.error('Error rejecting purchase');
    }
  };

  const showPaymentProof = (imagePath) => {
    if (!imagePath) {
      message.warning('No payment proof available');
      return;
    }
    setPreviewImage(`${config.API_BASE_URL}/uploads/PaymentProofs/${imagePath}`);
    setPreviewVisible(true);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Tag className={styles.approvedTag}>Approved</Tag>;
      case 'REJECTED':
        return <Tag className={styles.rejectedTag}>Rejected</Tag>;
      default:
        return <Tag className={styles.pendingTag}>Pending</Tag>;
    }
  };

  const exportToExcel = () => {
    if (purchases.length === 0) {
      message.warning('No data to export');
      return;
    }

    const excelData = purchases.map(purchase => ({
      'Purchase ID': purchase.id,
      'User Name': purchase.userName,
      'User Email': purchase.userEmail,
      'User Phone': purchase.userPhone,
      'Course Title': purchase.course.title,
      'Course Price': `₹${purchase.course.price}`,
      'Purchase Date': new Date(purchase.purchaseDate).toLocaleDateString(),
      'Expiry Date': new Date(purchase.expiryDate).toLocaleDateString(),
      'Payment Amount': `₹${purchase.payment.amount}`,
      'Payment Method': purchase.payment.paymentMethod,
      'Status': purchase.status,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Course Purchases");
    const fileName = `Course_Purchases_${filterStatus === 'all' ? 'All' : filterStatus}_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    message.success('Export started successfully');
  };

  const columns = [
    {
      title: 'Purchase ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div className={styles.userDetails}>
          <div className={styles.nowrap}>{record.userName}</div>
          <div className={styles.nowrap}>{record.userEmail}</div>
          <div className={styles.nowrap}>{record.userPhone}</div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Course',
      key: 'course',
      render: (_, record) => (
        <div className={styles.courseDetails}>
          <div className={styles.nowrap}><strong>{record.course.title}</strong></div>
          <div className={styles.nowrap}>Price: ₹{record.course.price}</div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Dates',
      key: 'dates',
      render: (_, record) => (
        <div className={styles.dateDetails}>
          <div className={styles.nowrap}>Purchased: {new Date(record.purchaseDate).toLocaleDateString()}</div>
          <div className={styles.nowrap}>Expires: {new Date(record.expiryDate).toLocaleDateString()}</div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_, record) => (
        <div className={styles.paymentDetails}>
          <div className={styles.nowrap}>Amount: ₹{record.payment.amount}</div>
          <div className={styles.nowrap}>Method: {record.payment.paymentMethod}</div>
          <Button 
            type="link" 
            onClick={() => showPaymentProof(record.payment.screenshotPath)}
            className={styles.paymentProofButton}
          >
            View Proof
          </Button>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className={styles.actionButtons}>
          {record.status === 'COMPLETED' && !record.verified && (
            <>
              <Button 
                type="primary" 
                onClick={() => handleApprove(record.id)}
                size="small"
              >
                Approve
              </Button>
              <Button 
                danger 
                onClick={() => handleReject(record.id)}
                size="small"
              >
                Reject
              </Button>
            </>
          )}
        </div>
      ),
      width: 150,
      fixed: 'right',
    },
  ];

  return (
    <div className={styles.adminPurchasesContainer}>
      <div className={styles.filters}>
        <Button 
          type={filterStatus === 'all' ? 'primary' : 'default'}
          onClick={() => setFilterStatus('all')}
        >
          All
        </Button>
        <Button 
          type={filterStatus === 'COMPLETED' ? 'primary' : 'default'}
          onClick={() => setFilterStatus('COMPLETED')}
        >
          Pending
        </Button>
        <Button 
          type={filterStatus === 'APPROVED' ? 'primary' : 'default'}
          onClick={() => setFilterStatus('APPROVED')}
        >
          Approved
        </Button>
        <Button 
          type={filterStatus === 'REJECTED' ? 'primary' : 'default'}
          onClick={() => setFilterStatus('REJECTED')}
        >
          Rejected
        </Button>
        <Button 
          type="primary" 
          onClick={exportToExcel}
          className={styles.exportButton}
        >
          Export to Excel
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={purchases} 
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />

      <Modal
        className={styles.paymentProofModal}
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
      >
        <img 
          src={previewImage} 
          alt="Payment Proof" 
          className={styles.paymentProofImage}
        />
      </Modal>
    </div>
  );
};

export default AdminCoursePurchases;