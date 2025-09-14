interface ConnectionStatusProps {
  isConnected: boolean;
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="mb-6">
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isConnected 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${
          isConnected ? 'bg-green-400' : 'bg-yellow-400'
        }`}></div>
        {isConnected ? 'Real-time Connected' : 'Connecting...'}
      </div>
    </div>
  );
} 