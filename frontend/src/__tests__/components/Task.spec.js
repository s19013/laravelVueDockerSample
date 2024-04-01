import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Task from '@/components/Task.vue'

import { createRouter, createWebHistory } from 'vue-router'
import { routes } from "@/router" 

// 使いまわし用の基本のprops
const baseProps = {
    task:{
        id:1,
        task_name:'testTask',
        created_at:'2024-03-23T0000', // Tで切り分けるようにしてるからTが必要
    } 
}

// vue-routerの警告を消すために色々
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
  })

const baseWrapper = mount(Task,{
    props:baseProps,
    global: {
      plugins: [router]
    }
})

test('レンダリング', () => {
    const wrapper = baseWrapper
    const anker = wrapper.findAll('a')[0]
    expect(anker.html()).toContain(baseProps.task.id)
    expect(wrapper.text()).toContain('testTask')
    expect(wrapper.text()).toContain('2024-03-23')
  })

test('created_at',() => {
    const wrapper = baseWrapper
    expect(wrapper.vm.created_at('2024-03-23T0000')).toBe('2024-03-23')
})

test('submit',() => {
    const wrapper = baseWrapper
    const buttons = wrapper.findAll('button')
    // 見つけたボタンの中から完了ボタンを探す
    // textに完了って書いてるボタンを取得するとおもむろにそうなる
    const submitButton = buttons.filter(element => element.text() == "完了").at(0)
    submitButton.trigger('click')
    // emitイベントが動いたか確認
    expect(wrapper.emitted('done')).toBeTruthy()
    // emitイベントが渡す値を確認
    // toEqualで配列みたいなのを書いてるのは帰り値の仕様
    expect(wrapper.emitted('done')[0]).toEqual([1])
    
    // console.log();
})

// 画面遷移テストはここでやることではない気がする｡