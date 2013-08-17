from django.db import models

# Create your models here.

class Nation(models.Model):
	name = models.CharField(max_length=50)
	group = models.CharField(max_length=10)
	fifa_ranking = models.IntegerField()
	## All this data covers the last 10 games
	wins = models.IntegerField()
	draws = models.IntegerField()
	losses = models.IntegerField()
	goals_for = models.IntegerField()
	goals_against = models.IntegerField()
	clean_sheets = models.IntegerField()
	goalless_games = models.IntegerField()
	shots = models.IntegerField()
	shots_on_target = models.IntegerField()
	shots_off_target = models.IntegerField()
	possession = models.IntegerField()
	pass_success = models.IntegerField()
	tackles = models.IntegerField()
	yellow_cards = models.IntegerField()
	red_cards = models.IntegerField()
	fouls = models.IntegerField()
	intercepts = models.IntegerField()
	headers = models.IntegerField()
	average_rating = models.IntegerField()
	match_one = models.CharField(max_length=200)
	match_two = models.CharField(max_length=200)
	match_three = models.CharField(max_length=200)
	match_four = models.CharField(max_length=200)
	match_five = models.CharField(max_length=200)
	match_six = models.CharField(max_length=200)
	match_seven = models.CharField(max_length=200)
	match_eight = models.CharField(max_length=200)
	match_nine = models.CharField(max_length=200)
	match_ten = models.CharField(max_length=200)
	competitions_won = models.CharField(max_length=400)
	def __unicode__(self):
		return self.name

class Club(models.Model):
	name = models.CharField(max_length=50)
	nation = models.ForeignKey(Nation)
	city = models.CharField(max_length=50)
	def __unicode__(self):
		return self.name

class Player(models.Model):
	name = models.CharField(max_length=100)
	nation = models.ForeignKey(Nation)
	position = models.CharField(max_length=30)
	club = models.ForeignKey(Club)
	age = models.IntegerField()
	height = models.IntegerField()
	weight = models.IntegerField()
	man_of_match = models.IntegerField()
	### International stats are total, club stats are season 2012/2013 and 2013/2014
	appearances_international = models.IntegerField()
	appearances_club = models.IntegerField()
	goals_international = models.IntegerField()
	goals_club = models.IntegerField()
	assists_international = models.IntegerField()
	assists_club = models.IntegerField()
	red_cards_international = models.IntegerField()
	red_cards_club = models.IntegerField()
	yellow_cards_international = models.IntegerField()
	yellow_cards_club = models.IntegerField()
	shots_international = models.IntegerField()
	shots_club = models.IntegerField()
	shots_on_target_international = models.IntegerField()
	shots_on_target_club = models.IntegerField()
	shots_off_target_international = models.IntegerField()
	shots_off_target_club = models.IntegerField()
	pass_success_international = models.IntegerField()
	pass_success_club = models.IntegerField()
	tackles_international = models.IntegerField()
	tackles_club = models.IntegerField()
	headers_international = models.IntegerField()
	headers_club = models.IntegerField()
	intercepts_international = models.IntegerField()
	intercepts_club = models.IntegerField()
	fouls_international = models.IntegerField()
	fouls_club = models.IntegerField()
	clearances_international = models.IntegerField()
	clearances_target_club = models.IntegerField()
	offsides_international = models.IntegerField()
	offsides_club = models.IntegerField()
	dispossesions_international = models.IntegerField()
	dispossesions_club = models.IntegerField()
	average_rating_international = models.IntegerField()
	average_rating_club = models.IntegerField()
	def __unicode__(self):
		return self.name

class Coach(models.Model):
	name = models.CharField(max_length=100)
	nation = models.ForeignKey(Nation)
	def __unicode__(self):
		return self.name
