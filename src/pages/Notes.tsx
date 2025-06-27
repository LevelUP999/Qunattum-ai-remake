
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Search, StickyNote, BookOpen, Calendar, Trash2 } from 'lucide-react';

interface SavedNote {
  routeId: string;
  activityId: string;
  routeTitle: string;
  activityTitle: string;
  content: string;
  savedAt: string;
}

const Notes = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<SavedNote[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadNotes();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = notes.filter(note =>
        note.routeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchTerm, notes]);

  const loadNotes = () => {
    const savedNotes: SavedNote[] = [];
    const routes = JSON.parse(localStorage.getItem('study_routes') || '[]');

    // Buscar todas as anotações salvas
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('notes_')) {
        const [, routeId, activityId] = key.split('_');
        const content = localStorage.getItem(key);
        
        if (content && content.trim()) {
          const route = routes.find((r: any) => r.id === routeId);
          if (route) {
            const activity = route.studyPlan.activities.find((a: any) => a.id === parseInt(activityId));
            if (activity) {
              savedNotes.push({
                routeId,
                activityId,
                routeTitle: route.title,
                activityTitle: activity.title,
                content,
                savedAt: new Date().toLocaleDateString('pt-BR')
              });
            }
          }
        }
      }
    }

    // Ordenar por data (mais recentes primeiro)
    savedNotes.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    setNotes(savedNotes);
  };

  const deleteNote = (routeId: string, activityId: string) => {
    localStorage.removeItem(`notes_${routeId}_${activityId}`);
    loadNotes();
  };

  const goToActivity = (routeId: string, activityId: string) => {
    navigate(`/study-activity/${routeId}/${activityId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="hover-lift"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            
            <div className="flex items-center space-x-2">
              <StickyNote className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Minhas Anotações</h1>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar anotações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <StickyNote className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {notes.length === 0 ? 'Nenhuma anotação encontrada' : 'Nenhuma anotação corresponde à busca'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {notes.length === 0 
                  ? 'Comece fazendo anotações durante seus estudos!'
                  : 'Tente usar termos diferentes na busca.'
                }
              </p>
              {notes.length === 0 && (
                <Button onClick={() => navigate('/dashboard')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Começar a Estudar
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredNotes.map((note, index) => (
              <Card key={`${note.routeId}-${note.activityId}`} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <span>{note.activityTitle}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Rota: {note.routeTitle}
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{note.savedAt}</span>
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNote(note.routeId, note.activityId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                      {note.content}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => goToActivity(note.routeId, note.activityId)}
                    variant="outline"
                    size="sm"
                  >
                    Ver Atividade Completa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Notes;
