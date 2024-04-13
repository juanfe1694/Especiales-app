import { Theme } from "@react-navigation/native";

export interface GlobalTheme extends Theme {
    buttonPrimary: string;
    buttonSecondary: string;
    colors: {
        primary: string;
        background: string;
        card: string;
        text: string;
        border: string;
        notification: string;
    };
    
}