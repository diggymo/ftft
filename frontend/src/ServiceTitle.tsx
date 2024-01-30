import './App.css'

export const ServiceTitle = ({children}: {children: React.ReactNode}) => {
  return <b style={{WebkitTextFillColor: "transparent", background: "-webkit-linear-gradient(0deg, #40E0D0, #FF8C00, #FF0080)", backgroundClip: "text"}}>{children}</b>
}
