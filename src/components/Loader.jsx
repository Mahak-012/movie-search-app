export default function Loader() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 0", gap:"16px" }}>
      <div style={{ position:"relative", width:"56px", height:"56px" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"3px solid transparent", borderTopColor:"#e53e3e", animation:"spin 0.9s linear infinite" }} />
        <div style={{ position:"absolute", inset:"8px", borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#ff6b6b", animation:"spin 0.6s linear infinite reverse" }} />
        <div style={{ position:"absolute", inset:"16px", borderRadius:"50%", background:"linear-gradient(135deg,#7f0000,#e53e3e)", animation:"pulse 1s ease-in-out infinite" }} />
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}`}</style>
    </div>
  );
}