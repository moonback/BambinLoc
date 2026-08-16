import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext.tsx';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, PackageOpen, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export default function TenantDashboard() {
  const { user, getToken } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const token = await getToken();
        const res = await fetch('/api/bookings/tenant', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Mes réservations</h1>
        <p className="text-slate-600 mb-8">Connectez-vous pour voir vos réservations.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'CONFIRMED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmée</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Annulée</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes réservations</h1>
        <p className="text-slate-600">Retrouvez l'historique de vos locations.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-slate-100 rounded-xl h-32 w-full"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <PackageOpen className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune réservation pour le moment</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              Vous n'avez pas encore réservé de matériel. Parcourez les annonces pour trouver ce dont vous avez besoin.
            </p>
            <Link to="/recherche" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Explorer les annonces
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="w-full sm:w-48 h-48 sm:h-auto bg-slate-100 shrink-0 relative">
                  <img 
                    src={booking.listing?.images?.[0]?.url || "https://images.unsplash.com/photo-1522771930-78848d92871d?w=400&auto=format&fit=crop"} 
                    alt={booking.listing?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/annonce/${booking.listing?.slug}`} className="hover:underline">
                        <h3 className="text-xl font-bold text-slate-900">{booking.listing?.title}</h3>
                      </Link>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="space-y-2 mt-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        <span>Du {format(parseISO(booking.startDate), 'dd MMMM yyyy', { locale: fr })} au {format(parseISO(booking.endDate), 'dd MMMM yyyy', { locale: fr })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>À retirer à : <span className="font-medium text-slate-900">{booking.listing?.city}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t pt-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={booking.owner?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${booking.owner?.firstName}`} 
                        alt="Propriétaire" 
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="text-sm">
                        <p className="text-slate-500">Loué par</p>
                        <p className="font-medium text-slate-900">{booking.owner?.firstName} {booking.owner?.lastName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500 mb-1">Total payé</p>
                      <p className="text-lg font-bold text-slate-900">{booking.totalPrice} €</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
