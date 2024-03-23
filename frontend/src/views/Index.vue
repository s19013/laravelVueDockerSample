<script setup>
import {ref,reactive,onBeforeMount} from 'vue';
import Task from '@/components/Task.vue'

import {default as axios} from '@/tools/customizedAxios.js'

let loading = ref(true)
let tasks = ref(null)
onBeforeMount(() => {
    axios
    .get('/')
    .then((response) => {
        tasks = ref(null)
        tasks.value = response.data
        loading.value = false

    })
    .catch((error) => {console.log(error);});
})


</script>

<template>
    <div>
        <router-link :to="{name:'create'}">
            <button>新規</button>
        </router-link>
        <div>
            <input type="text">
            <button>検索</button>
        </div>

        <p v-if="loading">読込中</p>
        {{ tasks }}
        <br>
        <template v-for="task of tasks" :key="task.id">
            <Task :task="task"/>
        </template>
    </div>
</template>

<style>
</style>