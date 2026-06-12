import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCheckoutStore from '../store/checkoutStore';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const order = useCheckoutStore((state) => state.order);
  const checkoutData = order || {};

  useEffect(() => {
    // Redirect về trang checkout sau 5 giây
    const timer = setTimeout(() => {
      navigate('/checkout');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="payment-cancel-container">
      <div className="cancel-content">
        <div className="cancel-icon">✕</div>
        <h2>Thanh Toán Bị Huỷ</h2>
        <p>Bạn đã huỷ giao dịch thanh toán</p>
        
        {checkoutData.orderCode && (
          <div className="order-info">
            <p><strong>Mã đơn hàng:</strong> {checkoutData.orderCode}</p>
            <p className="info-note">Đơn hàng của bạn vẫn được lưu. Bạn có thể quay lại để thanh toán sau.</p>
          </div>
        )}

        <div className="action-buttons">
          <button 
            onClick={() => navigate('/checkout')} 
            className="btn-retry"
          >
            Quay Lại Thanh Toán
          </button>
          <button 
            onClick={() => navigate('/my-orders')} 
            className="btn-orders"
          >
            Xem Đơn Hàng Của Tôi
          </button>
        </div>

        <p className="redirect-message">Tự động chuyển hướng sau 5 giây...</p>
      </div>

      <style jsx>{`
        .payment-cancel-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .cancel-content {
          background: white;
          border-radius: 12px;
          padding: 60px 40px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 90%;
        }

        .cancel-icon {
          font-size: 60px;
          color: #f5576c;
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

        .order-info {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          border-radius: 4px;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
        }

        .order-info p {
          margin: 8px 0;
          font-size: 14px;
        }

        .info-note {
          color: #856404;
          font-size: 13px;
          margin-top: 10px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          margin: 30px 0;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-retry,
        .btn-orders {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          flex: 1;
          min-width: 150px;
        }

        .btn-retry {
          background: #f5576c;
          color: white;
        }

        .btn-retry:hover {
          background: #e63946;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(245, 87, 108, 0.3);
        }

        .btn-orders {
          background: #e9ecef;
          color: #333;
        }

        .btn-orders:hover {
          background: #dee2e6;
          transform: translateY(-2px);
        }

        .redirect-message {
          color: #999;
          font-size: 14px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default PaymentCancel;