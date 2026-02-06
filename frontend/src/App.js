// import GaslessERC20 from "./components/GaslessERC20";
// import GaslessERC721 from "./components/GaslessERC721";

// function App() {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Gasless Transaction Forwarder</h1>
//       <GaslessERC20 />
//       <hr />
//       <GaslessERC721 />
//     </div>
//   );
// }

// export default App;

import GaslessERC20 from "./components/GaslessERC20";
import GaslessERC721 from "./components/GaslessERC721";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1 className="main-title">🚀 Gasless Transaction Forwarder</h1>

      <div className="grid-container">
        <div className="card">
          <h2>Gasless ERC20 Transfer</h2>
          <GaslessERC20 />
        </div>

        <div className="card">
          <h2>Gasless ERC721 Transfer</h2>
          <GaslessERC721 />
        </div>
      </div>
    </div>
  );
}

export default App;
