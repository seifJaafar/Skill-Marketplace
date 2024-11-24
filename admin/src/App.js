
import './App.css';
import MainRoutesComponent from './routes/MainRoutesComponent';
import Toast from './components/Toast';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Toast />
      <MainRoutesComponent />
    </div>
  );
}

export default App;
