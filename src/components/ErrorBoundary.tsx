import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{ marginBottom: '1rem' }}>Something went wrong</h1>
          <pre style={{ 
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            textAlign: 'left'
          }}>
            {this.state.error?.message}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
} 