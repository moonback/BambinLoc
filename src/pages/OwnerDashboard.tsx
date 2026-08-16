import { useAuth } from '@/context/AuthContext.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Package, CalendarDays, MessageSquare, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function OwnerDashboard() {
  const { user, signInWithGoogle, getToken } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const token = await getToken();
      const res = await fetch('/api/bookings/owner', {
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

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleStatusChange = async (bookingId: number, status: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        toast.success(`Réservation ${status === 'CONFIRMED' ? 'acceptée' : 'refusée'}`);
        fetchBookings();
      } else {
        throw new Error('Erreur');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Espace Propriétaire</h1>
        <p className="text-slate-600 mb-8">Connectez-vous pour accéder à votre espace propriétaire.</p>
        <Button onClick={() => signInWithGoogle()} className="w-full">Se connecter</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Espace Propriétaire</h1>
          <p className="text-slate-600 mt-1">Bonjour {user.displayName?.split(' ')[0] || 'Propriétaire'} 👋</p>
        </div>
        <Link to="/mettre-en-location">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" /> Nouvelle annonce
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').reduce((acc, curr) => acc + parseFloat(curr.totalPrice), 0).toFixed(2)} €
            </div>
            <p className="text-xs text-slate-500 mt-1">Total généré sur la plateforme</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations actives</CardTitle>
            <CalendarDays className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => b.status === 'CONFIRMED').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">À venir ou en cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes en attente</CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => b.status === 'PENDING').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">À valider rapidement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-slate-500 mt-1">1 message non lu</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reservations" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="reservations">Réservations ({bookings.length})</TabsTrigger>
          <TabsTrigger value="annonces">Mes annonces</TabsTrigger>
        </TabsList>
        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-slate-500">Chargement...</div>
              ) : bookings.length === 0 ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                  <CalendarDays className="h-12 w-12 text-slate-300 mb-4" />
                  Vous n'avez aucune réservation pour le moment.
                </div>
              ) : (
                <div className="divide-y">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                          <img 
                            src={booking.listing?.images?.[0]?.url || "https://images.unsplash.com/photo-1522771930-78848d92871d?w=150&auto=format&fit=crop"} 
                            className="w-full h-full object-cover" 
                            alt="" 
                          />
                        </div>
                        <div>
                          <Link to={`/annonce/${booking.listing?.slug}`} className="hover:underline">
                            <h4 className="font-semibold text-slate-900 text-lg">{booking.listing?.title}</h4>
                          </Link>
                          <p className="text-sm text-slate-500">Loué à {booking.tenant?.firstName} {booking.tenant?.lastName}</p>
                          <p className="text-sm font-medium text-primary mt-1">
                            Du {format(parseISO(booking.startDate), 'dd MMM', { locale: fr })} au {format(parseISO(booking.endDate), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-2">
                        <div className="text-right">
                          {booking.status === 'PENDING' && <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>}
                          {booking.status === 'CONFIRMED' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmée</Badge>}
                          {booking.status === 'CANCELLED' && <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Annulée</Badge>}
                          <div className="font-bold text-lg mt-1">{booking.totalPrice} €</div>
                        </div>
                        
                        {booking.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleStatusChange(booking.id, 'CANCELLED')}>
                              Refuser
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}>
                              Accepter
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="annonces">
          <Card>
            <CardContent className="p-6 text-center text-slate-500 py-12">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              Vos annonces apparaîtront ici.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
