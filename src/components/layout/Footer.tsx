import { Link } from 'react-router-dom';
import { Baby } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Baby className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">BambinLoc</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La plateforme simple et sécurisée pour louer du matériel bébé et enfant près de chez soi.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Explorer</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/recherche?categorie=poussette" className="hover:text-foreground">Poussettes</Link></li>
              <li><Link to="/recherche?categorie=siege-auto" className="hover:text-foreground">Sièges auto</Link></li>
              <li><Link to="/recherche?categorie=lit-bebe" className="hover:text-foreground">Lits bébé</Link></li>
              <li><Link to="/recherche?categorie=velo" className="hover:text-foreground">Vélos & Draisiennes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">BambinLoc</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/comment-ca-marche" className="hover:text-foreground">Comment ça marche</Link></li>
              <li><Link to="/mettre-en-location" className="hover:text-foreground">Mettre en location</Link></li>
              <li><Link to="/confiance" className="hover:text-foreground">Sécurité et confiance</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Nous contacter</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/cgu" className="hover:text-foreground">Conditions générales</Link></li>
              <li><Link to="/confidentialite" className="hover:text-foreground">Politique de confidentialité</Link></li>
              <li><Link to="/mentions-legales" className="hover:text-foreground">Mentions légales</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BambinLoc. Tous droits réservés.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Fait avec ♥ en France</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
