import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import PrimaryButton from './PrimaryButton';
import { useTheme } from '../theme/ThemeContext';

// Root error boundary with a graceful, themed fallback.
export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a real app this would report to a crash service.
    if (__DEV__) console.warn('Caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Fallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

function Fallback({ onReset }) {
  const { colors, spacing } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xxl,
      }}
    >
      <AppText variant="h1" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
        Something went wrong
      </AppText>
      <AppText
        variant="body"
        color="textSecondary"
        style={{ textAlign: 'center', marginBottom: spacing.xl }}
      >
        The app hit an unexpected error. You can try again.
      </AppText>
      <PrimaryButton label="Try again" icon="refresh" onPress={onReset} style={{ minWidth: 200 }} />
    </View>
  );
}
