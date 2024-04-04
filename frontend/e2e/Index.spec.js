import { test, expect,chromium} from '@playwright/test';

const apiBaseURL = 'http://localhost:8000/api/task'

// 画面遷移
//  新規
//  編集

test('検索', async ({ page }) => {
    await page.goto('/');
    const input = await page.getByRole('textbox')
    await input.click()
    await input.fill('test');

    const submit = await page.getByRole('button',{name:'検索'})
    await submit.click()

    const url = page.url()
    const regex = new RegExp('(?<=keyword=)(.*)')
    await expect(regex.test(url)).toBe(true)
})

// playwrightはtest.describe
test.describe('画面遷移', () => { 
    test('新規', async ({page}) => { 
        await page.goto('/');

        const button = await page.getByRole('button',{name:'新規'})
        await button.click()

        const url = page.url()
        await expect(url.includes('create')).toBe(true)
    })

    test('編集', async ({page}) => { 
        // propsで使うやつまできっちりとってこような!!
        const mockedResponseJson =[{
            id: 1, 
            task_name: 'test_task_name',
            deleted_at: null,
            created_at: '2024-03-23T07:41:42.000000Z', 
            updated_at: '2024-03-23T07:41:42.000000Z'
        }]

        // http://localhost:8000/api/task/?keyword=
        await page.route(apiBaseURL + "/" + "?keyword=", async route => {
            await route.fulfill({
                status:200,
                body: JSON.stringify(mockedResponseJson),
            });
        });

        const [request, response] = await Promise.all([
            page.waitForRequest(request => request.url().includes(apiBaseURL)),
            page.waitForResponse(response => response.url().includes(apiBaseURL)),
            page.goto('/')
        ])

        await expect(page.getByText(mockedResponseJson[0].task_name)).toBeVisible();

        // ボタンを推して画面遷移
        const button = page.getByRole('button',{name:'編集'})
        await button.click()

        const url = page.url()
        await expect(url.includes('edit/1')).toBe(true)
    })
 })

 