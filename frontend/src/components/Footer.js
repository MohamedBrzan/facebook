import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      &copy; {new Date().getFullYear()} created by{' '}
      <Link to='/'>Mohamed Mahmoud</Link>
    </>
  );
};

export default Footer;
