interface PlayIconProps {
  className?: string;
}

const PlayIcon = ({ className }: PlayIconProps) => {
  return (
    <svg
      className={className}
      width='24'
      height='25'
      viewBox='0 0 24 25'
      fill='white'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4.5 5.66869C4.5 4.24256 6.029 3.3385 7.2786 4.02578L18.8192 10.3731C20.1144 11.0855 20.1144 12.9466 18.8192 13.6589L7.2786 20.0062C6.029 20.6935 4.5 19.7895 4.5 18.3633V5.66869Z'
        fill='inherit'
      />
    </svg>
  );
};

export default PlayIcon;
