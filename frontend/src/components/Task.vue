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
            created_date:'',
        }
    }
})

</script>

<template>
    <div>
        <h3>{{ task.task_name }}</h3>
        <p>{{ task.created_date }}</p>

        <router-link :to="'/edit/'+task.id">
            <button>編集</button>
        </router-link>
        <button @click="done">完了</button>
    </div>
</template>

<style>

</style>