import React, { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native';

export const useKeyBoardVisibilityListener = () => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);
    
        // Limpia los oyentes cuando el componente se desmonta
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);
    
      const handleKeyboardDidShow = (event: KeyboardEvent) => {
        setIsKeyboardVisible(true);
      };
    
      const handleKeyboardDidHide = () => {
        setIsKeyboardVisible(false);
      };
      
    return { isKeyboardVisible }
}
