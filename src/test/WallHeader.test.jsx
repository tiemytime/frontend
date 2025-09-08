import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import WallHeader from '../components/wallofprayers/WallHeader';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('WallHeader', () => {
  const mockOnSearchChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders header elements correctly', () => {
    renderWithRouter(
      <WallHeader 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    // Check logo
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');

    // Check title elements
    expect(screen.getByText('One prayer')).toBeInTheDocument();
    expect(screen.getByText('One world')).toBeInTheDocument();
    expect(screen.getByText('Wall of Prayers')).toBeInTheDocument();

    // Check search input
    const searchInput = screen.getByPlaceholderText('Search an event, write a keyword');
    expect(searchInput).toBeInTheDocument();
  });

  it('displays search query value', () => {
    const searchQuery = 'peace prayer';
    
    renderWithRouter(
      <WallHeader 
        searchQuery={searchQuery}
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByDisplayValue('peace prayer');
    expect(searchInput).toBeInTheDocument();
  });

  it('calls onSearchChange when search input changes', () => {
    renderWithRouter(
      <WallHeader 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search an event, write a keyword');
    fireEvent.change(searchInput, { target: { value: 'health' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('health');
  });

  it('navigates to globe page when logo is clicked', () => {
    renderWithRouter(
      <WallHeader 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const logoContainer = screen.getByText('One prayer').closest('div');
    fireEvent.click(logoContainer);

    expect(mockNavigate).toHaveBeenCalledWith('/globe');
  });

  it('has correct styling classes for fixed header', () => {
    renderWithRouter(
      <WallHeader 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const header = document.querySelector('.fixed.top-0');
    expect(header).toHaveClass(
      'fixed',
      'top-0',
      'left-0',
      'right-0',
      'z-20',
      'flex',
      'justify-between',
      'items-center',
      'p-8'
    );
  });

  it('search input has correct styling', () => {
    renderWithRouter(
      <WallHeader 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchContainer = screen.getByPlaceholderText('Search an event, write a keyword').parentElement;
    expect(searchContainer).toHaveClass(
      'bg-white/10',
      'backdrop-blur-sm',
      'border',
      'border-white/20',
      'rounded',
      'px-4',
      'py-2'
    );

    const searchInput = screen.getByPlaceholderText('Search an event, write a keyword');
    expect(searchInput).toHaveClass(
      'bg-transparent',
      'text-white',
      'placeholder-gray-300',
      'outline-none',
      'w-64'
    );
  });

  it('has correct font classes', () => {
    renderWithRouter(
      <WallHeader 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const logoText = screen.getByText('One prayer').parentElement;
    expect(logoText).toHaveClass('text-white', 'font-marcellus');

    const title = screen.getByText('Wall of Prayers');
    expect(title).toHaveClass('text-white', 'font-marcellus', 'text-2xl');
  });

  it('logo has correct cursor pointer styling', () => {
    renderWithRouter(
      <WallHeader 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const logoContainer = screen.getByText('One prayer').closest('.cursor-pointer');
    expect(logoContainer).toHaveClass('cursor-pointer');
  });
});
