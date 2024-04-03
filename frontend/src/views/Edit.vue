<script setup>
import {ref,reactive,onBeforeMount} from 'vue';
import {default as axios} from '@/tools/customizedAxios.js'
import {useRoute,useRouter} from "vue-router";

const route = useRoute();
const router = useRouter()
let loading = ref(true)
let sending = ref(false)

let errorMessage = ref('')

const id = ref(route.params['id']);
let task_name = ref('')

onBeforeMount(() => {
    getTaskData()
})

const getTaskData = async () => {
    resetErrorMessage()
    await axios
    .get('/' + id.value)
    .then((response) => {
        task_name.value = response.data.task_name

        loading.value = false
    })
    .catch((error) => {
        // console.log(error);
        setErrorMessage(error)
    });
}

const submit = async () => {
    sending.value=true
    resetErrorMessage()

    await axios
    .put('/' + id.value ,{task_name:task_name.value})
    .then((response) => {
        router.push({name:'index'})
    })
    .catch((error) => {
        // console.log(error);
        setErrorMessage(error)
    });

    sending.value=false
}

const destroy = async () => {
    sending.value=true
    resetErrorMessage()

    await axios
    .delete('/' + id.value)
    .then((response) => {
        // 戻るボタンで戻って来れないようにするため
        router.replace({name:'index'})
    })
    .catch((error) => {
        // console.log(error);
        setErrorMessage(error)
    });

    sending.value=false
}

const resetErrorMessage = ()  => { errorMessage.value = '' }
const setErrorMessage = (error) => {
    // ネットワークエラーと処理失敗は別物らしい
    try {
        errorMessage.value = error.response.data.message
    } catch (innerError) {
        // ここに来たということは｡サーバーから送られたメッセージではないということ
        errorMessage.value = "エラーが発生しました｡時間を置いて再度送信して下さい｡"
    }
     
}
</script>

<template>
    <div>
        <router-link :to="{name:'index'}">
            <button>戻る</button>
        </router-link>
        <div>
            <textarea required v-model="task_name"/>
            <button @click="submit">送信</button>
        </div>

        <p v-if="loading">読込中</p>
        <p v-if="sending">送信中</p>
        <p>{{ errorMessage }}</p>

        <button @click="destroy">削除</button>
    </div>
</template>

<style>
</style>