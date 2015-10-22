$(document).ready(function() {

	Parse.initialize("m7CnuhWD7dIkJvze4ynK1BBbxH7D0JjGgfn9Iln1", "5Tm7XUvanrHDWsUKnuH5Ac07SrgmDKkeP714Xg7y");

	var ProductReviews = Parse.Object.extend('ProductReviews');

	$('#avgRating').raty({
		half: true
	});

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



	var getData = function() {
		var query = new Parse.Query(ProductReviews);
		query.find({
			success: function(results) {
				buildReviews(results);
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

		console.log(userRating+user+reviewDate+title+userReview+upVotes+downVotes);


	};


	getData();
});