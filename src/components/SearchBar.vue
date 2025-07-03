<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Search', query: { q: searchQuery.value } });
    searchQuery.value = '';
  }
}
</script>

<script lang="ts">
export default {
  name: 'SearchBar',
}
</script>

<template>
  <div class="search-container">
    <input 
      type="text" 
      class="search-input"
      placeholder="Buscar series o películas..." 
      v-model="searchQuery"
      @keydown.enter="performSearch"
    />
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  margin-bottom: 30px;
}
.search-input {
  width: 100%;
  background-color: #252836;
  border: 1px solid #333140;
  border-radius: 25px;
  padding: 12px 20px;
  color: white;
  font-size: 1rem;
  box-sizing: border-box; 
}
.search-input::placeholder {
  color: #888;
}
</style>