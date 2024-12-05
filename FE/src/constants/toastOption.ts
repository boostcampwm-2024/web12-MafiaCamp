import { Slide } from 'react-toastify';

export const TOAST_OPTION = {
  position: 'top-center',
  autoClose: 3000,
  closeButton: true,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: 'light',
  transition: Slide,
} as const;
