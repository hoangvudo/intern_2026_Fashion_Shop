import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useCheckoutStore from '../store/checkoutStore';
import api from '../services/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const order = useCheckoutStore((state) => state.order);
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [orderInfo, setOrderInfo] = useState(null);

  // orderId có thể đến từ store (vừa đặt hàng) hoặc từ query string (PayOS redirect về)
  const orderId = order?.id || searchParams.get('orderId') || searchParams.get('orderCode');

  useEffect(() => {
    checkPaymentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPaymentStatus = async () => {
    try {
      if (!orderId) {
        setPaymentStatus('error');
        return;
      }

      // Kiểm tra trạng thái thanh toán từ backend
      const response = await api.get(`/orders/${orderId}/payos/status`);

      if (response.data.isPaid) {
        setPaymentStatus('success');
        setOrderInfo(response.data);

        // Redirect tới trang thành công sau 3 giây
        setTimeout(() => {
          navigate(`/order-success?orderId=${orderId}`);
        }, 3000);
      } else {
        setPaymentStatus('pending');
        // Poll lại sau 2 giây
        setTimeout(checkPaymentStatus, 2000);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('error');
    }
  };

  return (
    <div className="payment-result-container">
      {paymentStatus === 'checking' && (
        <div className="status-checking">
          <div className="spinner"></div>
          <h2>Đang kiểm tra trạng thái thanh toán...</h2>
          <p>Vui lòng chờ trong giây lát</p>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="status-success">
          <div className="success-icon">✓</div>
          <h2>Thanh Toán Thành Công!</h2>
          <p>Đơn hàng của bạn đã được xác nhận</p>
          {orderInfo && (
            <div className="order-details">
              <p><strong>Mã đơn hàng:</strong> {orderInfo.orderCode}</p>
              <p><strong>Số tiền:</strong> {orderInfo.totalAmount?.toLocaleString()}đ</p>
              <p><strong>Trạng thái:</strong> <span className="status-paid">Đã thanh toán</span></p>
            </div>
          )}
          <p className="redirect-message">Đang chuyển hướng tới trang đơn hàng...</p>
        </div>
      )}

      {paymentStatus === 'pending' && (
        <div className="status-pending">
          <div className="spinner"></div>
          <h2>Đang Xử Lý Thanh Toán</h2>
          <p>Hệ thống đang xác nhận giao dịch của bạn</p>
          <p className="small-text">Vui lòng không đóng trang này</p>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="status-error">
          <div className="error-icon">✕</div>
          <h2>Có Lỗi Xảy Ra</h2>
          <p>Không thể kiểm tra trạng thái thanh toán</p>
          <button onClick={() => navigate('/checkout')} className="btn-retry">
            Quay Lại Thanh Toán
          </button>
        </div>
      )}

      <style jsx="true">{`
        .payment-result-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .status-checking,
        .status-success,
        .status-pending,
        .status-error {
          background: white;
          border-radius: 12px;
          padding: 60px 40px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 90%;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .success-icon {
          font-size: 60px;
          color: #4caf50;
          margin-bottom: 20px;
          animation: scaleIn 0.5s ease-out;
        }

        .error-icon {
          font-size: 60px;
          color: #f44336;
          margin-bottom: 20px;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        h2 {
          color: #333;
          margin: 20px 0 10px;
          font-size: 24px;
        }

        p {
          color: #666;
          margin: 10px 0;
          font-size: 16px;
        }

        .order-details {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          text-align: left;
        }

        .order-details p {
          margin: 10px 0;
          font-size: 14px;
        }

        .status-paid {
          background: #4caf50;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
        }

        .redirect-message {
          color: #999;
          font-size: 14px;
          margin-top: 20px;
        }

        .small-text {
          font-size: 14px;
          color: #999;
        }

        .btn-retry {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          transition: background 0.3s;
        }

        .btn-retry:hover {
          background: #5568d3;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;