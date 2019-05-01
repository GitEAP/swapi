var baseURL = "https://swapi.co/api/";
var paramsURL = "films/";
var hasMovieId = false;

var films = [];

var parentContainer = document.getElementById("movie-content");

/*
	ajax request to get movie data
*/
function getMovieData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	// show movie details
    	if(hasMovieId) {
			films = JSON.parse(this.responseText);
			viewMovieDetails();
    	}
    	// show all movies
    	else {
	      films = JSON.parse(this.responseText).results;
	      sortResults('date');
    	}
    }
  };
  xhttp.open("GET", baseURL+paramsURL, true);
  xhttp.send();
}

/*
	load data to DOM
*/
function loadData() {
    // Create materialize column with card for each movie	
	for (var i = 0; i < films.length; i++) {
    	var col = document.createElement("DIV");
    		col.classList.add("col", "s6","m4", "l3");

    	var card = document.createElement("DIV");
    		card.classList.add("card", "light-blue", "darken-4");

    	var cardContent = document.createElement("DIV");
    		cardContent.classList.add("card-content", "white-text", "card-height");

    	var cardTitle = document.createElement("SPAN");
    		cardTitle.classList.add("card-title");
    		cardTitle.innerHTML = films[i].title;

    	var p1 = document.createElement("P");
    		p1.innerHTML = "Episode: " + films[i].episode_id;

    	var p2 = document.createElement("P");
    		p2.innerHTML = formatDate(films[i].release_date);

    	var cardAction = document.createElement("DIV");
    		cardAction.classList.add("card-action");

    	var cardActionLink = document.createElement("A");
    		cardActionLink.innerHTML = "More Details";
    		cardActionLink.classList.add("yellow-text", "darken-1");
    		cardActionLink.setAttribute("href", "movie.html?film=" + (i+1));

    		//append content to cardContent
    		cardContent.appendChild(cardTitle);
            cardContent.appendChild(p1);
            cardContent.appendChild(p2);	

    		//append cardContent to card
    		card.appendChild(cardContent);

    		//append card action link to CardAction
    		cardAction.appendChild(cardActionLink);
			//append card and cardAction to column container
    		col.appendChild(card).appendChild(cardAction);
    	
    		//append col to row
    		parentContainer.appendChild(col);
    }
}

/*
	Format date to user friendly format
*/
function formatDate (releaseDate) {
	var months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var d = new Date(releaseDate);
	var formattedDate = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
	return formattedDate;
}

/*
	check if there is a parameter in url for details view
*/
function checkMovieId () {
	var urlParams = window.location.search;//?film=1
	if (urlParams !== "") {
		var getParamNum = urlParams.indexOf("=");
		var movieId = urlParams.slice(getParamNum + 1);
		paramsURL += movieId;//add movieId to request URL
		hasMovieId = true;
	}
}

/*
	load movie details to DOM
*/
function viewMovieDetails() {
        // create materialize collection for movie details
        var col = document.createElement("DIV");
            col.classList.add("col", "s12");

    	var ul = document.createElement("UL");
			ul.classList.add("collection", "with-header");

    	var li1 = document.createElement("LI");
    		li1.classList.add("collection-header");

		var heading = document.createElement("H4");
		heading.innerHTML = "Episode " + films.episode_id;

		var li2 = document.createElement("LI");
    		li2.classList.add("collection-item");
    		li2.innerHTML = "Release Date: " + formatDate(films.release_date);

    	var li3 = document.createElement("LI");
    		li3.classList.add("collection-item");
    		li3.innerHTML = "Director: " + films.director;

    	var li4 = document.createElement("LI");
    		li4.classList.add("collection-item");
    		li4.innerHTML = "Producer: " + films.producer;

        // append items to collection
    	li1.appendChild(heading);
    	ul.appendChild(li1);
    	ul.appendChild(li2);
    	ul.appendChild(li3);
    	ul.appendChild(li4);
        col.appendChild(ul);
    	parentContainer.appendChild(col);
        // change title of page to title of film
    	var movieTitle = document.getElementById("movie-title");
    	movieTitle.innerHTML = films.title;
}

/*
	sortResults based on user selection
	params: type = type of sort
*/
function sortResults(type) {
	switch(type) {
		case 'title':
			type = "title";
			sortArrayOfObjects(type);
		break;
		case 'episode':
			type = "episode_id";
			films.sort(function(a, b){return a[type] - b[type]});
		break;
		case 'date':
			type = "release_date";
			sortArrayOfObjects(type);
		break;
	}
	resetData();//clear DOM
	loadData();// Reload sorted films to DOM
}

/*
	sort array of object alphabetically
    strings of alpha characters only
*/
function sortArrayOfObjects(type) {
	films.sort(function(a, b){
    var x = a[type].toLowerCase();
    var y = b[type].toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  });
}

/*
	remove results from DOM
*/
function resetData() {
    var childNode = parentContainer.lastElementChild;  
    while (childNode) { 
        parentContainer.removeChild(childNode); 
        childNode = parentContainer.lastElementChild;
    } 
}


/*
	Add event listeners to each sorting button
*/
var sortBtn = document.querySelectorAll('.sortBtn');

for (var i =  0; i < sortBtn.length; i++) {
	sortBtn[i].addEventListener('click', function(){
		var buttonText = this.innerText.toLowerCase();
		sortResults(buttonText.trim());
	});
}

//checks url parameters
checkMovieId();

// calls api to get data results
getMovieData();
