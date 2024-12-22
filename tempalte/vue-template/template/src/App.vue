<template>
  <%_ if(data.mode === 'api') { _%>
  <div>requestApi</div>
  <%_ } else { _%>
  <div>default</div>
  <%_ } _%>
</template>

<script setup>
<%_ if(data.mode === 'api') { _%>
  console.log('request Api')
<%_ } _%>
</script>

<style></style>
