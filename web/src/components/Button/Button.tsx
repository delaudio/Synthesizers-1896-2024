interface ButtonProps {
  primary?: boolean;
  label: string;
  onClick?: () => void;
}

export const Button = ({ primary = false, label, onClick }: ButtonProps) => {
  return (
    <button 
      onClick={onClick}
      style={{ 
        backgroundColor: primary ? '#1ea7fd' : '#f8f8f8',
        color: primary ? 'white' : 'black'
      }}
    >
      {label}
    </button>
  );
};