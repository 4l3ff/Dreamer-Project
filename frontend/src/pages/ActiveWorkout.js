import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Plus, Check, X, Play, Pause, Trash2, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { addItem } from '../utils/db';
import { calculateCalories, calculateVolume } from '../utils/calculations';
import { toast } from 'sonner';

const ActiveWorkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, refreshData } = useApp();
  const { routine, type } = location.state || {};

  const [workoutName, setWorkoutName] = useState(routine?.name || 'Treino Rápido');
  const [exercises, setExercises] = useState(routine?.exercises || []);
  const [startTime] = useState(new Date());
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Beep sound for rest timer
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjeL0fPTgjMGHm7A7+OZSA0PVK3n77BdGAg+ltryxnMrBSN0xPDgl0IKE1+16+qnVRQLR6Df8r5rIAU2iszyxnYsBiFs0O/mnEkODlOn6O+yXxkIPZPZ88h1LAYgc8Tv4pdBCRNdtOrrp1UUC0eg4PKnVRQLR6Dg8r1sIQU3i9Hy0oQ0Bh1tv+7glkAJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3gl0AJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3glkAJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3glkAJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3glkAJE1+06uunVRQLR6Df8r5rIAU2iszy0oM0Bh1tv+3glkAJE1+06uunVRQLR6Df8r5rIAU2iczy');
    audioRef.current.loop = false;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      timerRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsResting(false);
            // Play beep sound
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.log('Audio play failed:', e));
            }
            // Vibrate if supported
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
            toast.success('Tempo de descanso finalizado!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isResting, restTimer]);

  const addExercise = () => {
    navigate('/exercicios', { state: { fromWorkout: true } });
  };

  const addSet = (exerciseIndex) => {
    const newExercises = [...exercises];
    const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
    newExercises[exerciseIndex].sets.push({
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      completed: false,
    });
    setExercises(newExercises);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const toggleSetComplete = (exerciseIndex, setIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex].completed = !newExercises[exerciseIndex].sets[setIndex].completed;
    setExercises(newExercises);

    // Start rest timer if set is completed
    if (newExercises[exerciseIndex].sets[setIndex].completed && exercises[exerciseIndex].restTime > 0) {
      setRestTimer(exercises[exerciseIndex].restTime);
      setIsResting(true);
      setCurrentExerciseIndex(exerciseIndex);
    }
  };

  const pauseRestTimer = () => {
    setIsResting(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resumeRestTimer = () => {
    if (restTimer > 0) {
      setIsResting(true);
    }
  };

  const finishWorkout = async () => {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 60000); // minutes
    const volume = calculateVolume(exercises);
    const calories = calculateCalories(volume, duration, userProfile?.weight || 70);

    const workout = {
      id: `workout_${Date.now()}`,
      name: workoutName,
      date: startTime.toISOString(),
      duration,
      volume,
      calories,
      exerciseCount: exercises.length,
      exercises: exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.filter(s => s.completed),
      })),
    };

    try {
      await addItem('workouts', workout);
      await refreshData();
      toast.success('Treino finalizado!');
      navigate('/');
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Erro ao salvar treino');
    }
  };

  const discardWorkout = () => {
    if (window.confirm('Tem certeza que deseja descartar este treino?')) {
      navigate('/treino');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0b] border-b border-gray-800 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate('/treino')}
              variant="ghost"
              size="icon"
              data-testid="back-button"
            >
              <ArrowLeft size={24} />
            </Button>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="flex-1 mx-4 bg-transparent text-xl font-bold text-center focus:outline-none"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            />
            <div className="w-10" />
          </div>

          {isResting && (
            <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tempo de descanso</p>
                <p className="text-2xl font-bold text-blue-400">{formatTime(restTimer)}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={pauseRestTimer}
                  size="icon"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Pause size={20} />
                </Button>
              </div>
            </div>
          )}

          {!isResting && restTimer > 0 && (
            <div className="bg-gray-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pausado</p>
                <p className="text-2xl font-bold">{formatTime(restTimer)}</p>
              </div>
              <Button
                onClick={resumeRestTimer}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Play size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Exercises */}
      <div className="max-w-md mx-auto px-4 pt-4">
        {exercises.length === 0 ? (
          <div className="bg-[#1a1a1b] rounded-2xl p-8 border border-gray-800 text-center mb-4">
            <p className="text-gray-400 mb-4">Adicione exercícios ao seu treino</p>
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
            {exercises.map((exercise, exIndex) => (
              <div key={exIndex} className="bg-[#1a1a1b] rounded-2xl p-5 border border-gray-800 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{exercise.name}</h3>
                    {exercise.note && (
                      <p className="text-sm text-gray-400 italic">{exercise.note}</p>
                    )}
                    {exercise.restTime > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Descanso: {Math.floor(exercise.restTime / 60)}min {exercise.restTime % 60}s
                      </p>
                    )}
                  </div>
                </div>

                {/* Sets Table */}
                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-2 text-xs text-gray-400 font-semibold">
                    <div>SÉRIE</div>
                    <div className="col-span-2 text-center">KG</div>
                    <div className="text-center">REPS</div>
                    <div className="text-center">OK</div>
                  </div>

                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-5 gap-2 items-center">
                      <div className="text-sm text-gray-400">{setIndex + 1}</div>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(exIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                        className="col-span-2 bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(exIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                        className="bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => toggleSetComplete(exIndex, setIndex)}
                        className={`rounded-lg p-2 transition-colors ${
                          set.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-[#111] border border-gray-700 text-gray-400'
                        }`}
                        data-testid={`complete-set-${exIndex}-${setIndex}`}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => addSet(exIndex)}
                  variant="ghost"
                  className="w-full mt-3 text-blue-500"
                  data-testid={`add-set-${exIndex}`}
                >
                  <Plus size={16} className="mr-2" />
                  Adicionar Série
                </Button>
              </div>
            ))}

            <Button
              onClick={addExercise}
              variant="outline"
              className="w-full mb-4"
              data-testid="add-another-exercise-button"
            >
              <Plus size={20} className="mr-2" />
              Adicionar Exercício
            </Button>
          </>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
          <Button
            onClick={discardWorkout}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500/10"
            data-testid="discard-workout-button"
          >
            <Trash2 size={20} className="mr-2" />
            Descartar
          </Button>
          <Button
            onClick={finishWorkout}
            className="bg-green-500 hover:bg-green-600"
            data-testid="finish-workout-button"
          >
            <Save size={20} className="mr-2" />
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkout;