const { test, expect } = require('@playwright/test');

test('user can manage daily tasks', async ({ page }) => {
  // Step 1: Open the Todo app
  await page.goto('https://demo.playwright.dev/todomvc/');

  // Step 2: Find the task input box
  const taskInput = page.getByPlaceholder('What needs to be done?');

  // Step 3: Add three daily tasks
  await taskInput.fill('Submit assignment');
  await taskInput.press('Enter');
  await taskInput.fill('Prepare meeting notes');
  await taskInput.press('Enter');
  await taskInput.fill('Pay electricity bill');
  await taskInput.press('Enter');

  // Step 4: Verify all three tasks are added
  await expect(page.getByText('Submit assignment')).toBeVisible();
  await expect(page.getByText('Prepare meeting notes')).toBeVisible();
  await expect(page.getByText('Pay electricity bill')).toBeVisible();

  // Step 5: Verify total task count
  const todoItems = page.locator('.todo-list li');
  await expect(todoItems).toHaveCount(3);

  // Step 6: Edit the second task by double-clicking it
  await page.getByText('Prepare meeting notes', { exact: true }).dblclick();
  const editInput = page.locator('.todo-list li.editing .edit');
  await expect(editInput).toBeVisible();
  await editInput.fill('Prepare weekly meeting notes');
  await editInput.press('Enter');

  // Step 7: Verify the task text was changed
  await expect(page.getByText('Prepare weekly meeting notes', { exact: true })).toBeVisible();
  await expect(page.getByText('Prepare meeting notes', { exact: true })).not.toBeVisible();

  // Step 8: Mark first task as completed
  await todoItems.nth(0).getByRole('checkbox').check();

  // Step 9: Go to Completed filter
  await page.getByRole('link', { name: 'Completed' }).click();

  // Step 10: Verify only completed task is visible
  await expect(page.getByText('Submit assignment')).toBeVisible();
  await expect(page.getByText('Prepare meeting notes')).not.toBeVisible();
  await expect(page.getByText('Pay electricity bill')).not.toBeVisible();

  // Step 11: Clear completed task
  await page.getByRole('button', { name: 'Clear completed' }).click();

  // Step 12: Verify completed task is removed
  await expect(page.getByText('Submit assignment')).not.toBeVisible();
});
