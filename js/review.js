$(document).ready(function() {

	Parse.initialize("m7CnuhWD7dIkJvze4ynK1BBbxH7D0JjGgfn9Iln1", "5Tm7XUvanrHDWsUKnuH5Ac07SrgmDKkeP714Xg7y");

	var ProductReviews = Parse.Object.extend('ProductReviews');



	$('#userRating').raty({
		half: true
	});

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



	var buildReviews = function(data) {
		$('#reviewArea').empty();
		data.forEach(function(d) {
			addReview(d);
		});
	};



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

		var reviewDiv = $('<div class="userReviewArea"></div>');

		var starDiv = $('<div class="userRating"></div>').raty({
			half: true,
			score: userRating,
			readOnly: true
		});
		
		var reviewTitle = $('<h3 class="reviewTitle"></h3>').text(' '+title);
		var deleteButton = $('<button class="btn btn-danger" id="deleteButton">X</button>');
		var deleteOption = $('<p class="deleteOption">Delete review? </p>').append(deleteButton);
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

		var reviewUserDate = $('<p class="byOnLine"></p>');
		var dateArray = reviewDate.toString().split(' '); 
		var dateString = dateArray[1]+' '+dateArray[2]+', '+dateArray[3];
		reviewUserDate.text('By '+user+' on '+dateString);
		reviewDiv.append(reviewUserDate);
		
		var reviewVotes = $('<p class="voteSummary">'+upVotes+' out of '+(upVotes+downVotes)+ ' found this review helpful</p>');	
		reviewDiv.append(reviewVotes);

		var reviewText = $('<p class="reviewTextBox"></p>').text(userReview);
		reviewDiv.append(reviewText);

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
		
		$('#reviewArea').prepend(reviewDiv);
	};


	getData();
});