import React, { createContext, useState, useEffect, useContext } from 'react';
import { initDB, getAllItems, getItem, updateItem, addItem } from '../utils/db';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [dbReady, setDbReady] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [folders, setFolders] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        await loadData();
        setDbReady(true);
      } catch (error) {
        console.error('Error initializing DB:', error);
      }
    };
    init();
  }, []);

  const loadData = async () => {
    try {
      const profiles = await getAllItems('userProfile');
      if (profiles.length === 0) {
        // Create default profile
        const defaultProfile = {
          id: 'main',
          name: 'Usuário',
          weight: 70,
          height: 170,
          birthDate: null,
          photo: null,
        };
        await addItem('userProfile', defaultProfile);
        setUserProfile(defaultProfile);
      } else {
        setUserProfile(profiles[0]);
      }

      const workoutsData = await getAllItems('workouts');
      setWorkouts(workoutsData.sort((a, b) => new Date(b.date) - new Date(a.date)));

      const routinesData = await getAllItems('routines');
      setRoutines(routinesData);

      const exercisesData = await getAllItems('exercises');
      setExercises(exercisesData);

      const foldersData = await getAllItems('folders');
      setFolders(foldersData);

      const measurementsData = await getAllItems('measurements');
      setMeasurements(measurementsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <AppContext.Provider
      value={{
        dbReady,
        userProfile,
        setUserProfile,
        workouts,
        routines,
        exercises,
        folders,
        measurements,
        activeWorkout,
        setActiveWorkout,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};