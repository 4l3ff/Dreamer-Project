import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Plus, Search, Dumbbell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { addItem } from '../utils/db';
import { toast } from 'sonner';

const ExerciseLibrary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exercises, refreshData, setActiveWorkout, activeWorkout } = useApp();
  const { fromWorkout, fromRoutine, routineData } = location.state || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewExercise, setShowNewExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseImage, setNewExerciseImage] = useState(null);

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createExercise = async () => {
    if (!newExerciseName.trim()) {
      toast.error('Digite um nome para o exercício');
      return;
    }

    const exercise = {
      id: `exercise_${Date.now()}`,
      name: newExerciseName.trim(),
      image: newExerciseImage,
      createdAt: new Date().toISOString(),
    };

    try {
      await addItem('exercises', exercise);
      await refreshData();
      toast.success('Exercício criado!');
      setShowNewExercise(false);
      setNewExerciseName('');
      setNewExerciseImage(null);
      selectExercise(exercise);
    } catch (error) {
      console.error('Error creating exercise:', error);
      toast.error('Erro ao criar exercício');
    }
  };

  const selectExercise = (exercise) => {
    const exerciseData = {
      ...exercise,
      sets: Array(3).fill(null).map(() => ({
        weight: 0,
        reps: 0,
        completed: false,
      })),
      restTime: 60,
      note: '',
    };

    if (fromWorkout) {
      // Add to active workout
      if (activeWorkout) {
        const updatedWorkout = {
          ...activeWorkout,
          exercises: [...(activeWorkout.exercises || []), exerciseData],
        };
        setActiveWorkout(updatedWorkout);
      }
      navigate(-1);
    } else if (fromRoutine && routineData) {
      // Add to routine being created/edited
      const updatedExercises = [...(routineData.exercises || []), exerciseData];
      navigate('/rotina/nova', {
        state: {
          ...routineData,
          exercises: updatedExercises,
        },
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0b] border-b border-gray-800 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="icon"
              data-testid="back-button"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Biblioteca de Exercícios
            </h1>
            <Button
              onClick={() => setShowNewExercise(true)}
              variant="ghost"
              size="icon"
              data-testid="new-exercise-button"
            >
              <Plus size={24} />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar exercícios..."
              className="bg-[#1a1a1b] border-gray-800 pl-10"
              data-testid="search-exercise-input"
            />
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="max-w-md mx-auto px-4 pt-4">
        {filteredExercises.length === 0 ? (
          <div className="bg-[#1a1a1b] rounded-2xl p-8 border border-gray-800 text-center">
            <Dumbbell size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-4">
              {searchTerm ? 'Nenhum exercício encontrado' : 'Nenhum exercício cadastrado'}
            </p>
            <Button
              onClick={() => setShowNewExercise(true)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus size={20} className="mr-2" />
              Criar Exercício
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => selectExercise(exercise)}
                data-testid={`exercise-${exercise.id}`}
                className="bg-[#1a1a1b] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {exercise.image ? (
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Dumbbell size={24} className="text-blue-500" />
                    </div>
                  )}
                  <h3 className="font-semibold">{exercise.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Exercise Dialog */}
      <Dialog open={showNewExercise} onOpenChange={setShowNewExercise}>
        <DialogContent className="bg-[#1a1a1b] border-gray-800">
          <DialogHeader>
            <DialogTitle>Criar Novo Exercício</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Exercício</label>
              <Input
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                placeholder="Ex: Supino reto"
                className="bg-[#111] border-gray-700"
                data-testid="new-exercise-name-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Imagem/GIF (Opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewExerciseImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-sm text-gray-400"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowNewExercise(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={createExercise}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                data-testid="create-exercise-button"
              >
                Criar e Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExerciseLibrary;