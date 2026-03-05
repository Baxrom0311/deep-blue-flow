interface WaveDividerProps {
  color?: string;
  direction?: 'down' | 'up';
  className?: string;
}

const WaveDivider = ({ color = 'hsl(var(--water-mist))', direction = 'down', className = '' }: WaveDividerProps) => (
  <div className={`w-full overflow-hidden leading-none ${direction === 'up' ? 'rotate-180' : ''} ${className}`}>
    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
      <path
        d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
        fill={color}
      />
    </svg>
  </div>
);

export default WaveDivider;
