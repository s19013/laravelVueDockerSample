import { mount,flushPromises  } from '@vue/test-utils'
import Edit  from '@/views/Edit.vue'
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

// 削除
// エラー処理

test('データ取得', async() => { 
    const mockedAxios = new MockAdapter(customizedAxios)
    // idは何でも良い
    mockedAxios.onGet(baseURL + "/1").reply(200,{
        task_name:"test"
    })

    // route.paramsの値を設定
    vi.mock('vue-router', async () => {
        const route = await vi.importActual('vue-router')
      
        return { ...route, 
            useRoute() {
                return {
                  route: "/",
                  params:{id:"1"},
                  pathname: "",
                  query: "",
                  asPath: "",
                };
              },
        }
    })

    const wrapper = await mount(Edit,baseWarpperOptions)

    // beforemount
    await wrapper.vm.getTaskData()
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe('test')
    expect(wrapper.vm.task_name).toBe('test')
 })

 test('モデル連携',async() => {

    const wrapper = await mount(Edit,baseWarpperOptions)

    const textarea = wrapper.find('textarea')
    await textarea.setValue('test')

    expect(textarea.element.value).toBe('test')
    expect(wrapper.vm.task_name).toBe('test')
})

test('送信',async() => {
    const wrapper = await mount(Edit,baseWarpperOptions)
    // route.paramsの値を設定
    vi.mock('vue-router', async () => {
        const route = await vi.importActual('vue-router')
      
        return { ...route, 
            useRoute() {
                return {
                  route: "/",
                  params:{id:"1"},
                  pathname: "",
                  query: "",
                  asPath: "",
                };
              },
        }
    })

    const mockedAxios = new MockAdapter(customizedAxios)
    mockedAxios.onPut(baseURL + "/1",{
        task_name:""
    }).reply(200)

    const buttons = wrapper.findAll('button')
    const submitButton =buttons.filter(element => element.text() == "送信").at(0)
    
    await submitButton.trigger('click')
    await flushPromises()

    // expectないけど｡エラーが出なければ無事に処理が済んだということだともうので良し

})

test('削除', async() => { 
    const wrapper = await mount(Edit,baseWarpperOptions)
    // route.paramsの値を設定
    vi.mock('vue-router', async () => {
        const route = await vi.importActual('vue-router')
      
        return { ...route, 
            useRoute() {
                return {
                  route: "/",
                  params:{id:"1"},
                  pathname: "",
                  query: "",
                  asPath: "",
                };
              },
        }
    })

    const mockedAxios = new MockAdapter(customizedAxios)
    mockedAxios.onDelete(baseURL + "/1").reply(200)

    const buttons = wrapper.findAll('button')
    const submitButton =buttons.filter(element => element.text() == "削除").at(0)
    
    await submitButton.trigger('click')
    await flushPromises()

    // expectないけど｡エラーが出なければ無事に処理が済んだということだともうので良し
 })

