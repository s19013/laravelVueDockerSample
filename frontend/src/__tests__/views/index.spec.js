import { nextTick } from 'vue'
import { mount,flushPromises } from '@vue/test-utils'
import Index  from '@/views/Index.vue'
import customizedAxios from '@/tools/customizedAxios.js'
import MockAdapter from 'axios-mock-adapter'
import {routes} from '@/router/index.js'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
  })

  const baseWarpperOptions = {
    global: {
      plugins: [router]
    }
}

const baseURL = 'http://localhost:8000/api/task'


test("とりあえず初期状態",async () => {
    // axiosを監視して、レスポンスのモックデータを設定
    const url = baseURL + "/"

    const mockedResponse = [
        {
            id:1,
            task_name:'testTask',
            created_at:'2024-03-23T0000'
        }
    ]

    // XXX:とりあえず動くけどよくわかってない
    // ライブラリを使った方法ならできた -> ただこのライブラリに依存することになる
    // axiosをモックする
    const mockedAxios = new MockAdapter(customizedAxios)
    mockedAxios.onGet(url).reply(200,mockedResponse)

    // XXX:とりあえず動くけどよくわかってない
    // Vue Routerのセットアップは、テスト環境でコンポーネントがアプリケーション内での振る舞いを正確に模倣できるようにするために必要です。
    // これにより、ルーティングに依存する機能（例えば、特定のルートパラメータを読み取る、またはナビゲーションを行う）を持つコンポーネントをテストする際に、
    // Vue Routerに関連する警告が表示されることなく、より実際のアプリケーションの環境に近い形でテストを行うことができます。
    // by coderabbitai
    vi.mock('vue-router', async () => {
        const route = await vi.importActual('vue-router')
      
        return { ...route, 
            useRoute() {
                return {
                  route: "/",
                  pathname: "",
                  query: {keyword:""},
                  asPath: "",
                };
              },
        }
    })

    // なぜこれで帰ってくるのか正直わからない?
    // axiosがmockされて改変されているから?
    // const response = await axios.get(baseURL + "/")
    // console.log(response.data);
    // const response = await customizedAxios.get(baseURL + "/")

    // await router.isReady()
    const wrapper = await mount(Index,baseWarpperOptions)

    // warning:vitestのmountだとBeforeMount,mounteなどのライフサイクル系が動かないらしい｡
    // BeforeMountでやってること再現しないとだめだってさ｡
    wrapper.vm.keyword = ''
    await wrapper.vm.search()


    // console.log(wrapper.vm.tasks);
    // console.log(wrapper.vm.route.query); 

    // axiosで通信したデータが変数に入っているか
    expect(wrapper.vm.tasks).toContainEqual(mockedResponse[0]);

})

test('読込中メッセージ',async() => {
    const url = baseURL + "/"

    const mockedResponse = [
        {
            id:1,
            task_name:'testTask',
            created_at:'2024-03-23T0000'
        }
    ]

    const mockedAxios = new MockAdapter(customizedAxios)
    mockedAxios.onGet(url).reply(200,mockedResponse)

    vi.mock('vue-router', async () => {
        const route = await vi.importActual('vue-router')
      
        return { ...route, 
            useRoute() {
                return {
                  route: "/",
                  pathname: "",
                  query: {keyword:""},
                  asPath: "",
                };
              },
        }
    })

    const wrapper = await mount(Index,baseWarpperOptions)

    // NOTE:読込未完了状態を調べるためにわざとasyncをつけていない
    wrapper.vm.search()

    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.text()).toContain("読込中")
})

test("task完了", async () => {
    const url = baseURL + "/"

    const mockedResponse = [
        {
            id:1,
            task_name:'testTask',
            created_at:'2024-03-23T0000'
        },
        {
            id:2,
            task_name:'testTask',
            created_at:'2024-03-23T0000'
        }
    ]

    const mockedAxios = new MockAdapter(customizedAxios)
    mockedAxios.onGet(url).reply(200,mockedResponse)
    mockedAxios.onDelete(url + mockedResponse[0].id).reply(200)

    vi.mock('vue-router', async () => {
        const route = await vi.importActual('vue-router')
      
        return { ...route, 
            useRoute() {
                return {
                  route: "/",
                  pathname: "",
                  query: {keyword:""},
                  asPath: "",
                };
              },
        }
    })

    
    const wrapper = await mount(Index,baseWarpperOptions)
    wrapper.vm.keyword = ''
    await wrapper.vm.search()

    const buttons = wrapper.findAll('button')
    const doneButton =buttons.filter(element => element.text() == "完了").at(0)

    // NOTE:axios処理するから多分awaitが必要
    await doneButton.trigger('click')

    
    expect(wrapper.vm.tasks.length).toBe(1)

})

