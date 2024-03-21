<script setuo>
import {ref} from 'vue';


</script>

<template>
    <div>
        <router-link :to="{name:'index'}">
            <button>戻る</button>
        </router-link>
        <div>
            <textarea />
            <button>送信</button>
        </div>
        <button>削除</button>
    </div>
</template>

<style>
</style>