describe('エラーメッセージ データ取得', () => { 
    test('ネットワークエラー',async() => {
        const mockedAxios = new MockAdapter(customizedAxios)
        mockedAxios.onGet(baseURL + "/1").networkError()
    
        const wrapper = await mount(Edit,baseWarpperOptions)
    
        // beforemount
        await wrapper.vm.getTaskData()
        await flushPromises()
    
        expect(wrapper.text()).toContain('エラーが発生しました｡時間を置いて再度送信して下さい｡')
    })
    
    // 処理失敗
    test('処理失敗',async() => {
        const mockedAxios = new MockAdapter(customizedAxios)
        mockedAxios.onGet(baseURL + "/1").reply(500,{
            // バックと同じ帰り値だから大丈夫
            message:"エラーが発生しました｡時間を置いて再度送信して下さい｡"
        })
    
        // route.paramsの値を設定
        vi.mock('vue-router', async () => {
            const route = await vi.importActual('vue-router')
          
            return { ...route, 
                useRoute() {
                    return {
                      route: "/",
                      params:{id:"1"},
                      pathname: "",
                      query: "",
                      asPath: "",
                    };
                  },
            }
        })
    
        const wrapper = await mount(Edit,baseWarpperOptions)
        await flushPromises()
    
        // beforemount
        await wrapper.vm.getTaskData()
        await flushPromises()
    
        expect(wrapper.text()).toContain('エラーが発生しました｡時間を置いて再度送信して下さい｡')
    })
 })

 describe('エラーメッセージ submit', () => { 
    test('ネットワークエラー',async() => {

        const wrapper = await mount(Edit,baseWarpperOptions)
        const mockedAxios = new MockAdapter(customizedAxios)
        mockedAxios.onPut(baseURL + "/1",{
            task_name:""
        }).networkError()
        

        const textarea = wrapper.find('textarea')
        await textarea.setValue('test')
    
        // beforemount
        await wrapper.vm.submit()
        await flushPromises()
    
        expect(wrapper.text()).toContain('エラーが発生しました｡時間を置いて再度送信して下さい｡')
    })
    
    // 処理失敗
    test('処理失敗',async() => {
        const wrapper = await mount(Edit,baseWarpperOptions)
        // route.paramsの値を設定
        vi.mock('vue-router', async () => {
            const route = await vi.importActual('vue-router')
        
            return { ...route, 
                useRoute() {
                    return {
                      route: "/",
                      params:{id:"1"},
                      pathname: "",
                      query: "",
                      asPath: "",
                    };
                  },
            }
        })
    
        const mockedAxios = new MockAdapter(customizedAxios)
        mockedAxios.onPut(baseURL + "/1",{
            task_name:""
        }).reply(500)
    
        const buttons = wrapper.findAll('button')
        const submitButton =buttons.filter(element => element.text() == "送信").at(0)
        
        await submitButton.trigger('click')
        await flushPromises()
    
        expect(wrapper.text()).toContain('エラーが発生しました｡時間を置いて再度送信して下さい｡')
    })
 })

 describe('エラーメッセージ データ取得', () => { 
    test('ネットワークエラー',async() => {
        const wrapper = await mount(Edit,baseWarpperOptions)
        // route.paramsの値を設定
        vi.mock('vue-router', async () => {
            const route = await vi.importActual('vue-router')
        
            return { ...route, 
                useRoute() {
                    return {
                      route: "/",
                      params:{id:"1"},
                      pathname: "",
                      query: "",
                      asPath: "",
                    };
                  },
            }
        })

        const mockedAxios = new MockAdapter(customizedAxios)
        mockedAxios.onDelete(baseURL + "/1").networkError()

        const buttons = wrapper.findAll('button')
        const submitButton =buttons.filter(element => element.text() == "削除").at(0)

        await submitButton.trigger('click')
        await flushPromises()

        expect(wrapper.text()).toContain('エラーが発生しました｡時間を置いて再度送信して下さい｡')
    })
    
    // 処理失敗
    test('処理失敗',async() => {
        const wrapper = await mount(Edit,baseWarpperOptions)
        // route.paramsの値を設定
        vi.mock('vue-router', async () => {
            const route = await vi.importActual('vue-router')
        
            return { ...route, 
                useRoute() {
                    return {
                      route: "/",
                      params:{id:"1"},
                      pathname: "",
                      query: "",
                      asPath: "",
                    };
                  },
            }
        })

        const mockedAxios = new MockAdapter(customizedAxios)
        mockedAxios.onDelete(baseURL + "/1").reply(500)

        const buttons = wrapper.findAll('button')
        const submitButton =buttons.filter(element => element.text() == "削除").at(0)

        await submitButton.trigger('click')
        await flushPromises()
            expect(wrapper.text()).toContain('エラーが発生しました｡時間を置いて再度送信して下さい｡')
    })
 })