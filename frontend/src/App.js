import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Toaster } from './components/ui/sonner';
import '@/App.css';

// Pages
import Home from './pages/Home';
import Treino from './pages/Treino';
import Profile from './pages/Profile';
import ActiveWorkout from './pages/ActiveWorkout';
import NewRoutine from './pages/NewRoutine';
import ExerciseLibrary from './pages/ExerciseLibrary';
import NewMeasurement from './pages/NewMeasurement';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import FolderManagement from './pages/FolderManagement';
import WorkoutDetails from './pages/WorkoutDetails';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/treino" element={<Treino />} />
            <Route path="/treino/ativo" element={<ActiveWorkout />} />
            <Route path="/treino/:id" element={<WorkoutDetails />} />
            <Route path="/rotina/nova" element={<NewRoutine />} />
            <Route path="/rotina/:id" element={<NewRoutine />} />
            <Route path="/exercicios" element={<ExerciseLibrary />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/perfil/editar" element={<EditProfile />} />
            <Route path="/medicoes/nova" element={<NewMeasurement />} />
            <Route path="/medicoes/:id" element={<NewMeasurement />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/pastas" element={<FolderManagement />} />
          </Routes>
          <Toaster richColors position="top-center" />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;