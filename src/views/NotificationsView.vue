<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTvShowsStore } from '../stores/tvShows';

const showsStore = useTvShowsStore();

const notifications = computed(() => showsStore.notifications);

onMounted(() => {
  showsStore.checkForUpdates();
});

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};
</script>

<template>
  <div class="notifications-view">
    <h1>Recent Updates</h1>
    <div v-if="notifications.length > 0" class="notification-list">
      <div v-for="update in notifications" :key="update.id" class="notification-item">
        <p>
          <span class="record-type">{{ update.recordType }}</span> con ID
          <RouterLink :to="`/${update.recordType}/${update.recordId}`" class="notification-link">
            {{ update.recordId }}
          </RouterLink>
          fue actualizado.
        </p>
        <small class="timestamp">{{ formatDate(update.timestamp) }}</small>
      </div>
    </div>
    <div v-else class="no-updates">
      <p>No new updates since your last visit.</p>
    </div>
  </div>
</template>

<style scoped>
.notifications-view {
  padding: 2rem;
  color: white;
}
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.notification-item {
  background-color: #2c3e50;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #42b983;
}
.record-type {
  font-weight: bold;
  text-transform: capitalize;
  display: inline-block;
  background-color: #42b983;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 8px;
}
.notification-link {
  color: #a2d8c3;
  font-weight: bold;
  text-decoration: none;
}
.notification-link:hover {
  text-decoration: underline;
}
.timestamp {
  color: #999;
}
.no-updates {
  margin-top: 2rem;
  text-align: center;
  color: #777;
}
</style>