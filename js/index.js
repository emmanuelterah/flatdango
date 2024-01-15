document.addEventListener('DOMContentLoaded', function () {
  // Function to display details of the selected film
  function displayFilmDetails(film) {
      const { title, poster, runtime, showtime, capacity, tickets_sold } = film;
      const availableTickets = capacity - tickets_sold;

      // Update the film details section with information from the selected film
      document.getElementById('movie-poster').src = poster;
      document.getElementById('movie-title').textContent = title;
      document.getElementById('movie-runtime').textContent = runtime;
      document.getElementById('movie-showtime').textContent = showtime;
      document.getElementById('available-tickets').textContent = availableTickets;

      // Update the Buy Ticket button based on available tickets
      const buyTicketButton = document.getElementById('buy-ticket');
      if (availableTickets > 0) {
          buyTicketButton.textContent = 'Buy Ticket';
          buyTicketButton.disabled = false;
      } else {
          buyTicketButton.textContent = 'Sold Out';
          buyTicketButton.disabled = true;
      }
  }

  // Fetch movie details on page load
  fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(movieDetails => {
          // Display details of the first film if available
          if (movieDetails.length > 0) {
              displayFilmDetails(movieDetails[0]);
          }

          // Add event listener for Buy Ticket button
          document.getElementById('buy-ticket').addEventListener('click', function () {
              // Buy ticket functionality
              buyTicket(movieDetails[0]); // Pass the details of the first movie
          });
      });

  // Fetch movie list on page load
  fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(movieList => {
          // Populate movie menu
          updateMovieMenu(movieList);
      });
});

function updateMovieDetails(movieDetails) {
  // Populate movie details on the page
  document.getElementById('movie-poster').src = movieDetails.poster;
  document.getElementById('movie-title').textContent = movieDetails.title;
  document.getElementById('movie-runtime').textContent = movieDetails.runtime;
  document.getElementById('movie-showtime').textContent = movieDetails.showtime;

  // Calculate available tickets
  const availableTickets = movieDetails.capacity - movieDetails.tickets_sold;
  const availableTicketsElement = document.getElementById('available-tickets');
  availableTicketsElement.textContent = availableTickets;

  // Update Buy Ticket button based on available tickets
  const buyTicketButton = document.getElementById('buy-ticket');
  if (availableTickets === 0) {
      buyTicketButton.textContent = 'Sold Out';
      buyTicketButton.disabled = true; // Disable the button when sold out
  } else {
      buyTicketButton.textContent = 'Buy Ticket';
      buyTicketButton.disabled = false;
  }
}

function updateMovieMenu(movieList) {
  // Populate movie menu on the left side of the page
  const filmsList = document.getElementById('films');
  movieList.forEach(movie => {
      const listItem = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.textContent = movie.title;
      anchor.classList.add('film-item');
      anchor.addEventListener('click', function (event) {
          // Prevent the default link behavior
          event.preventDefault();

          // Remove the 'active' class from all film items
          document.querySelectorAll('.film-item').forEach(item => {
              item.classList.remove('active');
          });

          // Fetch and update details for the selected movie
          fetchMovieDetails(movie.id);

          // Add the 'active' class to the selected film item
          anchor.classList.add('active');
      });
      
      // Add 'sold-out' class if the movie is sold out
      if (movie.capacity - movie.tickets_sold === 0) {
          listItem.classList.add('sold-out');
      }

      listItem.appendChild(anchor);
      filmsList.appendChild(listItem);
  });
}

function fetchMovieDetails(movieId) {
  // Fetch details for the selected movie
  fetch(`http://localhost:3000/films/${movieId}`)
      .then(response => response.json())
      .then(movieDetails => {
          // Update movie details on the page
          updateMovieDetails(movieDetails);
      });
}

function buyTicket(movieDetails) {
  const availableTicketsElement = document.getElementById('available-tickets');
  let availableTickets = parseInt(availableTicketsElement.textContent);

  if (availableTickets > 0) {
      // Decrease available tickets
      availableTickets--;
      availableTicketsElement.textContent = availableTickets;

      // Check if tickets are sold out after the purchase
      if (availableTickets === 0) {
          // Update Buy Ticket button to "Sold Out" and disable it
          const buyTicketButton = document.getElementById('buy-ticket');
          buyTicketButton.textContent = 'Sold Out';
          buyTicketButton.disabled = true;
      }

      alert('Ticket purchased successfully!');
  } 
}