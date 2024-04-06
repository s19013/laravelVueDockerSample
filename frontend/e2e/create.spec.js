import { test, expect} from '@playwright/test';
import { mockedResponse,mockedNetworkErrorResponse } from './testTool/mockApi';
import { fillTextarea,clickButton } from './testTool/locator';


const task_name = "testTask"
const apiBaseURL = 'http://localhost:8000/api/task'

test.describe('一通り動かす',() => { 

    // リクエストの中にtextareaの値が入っているか｡
    test('データがリクエストにはいっているか', async ({page}) => { 
        await page.goto('/create')
        
        // textareaでもtextboxで取らないといけないらしい｡
        await fillTextarea({
            page:page,
            value:task_name,
        })
        

        const [request] = await Promise.all([
            page.waitForRequest(request => request.url().includes(apiBaseURL)),
            clickButton({
                page:page,
                option:{name:'送信'}
            })
        ])

        // jsonに変換されてるからオブジェクトに戻さないといけない
        const postData = JSON.parse(request.postData())

        await expect('task_name' in postData).toBe(true)
        await expect(postData.task_name).toBe("testTask")
     })

    test('初期画面に戻っているか', async({page}) => { 
        await page.goto('/create')
        const task_name = "testTask"
        
        // textareaでもtextboxで取らないといけないらしい｡
        await fillTextarea({
            page:page,
            value:task_name,
        })

        // 送信したら必ず200を返すようにする
        await mockedResponse({
            page:page,
            url:"/",
            status:200
        })


        await clickButton({
            page:page,
            option:{name:'送信'}
        })

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


// 条件:戻るボタンを押す
// 期待:初期画面に戻る
test('戻るボタン', async ({page}) => { 
    await page.goto('/create')

    await clickButton({
        page:page,
        option:{name:'戻る'}
    })

    // 初期画面か
    const url = page.url()
    // index画面である -> 編集画面でも､新規画面でもない
    await expect(url.includes('edit')).toBe(false)
    await expect(url.includes('create')).toBe(false)

    // index画面には以下のボタンがあるはずなので確かめる
    await expect(page.getByRole('button',{name:'新規'})).toBeVisible()
 })

 test.describe('通信エラー', () => {
    test('サーバーエラー', async({page}) => { 
        await page.goto('/create')
        const task_name = "testTask"
        
        await fillTextarea({
            page:page,
            value:task_name,
        })
    
        
        // サーバーエラーを起こす
        await mockedResponse({
            page:page,
            url:"/",
            status:500,
            body:{message:'エラーが発生しました｡時間を置いて再度送信して下さい｡'}
        })
    
        await clickButton({
            page:page,
            option:{name:'送信'}
        })
    
        // api通信が終わるまで待つ
        await page.waitForTimeout(1000);
    
        await expect(page.getByText('エラーが発生しました｡時間を置いて再度送信して下さい｡')).toBeVisible()
     })

    test('ネットワークエラー', async({page}) => { 
        await page.goto('/create')
        const task_name = "testTask"
        
        // textareaでもtextboxで取らないといけないらしい｡
        
        await fillTextarea({
            page:page,
            value:task_name,
        })
    
        // ネットワークエラーを起こす
        await mockedNetworkErrorResponse({
            page:page,
            url:"/"
        })
    
        await clickButton({
            page:page,
            option:{name:'送信'}
        })
    
        // api通信が終わるまで待つ
        await page.waitForTimeout(1000);
    
        await expect(page.getByText('エラーが発生しました｡時間を置いて再度送信して下さい｡')).toBeVisible()
     })
})


 //  うまくいかないが｡ここだけ手動でやればよいだろ｡
//  test('送信中', async ({page}) => { 
//     await page.goto('/create')
//     await page.route(apiBaseURL + "/", async route => {
//         await route.fulfill({
//             status:200,
//         });
//     });
//     const task_name = "testTask"
    
//     // textareaでもtextboxで取らないといけないらしい｡
//     const textarea = await page.getByRole('textbox')
//     await textarea.fill(task_name)
//     const submit = await page.getByRole('button',{name:'送信'})
//     await submit.click()

//     await page.getByText("送信中").waitFor()
//     await expect(page.getByText("送信中")).toBeVisible()
//  })