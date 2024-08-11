import React from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import "@excalidraw/excalidraw/index.css";
import './App.css';  // Import the CSS file 

function App() {
	return (
		<div className="full-screen">
			<Excalidraw />
		</div>
	);
}

export default App;
