import { useApp } from "../context/AppContext";

export default function Notification() {
  const { notification } = useApp();
  if (!notification) return null;
  return (
    <div style={{ position:"fixed", bottom:"24px", right:"24px", zIndex:999, padding:"14px 20px", borderRadius:"14px", fontSize:"13px", fontWeight:"600", color:"white", background:"linear-gradient(135deg,#7f0000,#e53e3e)", boxShadow:"0 10px 40px rgba(229,62,62,0.4), 0 0 0 1px rgba(229,62,62,0.3)", animation:"fadeIn 0.3s ease" }}>
      ✓ {notification}
    </div>
  );
}