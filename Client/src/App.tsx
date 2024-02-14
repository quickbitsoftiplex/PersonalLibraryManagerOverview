import "./App.css";
import Books from "./components/Books";
import CustomAppBar from "./components/CustomAppBar";

function App() {
  return (
    <>
      <CustomAppBar></CustomAppBar>
      <div style={{ marginTop: "7rem" }}>
        <Books />
      </div>
    </>
  );
}

export default App;
