import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders the branding and tagline', () => {
    render(<Footer />);
    expect(screen.getByText('ElectIQ')).toBeInTheDocument();
    expect(screen.getByText(/Empowering voters across South Asia/i)).toBeInTheDocument();
  });

  it('renders Google Prompt Wars text', () => {
    render(<Footer />);
    expect(screen.getByText(/Made with ❤️ for Google Prompt Wars/i)).toBeInTheDocument();
  });
});
