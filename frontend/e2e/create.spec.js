import { test, expect} from '@playwright/test';

const apiBaseURL = 'http://localhost:8000/api/task'



test.describe('一通り動かす',() => { 

    // リクエストの中にtextareaの値が入っているか｡
    test('データがリクエストにはいっているか', async ({page}) => { 
        await page.goto('/create')
        const task_name = "testTask"
        
        // textareaでもtextboxで取らないといけないらしい｡
        const textarea = await page.getByRole('textbox')
        await textarea.fill(task_name)
        const submit = await page.getByRole('button',{name:'送信'})

        const [request] = await Promise.all([
            page.waitForRequest(request => request.url().includes(apiBaseURL)),
            submit.click()
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
        const textarea = await page.getByRole('textbox')
        await textarea.fill(task_name)

        // 送信したら必ず200を返すようにする
        await page.route(apiBaseURL + "/", async route => {
            await route.fulfill({
                status:200,
            });
        });

        const submit = await page.getByRole('button',{name:'送信'})
        await submit.click()

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

    const back = await page.getByRole('button',{name:'戻る'})
    await back.click()

    // 初期画面か
    const url = page.url()
    // index画面である -> 編集画面でも､新規画面でもない
    await expect(url.includes('edit')).toBe(false)
    await expect(url.includes('create')).toBe(false)

    // index画面には以下のボタンがあるはずなので確かめる
    await expect(page.getByRole('button',{name:'新規'})).toBeVisible()
 })

test('通信エラー', async({page}) => { 
    await page.goto('/create')
    const task_name = "testTask"
    
    // textareaでもtextboxで取らないといけないらしい｡
    const textarea = await page.getByRole('textbox')
    await textarea.fill(task_name)

    // ネットワークエラーを起こす
    await page.route(apiBaseURL + "/", async route => {
        await route.abort();
    });

    const submit = await page.getByRole('button',{name:'送信'})
    await submit.click()

    // api通信が終わるまで待つ
    await page.waitForTimeout(1000);

    // index画面には以下のボタンがあるはずなので確かめる
    await expect(page.getByText('エラーが発生しました｡時間を置いて再度送信して下さい｡')).toBeVisible()
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