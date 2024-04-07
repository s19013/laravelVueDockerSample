import { test, expect } from '@playwright/test';
import { mockedResponse,mockedNetworkErrorResponse } from './testTool/mockApi';
import { fillTextarea,clickButton } from './testTool/locator';

const apiBaseURL = 'http://localhost:8000/api/task'

// propsで使うやつまできっちりとってこような!!
const mockedTasks =[
    {
        id: 1, 
        task_name: 'test_task_name',
        deleted_at: null,
        created_at: '2024-03-23T07:41:42.000000Z', 
        updated_at: '2024-03-23T07:41:42.000000Z'
    }
]

const errorMessage = "通信エラーが発生しました｡時間を置いてもう一度送信してください"

// 条件:画面表示
// 期待:api通信をしてデータを表示
test('データ表示',async({page}) => {
    await mockedResponse({
        page:page,
        url:"/?keyword=",
        status:200,
        body:mockedTasks,
    })

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

    await fillTextarea({
        page:page,
        value:'test',
    })

    await clickButton({
        page:page,
        option:{name:"検索"}
    })

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

        await clickButton({
            page:page,
            option:{name:"新規"}
        })

        const url = page.url()
        await expect(url.includes('create')).toBe(true)
    })

    // 条件:編集ボタンを押す
    // 期待:編集画面へ遷移
    test('編集', async ({page}) => { 
        await mockedResponse({
            page:page,
            url:"/?keyword=",
            status:200,
            body:mockedTasks,
        })

        await page.goto('/')

        // ボタンを推して画面遷移
        await clickButton({
            page:page,
            option:{name:"編集"}
        })

        const url = page.url()
        await expect(url.includes('edit/1')).toBe(true)
    })
 })

test.describe('エラー', () => { 
    // 条件:api通信時に500エラーが帰ってくる
    // 期待:エラー文を表示
    test('サーバーエラー', async({page}) => { 
        await mockedResponse({
            page:page,
            url:"/?keyword=",
            status:500,
            body:errorMessage,
        })

        await page.goto('/')
        await expect(page.getByText(errorMessage)).toBeVisible();
     })

    // 条件:api通信時にネットワークエラーが起きる
    // 期待:エラー文を表示
    test('ネットワークエラー', async({page}) => { 
        await mockedNetworkErrorResponse({
            page:page,
            url:"/?keyword=",
        })

        await page.goto('/')
        await expect(page.getByText(errorMessage)).toBeVisible();
     })
 })

//  条件:指定したタスク完了ボタンを押す
//  期待:指定したタスクが画面に表示されない
test('タスク完了', async({page}) => { 
    await mockedResponse({
        page:page,
        url:"/?keyword=",
        status:200,
        body:mockedTasks,
    })

    // タスク完了apiのモック
    await mockedResponse({
        page:page,
        url:"/done/" + mockedTasks[0].id,
        status:200,
    })

    await page.goto('/');

    // タスク完了ボタンを押す
    await clickButton({
        page:page,
        option:{name:"完了"}
    })

    // apiが終わるまで待つ
    await page.waitForTimeout(1000);

    // タスクが画面から消える
    await expect(page.getByText(mockedTasks[0].task_name)).not.toBeVisible();
    await expect(page.getByText(mockedTasks[0].created_at.split("T")[0])).not.toBeVisible();
 })