import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toast from './components/Toast';
import MainRoutesComponent from './routes/MainRoutesComponent';


function App() {
  return (
    <div className="App">
      <Toast />
      <MainRoutesComponent />
    </div>
  );
}

export default App;
