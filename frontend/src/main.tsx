import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import eruda from "eruda"

if (window.location.origin.includes("5173")) {
const el = document.createElement('div');
document.body.appendChild(el);

eruda.init({
    container: el,
});
}


const searchParams = new URLSearchParams(window.location.search)
const ftftAuthorization = searchParams.get("ftftAuthorization")
if (ftftAuthorization) {
  localStorage.setItem("authorization", ftftAuthorization)
  window.location.href = window.location.origin +window.location.pathname 
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
  ,
)
