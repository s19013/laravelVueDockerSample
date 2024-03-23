<script setup>
import {ref} from 'vue';
import {default as axios} from '@/tools/customizedAxios.js'
import { useRouter } from 'vue-router'

const router = useRouter()


let task_name = ref('')
let sending =ref(false)
let errorMessage = ref('')

const submit = async () => {
    sending.value=true
    errorMessage.value = ''

    await axios
    .post('/',{task_name:task_name.value})
    .then((response) => {
        router.push({name:'index'})
    })
    .catch((error) => {
        console.log(error);
        errorMessage = error.response.data.message
    });

    sending.value=false
}
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