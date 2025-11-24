// Calorie calculation formula
export const calculateCalories = (volumeKg, durationMinutes, bodyWeightKg) => {
  // Formula: (Volume total × 0.003) + (Minutos × Peso corporal × 0.1)
  const volumeCalories = volumeKg * 0.003;
  const durationCalories = durationMinutes * bodyWeightKg * 0.1;
  return Math.round(volumeCalories + durationCalories);
};

// Calculate total volume
export const calculateVolume = (exercises) => {
  let totalVolume = 0;
  exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      if (set.completed) {
        totalVolume += (set.weight || 0) * (set.reps || 0);
      }
    });
  });
  return totalVolume;
};

// Format duration
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// Format date
export const formatDate = (date) => {
  const d = new Date(date);
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};