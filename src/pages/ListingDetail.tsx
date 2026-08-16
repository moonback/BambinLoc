import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Calendar, ShieldCheck, Check, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext.tsx';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ListingDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, signInWithGoogle, getToken } = useAuth();
  
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/listings/${slug}`)
      .then(res => res.json())
      .then(data => setListing(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleBooking = async () => {
    if (!user) {
      toast('Vous devez être connecté pour réserver', {
        action: {
          label: 'Se connecter',
          onClick: () => signInWithGoogle()
        }
      });
      return;
    }

    if (!date.from || !date.to) {
      toast.error('Veuillez sélectionner vos dates de location');
      return;
    }

    const days = differenceInDays(date.to, date.from) + 1;
    const totalPrice = days * parseFloat(listing.dailyPrice);

    setBookingLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId: listing.id,
          startDate: format(date.from, 'yyyy-MM-dd'),
          endDate: format(date.to, 'yyyy-MM-dd'),
          totalPrice
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la réservation');

      toast.success('Demande de réservation envoyée !');
      navigate('/mes-reservations');
    } catch (error) {
      toast.error('Impossible de finaliser la réservation');
    } finally {
      setBookingLoading(false);
    }
  };

  const daysSelected = date.from && date.to ? Math.max(1, differenceInDays(date.to, date.from) + 1) : 0;
  const computedPrice = daysSelected > 0 ? daysSelected * parseFloat(listing.dailyPrice || '0') : 0;

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Chargement...</div>;
  }

  if (!listing || listing.error) {
    return <div className="container mx-auto p-8 text-center text-red-500">Annonce non trouvée</div>;
  }

  return (
    <div className="bg-white">
      {/* Gallery */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] md:h-[500px] rounded-2xl overflow-hidden">
          <div className="h-full">
            <img 
              src={listing.images?.[0]?.url || "https://images.unsplash.com/photo-1522771930-78848d92871d?w=800&auto=format&fit=crop"} 
              alt={listing.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            <img src={listing.images?.[1]?.url || listing.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
            <img src={listing.images?.[2]?.url || listing.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
            <img src={listing.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
            <img src={listing.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <Link to={`/recherche?categorie=${listing.category?.slug}`} className="hover:underline">
                  {listing.category?.name}
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {listing.city}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{listing.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-slate-900">4.9</span> (12 avis)
                </span>
                <span>•</span>
                <span>Très bon état</span>
              </div>
            </div>

            <hr />

            {/* Owner Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={listing.owner?.profilePicture} />
                <AvatarFallback>{listing.owner?.firstName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">Loué par {listing.owner?.firstName}</h3>
                <p className="text-slate-500 text-sm">Membre depuis 2023 • Taux de réponse : 100%</p>
              </div>
            </div>

            <hr />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p>{listing.description}</p>
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-slate-600">
                {listing.brand && <div className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Marque : {listing.brand}</div>}
                {listing.model && <div className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Modèle : {listing.model}</div>}
                {listing.condition && <div className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> État : {listing.condition}</div>}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
              <div className="mb-6">
                <span className="text-3xl font-bold text-slate-900">{listing.dailyPrice} €</span>
                <span className="text-slate-500"> / jour</span>
              </div>

              <div className="space-y-4 mb-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="grid grid-cols-2 gap-2 border border-slate-300 rounded-xl p-1 cursor-pointer hover:border-slate-400 transition-colors">
                      <div className="p-3 border-r border-slate-300">
                        <label className="block text-xs font-bold uppercase text-slate-900 mb-1 cursor-pointer">Départ</label>
                        <div className="text-sm text-slate-600">
                          {date.from ? format(date.from, 'dd MMM', { locale: fr }) : 'Ajouter dates'}
                        </div>
                      </div>
                      <div className="p-3">
                        <label className="block text-xs font-bold uppercase text-slate-900 mb-1 cursor-pointer">Retour</label>
                        <div className="text-sm text-slate-600">
                          {date.to ? format(date.to, 'dd MMM', { locale: fr }) : 'Ajouter dates'}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarUI
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={(range: any) => setDate(range)}
                      numberOfMonths={2}
                      locale={fr}
                      disabled={(d) => d < new Date()}
                    />
                  </PopoverContent>
                </Popover>

                {daysSelected > 0 && (
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>{listing.dailyPrice} € x {daysSelected} jours</span>
                      <span>{computedPrice} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de service (5%)</span>
                      <span>{(computedPrice * 0.05).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pt-2 border-t">
                      <span>Total</span>
                      <span>{(computedPrice * 1.05).toFixed(2)} €</span>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                size="lg" 
                className="w-full text-lg h-14 rounded-xl" 
                onClick={handleBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Réservation...' : 'Réserver'}
              </Button>

              <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                <div className="text-sm text-slate-600">
                  <p className="font-semibold text-slate-900 mb-1">Caution : {listing.depositAmount} €</p>
                  <p>Non débitée. Une empreinte bancaire sera prise pour garantir la location.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
