const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';


  export const light = {
    colors: {
      background: "white", 
      border: "rgb(216, 216, 216)", 
      card: "rgb(255, 255, 255)", 
      notification: "rgb(255, 59, 48)", 
      primary: "rgb(0, 122, 255)", 
      text: "rgb(28, 28, 30)",
      error: "rgba(179, 38, 30, 1)"
    }, 
    dark: false,
    buttonPrimary: "#002851",
    buttonSecondary: '#69727d'
  }

  export const dark = {
    colors:{
      background: "rgb(1, 1, 1)", 
      border: "rgb(39, 39, 41)", 
      card: "rgb(18, 18, 18)", 
      notification: "rgb(255, 69, 58)", 
      primary: "rgb(10, 132, 255)", 
      text: "rgb(229, 229, 231)",
      error: "rgba(179, 38, 30, 1)"
  }, 
    dark: true,
    buttonPrimary: "#002851",
    buttonSecondary: '#54595F'
  }

  export const lightPaper = {
    animation: {"scale": 1}, 
    colors: {
      accent: "#03dac4", 
      backdrop: "rgba(0, 0, 0, 0.5)", 
      background: "white", 
      disabled: "rgba(0, 0, 0, 0.26)", 
      error: "#B00020", 
      notification: "#f50057", 
      onSurface: "#000000", 
      placeholder: "rgba(0, 0,0, 0.54)", 
      primary: "#002851", 
      surface: "#ffffff", 
      text: "#000000", 
      tooltip: "rgba(28, 27, 31, 1)"}, 
      dark: false, 
      fonts: {
        light: {
          fontFamily: "sans-serif-light", 
          fontWeight: "normal"
        }, medium: {
          fontFamily: "sans-serif-medium", 
          fontWeight: "normal"}, 
          regular: {
            fontFamily: "sans-serif", 
          fontWeight: "normal"
        }, thin: {
          fontFamily: "sans-serif-thin", 
          fontWeight: "normal"
        }
      }, 
      isV3: false, 
      roundness: 4, 
      version: 2
    }

    export const darkPaper = {
      animation: {"scale": 1}, 
      colors: {
        accent: "#03dac4", 
        backdrop: "rgba(0, 0, 0, 0.5)", 
        background: "#f6f6f6", 
        disabled: "rgba(0, 0, 0, 0.26)", 
        error: "#B00020", 
        notification: "#f50057", 
        onSurface: "#000000", 
        placeholder: "rgba(0, 0,0, 0.54)", 
        primary: "#6200ee", 
        surface: "#ffffff", 
        text: "#000000", 
        tooltip: "rgba(28, 27, 31, 1)"}, 
        dark: false, 
        fonts: {
          light: {
            fontFamily: "sans-serif-light", 
            fontWeight: "normal"
          }, medium: {
            fontFamily: "sans-serif-medium", 
            fontWeight: "normal"}, 
            regular: {
              fontFamily: "sans-serif", 
            fontWeight: "normal"
          }, thin: {
            fontFamily: "sans-serif-thin", 
            fontWeight: "normal"
          }
        }, 
        isV3: false, 
        roundness: 4, 
        version: 2
      }
