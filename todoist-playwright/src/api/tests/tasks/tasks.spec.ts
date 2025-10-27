import { test, expect } from '@playwright/test';
import { validateSchema } from '../../utils/jsonSchemaValidator';
import { TODOIST_API_BASE_URL, TODOIST_API_KEY } from '../../utils/data';
import { routes } from '../../utils/routes'; 
import fs  from 'fs';

test.describe('Tasks Test Suite', async () => {
  test('GET /tasks', async ({ request }) => {
    const response = await request.get(`${TODOIST_API_BASE_URL}${routes.TASKS}`, {
      headers: {
        'Authorization': `Bearer ${TODOIST_API_KEY}`,
      }
    });

    const resBody = await response.json();

    // Keeping it as a temporary log - might move it to a helper function
    try {
      fs.writeFileSync('./src/api/tests/tasks/response.txt', await response.body());
      console.info('File written successfully!');
    } catch (err) {
      console.error('Error writing file:', err);
    }

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    expect(async () => validateSchema('tasksSchema', resBody)).not.toThrow();
  })
});
