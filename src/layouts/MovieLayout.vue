<template>
<header>
    <input type="search" placeholder="Search" class="search-bar" />
    <div class="profile-icon"></div>
</header>
<RouterView/>
  <footer>
    <a href="/MainView" class="nav-item"><i class="fas fa-compass"></i><span>Explore</span></a>
    <a href="/MyShowView" class="nav-item active"><i class="fas fa-tv"></i><span>My shows</span></a>
    <a href="#" class="nav-item"><i class="fas fa-calendar-days"></i><span>Calendar</span></a>
    <a href="#" class="nav-item"><i class="fas fa-bell"></i><span>Notifications</span></a>
  </footer>
</template>