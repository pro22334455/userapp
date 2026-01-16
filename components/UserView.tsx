
import React, { useState } from 'react';
import { Order, Language } from '../types';
import { fetchOrders, isConfigReady } from '../store';
import { 
  Search, 
  Loader2, 
  Package, 
  Clock, 
  CreditCard, 
  User, 
  Phone,
  MapPin,
  ShoppingBag,
  Hash,
  Box,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import TrackingMap from './TrackingMap';

interface Props { lang: Language; }

const UserView: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [searchCode, setSearchCode] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const code = searchCode.trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setError('');
    
    try {
      const orders = await fetchOrders('user');
      const order = orders ? orders.find(o => o.orderCode.trim().toUpperCase() === code) : null;
      
      if (order) {
        setFoundOrder(order);
      } else {
        setFoundOrder(null);
        setError(isAr ? 'عذراً، كود الشحنة غير موجود' : 'Shipment code not found');
      }
    } catch (err) {
      setError(isAr ? 'فشل الاتصال بالخادم' : 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const statusLabels: Record<string, string> = {
    'China_Store': isAr ? 'بانتظار الشحن من المتجر' : 'Pending from Store',
    'China_Warehouse': isAr ? 'وصلت مخزننا في الصين' : 'In China Warehouse',
    'En_Route': isAr ? 'في الشحن الدولي' : 'En Route',
    'Libya_Warehouse': isAr ? 'وصلت مخزننا في ليبيا' : 'In Libya Warehouse',
    'Out_for_Delivery': isAr ? 'خارجة للتوصيل مع المندوب' : 'Out for Delivery',
    'Delivered': isAr ? 'تم التسليم بنجاح' : 'Delivered'
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pb-32">
      {/* Search Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-blue-600/10 rounded-3xl mb-6">
          <Box className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
          {isAr ? 'تتبع شحنتك' : 'Track Your Package'}
        </h1>
        <p className="text-slate-500 font-medium">
          {isAr ? 'أدخل كود التتبع الخاص بك (مثلاً: LY-1234)' : 'Enter your tracking code (e.g., LY-1234)'}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative group mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
        <div className="relative bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col md:flex-row gap-2">
          <input
            className="flex-1 px-8 py-5 bg-transparent outline-none text-2xl font-black text-slate-900 placeholder:text-slate-300"
            placeholder="LY-XXXX"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Search className="w-6 h-6" />}
            {isAr ? 'تتبع الآن' : 'Track Now'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {foundOrder && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16"></div>
            
            {/* Order Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-50 pb-8">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-2 inline-block">
                  {isAr ? 'رقم الشحنة' : 'Tracking Number'}
                </span>
                <h2 className="text-4xl font-black text-slate-900 font-mono tracking-tighter">
                  {foundOrder.orderCode}
                </h2>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  {isAr ? 'حالة الشحنة' : 'Current Status'}
                </span>
                <div className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 ${
                  foundOrder.status === 'Delivered' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                }`}>
                  {foundOrder.status === 'Delivered' && <CheckCircle2 className="w-4 h-4" />}
                  {statusLabels[foundOrder.status]}
                </div>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Product Info Card */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3 mb-4 text-blue-600">
                  <ShoppingBag className="w-5 h-5" />
                  <h4 className="text-xs font-black uppercase tracking-widest">{isAr ? 'محتويات الطرد' : 'Package Details'}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm font-bold">{isAr ? 'المنتج:' : 'Product:'}</span>
                    <span className="text-slate-900 font-black">{foundOrder.productName || '---'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm font-bold">{isAr ? 'الكمية:' : 'Quantity:'}</span>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200">
                      <Hash className="w-3 h-3 text-blue-500" />
                      <span className="text-slate-900 font-black">{foundOrder.quantity}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-slate-500 text-sm font-bold">{isAr ? 'الإجمالي:' : 'Total:'}</span>
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-xl">
                      <CreditCard className="w-4 h-4" />
                      <span>{foundOrder.totalPrice} <small className="text-[10px]">LYD</small></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receiver Info Card */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3 mb-4 text-blue-600">
                  <User className="w-5 h-5" />
                  <h4 className="text-xs font-black uppercase tracking-widest">{isAr ? 'بيانات المستلم' : 'Receiver Info'}</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase">{isAr ? 'الاسم' : 'Name'}</p>
                      <p className="text-slate-900 font-black">{foundOrder.customerName}</p>
                    </div>
                  </div>
                  
                  {/* رقم الهاتف - تم الإصلاح هنا لضمان الظهور */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                      <Phone className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase">{isAr ? 'رقم الهاتف' : 'Phone Number'}</p>
                      <p className="text-slate-900 font-black tracking-widest">{foundOrder.customerPhone || '---'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                      <MapPin className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-400 font-black uppercase">{isAr ? 'العنوان' : 'Address'}</p>
                      <p className="text-slate-900 font-bold text-xs truncate">{foundOrder.customerAddress || '---'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Location Highlight */}
            <div className="bg-blue-600 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-blue-200 overflow-hidden relative">
              <div className="absolute top-0 right-0 opacity-10 -mr-4 -mt-4">
                <MapPin className="w-32 h-32" />
              </div>
              <div className="p-5 bg-white/20 backdrop-blur-md rounded-2xl">
                <Clock className="w-10 h-10" />
              </div>
              <div className="text-center md:text-right">
                <span className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-1 block">
                  {isAr ? 'الموقع الحالي الفعلي' : 'Current Physical Location'}
                </span>
                <p className="text-2xl font-black leading-tight">
                  {foundOrder.currentPhysicalLocation || statusLabels[foundOrder.status]}
                </p>
              </div>
            </div>

            {/* Live Tracking Map if out for delivery */}
            {foundOrder.status === 'Out_for_Delivery' && (
              <div className="mt-8">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {isAr ? 'تتبع المندوب مباشر' : 'Live Driver Tracking'}
                </h4>
                <div className="h-[350px] rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-inner relative">
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

      {/* Footer Info */}
      {!foundOrder && !loading && (
        <div className="mt-20 text-center opacity-40 grayscale pointer-events-none">
          <div className="flex justify-center gap-12 mb-8">
            <Package className="w-12 h-12" />
            <MapPin className="w-12 h-12" />
            <ShoppingBag className="w-12 h-12" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em]">LogiTrack Professional Delivery Network</p>
        </div>
      )}
    </div>
  );
};

export default UserView;
