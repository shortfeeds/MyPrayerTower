import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('should load home page with hero section', async ({ page }) => {
        await page.goto('/');

        // Check hero title
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Spiritual Journey');

        // Check CTA buttons
        await expect(page.getByRole('link', { name: /Find Churches/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Prayer Wall/i })).toBeVisible();

        // Check stats section
        await expect(page.getByText('10,000+')).toBeVisible();
        await expect(page.getByText('4,000+')).toBeVisible();
    });

    test('should navigate to churches page', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Find Churches Near Me');
        await expect(page).toHaveURL('/churches');
    });
});

test.describe('Churches Page', () => {
    test('should display search and filters', async ({ page }) => {
        await page.goto('/churches');

        await expect(page.getByPlaceholder(/Search/i)).toBeVisible();
        await expect(page.getByText('Show Filters')).toBeVisible();
    });

    test('should search for churches', async ({ page }) => {
        await page.goto('/churches');

        await page.fill('input[placeholder*="Search"]', 'New York');
        await page.keyboard.press('Enter');

        // Wait for results
        await page.waitForSelector('text=Showing');
    });
});

test.describe('Prayer Wall', () => {
    test('should display prayer categories', async ({ page }) => {
        await page.goto('/prayer-wall');

        await expect(page.getByText('All')).toBeVisible();
        await expect(page.getByText('Health')).toBeVisible();
        await expect(page.getByText('Family')).toBeVisible();
    });

    test('should open submit prayer modal', async ({ page }) => {
        await page.goto('/prayer-wall');

        await page.click('text=Submit Prayer Request');

        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByPlaceholder(/Share your prayer/i)).toBeVisible();
    });

    test('should click pray button', async ({ page }) => {
        await page.goto('/prayer-wall');

        // Wait for prayers to load
        await page.waitForSelector('button:has-text("🙏")');

        const prayButton = page.locator('button:has-text("🙏")').first();
        const initialText = await prayButton.textContent();

        await prayButton.click();

        // Button should update
        await expect(prayButton).not.toHaveText(initialText!);
    });
});

test.describe('Authentication', () => {
    test('should display login form', async ({ page }) => {
        await page.goto('/login');

        await expect(page.getByPlaceholder('Email')).toBeVisible();
        await expect(page.getByPlaceholder('Password')).toBeVisible();
        await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    });

    test('should display register form', async ({ page }) => {
        await page.goto('/register');

        await expect(page.getByPlaceholder('First Name')).toBeVisible();
        await expect(page.getByPlaceholder('Email')).toBeVisible();
        await expect(page.getByRole('button', { name: /Create/i })).toBeVisible();
    });

    test('should navigate between login and register', async ({ page }) => {
        await page.goto('/login');
        await page.click('text=Sign Up');
        await expect(page).toHaveURL('/register');

        await page.click('text=Sign In');
        await expect(page).toHaveURL('/login');
    });
});

test.describe('Prayers Library', () => {
    test('should display prayer categories', async ({ page }) => {
        await page.goto('/prayers');

        await expect(page.getByText('Marian Prayers')).toBeVisible();
        await expect(page.getByText('Basic Prayers')).toBeVisible();
        await expect(page.getByText('Rosary')).toBeVisible();
    });

    test('should display popular prayers', async ({ page }) => {
        await page.goto('/prayers');

        await expect(page.getByText('Our Father')).toBeVisible();
        await expect(page.getByText('Hail Mary')).toBeVisible();
    });
});

test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
        await page.goto('/');

        const h1 = await page.locator('h1').count();
        expect(h1).toBe(1);
    });

    test('should have alt text for images', async ({ page }) => {
        await page.goto('/');

        const imagesWithoutAlt = await page.locator('img:not([alt])').count();
        expect(imagesWithoutAlt).toBe(0);
    });

    test('should have proper focus indicators', async ({ page }) => {
        await page.goto('/');

        // Tab to first focusable element
        await page.keyboard.press('Tab');

        const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
        expect(focusedElement).toBeTruthy();
    });

    test('should support keyboard navigation', async ({ page }) => {
        await page.goto('/');

        // Navigate with keyboard
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');

        // Should have navigated somewhere
        await expect(page).not.toHaveURL('/');
    });
});
