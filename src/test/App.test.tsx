import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Simple test component to verify setup
function TestComponent() {
  return <div>Test Component</div>;
}

describe('App Setup Tests', () => {
  it('renders test component', () => {
    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('basic math test', () => {
    expect(2 + 2).toBe(4);
  });
});