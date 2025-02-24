// app/App.tsx
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ExpoRoot } from 'expo-router';

export default function App() {
  return (
    <Provider store={store}>
      <ExpoRoot context={require.context('./')} />
    </Provider>
  );
}
