import React, { useState } from 'react';
import { Order, Language } from '../types';
import { fetchOrders } from '../store';
import { Search, Loader2, ShoppingBag, User, Clock, AlertCircle, Package, Hash, CreditCard } from 'lucide-react';
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
      setError(isAr ? 'Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø§Ù„Ø³ÙŠØ±ÙØ±' : 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12 pb-24">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] mb-6 shadow-sm border border-blue-100">
          <Package className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {isAr ? 'ØªØªØ¨Ø¹ Ø´Ø­Ù†ØªÙƒ' : 'Track Your Package'}
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">
          {isAr ? 'Ø£Ø¯Ø®Ù„ ÙƒÙˆØ¯ Ø§Ù„ØªØªØ¨Ø¹ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ø­Ø§Ù„Ø© Ø§Ù„Ø·Ø±Ø¯' : 'Enter your code to track in real-time'}
        </p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col sm:flex-row gap-2 mb-10 transition-all focus-within:ring-2 ring-blue-500/20">
        <input
          className="flex-1 px-6 py-4 bg-transparent outline-none text-xl font-bold uppercase text-slate-800 placeholder:text-slate-300"
          placeholder="LY-XXXX"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-200"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
          <span>{isAr ? 'Ø¨Ø­Ø«' : 'Search'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-5 rounded-2xl flex items-center gap-3 mb-10 border border-red-100 font-bold animate-in fade-in duration-300">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {foundOrder && (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500 fill-mode-both">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 p-6 md:p-8 text-white flex justify-between items-center relative">
              <div className="absolute top-0 right-0 left-0 h-1 bg-blue-600"></div>
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">{isAr ? 'Ø±Ù‚Ù… Ø§Ù„ØªØªØ¨Ø¹' : 'Tracking ID'}</p>
                <h2 className="text-2xl md:text-3xl font-black text-blue-400">{foundOrder.orderCode}</h2>
              </div>
              <div className="text-left bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl backdrop-blur-md">
                 <p className="text-blue-400 text-[10px] font-black uppercase mb-1">{isAr ? 'Ø§Ù„Ø­Ø§Ù„Ø©' : 'Status'}</p>
                 <p className="font-black text-sm md:text-base whitespace-nowrap">{statusLabels[foundOrder.status]}</p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-3xl flex items-start gap-4 border border-slate-100">
                  <div className="p-3 bg-white text-blue-600 rounded-2xl shadow-sm"><ShoppingBag className="w-5 h-5" /></div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1">{isAr ? 'Ø§Ù„Ù…Ù†ØªØ¬' : 'Product'}</p>
                    <p className="font-bold text-slate-800 text-sm md:text-base">{foundOrder.productName || '---'}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl flex items-start gap-4 border border-slate-100">
                  <div className="p-3 bg-white text-blue-600 rounded-2xl shadow-sm"><User className="w-5 h-5" /></div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1">{isAr ? 'Ø§Ù„Ù…Ø³ØªÙ„Ù…' : 'Receiver'}</p>
                    <p className="font-bold text-slate-800 text-sm md:text-base">{foundOrder.customerName}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 p-6 rounded-[2rem] flex items-center gap-5 text-white shadow-xl shadow-blue-100">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-blue-200 text-[10px] font-black uppercase mb-1">{isAr ? 'Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø­Ø§Ù„ÙŠ' : 'Live Location'}</p>
                  <p className="font-black text-lg md:text-xl leading-tight">
                    {foundOrder.currentPhysicalLocation || statusLabels[foundOrder.status]}
                  </p>
                </div>
              </div>

              {foundOrder.status === 'Out_for_Delivery' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-black text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                      {isAr ? 'ØªØªØ¨Ø¹ Ø§Ù„Ù…Ù†Ø¯ÙˆØ¨ Ù…Ø¨Ø§Ø´Ø±' : 'Live Driver Tracking'}
                    </p>
                  </div>
                  <div className="h-64 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner relative">
                    <TrackingMap 
                      driverLoc={foundOrder.driverLocation} 
                      customerLoc={foundOrder.customerLocation} 
                      isSimulating={true} 
                    />
                  </div>
                </div>
              )}
              
              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="text-center p-4">
                      <Hash className="w-4 h-4 mx-auto mb-2 text-slate-300" />
                      <p className="text-slate-400 text-[10px] font-bold uppercase">{isAr ? 'Ø§Ù„ÙƒÙ…ÙŠØ©' : 'Qty'}</p>
                      <p className="font-black text-slate-800">{foundOrder.quantity}</p>
                  </div>
                  <div className="text-center p-4">
                      <CreditCard className="w-4 h-4 mx-auto mb-2 text-slate-300" />
                      <p className="text-slate-400 text-[10px] font-bold uppercase">{isAr ? 'Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ' : 'Total'}</p>
                      <p className="font-black text-emerald-600">{foundOrder.totalPrice} LYD</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserView;
