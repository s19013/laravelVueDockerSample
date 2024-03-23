<script setup>
import {ref,reactive,onBeforeMount} from 'vue';
import {useRoute,useRouter} from "vue-router";
import {default as axios} from '@/tools/customizedAxios.js'
import Task from '@/components/Task.vue'

const route = useRoute();
const router = useRouter()

let loading = ref(true)
let tasks = ref(null)
let keyword = ref('')

onBeforeMount(() => {
    console.log("onBeforeMount");
    axios
    .get('/',{
        params:{
            keyword:route.query.keyword
        }
    })
    .then((response) => {
        tasks = ref(null)
        tasks.value = response.data
        loading.value = false
    })
    .catch((error) => {console.log(error);});
})

const taskDone = async (id) => {
    await axios
    .delete('/' + id)
    .then((response) => {
        tasks.value = leftOverTasks(id)
    })
    .catch((error) => {console.log(error);});
}

// 完了したタスクを配列から消す
// ->完了したタスク以外の要素を取ってくる
const leftOverTasks = (donedTaskId) => {
    return tasks.value.filter((task) => task.id !== donedTaskId)
}

const search = () => {
    console.log("search");
    router.push({name:'index',query: { keyword: keyword.value }})
}

</script>

<template>
    <div>
        <router-link :to="{name:'create'}">
            <button>新規</button>
        </router-link>
        <div>
            <input v-model="keyword" type="text">
            <button @click="search">検索</button>
        </div>

        <p v-if="loading">読込中</p>
        <!-- <pre>
            {{ tasks }}
        </pre> -->
        <br>
        <template v-for="task of tasks" :key="task.id">
            <Task :task="task" @done="taskDone"/>
        </template>
    </div>
</template>

<style>
</style>