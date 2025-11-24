import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Clock, Flame, Dumbbell, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { formatDuration, formatDate } from '../utils/calculations';
import { getItem } from '../utils/db';

const WorkoutDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    loadWorkout();
  }, [id]);

  const loadWorkout = async () => {
    try {
      const workoutData = await getItem('workouts', id);
      setWorkout(workoutData);
    } catch (error) {
      console.error('Error loading workout:', error);
    }
  };

  if (!workout) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0b] border-b border-gray-800 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="icon"
              data-testid="back-button"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Detalhes do Treino
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Workout Info */}
        <div className="bg-[#1a1a1b] rounded-2xl p-6 mb-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {workout.name}
          </h2>
          <p className="text-gray-400 mb-4">{formatDate(workout.date)}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-purple-500" />
                <span className="text-sm text-gray-400">Duração</span>
              </div>
              <p className="text-xl font-bold">{formatDuration(workout.duration)}</p>
            </div>

            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={20} className="text-orange-500" />
                <span className="text-sm text-gray-400">Calorias</span>
              </div>
              <p className="text-xl font-bold">{workout.calories}</p>
            </div>

            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell size={20} className="text-blue-500" />
                <span className="text-sm text-gray-400">Exercícios</span>
              </div>
              <p className="text-xl font-bold">{workout.exerciseCount}</p>
            </div>

            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-green-500" />
                <span className="text-sm text-gray-400">Volume</span>
              </div>
              <p className="text-xl font-bold">{workout.volume} kg</p>
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Exercícios Realizados</h3>
          <div className="space-y-3">
            {workout.exercises && workout.exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-[#1a1a1b] rounded-2xl p-5 border border-gray-800"
              >
                <h4 className="font-semibold mb-3">{exercise.name}</h4>
                
                {exercise.sets && exercise.sets.length > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 font-semibold">
                      <div>SÉRIE</div>
                      <div className="text-center">KG</div>
                      <div className="text-center">REPS</div>
                    </div>
                    
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-gray-400">{setIndex + 1}</div>
                        <div className="text-center font-semibold">{set.weight}</div>
                        <div className="text-center font-semibold">{set.reps}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetails;
