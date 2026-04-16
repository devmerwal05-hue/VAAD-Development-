export default function SkeletonLoader({ width = '100%', height = '100%', radius = '0' }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, #07070F 0%, #0B0B18 50%, #07070F 100%)',
        backgroundSize: '200% 100%',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      <style>
        {`
          @keyframes pulse {
            0% { background-position: 0% 0%; }
            50% { background-position: 200% 0%; }
            100% { background-position: 0% 0%; }
          }
        `}
      </style>
    </div>
  );
}