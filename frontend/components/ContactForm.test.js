/* eslint-disable semi */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
  render(<ContactForm />)
});

test('renders the contact form header', () => {
  render(<ContactForm />)

  const header = screen.getByText(/contact form/i)

  expect(header).toBeInTheDocument()
  expect(header).toBeTruthy()
  expect(header).toHaveTextContent(/contact form/i)
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  render(<ContactForm />)

  const firstNameInput = screen.getByLabelText('First Name*')
  userEvent.type(firstNameInput, 'asdf')

  const errors = await screen.findAllByTestId('error')
  expect(errors).toHaveLength(1)
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm />)

  const submitButton = screen.getByRole('button')
  userEvent.click(submitButton)

  const errors = await screen.findAllByTestId('error')
  expect(errors).toHaveLength(3)
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm />)

  const firstNameInput = screen.getByLabelText('First Name*')
  userEvent.type(firstNameInput, 'Matthew')
  expect(firstNameInput).toHaveValue('Matthew')

  const lastNameInput = screen.getByLabelText('Last Name*')
  userEvent.type(lastNameInput, 'Phillips')
  expect(lastNameInput).toHaveValue('Phillips')

  const submitButton = screen.getByRole('button')
  userEvent.click(submitButton)

  const errors = await screen.findAllByTestId('error')
  expect(errors).toHaveLength(1)
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />)

  const emailInput = screen.getByLabelText('Email*')
  userEvent.type(emailInput, 'asdf')

  const emailError = await screen.findByTestId('error')
  expect(emailError).toBeInTheDocument()
  expect(emailError).toBeTruthy()
  expect(emailError).toHaveTextContent(/error: email must be a valid email address./i)
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />)

  const firstNameInput = screen.getByLabelText('First Name*')
  userEvent.type(firstNameInput, 'Matthew')
  expect(firstNameInput).toHaveValue('Matthew')

  const emailInput = screen.getByLabelText('Email*')
  userEvent.type(emailInput, 'matt@matt.com')
  expect(emailInput).toHaveValue('matt@matt.com')

  const submitButton = screen.getByRole('button')
  userEvent.click(submitButton)

  const lastNameError = await screen.findByTestId('error')
  expect(lastNameError).toBeInTheDocument()
  expect(lastNameError).toBeTruthy()
  expect(lastNameError).toHaveTextContent(/error: lastName is a required field./i)
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm />)

  const firstNameInput = screen.getByLabelText('First Name*')
  userEvent.type(firstNameInput, 'Matthew')
  expect(firstNameInput).toHaveValue('Matthew')

  const lastNameInput = screen.getByLabelText('Last Name*')
  userEvent.type(lastNameInput, 'Phillips')
  expect(lastNameInput).toHaveValue('Phillips')

  const emailInput = screen.getByLabelText('Email*')
  userEvent.type(emailInput, 'matt@matt.com')
  expect(emailInput).toHaveValue('matt@matt.com')

  const submitButton = screen.getByRole('button')
  userEvent.click(submitButton)

  await waitFor(() => {
    const firstNameDisplay = screen.queryByText(/matthew/i)
    const lastNameDisplay = screen.queryByText(/phillips/i)
    const emailDisplay = screen.queryByText(/matt@matt.com/i)
    const messageDisplay = screen.queryByTestId('messageDisplay')

    expect(firstNameDisplay).toBeInTheDocument()
    expect(lastNameDisplay).toBeInTheDocument()
    expect(emailDisplay).toBeInTheDocument()
    expect(messageDisplay).not.toBeInTheDocument()
  })
});

test('renders all fields text when all fields are submitted.', async () => {
  render(<ContactForm />)

  const firstNameInput = screen.getByLabelText('First Name*')
  userEvent.type(firstNameInput, 'Matthew')
  expect(firstNameInput).toHaveValue('Matthew')

  const lastNameInput = screen.getByLabelText('Last Name*')
  userEvent.type(lastNameInput, 'Phillips')
  expect(lastNameInput).toHaveValue('Phillips')

  const emailInput = screen.getByLabelText('Email*')
  userEvent.type(emailInput, 'matt@matt.com')
  expect(emailInput).toHaveValue('matt@matt.com')

  const messageInput = screen.getByLabelText('Message')
  userEvent.type(messageInput, 'test message')
  expect(messageInput).toHaveValue('test message')

  const submitButton = screen.getByRole('button')
  userEvent.click(submitButton)

  await waitFor(() => {
    const firstNameDisplay = screen.queryByText(/matthew/i)
    const lastNameDisplay = screen.queryByText(/phillips/i)
    const emailDisplay = screen.queryByText(/matt@matt.com/i)
    const messageDisplay = screen.queryByText(/test message/i)

    expect(firstNameDisplay).toBeInTheDocument()
    expect(lastNameDisplay).toBeInTheDocument()
    expect(emailDisplay).toBeInTheDocument()
    expect(messageDisplay).toBeInTheDocument()
  })
});
