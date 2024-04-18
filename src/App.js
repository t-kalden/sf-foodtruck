import './App.css';
import { FoodTruckMap } from './api/truck';

function App() {

  return (
    <div className="App">
      <h1 className='text-3xl font-bold'>Mobile Food Permit Data</h1>
      <FoodTruckMap />
    </div>
  );
}

export default App;
