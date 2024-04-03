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
let errorMessage = ref(null)

defineExpose({tasks,loading,keyword})

onBeforeMount(async () => {
    keyword.value = route.query.keyword || ''; // URL のクエリパラメーターを取得
    await search()
})

const taskDone = async (id) => {
    resetErrorMessage()
    await axios
    .delete('/done/' + id)
    .then(() => {
        // エラーが帰ってこない -> 動作が正常に終了したということ
        // レスポンスは特に無い
        setTasks(leftOverTasks(id))
    })
    .catch((error) => {
        // console.log(error);
        setErrorMessage("通信エラーが発生しました｡時間を置いてもう一度送信してください")
    });
}

const search = async () => {
    nowLoading()
    resetErrorMessage()
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
    .catch((error) => {
        // console.log(error);
        setErrorMessage("通信エラーが発生しました｡時間を置いてもう一度送信してください")
    });
}

const submit = () => {
    // urlを書き換える 他の人にurlを渡したりして再現できるようにするため?
    router.push({name:'index',query: { keyword: keyword.value }})
    search()
}

const setTasks = (arg) => {
    tasks.value = arg
}

const resetErrorMessage = () => {
    errorMessage.value = null
}

const setErrorMessage = (message) => {
    errorMessage.value = message
}

// 完了したタスクを配列から消す
// ->完了したタスク以外の要素を取ってくる
const leftOverTasks = (donedTaskId) => {
    return tasks.value.filter((task) => task.id !== donedTaskId)
}

const nowLoading = () => {loading.value = true}

const LoadingCompleted = () => { loading.value = false }

</script>

<template>
    <div>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <router-link :to="{name:'create'}">
            <button>新規</button>
        </router-link>
        <div>
            <input v-model="keyword" type="text">
            <button @click="submit">検索</button>
        </div>

        <p v-if="loading">読込中</p>
        
        <br>
        <div v-if="!loading">
            <template v-for="task of tasks" :key="task.id">
                <Task :task="task" @done="taskDone"/>
            </template>
        </div>
    </div>
</template>

<style>
</style>