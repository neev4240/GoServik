import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';

export function BookingFlow() {
  const { proId } = useParams<{ proId: string }>();
  const navigate = useNavigate();
  const { professionals, currentUser, bookService } = useStore();
  
  const pro = professionals.find(p => p.id === proId);
  const [step, setStep] = useState(1);
  
  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Generate next 14 days for booking
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i + 1));
  const availableTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  if (!pro) return <div>Professional not found</div>;

  // Enforce authentication
  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md p-8 text-center mt-20 border rounded-2xl shadow-sm bg-white">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in Required</h2>
        <p className="text-slate-500 mb-6">You need to sign in to your customer account to book a professional.</p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          <Button asChild><Link to="/login">Sign In</Link></Button>
        </div>
      </div>
    );
  }

  const selectedService = pro.services.find(s => s.id === selectedServiceId);

  const handleBook = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    bookService({
      customerId: currentUser.id,
      professionalId: pro.id,
      serviceId: selectedService.id,
      date: selectedDate.toISOString(),
      time: selectedTime,
      notes,
      totalPrice: selectedService.basePrice // Simple pricing for now
    });
    setStep(4); // Success step
  };

  return (
    <div className="bg-transparent min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {step > 1 ? 'Back to previous step' : 'Cancel booking'}
        </button>

        {step < 4 && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Book {pro.name}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className={`px-2.5 py-1 rounded-full font-medium ${step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-200'}`}>1. Service</span>
              <div className="h-px w-4 bg-slate-300" />
              <span className={`px-2.5 py-1 rounded-full font-medium ${step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-200'}`}>2. Date & Time</span>
              <div className="h-px w-4 bg-slate-300" />
              <span className={`px-2.5 py-1 rounded-full font-medium ${step >= 3 ? 'bg-slate-900 text-white' : 'bg-slate-200'}`}>3. Confirm</span>
            </div>
          </div>
        )}

        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg border border-white/40 overflow-hidden">
          {step === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Select a Service</h2>
              <div className="space-y-3">
                {pro.services.map(service => (
                  <label 
                    key={service.id} 
                    className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedServiceId === service.id ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <input 
                      type="radio" 
                      name="service" 
                      value={service.id}
                      checked={selectedServiceId === service.id}
                      onChange={() => setSelectedServiceId(service.id)}
                      className="mt-1 mr-4 h-4 w-4 text-slate-900 focus:ring-slate-900"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-900">{service.name}</span>
                        <span className="font-bold">₹{service.basePrice}</span>
                      </div>
                      <p className="text-sm text-slate-500">{service.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!selectedServiceId} size="lg">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Select Date & Time</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" /> Available Dates
                </h3>
                <div className="flex overflow-x-auto pb-4 gap-3 snap-x scrollbar-hide">
                  {availableDates.map(date => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 min-w-[80px] shrink-0 snap-start transition-all ${isSelected ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                      >
                        <span className="text-xs uppercase font-medium opacity-80">{format(date, 'MMM')}</span>
                        <span className="text-xl font-bold my-1">{format(date, 'd')}</span>
                        <span className="text-xs font-medium opacity-80">{format(date, 'EEE')}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className="mb-6 animate-in slide-in-from-bottom-4 duration-300">
                  <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Available Times
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 rounded-lg border-2 text-sm font-medium transition-all ${selectedTime === time ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t flex justify-end">
                <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime} size="lg">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && selectedService && selectedDate && (
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Review & Confirm</h2>
              
              <div className="bg-white/50 backdrop-blur-md rounded-xl p-6 border border-white/50 mb-6">
                <div className="flex gap-4 mb-6 pb-6 border-b">
                  <img src={pro.avatar} alt={pro.name} className="h-16 w-16 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{pro.name}</h3>
                    <p className="text-slate-500 text-sm">{pro.tagline}</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service</span>
                    <span className="font-medium text-slate-900">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date</span>
                    <span className="font-medium text-slate-900">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time</span>
                    <span className="font-medium text-slate-900">{selectedTime}</span>
                  </div>
                  <div className="pt-4 mt-4 border-t flex justify-between text-base">
                    <span className="font-bold text-slate-900">Total Price</span>
                    <span className="font-bold text-slate-900">₹{selectedService.basePrice}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes for Professional (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 min-h-[100px]"
                  placeholder="Describe your issue or provide specific instructions..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>Back</Button>
                <Button size="lg" onClick={handleBook}>Confirm Booking</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-12 text-center">
              <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Your booking request has been sent to {pro.name}. You can manage this booking in your dashboard.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link to="/explore">Explore More</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
