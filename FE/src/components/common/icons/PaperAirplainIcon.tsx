interface PaperAirplainIconProps {
  className?: string;
}

const PaperAirplainIcon = ({ className }: PaperAirplainIconProps) => {
  return (
    <svg
      className={className}
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='white'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2.31869 1.60287C2.1422 1.5516 1.95181 1.60129 1.82288 1.73227C1.69395 1.86325 1.64727 2.0544 1.70132 2.23006L3.32284 7.5H9C9.27614 7.5 9.5 7.72386 9.5 8C9.5 8.27614 9.27614 8.5 9 8.5H3.32285L1.70138 13.7698C1.64733 13.9454 1.69401 14.1366 1.82294 14.2676C1.95187 14.3985 2.14227 14.4482 2.31876 14.397C6.78449 13.0996 10.9316 11.0543 14.6155 8.40581C14.7462 8.31187 14.8236 8.16077 14.8236 7.99984C14.8236 7.8389 14.7462 7.6878 14.6155 7.59386C10.9316 4.94544 6.78443 2.90014 2.31869 1.60287Z'
        fill='inherit'
      />
    </svg>
  );
};

export default PaperAirplainIcon;
