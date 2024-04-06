import { test, expect} from '@playwright/test';
import { mockedResponse,mockedNetworkErrorResponse } from './testTool/mockApi';
import { fillTextarea,clickButton } from './testTool/locator';

const apiBaseURL = 'http://localhost:8000/api/task'

const mockedTask = {
    "id": 23,
    "task_name": "newTask",
    "deleted_at": null,
    "created_at": "2024-03-23T07:41:42.000000Z",
    "updated_at": "2024-03-23T07:41:42.000000Z"
}

const newTaskName = "editedTask"


// 通信エラー
    // 送信
        // 500
        // ネットワーク

async function mockTaskResponse(page) {
    await page.route(apiBaseURL + "/" + mockedTask.id , async route => {
        await route.fulfill({
            status:200,
            body: JSON.stringify(mockedTask),
        });
    });
}

async function mockServerError(page){
    await page.route(apiBaseURL + "/" + mockedTask.id, async route => {
        await route.fulfill({
            status:500,
            body:JSON.stringify({message:"エラーが発生しました｡時間を置いて再度送信して下さい｡"}),
        });
    });
}

async function mockNetworkError(page){
    await page.route(apiBaseURL + "/" + mockedTask.id, async route => {
        await route.abort()
    });
}

async function mockSubmitSucces(page){
    await page.route(apiBaseURL + "/" + mockedTask.id, async route => {
        await route.fulfill({
            status:200,
        });
    });
}

// 条件:戻るボタンを押す
// 期待:初期画面に戻る
test('戻るボタン', async ({page}) => { 
    await page.goto('/edit/1')

    await clickButton({page:page,option:{name:'戻る'}})

    // 初期画面か
    const url = page.url()
    // index画面である -> 編集画面でも､新規画面でもない
    await expect(url.includes('edit')).toBe(false)
    await expect(url.includes('create')).toBe(false)

    // index画面には以下のボタンがあるはずなので確かめる
    await expect(page.getByRole('button',{name:'新規'})).toBeVisible()
 })

// 条件:画面を表示
// 期待:api通信でデータを取得し､データを表示
test('データ読み込み', async({page}) => {
    await mockTaskResponse(page)

    await page.goto('/edit/' + mockedTask.id)

    // textareaの値はtoBeVisible()ではなく､toHaveValue()を使う
    const textarea = await page.getByRole('textbox')
    await expect(textarea).toHaveValue(mockedTask.task_name);
})

// 条件:テキストエリアに新しい値を与え送信ボタンを押す
test.describe('送信', () => {
    // 期待:リクエストにtextareaの値があるか｡
    test('リクエストにデータがあるか', async({page}) => { 
        await mockTaskResponse(page)
        await mockSubmitSucces(page)

        await page.goto('/edit/' + mockedTask.id)

        await fillTextarea({page:page,value:newTaskName})

        const [request] = await Promise.all([
            page.waitForRequest(request => request.url().includes(apiBaseURL)),
            clickButton({page:page,option:{name:'送信'}})
        ])

        // jsonに変換されてるからオブジェクトに戻さないといけない
        const postData = JSON.parse(request.postData())

        await expect('task_name' in postData).toBe(true)
        await expect(postData.task_name).toBe(newTaskName)

     })

     // 期待:初期画面に戻ったか｡
     test('画面遷移', async({page}) => { 

        await mockTaskResponse(page)
        await mockSubmitSucces(page)

        await page.goto('/edit/' + mockedTask.id)

        await fillTextarea({page:page,value:newTaskName})
        await clickButton({page:page,option:{name:'送信'}})

        // ブラウザでもurlが書き換わるまでタイムラグがあるから少し待つ
        await page.waitForTimeout(1000);

        // 初期画面か
        const url = page.url()
        // index画面である -> 編集画面でも､新規画面でもない
        await expect(url).not.toContain('edit')
        await expect(url).not.toContain('create')

        // index画面には以下のボタンがあるはずなので確かめる
        await expect(page.getByRole('button',{name:'新規'})).toBeVisible()
      })
})

// 条件:データ取得時にエラーが起きる
test.describe("データ取得 エラー",() => {
    test('サーバーエラー', async ({page}) => { 

        await mockServerError(page)
        await page.goto('/edit/' + mockedTask.id)

        // api通信が終わるまで待つ
        await page.waitForTimeout(1000);

        // index画面には以下のボタンがあるはずなので確かめる
        await expect(page.getByText('エラーが発生しました｡時間を置いて再度送信して下さい｡')).toBeVisible()

     })

     test('ネットワークエラー', async ({page}) => { 
        await mockNetworkError(page)
        await page.goto('/edit/' + mockedTask.id)

        // api通信が終わるまで待つ
        await page.waitForTimeout(1000);

        // index画面には以下のボタンがあるはずなので確かめる
        await expect(page.getByText('エラーが発生しました｡時間を置いて再度送信して下さい｡')).toBeVisible()
      })
})

test.describe("送信 エラー",() => {
    test('サーバーエラー', async({page}) => { 
        await mockTaskResponse(page)

        await page.goto('/edit/' + mockedTask.id)

        await mockServerError(page)

        await clickButton({page:page,option:{name:'送信'}})

        await expect(page.getByText('エラーが発生しました｡時間を置いて再度送信して下さい｡')).toBeVisible()

     })

     test('ネットワークエラー', async({page}) => { 
        await mockTaskResponse(page)

        await page.goto('/edit/' + mockedTask.id)

        await mockNetworkError(page)

        await clickButton({page:page,option:{name:'送信'}})

        await expect(page.getByText('エラーが発生しました｡時間を置いて再度送信して下さい｡')).toBeVisible()
    })
})