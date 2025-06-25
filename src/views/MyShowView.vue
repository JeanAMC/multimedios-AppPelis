<template>

  <nav class="tab-nav">
    <button class="active">TV series</button>
    <button>Movies</button>
  </nav>

  <section class="categories">
    <div class="category">
      <div class="thumbnail">
        <img src="https://cdn.europosters.eu/image/750/poster/wednesday-perfect-day-i186428.jpg" alt="Wednesday" />
        <span class="badge">10</span>
      </div>
      <p>Watchlist</p>
    </div>

    <div class="category">
      <div class="thumbnail">
        <img src="https://picfiles.alphacoders.com/340/thumb-1920-340575.jpg" alt="Westworld" />
        <span class="badge">3</span>
      </div>
      <p>Watched</p>
    </div>

    <div class="category">
      <div class="thumbnail">
        <img src="https://www.themoviedb.org/t/p/original/s68zjwpBtNL18Fs3hBZQvMnOfDU.jpg" alt="Servant" />
        <span class="badge">2</span>
      </div>
      <p>Favorites</p>
    </div>
  </section>

  <section class="watching-list">
    <article class="watching-item">
      <img src="https://www.themoviedb.org/t/p/original/s68zjwpBtNL18Fs3hBZQvMnOfDU.jpg" alt="Severance" />
      <div class="info">
        <h3>Servant</h3>
        <p class="episode-info">
          Temporada 4, Episodio 2<br />
          <span class="episode-title">"Picor"</span>
        </p>
        <div class="progress"><span style="width: 20%"></span></div>
        <small>4/2 • 6 left</small>
        <div class="actions">
          <button class="watched">Watched</button>
          <a href="#">Summary</a>
        </div>
      </div>
    </article>

    <article class="watching-item">
      <img
        src="https://resizing.flixster.com/JGirM4BcLVac7R8clPe0O0_1sV8=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvYjU3ZjEzZjQtMmM4MS00NTNlLWFiZTItYmY5ZTZiOWEwMWU4LmpwZw=="
        alt="The Devil's Hour" />
      <div class="info">
        <h3>The Devil's Hour</h3>
        <p class="episode-info">
          Temporada 2, Episodio 2<br />
          <span class="episode-title">"Red Lines"</span>
        </p>
        <div class="progress"><span style="width: 70%"></span></div>
        <small>2/2 • 3 left</small>
        <div class="actions">
          <button class="watched">Watched</button>
          <a href="#">Summary</a>
        </div>
      </div>
    </article>
  </section>
</template>