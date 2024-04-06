import { test, expect} from '@playwright/test';

const apiBaseURL = 'http://localhost:8000/api/task'

// propsで使うやつまできっちりとってこような!!
const mockedResponseJson =[{
    id: 1, 
    task_name: 'test_task_name',
    deleted_at: null,
    created_at: '2024-03-23T07:41:42.000000Z', 
    updated_at: '2024-03-23T07:41:42.000000Z'
}]

test('データ表示',async({page}) => {
    await page.route(apiBaseURL + "/" + "?keyword=", async route => {
        await route.fulfill({
            status:200,
            body: JSON.stringify(mockedResponseJson),
        });
    });

    await page.goto('/')

    await expect(page.getByText(mockedResponseJson[0].task_name)).toBeVisible();
    await expect(page.getByText(mockedResponseJson[0].created_at.split("T")[0])).toBeVisible();
})

test('検索', async ({ page }) => {
    await page.goto('/');
    const input = await page.getByRole('textbox')
    await input.click()
    await input.fill('test');

    const submit = await page.getByRole('button',{name:'検索'})
    await submit.click()

     // URLにクエリパラメータが含まれているかを確認
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

        // http://localhost:8000/api/task/?keyword=
        await page.route(apiBaseURL + "/" + "?keyword=", async route => {
            await route.fulfill({
                status:200,
                body: JSON.stringify(mockedResponseJson),
            });
        });

        await page.goto('/')

        // ボタンを推して画面遷移
        const button = page.getByRole('button',{name:'編集'})
        await button.click()

        const url = page.url()
        await expect(url.includes('edit/1')).toBe(true)
    })
 })

 