
import React, { useState } from 'react';
import { Order, Language } from '../types';
import { fetchOrders } from '../store';
import { Search, Loader2, MapPin, ShoppingBag, CreditCard, User, Phone, Hash, Clock, AlertCircle } from 'lucide-react';
import TrackingMap from './TrackingMap';

interface Props { lang: Language; }

const UserView: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [searchCode, setSearchCode] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusLabels: Record<string, string> = {
    'China_Store': isAr ? 'Ø¨Ø§Ù†ØªØ¸Ø§Ø± Ø§Ù„Ø´Ø­Ù† Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±' : 'Pending Shipment',
    'China_Warehouse': isAr ? 'ÙˆØµÙ„Øª Ù…Ø®Ø²Ù†Ù†Ø§ ÙÙŠ Ø§Ù„ØµÙŠÙ†' : 'In China Warehouse',
    'En_Route': isAr ? 'ÙÙŠ Ø§Ù„Ø´Ø­Ù† Ø§Ù„Ø¯ÙˆÙ„ÙŠ' : 'En Route',
    'Libya_Warehouse': isAr ? 'ÙˆØµÙ„Øª Ù…Ø®Ø§Ø²Ù†Ù†Ø§ ÙÙŠ Ù„ÙŠØ¨ÙŠØ§' : 'In Libya Warehouse',
    'Out_for_Delivery': isAr ? 'Ø®Ø±Ø¬Øª Ù…Ø¹ Ø§Ù„Ù…Ù†Ø¯ÙˆØ¨ Ù„Ù„ØªÙˆØµÙŠÙ„' : 'Out for Delivery',
    'Delivered': isAr ? 'ØªÙ… ØªØ³Ù„ÙŠÙ… Ø§Ù„Ø´Ø­Ù†Ø© Ø¨Ù†Ø¬Ø§Ø­' : 'Delivered'
  };

  const handleSearch = async () => {
    if (!searchCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const orders = await fetchOrders();
      const order = orders.find(o => o.orderCode.trim().toUpperCase() === searchCode.trim().toUpperCase());
      if (order) {
        setFoundOrder(order);
      } else { 
        setFoundOrder(null); 
        setError(isAr ? 'Ø¹Ø°Ø±Ø§Ù‹ØŒ ÙƒÙˆØ¯ Ø§Ù„Ø´Ø­Ù†Ø© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' : 'Shipment not found'); 
      }
    } catch (err) {
      setError(isAr ? 'Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø§Ù„Ø³ÙŠØ±ÙØ±' : 'Server connection error');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto pb-24 ar-text">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          {isAr ? 'ØªØªØ¨Ø¹ Ø´Ø­Ù†ØªÙƒ' : 'Track Package'}
        </h1>
        <p className="text-slate-500 text-sm">
          {isAr ? 'Ø£Ø¯Ø®Ù„ ÙƒÙˆØ¯ Ø§Ù„ØªØªØ¨Ø¹ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ (Ù…Ø«Ø§Ù„: LY-1234)' : 'Enter your tracking code (e.g. LY-1234)'}
        </p>
      </div>

      <div className="bg-white p-2 rounded-3xl shadow-xl border flex flex-col md:flex-row gap-2 mb-6">
        <input
          className="flex-1 px-6 py-4 bg-transparent outline-none text-xl font-bold uppercase"
          placeholder="LY-XXXX"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
          {isAr ? 'Ø¨Ø­Ø«' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 mb-6 font-bold border border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {foundOrder && (
        <div className="space-y-4">
          <div className="bg-white rounded-[2rem] border shadow-lg p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase">{isAr ? 'Ø±Ù‚Ù… Ø§Ù„ØªØªØ¨Ø¹' : 'Order ID'}</p>
                <h2 className="text-2xl font-black text-blue-600">{foundOrder.orderCode}</h2>
              </div>
              <div className="text-left bg-blue-50 px-3 py-1 rounded-lg">
                <p className="text-blue-600 text-[10px] font-black uppercase">{isAr ? 'Ø§Ù„Ø­Ø§Ù„Ø©' : 'Status'}</p>
                <span className="font-bold text-xs">{statusLabels[foundOrder.status]}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-xs font-black uppercase">{isAr ? 'Ø§Ù„Ù…Ù†ØªØ¬' : 'Product'}</span>
                </div>
                <p className="font-bold text-slate-800">{foundOrder.productName || '---'}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500">{isAr ? 'Ø§Ù„ÙƒÙ…ÙŠØ©' : 'Qty'}</span>
                  <span className="font-black text-blue-600">{foundOrder.quantity}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-black uppercase">{isAr ? 'Ø§Ù„Ù…Ø³ØªÙ„Ù…' : 'Receiver'}</span>
                </div>
                <p className="font-bold text-slate-800">{foundOrder.customerName}</p>
                <p className="text-sm text-slate-500 flex items-center gap-2"><Phone className="w-3 h-3" /> {foundOrder.customerPhone || '---'}</p>
              </div>
            </div>

            <div className="bg-blue-600 rounded-2xl p-5 text-white flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl"><Clock className="w-6 h-6" /></div>
              <div>
                <p className="text-white/60 text-[10px] font-black uppercase">{isAr ? 'Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø­Ø§Ù„ÙŠ' : 'Current Location'}</p>
                <p className="font-black text-lg">{foundOrder.currentPhysicalLocation || statusLabels[foundOrder.status]}</p>
              </div>
            </div>

            {foundOrder.status === 'Out_for_Delivery' && (
              <div className="h-64 rounded-2xl overflow-hidden border-2 border-slate-100">
                <TrackingMap 
                  driverLoc={foundOrder.driverLocation} 
                  customerLoc={foundOrder.customerLocation} 
                  isSimulating={true} 
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserView;
