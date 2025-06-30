<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  <header>
    <input type="search" placeholder="Search" class="search-bar" />
    <div class="profile-icon"></div>
  </header>
  <RouterView/>
  <footer>
    <RouterLink to="/MainView" class="nav-item" active-class="active">
      <i class="fas fa-compass"></i><span>Explore</span>
    </RouterLink>
    <RouterLink to="/MyShowView" class="nav-item" active-class="active">
      <i class="fas fa-tv"></i><span>My shows</span>
    </RouterLink>
    <RouterLink to="/calendarView" class="nav-item" active-class="active">
        <i class="fas fa-calendar-days"></i><span>Calendar</span>
      </RouterLink>
   <RouterLink to="/NotificationsView" class="nav-item" active-class="active">
  <i class="fas fa-bell"></i><span>Notifications</span>
</RouterLink>
  </footer>
</template>

<script setup>
// No es necesario código aquí para el cambio solicitado
</script>