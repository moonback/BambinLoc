import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

export default function CreateListing() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Connectez-vous pour publier une annonce</h1>
        <p className="text-slate-600 mb-8">Vous devez posséder un compte pour proposer votre matériel à la location.</p>
        <Button onClick={() => signInWithGoogle()} className="w-full">Se connecter avec Google</Button>
      </div>
    );
  }

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Votre annonce a été publiée avec succès !');
    navigate('/proprietaire');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Publier une annonce</h1>
          <span className="text-sm font-medium text-slate-500">Étape {step} sur 3</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-10">
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Que souhaitez-vous louer ?</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Titre de l'annonce</label>
                      <Input placeholder="Ex: Poussette Yoyo Babyzen 6+" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Catégorie</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Sélectionnez une catégorie</option>
                        <option value="poussette">Poussette</option>
                        <option value="siege-auto">Siège auto</option>
                        <option value="lit-bebe">Lit bébé</option>
                        <option value="velo">Vélo / Draisienne</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea 
                        placeholder="Décrivez votre matériel (état, accessoires inclus...)" 
                        className="min-h-[120px]" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit">Suivant</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Photos</h2>
                  <p className="text-sm text-slate-500 mb-6">Ajoutez au moins une photo pour montrer l'état de votre matériel.</p>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="mx-auto h-12 w-12 text-slate-400 mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      📸
                    </div>
                    <span className="text-sm font-medium text-primary">Cliquez pour uploader</span>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={handlePrev}>Retour</Button>
                  <Button type="submit">Suivant</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Prix et conditions</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Prix par jour (€)</label>
                        <Input type="number" placeholder="10" required min="1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Caution (€)</label>
                        <Input type="number" placeholder="150" required min="0" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Ville de retrait</label>
                      <Input placeholder="Ex: Paris 11e" required />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={handlePrev}>Retour</Button>
                  <Button type="submit">Publier mon annonce</Button>
                </div>
              </div>
            )}

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
