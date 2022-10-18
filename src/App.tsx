import "./App.css";
import Editor from "./components/editor";
import Preview from "./components/preview";
import SideBar from "./components/sidebar";

function App() {
  return (
    <div className="App">
      <div className="mainContent">
        <Preview />
        <Editor onInput={(code) => console.log(code)} />
      </div>
      <SideBar />
    </div>
  );
}

export default App;
