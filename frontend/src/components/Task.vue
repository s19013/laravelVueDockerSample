<script setup>
import {ref,defineProps,defineEmits} from 'vue';
const emit = defineEmits(['done'])
const done = () => {
    emit('done',props.task.id)
}

const props = defineProps({
    task:{
        type:Object,
        default:{
            id:0,
            task_name:'',
            created_at:'',
        }
    }
})

const created_at = (date) => {
    return date.split("T")[0]
}

</script>

<template>
    <div>
        <h3>{{ task.task_name }}</h3>
        <p>{{ created_at(task.created_at)}}</p>

        <router-link :to="'/edit/'+task.id">
            <button>編集</button>
        </router-link>
        <button @click="done">完了</button>
    </div>
</template>

<style>

</style>