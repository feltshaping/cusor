<template>
  <div>
    <button @click="showModal = true">打开模态框</button>
    
    <!-- 使用 v-model:show 实现双向绑定 -->
    <SonModal v-model:show="showModal" ref="sonModalRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SonModal from './SonModal.vue';

const showModal = ref(false);
const sonModalRef = ref(null);

// 进阶用法：父组件也可以直接调用子组件暴露的方法
// sonModalRef.value.hide(); 
</script>