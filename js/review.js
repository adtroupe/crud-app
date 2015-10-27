
//A function for when the overal document is loaded and ready for content to prevent objects trying to load on an unready page.
$(document).ready(function() {

	//Intializes the Parse and Parse.object
	Parse.initialize("m7CnuhWD7dIkJvze4ynK1BBbxH7D0JjGgfn9Iln1", "5Tm7XUvanrHDWsUKnuH5Ac07SrgmDKkeP714Xg7y");
	var ProductReviews = Parse.Object.extend('ProductReviews');

	$('#userRating').raty({
		half: true
	});

	//Gets and sets the form inputs in Parse, resets the fields, and calls getData() if the save to Parse is successful.
	$('form').submit( function() {
		var review = new ProductReviews();
		review.set({
			userRating: parseFloat($('#userRating>input').val()),
			name: $('#name').val(),
			title: $('#title').val(),
			userReview: $('#review').val(),
			upVotes: 0,
			downVotes: 0
		});
		$('#userRating>input').val('0');
		$('#name').val('');
		$('#title').val('');
		$('#review').val('');

		review.save(null, {
			success:function(){
				getData();
			}
		});
		return false;
	});

	var numReviews;
	var totalRating;

	//getData() function is called when the page is loaded and when any information is added/updated.
	//Builds the Average Raty Star rating at the top of the page and shows how many reviews there currently are.
	var getData = function() {
		numReviews = 0;
		totalRating = 0;
		$('#avgRating').empty();
		$('#ratingReviews').empty();
		var query = new Parse.Query(ProductReviews);
		query.find({
			success: function(results) {
				buildReviews(results);
				$('#avgRating').raty({
					half: true,
					score: Math.round((totalRating/numReviews)*2)/2,
					readOnly: true
				});
				$('#ratingReviews').append(' Average Rating from '+numReviews+' product reviews');
			}
		});
	};

	//Parses through the parse data for individual reviews and sends them to the addReview(d) function to be appended in the html
	var buildReviews = function(data) {
		$('#reviewArea').empty();
		data.forEach(function(d) {
			addReview(d);
		});
	};

	//This functions obtains all of the input fields for a individual review, then creates html elements to display the data and eventually appends them all to the correct div in the html.
	var addReview = function(review) {
		var userRating = review.get('userRating');
		var user = review.get('name');
		var reviewDate = review.get('createdAt');
		var title = review.get('title');
		var userReview = review.get('userReview');
		var upVotes = review.get('upVotes');
		var downVotes = review.get('downVotes');
		numReviews++;
		totalRating = totalRating + userRating;

		//A div for the entire review
		var reviewDiv = $('<div class="userReviewArea"></div>');

		//A div for the user's rating
		var starDiv = $('<div class="userRating"></div>').raty({
			half: true,
			score: userRating,
			readOnly: true
		});
		
		//The content in the first row of the review
		var reviewTitle = $('<h3 class="reviewTitle"></h3>').text(' '+title);
		var deleteButton = $('<button class="btn btn-danger" id="deleteButton">X</button>');
		var deleteOption = $('<p class="deleteOption"><span class="deleteText">Delete review?</span> </p>').append(deleteButton);
		reviewDiv.append(deleteOption);
		reviewDiv.append(starDiv);
		reviewDiv.append(reviewTitle);
		deleteButton.on('click', function() {
			review.destroy({
				success: function() {
					getData();
				}
			});
		});

		//The content regarding user and date
		var reviewUserDate = $('<p class="byOnLine"></p>');
		var dateArray = reviewDate.toString().split(' '); 
		var dateString = dateArray[1]+' '+dateArray[2]+', '+dateArray[3];
		reviewUserDate.text('By '+user+' on '+dateString);
		reviewDiv.append(reviewUserDate);
		
		//Vote totals of the review
		var reviewVotes = $('<p class="voteSummary">'+upVotes+' out of '+(upVotes+downVotes)+ ' found this review helpful</p>');	
		reviewDiv.append(reviewVotes);

		//The body text of the user's review
		var reviewText = $('<p class="reviewTextBox"></p>').text(userReview);
		reviewDiv.append(reviewText);

		//The method to vote for if a review was helpful which alters the totals in Parse
		var helpfulQuestion = $('<p class="useful">Was this review helpful to you? </p>');
		var upVoteButton = $('<button class="btn btn-warning" id="yesB">Yes</button>');
		var downVoteButton = $('<button class="btn btn-warning" id="noB">No</button>');
		helpfulQuestion.append(upVoteButton).append(downVoteButton)
		reviewDiv.append(helpfulQuestion);
		upVoteButton.on('click', function() {
			review.increment('upVotes');
			review.save(null, {
				success: function() {
					getData();
				}
			});
		});
		downVoteButton.on('click', function() {
			review.increment('downVotes');
			review.save(null, {
				success: function() {
					getData();
				}
			});
		});
		
		//Prepends the review at the top of the overall page's review area
		$('#reviewArea').prepend(reviewDiv);
	};

	getData();
});