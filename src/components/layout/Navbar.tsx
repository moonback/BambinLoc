import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Baby, LogOut, PlusCircle, Search, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, signInWithGoogle } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Baby className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">BambinLoc</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center px-6">
            <div className="flex items-center space-x-6">
              <Link to="/recherche" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Explorer
              </Link>
              <Link to="/comment-ca-marche" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Comment ça marche
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/mettre-en-location" className="hidden sm:block">
              <Button variant="outline" className="gap-2 shrink-0">
                <PlusCircle className="h-4 w-4" />
                Mettre en location
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User avatar"} />
                      <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profil">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mes-reservations">
                      <Baby className="mr-2 h-4 w-4" />
                      <span>Mes réservations</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/proprietaire">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Mode Propriétaire</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-red-500">Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signInWithGoogle()}>Connexion</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
