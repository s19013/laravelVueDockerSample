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

    // ライブラリを使った方法ならできた -> ただこのライブラリに依存することになる
    // axiosをモックする
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

    // なぜこれで帰ってくるのか正直わからない?
    // axiosがmockされて改変されているから?
    // const response = await axios.get(baseURL + "/")
    // console.log(response.data);
    // const response = await customizedAxios.get(baseURL + "/")

    // await router.isReady()
    const wrapper = await mount(Index,
        {
            global: {
                plugins: [router],
                stubs: {RouterLink: RouterLinkStub},
            },
        }
    )

    // BeforeMountでやってること再現しないとだめだってさ｡
    wrapper.vm.keyword = ''
    await wrapper.vm.search()


    // console.log(wrapper.vm.tasks);
    // console.log(wrapper.vm.route.query); 

    // axiosで通信したデータが変数に入っているか
    expect(wrapper.vm.tasks).toContainEqual(mockedResponse[0]);

})