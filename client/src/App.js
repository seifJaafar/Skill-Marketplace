import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toast from './components/Toast';
import MainRoutesComponent from './routes/MainRoutesComponent';
import { SocketProvider } from './custom/socketContext';

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <Toast />
        <MainRoutesComponent />
      </SocketProvider>
    </div>
  );
}

export default App;
