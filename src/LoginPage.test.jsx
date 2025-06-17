import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './LoginPage';

describe('LoginPage component', () => {
    test('renders login form', () => {
        render(<LoginPage />);
        expect(screen.getByText(/Login to Your Account/i)).toBeInTheDocument();
    });

    test('password field is of type password (masked)', () => {
        render(<LoginPage />);
        const passwordField = screen.getByPlaceholderText(/password/i);
        expect(passwordField).toHaveAttribute('type', 'password');
    });

    test('email and password inputs update state on change', () => {
        render(<LoginPage />);
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        fireEvent.change(emailInput, { target: { value: 'abc@mail.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        expect(emailInput.value).toBe('abc@mail.com');
        expect(passwordInput.value).toBe('123456');
    });

    test('error resets on successful login after failure', () => {
        render(<LoginPage />);
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        fireEvent.change(emailInput, { target: { value: 'wrong@mail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();

        fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
    });

    test('whitespace is trimmed from input', () => {
        render(<LoginPage />);
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: '  test@mail.com  ' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '  password123  ' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
    });

    test('form submits with Enter key', () => {
        render(<LoginPage />);
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@mail.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.submit(screen.getByRole('button', { name: /login/i }));
        expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
    });

    test('saves email to localStorage if Remember Me is checked', () => {
        render(<LoginPage />);
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@mail.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByLabelText(/Remember Me/i));
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        expect(localStorage.getItem('rememberedUser')).toContain('test@mail.com');
    });

    test('toggles Remember Me checkbox', () => {
        render(<LoginPage />);
        const checkbox = screen.getByLabelText(/Remember Me/i);
        expect(checkbox.checked).toBe(false); // initially unchecked
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
    });

    test('Forgot Password link is present', () => {
        render(<LoginPage />);
        const link = screen.getByText(/Forgot Password/i);
        expect(link).toBeInTheDocument();
        expect(link.closest('a')).toHaveAttribute('href', '/forgot-password');
    });

    test('shows error for empty form', () => {
        render(<LoginPage />);
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(screen.getByText(/Please fill in all fields/i)).toBeInTheDocument();
    });

    test('shows error for invalid email', () => {
        render(<LoginPage />);
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'invalidemail' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
    });

    test('shows success message for valid login', () => {
        render(<LoginPage />);
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@mail.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
    });

    test('shows error for wrong credentials', () => {
        render(<LoginPage />);
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'wrong@mail.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
});
