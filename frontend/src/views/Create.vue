<script setup>
import {ref} from 'vue';
import {default as axios} from '@/tools/customizedAxios.js'
import { useRouter } from 'vue-router'

const router = useRouter()


let task_name = ref('')
let sending =ref(false)
let errorMessage = ref('')

defineExpose({sending})

const submit = async () => {
    sending.value=true
    resetErrorMessage()

    await axios
    .post('/',{task_name:task_name.value})
    .then((response) => {
        // ホーム画面に戻る
        router.push({name:'index'})
    })
    .catch((error) => {
        // console.log(error);
        
        // ネットワークエラーと処理失敗は別物らしい
        try {
            setErrorMessage( error.response.data.message )
        } catch (error) {
            // ここに来たということは｡サーバーから送られたメッセージではないということ
            setErrorMessage("エラーが発生しました｡時間を置いて再度送信して下さい｡")
        }
    });

    sending.value=false
}

const resetErrorMessage = () => {errorMessage.value = ''}
const setErrorMessage = (message) => { errorMessage.value = message }
</script>

<template>
    <div>
        
        <router-link :to="{name:'index'}">
            <button>戻る</button>
        </router-link>
        <div>
            <textarea  placeholder="タスク名" required v-model="task_name"/>
            <button @click="submit">送信</button>
        </div>
        <p v-if="sending">送信中</p>
        <p>{{ errorMessage }}</p>
    </div>
</template>

<style>
</style>