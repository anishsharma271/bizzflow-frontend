
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import "./scrollBar.css"

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <IconButton
      color="danger"
      aria-label="scroll-to-top"
      onClick={scrollToTop}
      style={{ display: isVisible ? 'block' : 'none', position: 'fixed', bottom: 60, right: 16 }}
      className='resoonsive-view'
    >
      <ArrowUpwardIcon style={{ color: 'white' }} />
    </IconButton>
  );
};

export default ScrollToTopButton;