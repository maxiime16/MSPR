import * as React from 'react';
import { AuthProvider } from './components/AuthContext';
import MainContainer from './navigation/MainContainer';

function App() {
  return (
    <AuthProvider>
      <MainContainer />
    </AuthProvider>
  );
}

export default App;
