import { useAuth } from '@/context/AuthContext.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Package, CalendarDays, MessageSquare, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OwnerDashboard() {
  const { user, signInWithGoogle } = useAuth();

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
            <div className="text-2xl font-bold">120,00 €</div>
            <p className="text-xs text-slate-500 mt-1">+20% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations actives</CardTitle>
            <CalendarDays className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-slate-500 mt-1">1 départ aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annonces actives</CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-slate-500 mt-1">0 en brouillon</p>
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
          <TabsTrigger value="reservations">Réservations (2)</TabsTrigger>
          <TabsTrigger value="annonces">Mes annonces (3)</TabsTrigger>
        </TabsList>
        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      <img src="https://images.unsplash.com/photo-1522771930-78848d92871d?w=150&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Poussette Yoyo Babyzen</h4>
                      <p className="text-sm text-slate-500">Loué par Sophie Martin</p>
                      <p className="text-sm font-medium text-primary mt-1">Du 10 au 15 Août</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mb-2">
                      Confirmée
                    </span>
                    <div className="font-semibold">60,00 €</div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Draisienne Puky LR M</h4>
                      <p className="text-sm text-slate-500">Loué par Marc Dubois</p>
                      <p className="text-sm font-medium text-primary mt-1">Du 20 au 22 Août</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 mb-2">
                      En attente
                    </span>
                    <div className="font-semibold">15,00 €</div>
                  </div>
                </div>
              </div>
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
