
import React, { useState } from 'react';
import { Order, Language } from '../types';
import { fetchOrders } from '../store';
import { Search, Loader2, MapPin, ShoppingBag, CreditCard, User, Phone, Hash, Clock } from 'lucide-react';
import TrackingMap from './TrackingMap';

interface Props { lang: Language; }

const UserView: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [searchCode, setSearchCode] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchCode) return;
    setLoading(true);
    setError('');
    try {
      const orders = await fetchOrders();
      const order = orders.find(o => o.orderCode.trim().toUpperCase() === searchCode.trim().toUpperCase());
      if (order) {
        setFoundOrder(order);
      } else { 
        setFoundOrder(null); 
        setError(isAr ? 'Ø¹Ø°Ø±Ø§Ù‹ØŒ ÙƒÙˆØ¯ Ø§Ù„Ø´Ø­Ù†Ø© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯ ÙÙŠ Ø§Ù„Ù†Ø¸Ø§Ù…' : 'Shipment code not found'); 
      }
    } catch (err) {
      setError(isAr ? 'Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø§ØªØµØ§Ù„ØŒ ÙŠØ±Ø¬Ù‰ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù„Ø§Ø­Ù‚Ø§Ù‹' : 'Connection error, please try again');
    }
    setLoading(false);
  };

  const statusLabels: Record<string, string> = {
    'China_Store': isAr ? 'Ø¨Ø§Ù†ØªØ¸Ø§Ø± Ø§Ù„Ø´Ø­Ù† Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±' : 'Pending Shipment',
    'China_Warehouse': isAr ? 'ÙˆØµÙ„Øª Ù…Ø®Ø²Ù†Ù†Ø§ ÙÙŠ Ø§Ù„ØµÙŠÙ†' : 'In China Warehouse',
    'En_Route': isAr ? 'ÙÙŠ Ø§Ù„Ø´Ø­Ù† Ø§Ù„Ø¯ÙˆÙ„ÙŠ (Ø¹Ø¨Ø± Ø§Ù„Ø¨Ø­Ø±/Ø§Ù„Ø¬Ùˆ)' : 'En Route',
    'Libya_Warehouse': isAr ? 'ÙˆØµÙ„Øª Ù…Ø®Ø§Ø²Ù†Ù†Ø§ ÙÙŠ Ù„ÙŠØ¨ÙŠØ§' : 'In Libya Warehouse',
    'Out_for_Delivery': isAr ? 'Ø®Ø±Ø¬Øª Ù…Ø¹ Ø§Ù„Ù…Ù†Ø¯ÙˆØ¨ Ù„Ù„ØªÙˆØµÙŠÙ„' : 'Out for Delivery',
    'Delivered': isAr ? 'ØªÙ… ØªØ³Ù„ÙŠÙ… Ø§Ù„Ø´Ø­Ù†Ø© Ø¨Ù†Ø¬Ø§Ø­' : 'Delivered'
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          {isAr ? 'ØªØªØ¨Ø¹ Ø´Ø­Ù†ØªÙƒ' : 'Track Package'}
        </h1>
        <p className="text-slate-500">
          {isAr ? 'Ø£Ø¯Ø®Ù„ ÙƒÙˆØ¯ Ø§Ù„ØªØªØ¨Ø¹ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù„Ù…Ø¹Ø±ÙØ© ÙƒØ§ÙØ© Ø§Ù„ØªÙØ§ØµÙŠÙ„' : 'Enter your code to see all details'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border mb-8 flex flex-col md:flex-row gap-2 transition-all focus-within:ring-2 ring-blue-500/20">
        <input
          className="flex-1 px-8 py-5 bg-transparent outline-none text-2xl font-black uppercase placeholder:normal-case"
          placeholder="LY-XXXX"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[2rem] font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (isAr ? 'ØªØªØ¨Ø¹ Ø§Ù„Ø¢Ù†' : 'Track')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold mb-6 animate-pulse">
          {error}
        </div>
      )}

      {/* Result Card */}
      {foundOrder && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[2.5rem] border shadow-xl p-8 space-y-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 left-0 h-2 bg-blue-600"></div>
            
             <div className="flex justify-between items-center border-b pb-6">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    {isAr ? 'Ø±Ù‚Ù… Ø§Ù„ØªØªØ¨Ø¹' : 'Tracking ID'}
                  </p>
                  <h2 className="text-3xl font-black text-blue-600">{foundOrder.orderCode}</h2>
                </div>
                <div className="text-left">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-right">
                    {isAr ? 'Ø§Ù„Ø­Ø§Ù„Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©' : 'Current Status'}
                  </p>
                  <span className="inline-block mt-1 bg-blue-50 text-blue-600 px-4 py-1 rounded-full font-bold text-sm">
                    {statusLabels[foundOrder.status]}
                  </span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Package Details */}
                <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">
                    {isAr ? 'Ù…Ø­ØªÙˆÙŠØ§Øª Ø§Ù„Ø·Ø±Ø¯' : 'Package Contents'}
                  </h4>
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-slate-800">
                      {foundOrder.productName || (isAr ? 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯' : 'N/A')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-slate-800">
                      {isAr ? `Ø§Ù„ÙƒÙ…ÙŠØ©: ${foundOrder.quantity}` : `Qty: ${foundOrder.quantity}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t mt-2">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {isAr ? 'Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ' : 'Total Price'}
                        </p>
                        <p className="text-xl font-black text-emerald-600">{foundOrder.totalPrice} LYD</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Receiver Info */}
                <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">
                    {isAr ? 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø³ØªÙ„Ù…' : 'Receiver Info'}
                  </h4>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-slate-800">{foundOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-slate-800 font-mono tracking-tighter">
                      {foundOrder.customerPhone || '---'}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                    <span className="font-bold text-slate-800 text-sm leading-tight">
                      {foundOrder.customerAddress || (isAr ? 'Ù„Ù… ÙŠØªÙ… ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ø¹Ù†ÙˆØ§Ù†' : 'No address')}
                    </span>
                  </div>
                </div>
             </div>

             {/* Location Banner */}
             <div className="bg-blue-600 text-white p-6 rounded-3xl flex items-center gap-6 shadow-xl shadow-blue-200">
                <div className="p-3 bg-white/20 rounded-xl"><Clock className="w-8 h-8" /></div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                    {isAr ? 'Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ« Ù„Ù„Ù…ÙˆÙ‚Ø¹' : 'Last Known Location'}
                  </p>
                  <p className="text-xl font-black">
                    {foundOrder.currentPhysicalLocation || statusLabels[foundOrder.status]}
                  </p>
                </div>
             </div>

             {/* Map for Live Tracking */}
             {foundOrder.status === 'Out_for_Delivery' && (
               <div className="space-y-4 animate-bounce-subtle">
                  <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    {isAr ? 'ØªØªØ¨Ø¹ Ø§Ù„Ù…Ù†Ø¯ÙˆØ¨ Ù…Ø¨Ø§Ø´Ø±Ø©' : 'Live Driver Tracking'}
                  </div>
                  <div className="h-[300px] rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl relative z-10">
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
      )}
    </div>
  );
};

export default UserView;
