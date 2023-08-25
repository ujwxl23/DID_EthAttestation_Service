import './App.css';
import EASFormOffChain from './components/EASFormOffChain';
import EASForm from './components/EASForm';

function App() {
  return (
    <div className="bg-black h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl mb-8">Receive Attested Certificate</h1>
      <EASForm/>
      <br/>
      <br/>
      <h2 className="text-4xl mb-8">Verify Offchain attestation</h2>
      <EASFormOffChain/>
    </div>
  );
}

export default App;
