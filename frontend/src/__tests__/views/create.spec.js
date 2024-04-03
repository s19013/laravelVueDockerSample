import { mount,flushPromises } from '@vue/test-utils'
import Create  from '@/views/Create.vue'
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

// モデル連携
// 送信中
// エラー処理

test('モデル連携',async() => {

    const wrapper = await mount(Create,baseWarpperOptions)

    const textarea = wrapper.find('textarea')
    await textarea.setValue('test')

    expect(textarea.element.value).toBe('test')
    expect(wrapper.vm.task_name).toBe('test')
})

// ネットワークエラーと処理失敗は別物らしい
describe('エラー処理', () => { 
    test('ネットワークエラー',async() => {
        const wrapper = await mount(Create,baseWarpperOptions)
    
        const mockedAxios = new MockAdapter(customizedAxios)
        mockedAxios.onPost(baseURL + "/").networkError()
    
        const textarea = wrapper.find('textarea')
        await textarea.setValue('test')
    
        const buttons = wrapper.findAll('button')
        const submitButton =buttons.filter(element => element.text() == "送信").at(0)
    
        await submitButton.trigger('click')
        await flushPromises()
    
        expect(wrapper.text()).toContain('エラーが発生しました｡時間を置いて再度送信して下さい｡')
    })
    
    // 処理失敗
    test('処理失敗',async() => {
        const wrapper = await mount(Create,baseWarpperOptions)
    
        const mockedAxios = new MockAdapter(customizedAxios)
        mockedAxios.onPost(baseURL + "/").reply(500,{
            // バックと同じ帰り値だから大丈夫
            message:"エラーが発生しました｡時間を置いて再度送信して下さい｡"
        });
    
        const textarea = wrapper.find('textarea')
        await textarea.setValue('test')
    
        const buttons = wrapper.findAll('button')
        const submitButton =buttons.filter(element => element.text() == "送信").at(0)
    
        await submitButton.trigger('click')
        await flushPromises()
    
        expect(wrapper.text()).toContain('エラーが発生しました｡時間を置いて再度送信して下さい｡')
    })
})

test('送信中', async () => {
    const wrapper = await mount(Create,baseWarpperOptions)

    // 送信中状態にするためディレイをかける
    const mockedAxios = new MockAdapter(customizedAxios,{ delayResponse: 2000 })
    mockedAxios.onPost(baseURL + "/").reply(200,{})

    const textarea = wrapper.find('textarea')
    await textarea.setValue('test')

    const buttons = wrapper.findAll('button')
    const submitButton =buttons.filter(element => element.text() == "送信").at(0)

    // 送信中のdomが見たい場合はawiatで待つ必要があるらしい｡
    // XXX:index.spec.jsとやってることは同じはずなのに同じ判定の仕方ではテストが通らない?
    // 調査の必要あり
    await submitButton.trigger('click')

    expect(wrapper.vm.sending).toBe(true)
    expect(wrapper.text()).toContain('送信中')
 })
