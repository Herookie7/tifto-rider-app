import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useApptheme } from "@/lib/context/global/theme.context";
import { Colors } from "@/lib/utils/constants";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  // Use theme with fallback in case theme context fails
  let appTheme = Colors.light;
  try {
    const themeContext = useApptheme();
    appTheme = themeContext?.appTheme || Colors.light;
  } catch (themeError) {
    console.error("Error getting theme in ErrorFallback:", themeError);
    appTheme = Colors.light;
  }

  return (
    <View style={[styles.container, { backgroundColor: appTheme.themeBackground }]}>
      <View style={[styles.content, { backgroundColor: appTheme.cardBackground }]}>
        <Text style={[styles.title, { color: appTheme.fontMainColor }]}>
          Something went wrong
        </Text>
        <Text style={[styles.message, { color: appTheme.fontSecondColor }]}>
          {error?.message || "An unexpected error occurred"}
        </Text>
        <TouchableOpacity
          testID="error-boundary-try-again"
          style={[styles.button, { backgroundColor: appTheme.primary }]}
          onPress={onReset}
        >
          <Text style={[styles.buttonText, { color: appTheme.black }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    padding: 20,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

// Export as a functional component wrapper for hooks
export default function ErrorBoundary({ children, fallback }: Props) {
  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>;
}
