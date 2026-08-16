import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Calendar, CheckCircle2, Map, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CATEGORIES = [
  { id: 'poussette', name: 'Poussettes', icon: '🚼' },
  { id: 'velo', name: 'Vélos & Draisiennes', icon: '🚲' },
  { id: 'lit-bebe', name: 'Lits bébé', icon: '🛌' },
  { id: 'siege-auto', name: 'Sièges auto', icon: '💺' },
  { id: 'porte-bebe', name: 'Porte-bébés', icon: '👶' },
  { id: 'chaise-haute', name: 'Chaises hautes', icon: '🪑' },
];

export default function Home() {
  const navigate = useNavigate();
  const [popularListings, setPopularListings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => setPopularListings(data.slice(0, 4)))
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/recherche');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-slate-900">
                  Le matériel bébé dont vous avez besoin, <span className="text-primary">près de chez vous.</span>
                </h1>
                <p className="max-w-[600px] text-lg text-slate-600 sm:text-xl leading-relaxed">
                  Louez poussettes, vélos, lits bébé et équipements pour enfants auprès de particuliers pour vos vacances, vos week-ends ou simplement pour tester.
                </p>
              </div>

              {/* Search Widget */}
              <div className="w-full max-w-2xl bg-white p-2 rounded-2xl shadow-lg border border-slate-100">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input 
                      placeholder="Que recherchez-vous ?" 
                      className="pl-10 h-12 border-0 bg-slate-50 focus-visible:ring-1"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input 
                      placeholder="Où êtes-vous ?" 
                      className="pl-10 h-12 border-0 bg-slate-50 focus-visible:ring-1"
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-12 px-8 rounded-xl font-medium">
                    Rechercher
                  </Button>
                </form>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              {/* Note to AI/Image-generation: A high-quality photo of a happy family traveling or using a stroller, premium lifestyle aesthetic. */}
              <img 
                src="https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=2070&auto=format&fit=crop"
                alt="Famille avec matériel bébé" 
                className="rounded-3xl object-cover h-[500px] w-full shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Map className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Plus de 2000 annonces</p>
                    <p className="text-sm text-slate-500">Partout en France</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Parcourir par catégorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} to={`/recherche?categorie=${cat.id}`}>
                <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="font-medium text-sm text-slate-700">{cat.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Listings */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Annonces populaires</h2>
            <Link to="/recherche" className="text-primary font-medium hover:underline">Voir tout</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularListings.map((listing) => (
              <Link key={listing.id} to={`/annonce/${listing.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all h-full border-transparent shadow-sm">
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img 
                      src={listing.imageUrl || "https://images.unsplash.com/photo-1522771930-78848d92871d?w=800&auto=format&fit=crop"} 
                      alt={listing.title} 
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900 line-clamp-1">{listing.title}</h3>
                    </div>
                    <div className="text-sm text-slate-500 mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {listing.city}
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.9</span>
                      <span className="text-sm text-slate-400">(12)</span>
                    </div>
                    <div className="font-semibold text-slate-900">
                      {listing.dailyPrice} € <span className="text-sm font-normal text-slate-500">/ jour</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Comment ça marche</h2>
            <p className="text-slate-600 text-lg">Louez du matériel en toute simplicité pour quelques jours ou quelques semaines.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Trouvez</h3>
              <p className="text-slate-600">Recherchez le matériel idéal parmi les annonces de particuliers près de chez vous ou sur votre lieu de vacances.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Réservez</h3>
              <p className="text-slate-600">Sélectionnez vos dates, payez en toute sécurité sur la plateforme et convenez d'un point de rendez-vous.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Profitez</h3>
              <p className="text-slate-600">Récupérez le matériel, profitez de votre séjour l'esprit léger, et restituez-le à la fin de la location.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Owner */}
      <section className="py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-10 md:p-16 flex flex-col justify-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Votre matériel dort dans un placard ? Faites-le travailler.
                </h2>
                <p className="text-slate-300 text-lg">
                  Rejoignez des milliers de parents qui rentabilisent leurs équipements bébé lorsqu'ils ne s'en servent pas. Assurance incluse.
                </p>
                <div>
                  <Link to="/mettre-en-location">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 h-12 px-8 rounded-xl font-medium">
                      Mettre mon matériel en location
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="h-full hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2070&auto=format&fit=crop" 
                  alt="Mettre en location" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
