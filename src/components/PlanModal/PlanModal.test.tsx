/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import PlanModal from './PlanModal'
import { TaskProvider } from '../../store/TaskContext'
import { ToastProvider } from '../Toast/ToastProvider'

// Mock the task store hooks
vi.mock('../../store/TaskContext', () => ({
  useTaskStore: () => ({
    addTask: vi.fn(),
    categories: [
      { id: 'cat1', name: 'Test Category', color: '#000000' }
    ]
  }),
  TaskProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

describe('PlanModal', () => {
  const mockProps = {
    categoryId: 'cat1',
    categoryName: 'Test Category',
    onClose: vi.fn(),
    onTasksAdded: vi.fn()
  }

  const renderWithProviders = (props = mockProps) => {
    return render(
      <TaskProvider>
        <ToastProvider>
          <PlanModal {...props} />
        </ToastProvider>
      </TaskProvider>
    )
  }

  it('renders the modal with ADHD-friendly message', () => {
    renderWithProviders()
    
    expect(screen.getByText(/Planning tasks ahead of time/)).toBeInTheDocument()
    expect(screen.getByText(/helps reduce mental load/)).toBeInTheDocument()
  })

  it('allows adding multiple tasks', () => {
    renderWithProviders()
    
    // Add first task
    const taskInput = screen.getByPlaceholderText('Task name')
    fireEvent.change(taskInput, { target: { value: 'Test Task 1' } })

    // Add another task
    const addButton = screen.getByText('+ Add Another Task')
    fireEvent.click(addButton)

    // Should now have two task inputs
    const taskInputs = screen.getAllByPlaceholderText('Task name')
    expect(taskInputs).toHaveLength(2)
  })

  it('allows removing tasks', () => {
    renderWithProviders()
    
    // Add a task
    const taskInput = screen.getByPlaceholderText('Task name')
    fireEvent.change(taskInput, { target: { value: 'Test Task' } })

    // Add another task
    const addButton = screen.getByText('+ Add Another Task')
    fireEvent.click(addButton)

    // Remove the first task
    const removeButtons = screen.getAllByLabelText('Remove task')
    fireEvent.click(removeButtons[0])

    // Should now have one task input
    const taskInputs = screen.getAllByPlaceholderText('Task name')
    expect(taskInputs).toHaveLength(1)
  })

  it('validates task names before saving', () => {
    renderWithProviders()
    
    // Try to save without entering a task name
    const saveButton = screen.getByText('Save Plan')
    expect(saveButton).toBeDisabled()

    // Add a task name
    const taskInput = screen.getByPlaceholderText('Task name')
    fireEvent.change(taskInput, { target: { value: 'Test Task' } })

    // Save button should be enabled
    expect(saveButton).not.toBeDisabled()
  })

  it('allows setting recurrence options', () => {
    renderWithProviders()
    
    // Change interval
    const intervalInput = screen.getByLabelText('Recurrence interval')
    fireEvent.change(intervalInput, { target: { value: '2' } })
    expect(intervalInput).toHaveValue(2)

    // Change type
    const typeSelect = screen.getByLabelText('Recurrence type')
    fireEvent.change(typeSelect, { target: { value: 'weekly' } })
    expect(typeSelect).toHaveValue('weekly')
  })

  it('allows setting start date', () => {
    renderWithProviders()
    
    // Enable start date
    const startDateCheckbox = screen.getByLabelText(/Start date/)
    fireEvent.click(startDateCheckbox)

    // Date picker should appear
    const datePicker = screen.getByLabelText('Task start date')
    expect(datePicker).toBeInTheDocument()
  })
}) 