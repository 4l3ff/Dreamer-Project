import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Settings, Plus, Edit, TrendingUp, Clock, Dumbbell } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const { userProfile, workouts, measurements } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    let totalMinutes = 0;
    let totalVolume = 0;
    
    workouts.forEach(workout => {
      totalMinutes += workout.duration || 0;
      totalVolume += workout.volume || 0;
    });
    
    return {
      workoutCount: workouts.length,
      totalHours: Math.floor(totalMinutes / 60),
      totalVolume,
    };
  }, [workouts]);

  const chartData = useMemo(() => {
    const last30Days = workouts
      .filter(w => {
        const workoutDate = new Date(w.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return workoutDate >= thirtyDaysAgo;
      })
      .slice(0, 10)
      .reverse()
      .map(w => ({
        date: new Date(w.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        volume: w.volume,
      }));
    
    return last30Days;
  }, [workouts]);

  const age = useMemo(() => {
    if (!userProfile?.birthDate) return null;
    const today = new Date();
    const birthDate = new Date(userProfile.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [userProfile]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Perfil
          </h1>
          <Button
            onClick={() => navigate('/configuracoes')}
            variant="ghost"
            size="icon"
            data-testid="settings-button"
          >
            <Settings size={24} />
          </Button>
        </div>

        {/* User Info */}
        <div className="bg-[#1a1a1b] rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
              {userProfile?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{userProfile?.name || 'Usuário'}</h2>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>{userProfile?.weight || 70} kg</span>
                <span>{userProfile?.height || 170} cm</span>
                {age && <span>{age} anos</span>}
              </div>
            </div>
            <Button
              onClick={() => navigate('/perfil/editar')}
              variant="ghost"
              size="icon"
              data-testid="edit-profile-button"
            >
              <Edit size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Dumbbell size={16} className="text-blue-500" />
                <p className="text-2xl font-bold">{stats.workoutCount}</p>
              </div>
              <p className="text-xs text-gray-400">Treinos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock size={16} className="text-purple-500" />
                <p className="text-2xl font-bold">{stats.totalHours}h</p>
              </div>
              <p className="text-xs text-gray-400">Duração</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp size={16} className="text-green-500" />
                <p className="text-2xl font-bold">{stats.totalVolume}</p>
              </div>
              <p className="text-xs text-gray-400">kg Total</p>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        {chartData.length > 0 && (
          <div className="bg-[#1a1a1b] rounded-2xl p-6 mb-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Progresso de Volume</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
                <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1b', border: '1px solid #333', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Body Measurements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Medições Corporais</h3>
            <Button
              onClick={() => navigate('/medicoes/nova')}
              data-testid="add-measurement-button"
              className="bg-blue-500 hover:bg-blue-600 rounded-full"
              size="sm"
            >
              <Plus size={16} className="mr-1" />
              Adicionar
            </Button>
          </div>

          {measurements.length === 0 ? (
            <div className="bg-[#1a1a1b] rounded-2xl p-8 border border-gray-800 text-center">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Nenhuma medição registrada</p>
              <p className="text-sm text-gray-500 mt-2">Comece a acompanhar suas medidas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {measurements.slice(0, 5).map((measurement) => (
                <div
                  key={measurement.id}
                  onClick={() => navigate(`/medicoes/${measurement.id}`)}
                  className="bg-[#1a1a1b] rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-400">
                      {new Date(measurement.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {measurement.weight && (
                      <div>
                        <span className="text-gray-400">Peso:</span>
                        <span className="ml-2 font-semibold">{measurement.weight} kg</span>
                      </div>
                    )}
                    {measurement.waist && (
                      <div>
                        <span className="text-gray-400">Cintura:</span>
                        <span className="ml-2 font-semibold">{measurement.waist} cm</span>
                      </div>
                    )}
                    {measurement.chest && (
                      <div>
                        <span className="text-gray-400">Peito:</span>
                        <span className="ml-2 font-semibold">{measurement.chest} cm</span>
                      </div>
                    )}
                    {measurement.arm && (
                      <div>
                        <span className="text-gray-400">Braço:</span>
                        <span className="ml-2 font-semibold">{measurement.arm} cm</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;