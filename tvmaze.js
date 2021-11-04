
      async function searchShows(query) {
        const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
        let shows = res.data.map(results => {
          let show = results.show;
          return {
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image ? show.image.medium : 'MISSING IMAGE'
          };
        });
          return shows;
      }
      

      
      function populateShows(shows) {
        const $showsList = $("#shows-list");
        $showsList.empty();
      
        for (let show of shows) {
          let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
               <div class="card" data-show-id="${show.id}">
                 <div class="card-body">
                   <h5 class="card-title">${show.name}</h5>
                   <p class="card-text">${show.summary}</p>
                   <img src=${show.image}>
                   <button class="btn get-episodes">Get Episodes</button>
                 </div>
               </div>
             </div>
            `);
      
          $showsList.append($item);
        }
      }
      
      
      /** Handle search form submission:
       *    - hide episodes area
       *    - get list of matching shows and show in shows list
       */
      
      $("#search-form").on("submit", async function handleSearch (evt) {
        evt.preventDefault();
      
        let query = $("#search-query").val();
        if (!query) return;
      
        $("#episodes-area").hide();
      
        let shows = await searchShows(query);
      
        populateShows(shows);
      });
      
      
      /** Given a show ID, return list of episodes:
       *      { id, name, season, number }
       */
      
      async function getEpisodes(id) {
        const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
        let episodes = res.data.map(episode => ({
            id: episode.id,
            name: episode.name,
            season: episode.season,
            number: episode.number  
        }));
          return episodes;
      }
        
      function populateEpisodes(episodes) {
        const $episodesList = $("#episodes-list");
        $episodesList.empty();
      
        for (let episode of episodes) {
          let $item = $(
            `<li>
                ${episode.name}
                (season ${episode.season}, episode ${episode.number})
            </li>
            `);
          $episodesList.append($item);
        }
        $('#episodes-area').show();
      }

      $('#shows-list').on('click', '.get-episodes', async function clickForEpisodes(e){
        let showId = $(e.target).closest('.Show').data('show-id');
        let episodes = await getEpisodes(showId);
        populateEpisodes(episodes);
      });


      