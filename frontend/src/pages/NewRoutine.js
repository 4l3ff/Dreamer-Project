import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { addItem, updateItem, getItem } from '../utils/db';
import { toast } from 'sonner';

const NewRoutine = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { folders, refreshData } = useApp();
  const [isEditing] = useState(!!id);

  const [name, setName] = useState('');
  const [folderId, setFolderId] = useState('none');
  const [exercises, setExercises] = useState([]);

  React.useEffect(() => {
    if (id) {
      loadRoutine();
    }
  }, [id]);

  const loadRoutine = async () => {
    try {
      const routine = await getItem('routines', id);
      if (routine) {
        setName(routine.name);
        setFolderId(routine.folderId || 'none');
        setExercises(routine.exercises || []);
      }
    } catch (error) {
      console.error('Error loading routine:', error);
      toast.error('Erro ao carregar rotina');
    }
  };

  const addExercise = () => {
    navigate('/exercicios', { 
      state: { 
        fromRoutine: true,
        routineData: { name, folderId, exercises }
      } 
    });
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const saveRoutine = async () => {
    if (!name.trim()) {
      toast.error('Digite um nome para a rotina');
      return;
    }

    const routine = {
      id: isEditing ? id : `routine_${Date.now()}`,
      name: name.trim(),
      folderId: folderId === 'none' ? null : folderId,
      exercises: exercises,
      createdAt: isEditing ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        await updateItem('routines', routine);
        toast.success('Rotina atualizada!');
      } else {
        await addItem('routines', routine);
        toast.success('Rotina criada!');
      }
      await refreshData();
      navigate('/treino');
    } catch (error) {
      console.error('Error saving routine:', error);
      toast.error('Erro ao salvar rotina');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0b] border-b border-gray-800 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/treino')}
              variant="ghost"
              size="icon"
              data-testid="back-button"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {isEditing ? 'Editar Rotina' : 'Nova Rotina'}
            </h1>
            <Button
              onClick={saveRoutine}
              className="bg-blue-500 hover:bg-blue-600"
              data-testid="save-routine-button"
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nome da Rotina</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Push Day, Upper Body"
              className="bg-[#1a1a1b] border-gray-800"
              data-testid="routine-name-input"
            />
          </div>

          {folders.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Pasta</label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full bg-[#1a1a1b] border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                data-testid="folder-select"
              >
                <option value="none">Nenhuma pasta</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Exercises */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Exercícios</h2>

          {exercises.length === 0 ? (
            <div className="bg-[#1a1a1b] rounded-2xl p-8 border border-gray-800 text-center mb-4">
              <p className="text-gray-400 mb-4">Nenhum exercício adicionado</p>
              <Button
                onClick={addExercise}
                className="bg-blue-500 hover:bg-blue-600"
                data-testid="add-exercise-button"
              >
                <Plus size={20} className="mr-2" />
                Adicionar Exercício
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="bg-[#1a1a1b] rounded-2xl p-4 border border-gray-800"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical size={20} className="text-gray-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{exercise.name}</h3>
                        <div className="space-y-2">
                          <Input
                            value={exercise.note || ''}
                            onChange={(e) => updateExercise(index, 'note', e.target.value)}
                            placeholder="Nota do exercício (opcional)"
                            className="bg-[#111] border-gray-700 text-sm"
                          />
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block text-xs text-gray-400 mb-1">Séries</label>
                              <Input
                                type="number"
                                value={exercise.sets?.length || 3}
                                onChange={(e) => {
                                  const count = parseInt(e.target.value) || 3;
                                  const newSets = Array(count).fill(null).map(() => ({
                                    weight: 0,
                                    reps: 0,
                                    completed: false,
                                  }));
                                  updateExercise(index, 'sets', newSets);
                                }}
                                className="bg-[#111] border-gray-700 text-sm"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs text-gray-400 mb-1">Descanso (seg)</label>
                              <Input
                                type="number"
                                value={exercise.restTime || 60}
                                onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value) || 60)}
                                className="bg-[#111] border-gray-700 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeExercise(index)}
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={addExercise}
                variant="outline"
                className="w-full"
                data-testid="add-another-exercise-button"
              >
                <Plus size={20} className="mr-2" />
                Adicionar Exercício
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewRoutine;