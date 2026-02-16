/**
 * Theme colors adapted from customer app for Tifto Rider App
 * Supports both Pink (Light) and Dark themes with comprehensive color palette
 */

const Palette = {
  light: {
    primary: '#FF9800', // Brand Orange
    secondary: '#4CAF50', // Green
    background: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    surface: '#F5F5F5',
    border: '#E0E0E0',
    error: '#B00020'
  },
  dark: {
    primary: '#FF9800',
    secondary: '#4CAF50',
    background: '#121212',
    text: '#F5F5F5',
    textSecondary: '#B0BEC5',
    surface: '#1E1E1E',
    border: '#333333',
    error: '#CF6679'
  }
};

export const Colors = {
  light: {
    // Primary colors
    primary: Palette.light.primary,
    text: Palette.light.text,
    primaryBlue: "#0EA5E9",
    main: Palette.light.primary,

    // Background colors
    themeBackground: Palette.light.background,
    screenBackground: Palette.light.background,
    cardBackground: Palette.light.surface,
    menuBar: "#FFF",
    backgroundColor: "transparent",
    backgroundColor2: "rgba(0, 0, 0, 0.5)",
    backgroundColor3: "rgba(256, 256, 256, 0.9)",
    CustomLoadingBG: "#FFF",
    newBackground: "#f0f0f0",
    newheaderBG: Palette.light.background,

    // Text colors
    fontMainColor: Palette.light.text,
    fontSecondColor: Palette.light.textSecondary,
    fontThirdColor: "#374151",
    fontFourthColor: "#111827",
    fontFifthColor: "#9CA3AF",
    fontNewColor: "#6B7280",
    fontWhite: "#FFF",
    fontGrayNew: "#4B5563",
    newFontcolor: Palette.light.text,
    mainTextColor: Palette.light.text,
    secondaryText: "#4B5563",
    secondaryTextColor: "#4B5563",
    subText: "#475569",

    // Icon colors
    iconColor: "#333333",
    iconColorDark: "#0F172A",
    iconColorPink: Palette.light.secondary,
    newIconColor: Palette.light.text,
    iconStroke: "#0F172A",
    iconBackground: "#D1D5DB",

    // Header colors
    headerColor: Palette.light.background,
    headerBackground: Palette.light.background,
    headerMenuBackground: "#FAFAFA",
    headerText: Palette.light.text,
    newheaderColor: Palette.light.secondary,
    firstHeaderBackground: "#F5F5F5",

    // Button colors
    buttonBackground: Palette.light.primary,
    buttonText: "#FFF",
    buttonBackgroundPink: Palette.light.secondary,
    buttonTextPink: "#FFF",
    newButtonBackground: "#F3FFEE",
    newButtonText: "#63C43B",
    editProfileButton: "#0EA5E9",
    deleteButton: "#fe0000",
    deleteAccountBtn: "#EF4444",

    // Border and line colors
    borderColor: Palette.light.border,
    borderBottomColor: "#DAD6D6",
    borderLight: "#D9D9D9",
    newBorderColor: "#F3F4F6",
    customBorder: "#E5E7EB",
    horizontalLine: "#949393",
    lightHorizontalLine: "#f0f0f0",
    verticalLine: "#D1D5DB",
    borderLineColor: "rgb(181, 181, 181)",

    // Status colors
    orderComplete: "#1DB20D",
    orderUncomplete: "#fe0000",
    statusBgColor: "#E4FFD9",
    statusSecondColor: "#5A5858",

    // Tag and badge colors
    tagColor: Palette.light.secondary,

    // Radio and checkbox colors
    radioColor: Palette.light.secondary,
    radioOuterColor: "#fff",
    filterRadioOuterColor: Palette.light.secondary,

    // Star and rating colors
    startColor: Palette.light.secondary,
    startOutlineColor: Palette.light.secondary,
    starColor: "#4165b9",
    starRating: "#E2C077",
    stars: "#FFA921",

    // Spinner and loading colors
    spinnerColor: Palette.light.secondary,

    // Cart and container colors
    cartContainer: "#FFF",
    itemCardColor: "#FFF",
    secondaryBackground: "#ECECEC",

    // Error colors
    textErrorColor: Palette.light.error,
    errorInputBack: "#F7E7E5",
    errorInputBorder: "#DB4A39",

    // Input colors
    inputPlaceHolder: "rgba(0, 0, 0, 0.3)",
    placeholderColor: "#000000",
    placeholderColorMsg: "#000000",

    // Shadow and overlay colors
    shadowColor: "#2a2a2a",
    shadow: "#707070",
    transparent: "#00000000",
    customizeOpacityBtn: "rgba(0, 0, 0, 0.74)",

    // Title component colors
    titleComponentBackground: "rgba(39,111,191,0.1)",
    titleComponentText: "rgba(39,111,191,0.8)",
    titleTextError: "#FFF",

    // Ripple and interaction colors
    rippleColor: Palette.light.secondary,
    backIcon: "#fff",
    backIconBackground: "#000",

    // Additional colors
    black: "#000",
    white: "#FFF",
    gray: "gray",
    hex: "#b0afbc",
    darkBgFont: "#000",
    btnText: "#000",
    orange: "#FFA921",
    gray500: "#6B7280",
    gray100: "#F3F4F6",
    gray200: "#E5E7EB",
    gray600: "#4B5563",
    gray700: "#374151",
    gray900: "#111827",
    chatColor: "#1F2937",
    lightBlue: "#3B82F6",
    linkColor: "#0EA5E9",
    svgFill: "#2E2E2E",
    red600: "#DC2626",
    mustard: "#d8d8d874",

    // Color palette
    color1: "#fafafa",
    color2: "#6B7280",
    color3: "transparent",
    color4: "#111827",
    color5: "#F3F4F6",
    color6: "#949393",
    color7: "#374151",
    color8: "#f0f0f0",
    color9: "gray",
    color10: "transparent",
    color11: "#4B5563",
    color12: "#94A3B8",
    filtersBg: "#f0f0f0",

    // Radius and selection colors
    radiusBorder: "#fe0000",
    radiusFill: "rgba(0, 255, 0, 0.2)",

    // Tab navigator
    tabNaviatorBackground: "#1F2937",
    lowOpacityPrimaryColor: "rgba(255, 152, 0, 0.12)",
    switchButtonColor: "#4F46E5",
    sidebarIconBackground: "#E5E7EB",

    // Map colors
    mapBackground: "#ffffff",

    // Toggler
    toggler: "#fff",
  },
  dark: {
    // Primary colors
    primary: Palette.dark.primary,
    text: Palette.dark.text,
    primaryBlue: "#0EA5E9",
    main: Palette.dark.primary,

    // Background colors
    themeBackground: Palette.dark.background,
    screenBackground: Palette.dark.background,
    cardBackground: Palette.dark.surface,
    menuBar: "#000",
    backgroundColor: "transparent",
    backgroundColor2: "rgba(0, 0, 0, 0.5)",
    backgroundColor3: "rgba(0, 0, 0, 0.9)",
    CustomLoadingBG: "#000",
    newBackground: "#000",
    newheaderBG: Palette.dark.background,

    // Text colors
    fontMainColor: Palette.dark.text,
    fontSecondColor: Palette.dark.textSecondary,
    fontThirdColor: "#F9F9F9",
    fontFourthColor: "#fff",
    fontFifthColor: "#F9F9F9",
    fontNewColor: "#F9F9F9",
    fontWhite: "#FFF",
    fontGrayNew: "#F9F9F9",
    newFontcolor: Palette.dark.text,
    mainTextColor: "#f2f2f2",
    secondaryText: "#A3A0A0",
    secondaryTextColor: "#4B5563",
    subText: "#475569",

    // Icon colors
    iconColor: "#FCFCFC",
    iconColorDark: "#FCFCFC",
    iconColorPink: Palette.dark.secondary,
    newIconColor: Palette.dark.text,
    iconStroke: "#b0afbc",
    iconBackground: "#E5E7EB",

    // Header colors
    headerColor: Palette.dark.background,
    headerBackground: Palette.dark.background,
    headerMenuBackground: "#000",
    headerText: Palette.dark.text,
    newheaderColor: Palette.dark.secondary,
    firstHeaderBackground: "#F5F5F5",

    // Button colors
    buttonBackground: Palette.dark.primary,
    buttonText: "#000",
    buttonBackgroundPink: Palette.dark.secondary,
    buttonTextPink: "#FFF",
    newButtonBackground: "#F3FFEE",
    newButtonText: "#63C43B",
    editProfileButton: "#90E36D",
    deleteButton: "#fe0000",
    deleteAccountBtn: "#EF4444",

    // Border and line colors
    borderColor: Palette.dark.border,
    borderBottomColor: "#f9f9f9",
    borderLight: "#D9D9D9",
    newBorderColor: "#F3F4F6",
    customBorder: "transparent",
    horizontalLine: "#DFDCDC",
    lightHorizontalLine: "#2D2929",
    verticalLine: "#fff",
    borderLineColor: "rgb(181, 181, 181)",

    // Status colors
    orderComplete: "#1DB20D",
    orderUncomplete: "#fe0000",
    statusBgColor: "#E4FFD9",
    statusSecondColor: "#949393",

    // Tag and badge colors
    tagColor: Palette.dark.secondary,

    // Radio and checkbox colors
    radioColor: Palette.dark.secondary,
    radioOuterColor: "#383737",
    filterRadioOuterColor: Palette.dark.secondary,

    // Star and rating colors
    startColor: Palette.dark.secondary,
    startOutlineColor: Palette.dark.secondary,
    starColor: "#4165b9",
    starRating: "#E2C077",
    stars: "#FFA921",

    // Spinner and loading colors
    spinnerColor: Palette.dark.secondary,

    // Cart and container colors
    cartContainer: "#383737",
    itemCardColor: Palette.dark.surface,
    secondaryBackground: "#ECECEC",

    // Error colors
    textErrorColor: Palette.dark.error,
    errorInputBack: "#000",
    errorInputBorder: "#DB4A39",

    // Input colors
    inputPlaceHolder: "rgba(255, 255, 255, 0.3)",
    placeholderColor: "#fff",
    placeholderColorMsg: "#fff",

    // Shadow and overlay colors
    shadowColor: "#898989",
    shadow: "#707070",
    transparent: "#ff000080",
    customizeOpacityBtn: "rgba(0, 0, 0, 0.74)",

    // Title component colors
    titleComponentBackground: "rgba(39,111,191,0.1)",
    titleComponentText: "rgba(39,111,191,0.8)",
    titleTextError: "#FFF",

    // Ripple and interaction colors
    rippleColor: Palette.dark.secondary,
    backIcon: "#fff",
    backIconBackground: "#000",

    // Additional colors
    black: "#000",
    white: "#E0E0E0",
    gray: "gray",
    hex: "#b0afbc",
    darkBgFont: "#FFF",
    btnText: "#FFF",
    orange: "#FFA921",
    gray500: "#F9F9F9",
    gray100: "#000",
    gray200: "#E5E7EB",
    gray600: "#F9F9F9",
    gray700: "#F9F9F9",
    gray900: "#fff",
    chatColor: "#1F2937",
    lightBlue: "#3B82F6",
    linkColor: "#0EA5E9",
    svgFill: "#d9d9d9",
    red600: "#DC2626",
    mustard: "#d8d8d874",

    // Color palette
    color1: "#282828",
    color2: "#000",
    color3: "transparent",
    color4: "#111827",
    color5: "#000",
    color6: "#f9f9f9",
    color7: "#fff",
    color8: "#000",
    color9: "#fff",
    color10: "#fff",
    color11: "#4B5563",
    color12: "#fff",
    filtersBg: Palette.dark.secondary,

    // Radius and selection colors
    radiusBorder: "#fe0000",
    radiusFill: "rgba(0, 255, 0, 0.2)",

    // Tab navigator
    tabNaviatorBackground: "#1F2937",
    lowOpacityPrimaryColor: "gray",
    switchButtonColor: "#4F46E5",
    sidebarIconBackground: "#E5E7EB",

    // Map colors
    mapBackground: "#242f3e",

    // Toggler
    toggler: "#000",
  },
};
