'use client';

import { useEffect, useState } from 'react';

export const useHeaderController = () => {
  const [scrolled, setScrolled] = useState(false);
  const [headerSidebarVisible, setHeaderSidebarVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY >= 300) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const openHeaderSidebar = () => {
    setHeaderSidebarVisible(true);
  };

  const closeHeaderSidebar = () => {
    setHeaderSidebarVisible(false);
  };

  const openProfileModal = () => {
    setProfileModalVisible(true);
  };

  const closeProfileModal = () => {
    setProfileModalVisible(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    scrolled,
    headerSidebarVisible,
    profileModalVisible,
    openHeaderSidebar,
    closeHeaderSidebar,
    openProfileModal,
    closeProfileModal,
  };
};
