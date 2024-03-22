<script setuo>
import {ref} from 'vue';


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
    </div>
</template>

<style>
</style>