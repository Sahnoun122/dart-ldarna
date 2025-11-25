import { useAuth } from "../context/AuthContext";

export default function AuthDebugInfo() {
  const { user, token, apiType, debugAuthState } = useAuth();

  if (process.env.NODE_ENV !== 'development') return null;

  const debugInfo = debugAuthState ? debugAuthState() : {};

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs z-50 max-w-sm">
      <div className="mb-2"><strong>🔍 Auth Debug Info:</strong></div>
      
      <div className="mb-1">
        <strong>Context State:</strong>
      </div>
      <div>• User: {user ? `${user.username || user.email} (${user.id || user._id})` : '❌ NULL'}</div>
      <div>• Token: {token ? '✅ Present' : '❌ Missing'}</div>
      <div>• API Type: {apiType}</div>
      
      <div className="mt-2 mb-1">
        <strong>LocalStorage:</strong>
      </div>
      <div>• User: {debugInfo.localStorage?.user || '❌'}</div>
      <div>• Token: {debugInfo.localStorage?.token || '❌'}</div>
      <div>• API Type: {debugInfo.localStorage?.apiType || '❌'}</div>

      <div className="mt-2 mb-1">
        <strong>Raw localStorage:</strong>
      </div>
      <div style={{ fontSize: '10px', wordBreak: 'break-all' }}>
        {localStorage.getItem('user')?.substring(0, 50)}...
      </div>
    </div>
  );
}