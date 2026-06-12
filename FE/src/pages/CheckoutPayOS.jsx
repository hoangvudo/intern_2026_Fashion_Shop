import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckoutStore } from '../store/checkoutStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import api from '../services/api';
import orderService from '../services/orderService';

const CheckoutPayOS = () => {
  const navigate = useNavigate();
  const { checkoutData, setCheckoutData } = useCheckoutStore();
  const { user } = useAuthStore();
  const { items, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = subtotal + 20000;

  const handlePayment = async () => {
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      const orderData = {
        shippingName: user.fullName,
        shippingPhone: user.phone,
        shippingAddress: checkoutData.address || "Địa chỉ nhận hàng",
        paymentMethod: 'PAYOS',
        items: items.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price }))
      };
      const orderRes = await orderService.placeOrder(orderData);
      const payRes = await api.post(`/orders/${orderRes.id}/payos/create`);
      
      setPaymentLink(payRes.data);
      setShowQR(true);
      clearCart();
    } catch (error) {
      alert('Lỗi: Mã đơn hàng có thể đã tồn tại trên PayOS. Hãy thử tạo đơn mới!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '15px', textAlign: 'center', background: '#fff' }}>
      {!showQR ? (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Xác nhận thanh toán</h2>
          <div style={{ textAlign: 'left', marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
            <p><strong>Tổng tiền:</strong> <span style={{ color: '#ee4d2d', fontSize: '1.2rem' }}>{totalAmount.toLocaleString()}đ</span></p>
            <p><strong>Phương thức:</strong> Chuyển khoản qua PayOS</p>
          </div>
          <button onClick={handlePayment} disabled={loading} style={{ width: '100%', padding: '15px', background: '#ee4d2d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'ĐANG TẠO MÃ QR...' : 'TIẾP TỤC THANH TOÁN'}
          </button>
        </div>
      ) : (
        <div>
          <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Quét mã VietQR</h2>
          
          {/* SỬ DỤNG DỊCH VỤ VIETQR CHUẨN ĐỂ HIỂN THỊ ẢNH */}
          <div style={{ margin: '20px 0', padding: '10px', background: '#fff', border: '2px solid #007bff', borderRadius: '12px', display: 'inline-block' }}>
            <img 
              src={`https://img.vietqr.io/image/${paymentLink.bin}-${paymentLink.accountNumber}-compact2.png?amount=${paymentLink.amount}&addInfo=${encodeURIComponent(paymentLink.description )}&accountName=${encodeURIComponent(paymentLink.accountName)}`} 
              alt="VietQR Code" 
              style={{ width: '300px', height: 'auto' }} 
            />
          </div>

          <div style={{ textAlign: 'left', background: '#f8f9fa', padding: '15px', borderRadius: '10px', fontSize: '0.9rem', margin: '15px 0' }}>
            <p><strong>Ngân hàng:</strong> VietinBank (Mã: {paymentLink.bin})</p>
            <p><strong>Số tài khoản:</strong> <span style={{ color: '#007bff' }}>{paymentLink.accountNumber}</span></p>
            <p><strong>Chủ tài khoản:</strong> {paymentLink.accountName}</p>
            <p><strong>Nội dung:</strong> <span style={{ color: '#ee4d2d', fontWeight: 'bold' }}>{paymentLink.description}</span></p>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>
            * Hệ thống sẽ tự động xác nhận sau khi bạn chuyển khoản thành công.
          </p>

          <button onClick={() => navigate('/my-orders')} style={{ marginTop: '20px', padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Xem đơn hàng của tôi
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPayOS;
