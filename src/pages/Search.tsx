import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, Star, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('categorie') || 'all';

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        if (currentCategory !== 'all') {
          // In a real app, this should be done on the backend
          // We don't have category slug directly on the listing API response, 
          // but we can just show all for the MVP search, or modify the API.
        }
        setListings(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams, currentCategory]);

  const handleCategoryChange = (val: string) => {
    if (val === 'all') {
      searchParams.delete('categorie');
    } else {
      searchParams.set('categorie', val);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-lg border-b pb-4">
          <Filter className="w-5 h-5" />
          Filtres
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Catégorie</label>
            <Select value={currentCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Lieu</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Ville ou CP" className="pl-9" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Prix maximum (€/jour)</label>
            <Input type="number" placeholder="50" min="0" />
          </div>

          <Button className="w-full">Appliquer les filtres</Button>
        </div>
      </aside>

      {/* Main Results */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">
            Résultats {listings.length > 0 && <span className="text-muted-foreground text-lg font-normal">({listings.length})</span>}
          </h1>
          <Select defaultValue="pertinence">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pertinence">Pertinence</SelectItem>
              <SelectItem value="prix_asc">Prix croissant</SelectItem>
              <SelectItem value="prix_desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-slate-100 rounded-xl h-[300px]"></div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link key={listing.id} to={`/annonce/${listing.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all h-full border-slate-200">
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
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
            <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Aucun résultat</h3>
            <p className="mt-1 text-slate-500">Nous n'avons trouvé aucun matériel correspondant à vos critères.</p>
            <Button variant="outline" className="mt-6" onClick={() => handleCategoryChange('all')}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
