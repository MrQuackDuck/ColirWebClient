import { useMediaQuery } from "react-responsive";

export const useResponsiveness = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1223px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });

  return { isMobile, isTablet, isDesktop };
};