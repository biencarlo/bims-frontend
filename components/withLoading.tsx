// components/withLoading.tsx
import React, { ComponentType } from 'react';
import LoadingPage from './LoadingPage';

const withLoading = (WrappedComponent: ComponentType) => {
  return class WithLoading extends React.Component {
    state = {
      loading: true,
    };

    componentDidMount() {
      // Simulate an asynchronous action (e.g., fetching data) that takes time
      setTimeout(() => {
        this.setState({ loading: false });
      }, 1000); // Adjust the timeout duration as needed
    }

    render() {
      return this.state.loading ? <LoadingPage /> : <WrappedComponent {...this.props} />;
    }
  };
};

export default withLoading;
