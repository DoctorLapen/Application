import {
  ScaleLoader,
} from 'react-spinners';

const Spinner = () => {
  const color = '#36d7b7';
  const size = 50;
  const speedMultiplier = 1;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center', padding: '20px' }}>
      
      <div style={{ textAlign: 'center' }}>
        <ScaleLoader color={color} height={size} width={10} speedMultiplier={speedMultiplier} />
      </div>     
    </div>
  );
};

export default Spinner;