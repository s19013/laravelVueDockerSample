import { mount,RouterLinkStub } from '@vue/test-utils'
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

    const url = baseURL + "/"

    // const mockedResponse = [
    //     {
    //         id:1,
    //         task_name:'testTask',
    //         created_at:'2024-03-23T0000'
    //     }
    // ]

    // const mockedAxios = new MockAdapter(customizedAxios)
    // mockedAxios.onGet(url).reply(200,mockedResponse)

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