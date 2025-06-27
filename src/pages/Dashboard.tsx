
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, BookOpen, Clock, Trophy, Target } from 'lucide-react';

interface StudyRoute {
  id: string;
  title: string;
  subject: string;
  dailyTime: string;
  dedication: string;
  activities: number;
  completedActivities: number;
  createdAt: string;
}

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<StudyRoute[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load routes from localStorage
    const savedRoutes = localStorage.getItem('study_routes');
    if (savedRoutes) {
      setRoutes(JSON.parse(savedRoutes));
    }
  }, [isAuthenticated, navigate]);

  const getProgressPercentage = (route: StudyRoute) => {
    return Math.round((route.completedActivities / route.activities) * 100);
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Você está indo muito bem! 🚀",
      "Mais um dia, mais um passo! 💪",
      "Vamos conquistar mais um objetivo hoje? ⭐",
      "Seu futuro agradece pelo esforço de hoje! 🎯",
      "Cada minuto estudado é um investimento em você! 💎"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Olá, {user?.name}! 👋
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            {getMotivationalMessage()}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rotas de Estudo</p>
                    <p className="text-3xl font-bold text-primary">{routes.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pontos</p>
                    <p className="text-3xl font-bold text-accent">{user?.points || 0}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Progresso Médio</p>
                    <p className="text-3xl font-bold text-primary">
                      {routes.length > 0 
                        ? Math.round(routes.reduce((acc, route) => acc + getProgressPercentage(route), 0) / routes.length)
                        : 0}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Study Routes Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Suas Rotas de Estudo</h2>
          <Link to="/create-route">
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover-lift">
              <Plus className="w-5 h-5 mr-2" />
              Criar Nova Rota
            </Button>
          </Link>
        </div>

        {routes.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-2xl mb-2">Nenhuma rota criada ainda</CardTitle>
              <CardDescription className="text-lg mb-6">
                Crie sua primeira rota de estudo personalizada e comece a transformar sua forma de aprender!
              </CardDescription>
              <Link to="/create-route">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeira Rota
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card key={route.id} className="hover-lift cursor-pointer border-0 shadow-lg">
                <Link to={`/study-route/${route.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{route.title}</span>
                      <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {getProgressPercentage(route)}%
                      </div>
                    </CardTitle>
                    <CardDescription>{route.subject}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {route.dailyTime} por dia
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Target className="w-4 h-4 mr-2" />
                        Dedicação: {route.dedication}
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(route)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{route.completedActivities}/{route.activities} atividades</span>
                        <span>{new Date(route.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