test('検索窓', async() => { 

    // ここではaxiosのモックはいらない｡(通信系使わないから)
    // 書かなくても動くことを確認した｡

    vi.mock('vue-router', async () => {
        const route = await vi.importActual('vue-router')
      
        return { ...route, 
            useRoute() {
                return {
                  route: "/",
                  pathname: "",
                  query: {keyword:""},
                  asPath: "",
                };
              },
        }
    })

    const wrapper = await mount(Index,baseWarpperOptions)

    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('test')

    // 検索窓自体とmodelを確認
    expect(textInput.element.value).toBe('test')
    expect(wrapper.vm.keyword).toBe('test')
 })

 describe('通信エラー', async () => { 
    const url = baseURL + "/"

    vi.mock('vue-router', async () => {
        const route = await vi.importActual('vue-router')
      
        return { ...route, 
            useRoute() {
                return {
                  route: "/",
                  pathname: "",
                  query: {keyword:""},
                  asPath: "",
                };
              },
        }
    })

    
    test('検索', async() => { 
        const wrapper = await mount(Index,baseWarpperOptions)

        // エラーを返すように設定
        const mockedAxios = new MockAdapter(customizedAxios)
        mockedAxios.onGet(baseURL).networkErrorOnce()

        await wrapper.vm.search()

        expect(wrapper.text()).toContain("通信エラーが発生しました｡時間を置いてもう一度送信してください")
    })

    test('タスク完了', async() => { 
        const url = baseURL + "/"
        const mockedResponse = [
            {
                id:1,
                task_name:'testTask',
                created_at:'2024-03-23T0000'
            }
        ]

        const mockedAxios = new MockAdapter(customizedAxios)
        mockedAxios.onGet(url).reply(200,mockedResponse)
        // エラーを返すように設定
        // note:数字に意味はない｡とにかく適当にidを書かなければいけないだけ｡
        mockedAxios.onDelete(url + "1").networkErrorOnce()

        const wrapper = await mount(Index,baseWarpperOptions)

        // ライフサイクル系が動かないなら直接代入しても問題ないはず
        // モックもいらないはず
        // でも今はいいかな?

        await wrapper.vm.search()

        const buttons = wrapper.findAll('button')
        const doneButton =buttons.filter(element => element.text() == "完了").at(0)

        await doneButton.trigger('click')
        // これを書かないと domの更新まで待ってもらえないらしい
        // await nextTick()

        // 今回はすべての非同期処理が完了するまで待つflushPromisesが適切だったらしい｡
        await flushPromises()

        expect(wrapper.text()).toContain("通信エラーが発生しました｡時間を置いてもう一度送信してください")
    })
})


// うまくいかない
// やはりvue router周りはplaywrightでやったほうが良いかも?
// test('submit', async () => { 
//     const url = baseURL + "/"

//     const wrapper = await mount(Index,baseWarpperOptions)

//     const textInput = wrapper.find('input[type="text"]')
//     await textInput.setValue('test')

//     console.log(wrapper.vm.keyword);

//     const mockedAxios = new MockAdapter(customizedAxios)
//     mockedAxios.onGet(url, { query:{
//         keyword:wrapper.vm.keyword
//     } }).reply(200,{})

//     // vi.mock('vue-router', async (wrapper) => {
//     //     const route = await vi.importActual('vue-router')
      
//     //     return { ...route, 
//     //         useRoute() {
//     //             return {
//     //               route: "/",
//     //               pathname: "",
//     //               query: {keyword:wrapper.vm.keyword},
//     //               asPath: "",
//     //             };
//     //           },
//     //     }
//     // })

    
//     const buttons = wrapper.findAll('button')
//     const submitButtons =buttons.filter(element => element.text() == "検索").at(0)

//     await submitButtons.trigger('click')
//     await flushPromises()

//     // console.log(wrapper.vm.router.value.query);
//     console.log(wrapper.vm.route);
//     // urlに変化があるか確認
//     // expect(wrapper.vm.route.query).toMatchObject({ keyword:"test" })
//     // console.log(router.currentRoute.value.query.keyword);
//  })