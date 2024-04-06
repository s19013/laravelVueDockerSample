import { test, expect} from '@playwright/test';

const apiBaseURL = 'http://localhost:8000/api/task'

// propsで使うやつまできっちりとってこような!!
const mockedTasks =[{
    id: 1, 
    task_name: 'test_task_name',
    deleted_at: null,
    created_at: '2024-03-23T07:41:42.000000Z', 
    updated_at: '2024-03-23T07:41:42.000000Z'
}]

const errorMessage = "通信エラーが発生しました｡時間を置いてもう一度送信してください"

async function mockedResponse({page,status,body}) {
    await page.route(apiBaseURL + "/" + "?keyword=", async route => {
        await route.fulfill({
            status:status,
            body: body
        });
    });
}

async function mockedNormalResponse(page) {
    await mockedResponse({
        page:page,
        status:200,
        body:JSON.stringify(mockedTasks),
    })
}

async function mockedServerErrorResponse(page) {
    await mockedResponse({
        page:page,
        status:500,
        body:JSON.stringify(errorMessage),
    })
}

async function mockedNetworkErrorResponse(page) {
    await page.route(apiBaseURL + "/" + "?keyword=", async route => {
        await route.abort()
    });
}

async function clickButton(page,buttonName) {
    const button = page.getByRole('button',{name:buttonName})
    await button.click()
}

// 条件:画面表示
// 期待:api通信をしてデータを表示
test('データ表示',async({page}) => {
    await mockedNormalResponse(page)

    await page.goto('/')

    await expect(page.getByText(mockedTasks[0].task_name)).toBeVisible();
    await expect(page.getByText(mockedTasks[0].created_at.split("T")[0])).toBeVisible();
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
        await mockedNormalResponse(page)

        await page.goto('/')

        // ボタンを推して画面遷移
        await clickButton(page,"編集")

        const url = page.url()
        await expect(url.includes('edit/1')).toBe(true)
    })
 })

test.describe('エラー', () => { 
    // 条件:api通信時に500エラーが帰ってくる
    // 期待:エラー文を表示
    test('サーバーエラー', async({page}) => { 
        await mockedServerErrorResponse(page)
        await page.goto('/')
        await expect(page.getByText(errorMessage)).toBeVisible();
     })

    // 条件:api通信時にネットワークエラーが起きる
    // 期待:エラー文を表示
    test('ネットワークエラー', async({page}) => { 
        await mockedNetworkErrorResponse(page)
        await page.goto('/')
        await expect(page.getByText(errorMessage)).toBeVisible();
     })
 })