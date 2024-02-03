import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import eruda from "eruda"

// if (window.location.origin === "https://d3ozb6rt05ntqw.cloudfront.net") {
  // const el = document.createElement('div');
  // document.body.appendChild(el);
  
  // eruda.init({
  //     container: el,
  // });
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
  ,
)
