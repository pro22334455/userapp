import React, { useState } from 'react';
import { Order, Language } from '../types';
import { fetchOrders } from '../store';
import { Search, Loader2, ShoppingBag, User, Phone, Clock, AlertCircle, Package } from 'lucide-react';
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
    const code = searchCode.trim().toUpperCase();
    if (!code) return;
    
    setLoading(true);
    setError('');
    setFoundOrder(null);

    try {
      const orders = await fetchOrders();
      const order = orders.find(o => o.orderCode.trim().toUpperCase() === code);
      
      if (order) {
        setFoundOrder(order);
      } else {
        setError(isAr ? 'Ø¹Ø°Ø±Ø§Ù‹ØŒ ÙƒÙˆØ¯ Ø§Ù„Ø´Ø­Ù†Ø© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' : 'Shipment not found');
      }
    } catch (err) {
      setError(isAr ? 'Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø§Ù„Ø³ÙŠØ±ÙØ±' : 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 pb-24">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isAr ? 'ØªØªØ¨Ø¹ Ø´Ø­Ù†ØªÙƒ' : 'Track Your Package'}
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          {isAr ? 'Ø£Ø¯Ø®Ù„ ÙƒÙˆØ¯ Ø§Ù„ØªØªØ¨Ø¹ (Ù…Ø«Ø§Ù„: LY-1001)' : 'Enter tracking code (e.g. LY-1001)'}
        </p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-md border border-slate-200 flex flex-col sm:flex-row gap-2 mb-8">
        <input
          className="flex-1 px-4 py-3 bg-transparent outline-none text-lg font-bold uppercase text-slate-700"
          placeholder="LY-XXXX"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
          <span>{isAr ? 'ØªØªØ¨Ø¹' : 'Track'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8 border border-red-100 text-sm font-bold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {foundOrder && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">{isAr ? 'Ø±Ù‚Ù… Ø§Ù„ØªØªØ¨Ø¹' : 'Tracking No.'}</p>
                <h2 className="text-xl font-bold text-blue-400">{foundOrder.orderCode}</h2>
              </div>
              <div className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-lg">
                 <p className="text-blue-400 text-[10px] font-bold uppercase">{isAr ? 'Ø§Ù„Ø­Ø§Ù„Ø©' : 'Status'}</p>
                 <p className="font-bold text-xs">{statusLabels[foundOrder.status]}</p>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3">
                  <ShoppingBag className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">{isAr ? 'Ø§Ù„Ù…Ù†ØªØ¬' : 'Product'}</p>
                    <p className="font-bold text-slate-800 text-sm">{foundOrder.productName || '---'}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">{isAr ? 'Ø§Ù„Ù…Ø³ØªÙ„Ù…' : 'Receiver'}</p>
                    <p className="font-bold text-slate-800 text-sm">{foundOrder.customerName}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-blue-400 text-[10px] font-bold uppercase">{isAr ? 'Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø­Ø§Ù„ÙŠ' : 'Current Location'}</p>
                  <p className="font-bold text-blue-900 text-md">
                    {foundOrder.currentPhysicalLocation || statusLabels[foundOrder.status]}
                  </p>
                </div>
              </div>

              {foundOrder.status === 'Out_for_Delivery' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    {isAr ? 'ØªØªØ¨Ø¹ Ø§Ù„Ù…Ù†Ø¯ÙˆØ¨ (Ù…Ø¨Ø§Ø´Ø±)' : 'Live Driver Tracking'}
                  </p>
                  <div className="h-48 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                    <TrackingMap 
                      driverLoc={foundOrder.driverLocation} 
                      customerLoc={foundOrder.customerLocation} 
                      isSimulating={true} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserView;
