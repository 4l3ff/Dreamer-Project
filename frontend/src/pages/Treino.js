import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Folder, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';

const Treino = () => {
  const { routines, folders } = useApp();
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState('all');

  const filteredRoutines = selectedFolder === 'all'
    ? routines
    : routines.filter(r => r.folderId === selectedFolder);

  const startQuickWorkout = () => {
    navigate('/treino/ativo', { state: { type: 'quick' } });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Treino
          </h1>
          <p className="text-gray-400">Comece um treino agora</p>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-1">Início Rápido</h2>
              <p className="text-blue-100 text-sm">Comece um treino vazio</p>
            </div>
            <Button
              onClick={startQuickWorkout}
              data-testid="quick-start-button"
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-full w-14 h-14 p-0"
            >
              <Play size={24} fill="currentColor" />
            </Button>
          </div>
        </div>

        {/* Folders */}
        {folders.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Pastas</h2>
              <Button
                onClick={() => navigate('/pastas')}
                variant="ghost"
                size="sm"
                className="text-blue-500"
              >
                Gerenciar
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedFolder('all')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedFolder === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#1a1a1b] text-gray-400 border border-gray-800'
                }`}
              >
                Todas
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedFolder === folder.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#1a1a1b] text-gray-400 border border-gray-800'
                  }`}
                >
                  {folder.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Routines */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Rotinas</h2>
            <Button
              onClick={() => navigate('/rotina/nova')}
              data-testid="new-routine-button"
              className="bg-blue-500 hover:bg-blue-600 rounded-full"
              size="sm"
            >
              <Plus size={16} className="mr-1" />
              Nova Rotina
            </Button>
          </div>

          {filteredRoutines.length === 0 ? (
            <div className="bg-[#1a1a1b] rounded-2xl p-8 border border-gray-800 text-center">
              <Folder size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Nenhuma rotina criada ainda</p>
              <p className="text-sm text-gray-500 mt-2">Crie sua primeira rotina de treino</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRoutines.map((routine) => (
                <div
                  key={routine.id}
                  className="bg-[#1a1a1b] rounded-2xl p-5 border border-gray-800"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{routine.name}</h3>
                      {routine.exercises && routine.exercises.length > 0 && (
                        <>
                          <p className="text-sm text-gray-400 mb-2">
                            {routine.exercises.slice(0, 3).map(ex => ex.name).join(', ')}
                            {routine.exercises.length > 3 && '...'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {routine.exercises.length} exercícios
                          </p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/rotina/${routine.id}`)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate('/treino/ativo', { state: { routine } })}
                      data-testid={`start-routine-${routine.id}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-xl"
                    >
                      <Play size={16} className="mr-2" fill="currentColor" />
                      Iniciar
                    </Button>
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

export default Treino;