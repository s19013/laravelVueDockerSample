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

async function mockedResponse(page) {
    await page.route(apiBaseURL + "/" + "?keyword=", async route => {
        await route.fulfill({
            status:200,
            body: JSON.stringify(mockedResponseJson),
        });
    });
}

async function clickButton(page,buttonName) {
    const button = page.getByRole('button',{name:buttonName})
    await button.click()
}

// 条件:画面表示
// 期待:api通信をしてデータを表示
test('データ表示',async({page}) => {
    await mockedResponse(page)

    await page.goto('/')

    await expect(page.getByText(mockedResponseJson[0].task_name)).toBeVisible();
    await expect(page.getByText(mockedResponseJson[0].created_at.split("T")[0])).toBeVisible();
})

// 条件:inputに文字列を入れて送信
// 期待:urlのクエリが追加されている
test('検索', async ({ page }) => {
    await page.goto('/');
    const input = await page.getByRole('textbox')
    await input.fill('test');
    
    await clickButton(page,"検索")

     // URLにクエリパラメータが含まれているかを確認
    const url = page.url()
    const regex = new RegExp('(?<=keyword=)(.*)')
    await expect(regex.test(url)).toBe(true)
})

// playwrightはtest.describe
test.describe('画面遷移', () => { 
    // 条件:新規ボタンを押す
    // 期待:新規画面へ遷移
    test('新規', async ({page}) => { 
        await page.goto('/');

        await clickButton(page,"新規")

        const url = page.url()
        await expect(url.includes('create')).toBe(true)
    })

    // 条件:編集ボタンを押す
    // 期待:編集画面へ遷移
    test('編集', async ({page}) => { 
        await mockedResponse(page)

        await page.goto('/')

        // ボタンを推して画面遷移
        await clickButton(page,"編集")

        const url = page.url()
        await expect(url.includes('edit/1')).toBe(true)
    })
 })

// test('エラー', () => { second })