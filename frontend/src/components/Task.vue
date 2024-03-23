<script setup>
import {ref,defineProps} from 'vue';

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
        <button>完了</button>
    </div>
</template>

<style>

</style>