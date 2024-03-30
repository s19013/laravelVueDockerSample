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

onBeforeMount(async () => {
    keyword.value = route.query.keyword || ''; // URL のクエリパラメーターを取得
    await search()
})

const taskDone = async (id) => {
    await axios
    .delete('/' + id)
    .then((response) => {
        setTasks(leftOverTasks(id))
    })
    .catch((error) => {console.log(error);});
}

const search = async () => {
    await axios
    .get('/',{
        params:{
            keyword:keyword.value
        }
    })
    .then((response) => {
        setTasks(response.data)
        LoadingCompleted()
    })
    .catch((error) => {console.log(error);});
}

const submit = () => {
    // urlを書き換える 他の人にurlを渡したりして再現できるようにするため?
    router.push({name:'index',query: { keyword: keyword.value }})
    search()
}

const setTasks = (arg) => {
    tasks.value = arg
}

// 完了したタスクを配列から消す
// ->完了したタスク以外の要素を取ってくる
const leftOverTasks = (donedTaskId) => {
    return tasks.value.filter((task) => task.id !== donedTaskId)
}

const LoadingCompleted = () => { loading.value = false }

</script>

<template>
    <div>
        <router-link :to="{name:'create'}">
            <button>新規</button>
        </router-link>
        <div>
            <input v-model="keyword" type="text">
            <button @click="submit">検索</button>
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