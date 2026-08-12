<template>
  <!-- 3. DOM 上实现隐藏监听：通过自定义事件 vue:hide 桥接 -->
  <div 
    ref="deleteRef" 
    class="modal fade" 
    tabindex="-1" 
    @vue:hide="$emit('update:show', false)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">确认删除</h5>
          <!-- 子组件点击子标签，可以直接调用暴露的 hide 方法 -->
          <button type="button" class="btn-close" @click="hide"></button>
        </div>
        <div class="modal-body">确定要删除这条数据吗？</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="hide">取消</button>
          <button type="button" class="btn btn-primary" @click="handleConfirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const deleteRef = ref(null);
// 初始化 Modal 并获取控制方法
const { modal, hide } = useModal(deleteRef, 'show');

// 监听父组件传入的 show 属性，驱动 Bootstrap Modal 的显示/隐藏
watch(() => props.show, (newVal) => {
  if (newVal) {
    modal.value?.show();
  } else {
    modal.value?.hide();
  }
});

// 子组件内部的业务逻辑
const handleConfirm = () => {
  console.log('执行删除逻辑...');
  hide(); // 业务完成后，直接调用暴露的方法关闭
};
</script>