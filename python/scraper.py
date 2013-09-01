# -◊- coding: utf-8 -◊-
from bs4 import BeautifulSoup
import requests


"""
data structure
{'NAME':'',
'FIFA_RANKING':'',
'FIFA_RANKING_POINTS':'',
'ELO_RANKING':'',
'ELO_RANKING_POINTS':'',
'CONTINENT':'',
'CAPTAIN':'',
'COACH':'',
'BEST_RESULT':'',
'WINS':'',
'LOSSES':'',
'DRAWS':'',
'GOALS_FOR':'',
'GOALS_AGAINST':'',
'CLEAN_SHEETS':'',
'GOALLESS_GAMES':'',
'GAME1_FOR':'',
'GAME1_AGAINST':'',
'GAME1_OPPONENT':'',
'GAME2_FOR':'',
'GAME2_AGAINST':'',
'GAME2_OPPONENT':'',
'GAME3_FOR':'',
'GAME3_AGAINST':'',
'GAME3_OPPONENT':'',
'GAME4_FOR':'',
'GAME4_AGAINST':'',
'GAME4_OPPONENT':'',
'GAME5_FOR':'',
'GAME5_AGAINST':'',
'GAME5_OPPONENT':'',
'GAME6_FOR':'',
'GAME6_AGAINST':'',
'GAME6_OPPONENT':'',
'GAME7_FOR':'',
'GAME7_AGAINST':'',
'GAME7_OPPONENT':'',
'GAME8_FOR':'',
'GAME8_AGAINST':'',
'GAME8_OPPONENT':'',
'GAME9_FOR':'',
'GAME9_AGAINST':'',
'GAME9_OPPONENT':'',
'GAME10_FOR':'',
'GAME10_AGAINST':'',
'GAME10_OPPONENT':'',
}

{'NAME':'',
'NATION':'',
'BIRTH_CITY':'',
'BIRTH_COUNTRY':'',
'CLUB':'',
'DATE_OF_BIRTH':'',
'AGE':'',
'HEIGHT':'',
'WEIGHT':'',
'WIKIPEDIA_PAGE':'',
'POSITION':'',
'NUMBER':'',
'INT_CAPS':'',
'CLUB_CAPS':'',
'INT_GOALS':'',
'CLUB_GOALS':'',
'INT_ASSISTS':'',
'CLUB_ASSISTS':'',
'INT_YELLOW_CARDS':'',
'CLUB_YELLOW_CARDS':'',
'INT_RED_CARDS':'',
'CLUB_RED_CARDS':'',
'CLUB_SHOTS':'',
'CLUB_SHOTS_ON_GOAL':'',
'CLUB_FOULS_COMMITTED':'',
'CLUB_FOULS_SUFFERED':''
}

"""

wiki_urls = {"Iran":"http://en.wikipedia.org/wiki/Iran_national_football_team", "Brazil":"http://en.wikipedia.org/wiki/Brazil_national_football_team", "Australia":"http://en.wikipedia.org/wiki/Australia_national_football_team", "Japan":"http://en.wikipedia.org/wiki/Japan_national_football_team", "Korea":"http://en.wikipedia.org/wiki/South_Korea_national_football_team"}
bari_urls = {"Iran":["http://www.bari91.com/soccer_clubs/Iran/2013", "http://www.bari91.com/soccer_clubs/Iran/2012"], "Brazil":["http://www.bari91.com/soccer_clubs/Brazil/2013", "http://www.bari91.com/soccer_clubs/Brazil/2012"], "Australia":["http://www.bari91.com/soccer_clubs/Australia/2013", "http://www.bari91.com/soccer_clubs/Australia/2012"], "Japan":["http://www.bari91.com/soccer_clubs/Japan/2013", "http://www.bari91.com/soccer_clubs/Japan/2012"], "Korea":["http://www.bari91.com/soccer_clubs/South_Korea/2013", "http://www.bari91.com/soccer_clubs/South_Korea/2012"]}
espn_urls = {'Brazil':'http://espnfc.com/team/squad/_/id/205/', 'Iran':'http://espnfc.com/team/squad/_/id/469/season/2013/league/fifa.worldq.afc/iran', 'Korea':'http://espnfc.com/team/squad/_/id/451/south-korea', 'Japan':'http://espnfc.com/team/squad/_/id/627/japan', 'Australia':'http://espnfc.com/team/squad/_/id/628/australia'}
nations = ['Brazil', 'Iran', 'Australia', 'Korea', 'Japan']

all_team_data = []
all_player_data = []

def get_html(url):
	"""Fetch the html of the webpage."""
	print "Fetching " + url
	headers = { 'User-Agent' : 'Mozilla/5.0' }
	response = requests.get(url, headers=headers)
	return response.text

def get_data_item(html, search_prefix):
	""" Used in conjunction with BeautifulSoup to fetch the text between tags,
	doesn't work if the text is split somehow
	"""

	title = html.find(text=search_prefix)
	if title != None:
		string = title.find_next(text=True)
		while string == "\n":
			string = string.find_next(text=True)
	else:
		string = 'Unknown'
	return string

def get_name(html):
	""" Get team name from wikipedia html """
	name = html.find(class_='fn org')
	text = name.text.strip(u'\xa0') ##Remove weird spacing
	return text

def get_best_results(html):
	""" Get best results from wikipedia html """
	title = html.find(text='Best result')
	text = title.find_next()
	text = text.find_all(text=True)
	text[1] = text[1].strip(": ")
	text[0] = text[0].strip(" ,") + ": "
	results = ""
	for i in text:
		if i != '\n':
			results += i
		else:
			results += ' '
	return results

def get_wiki_data(url, team_dict):
	""" Get all data from wiki page """
	html = get_html(url)
	soup = BeautifulSoup(html)
	team_dict["NAME"] = get_name(soup)
	team_dict["CONTINENT"] = get_data_item(soup, 'Confederation')
	team_dict["CAPTAIN"] = get_data_item(soup, 'Captain')
	team_dict["COACH"] = get_data_item(soup, 'Head coach')
	team_dict["BEST_RESULT"] = get_best_results(soup)
	get_wiki_player_data(soup, team_dict["NAME"])
	return team_dict

def get_wiki_player_data(soup, nation):
	""" Retrieves the player data from the team's wikipedia page."""
	squad = soup.find(id='Current_squad')
	table = squad.find_next("table")
	table = table.find_next("table")
	row = table.find_next("tr")
	x = 0
	while x < 50:
		player = {"NATION":nation}
		row = row.find_next("tr")
		col = row.find_next("td")
		col = col.find_next("td")
		try:
			position = col(text=True)[1] ### Once it gets to the end of the list it will not return a list so this will break.
		except:
			break
		col = col.find_next("td")
		player["NAME"] = unicode(col(text=True)[0])
		link = col.find_next("a")
		player["WIKIPEDIA_PAGE"] = "https://en.wikipedia.org" + link['href']
		col = col.find_next("td")
		player["DATE_OF_BIRTH"] = col(text=True)[1]
		player["AGE"] = col(text=True)[4][-3:-1]
		col = col.find_next("td")
		player["INT_CAPS"] = col(text=True)[0]
		col = col.find_next("td")
		player["INT_GOALS"] = col(text=True)[0]
		col = col.find_next("td")
		player["CLUB"] = unicode(col(text=True)[1])
		x += 1 
		if player not in all_player_data:
			all_player_data.append(player)


def get_last_ten_results(url):
	""" Get ten most recent game results from bari91, arranged from most recent. """
	html = get_html(url[0]) + get_html(url[1])
	soup = BeautifulSoup(html)
	results = []
	ordered_results = []

	result = soup.find_all(class_='win')
	if result != None:
		for i in result:
			opponent = i.find_previous('a')
			date = opponent.find_previous(text=True)
			results.append([opponent.string, i.string, date.string])

	result = soup.find_all(class_='lose')
	if result != None:
		for i in result:
			opponent = i.find_previous('a')
			date = opponent.find_previous(text=True)
			results.append([opponent.string, i.string, date.string])

	result = soup.find_all(class_='draw')
	if result != None:
		for i in result:
			opponent = i.find_previous('a')
			date = opponent.find_previous(text=True)
			results.append([opponent.string, i.string, date.string])

	while len(ordered_results) < 10:
		date = [0,0,0]
		most_recent = None
		for item in results:
			match_date = item[2].split(".")
			if int(match_date[2]) > int(date[2]):
				date = match_date
				most_recent = item
			elif int(match_date[2]) == int(date[2]):
				if int(match_date[1]) > int(date[1]):
					date = match_date
					most_recent = item
				elif int(match_date[1]) == int(date[1]):
					if int(match_date[0]) > int(date[0]):
						date = match_date
						most_recent = item
		ordered_results.append(most_recent)
		results.remove(most_recent)

	return ordered_results

def parse_bari_data(results, team_dict):

	goals_for = 0
	goals_against = 0
	clean_sheets = 0
	goalless_matches = 0
	wins = 0
	draws = 0
	losses = 0
	for i, result in enumerate(results):
		score = result[1].split(":")
		home = int(score[0])
		away = int(score[1])
		goals_for += home
		goals_against += away
		game = 'GAME' + str(i+1)
		team_dict[game + "_FOR"] = home
		team_dict[game + "_AGAINST"] = away
		team_dict[game + "_OPPONENT"] = result[0]
		if away == 0:
			clean_sheets += 1
		if home == 0:
			goalless_matches += 1
		if home > away:
			wins += 1
		elif home == away:
			draws += 1
		else:
			losses += 1
	team_dict["GOALS_FOR"] = goals_for
	team_dict["GOALS_AGAINST"] = goals_against
	team_dict["CLEAN_SHEETS"] = clean_sheets
	team_dict["GOALLESS_GAMES"] = goalless_matches
	team_dict["WINS"] = wins
	team_dict["DRAWS"] = draws
	team_dict["LOSSES"] = losses
	return team_dict

def get_bari_data(url,team_dict):
	results = get_last_ten_results(url)
	team_dict = parse_bari_data(results, team_dict)
	return team_dict

def get_fifa_data():
	html = get_html('http://www.fifa.com/worldranking/rankingtable/index.html')
	start = html.find('var pt_team_info_jsonObj')
	end = html.find(';', start)
	return html[start:end]

def parse_fifa_data(data, nation):
	start = data.find(nation)
	rank_start = data.find('rank', start) + 6
	rank_end = data.find("'", rank_start)
	rank = data[rank_start:rank_end]
	points_start = data.find('thisPoints', rank_end) + 12
	points_end = data.find("'", points_start)
	points = data[points_start:points_end]
	return rank, points

def get_elo_data():
	html = get_html('http://www.eloratings.net/world.html')
	start = html.find('Ratings and Statistics')
	return html[start:]

def parse_elo_data(data, nation):
	## Hack for different Korea names
	if nation == "Korea":
		nation = 'South Korea'

	soup = BeautifulSoup(data)
	title = soup.find(text=nation)
	if title != None:
		points = title.find_next(text=True)
		rank = title.find_previous(text=True)

	return rank, points

def get_team_data():
	fifa_data = get_fifa_data()
	elo_data = get_elo_data()
	for nation in nations:
		team_dict = {}
		team_dict = get_wiki_data(wiki_urls[nation], team_dict)
		team_dict = get_bari_data(bari_urls[nation], team_dict)
		fifa_ranks = parse_fifa_data(fifa_data, nation)
		elo_ranks = parse_elo_data(elo_data, nation)
		team_dict["FIFA_RANKING"] = fifa_ranks[0]
		team_dict["FIFA_RANKING_POINTS"] = fifa_ranks[1]
		team_dict["ELO_RANKING"] = elo_ranks[0]
		team_dict["ELO_RANKING_POINTS"] = elo_ranks[1]
		all_team_data.append(team_dict)


def get_club_caps_goals(html):
	caps = 0
	goals = 0
	assists = -1

	table_start = html.find('id="Career_')
	if table_start == -1:
		table_start = html.find('id="Statistics"')
	if table_start == -1:
		table_start = html.find('id="Club_statistics')
	if table_start == -1:
		table_start = html.find('id="Club_')
	if table_start == -1:
		table_start = html.find('id="A-League_career_statistics"')
	if table_start == -1:
		print 'No club statistics'
		return(-1, -1, -1)
	table_start = html.find('<table', table_start)
	table_end = html.find('</table>', table_start)
	table = html[table_start:table_end]

	if table.find('Assists') != -1:
		assists = 0

	year_start = 0
	year_end = 0
	while year_start != -1:
		year_start = table.find('>2012', year_end)
		if year_start == -1:
			break
		year_end = table.find('</tr>', year_start)
		stats = table[year_start:year_end]
		stats = stats.split('<td')
		if assists >= 0:
			new_caps = ''.join(c for c in stats[-3] if c.isdigit())
			if new_caps != '':
				caps += int(new_caps)
			new_goals = ''.join(c for c in stats[-2] if c.isdigit())
			if new_goals != '':
				goals += int(new_goals)
			new_assists = ''.join(c for c in stats[-1] if c.isdigit())
			if new_assists != '':
				assists += int(new_assists)
		else:
			new_caps = ''.join(c for c in stats[-2] if c.isdigit())
			if new_caps != '':
				caps += int(new_caps)
			new_goals = ''.join(c for c in stats[-1] if c.isdigit())
			if new_goals != '':
				goals += int(new_goals)

	year_start = 0
	year_end = 0
	while year_start != -1:
		year_start = table.find('>2013', year_end)
		if year_start == -1:
			break
		year_end = table.find('</tr>', year_start)
		stats = table[year_start:year_end]
		stats = stats.split('<td')
		if assists >= 0:
			new_caps = ''.join(c for c in stats[-3] if c.isdigit())
			if new_caps != '':
				caps += int(new_caps)
			new_goals = ''.join(c for c in stats[-2] if c.isdigit())
			if new_goals != '':
				goals += int(new_goals)
			new_assists = ''.join(c for c in stats[-1] if c.isdigit())
			if new_assists != '':
				assists += int(new_assists)
		else:
			new_caps = ''.join(c for c in stats[-2] if c.isdigit())
			if new_caps != '':
				caps += int(new_caps)
			new_goals = ''.join(c for c in stats[-1] if c.isdigit())
			if new_goals != '':
				goals += int(new_goals)

	return (caps,goals,assists)

def get_player_data():
	for player in all_player_data:
		html = get_html(player["WIKIPEDIA_PAGE"])
		soup = BeautifulSoup(html)
		player["HEIGHT"] = get_data_item(soup, 'Height')
		player["POSITION"] = get_data_item(soup, 'Playing position')
		place_of_birth = get_data_item(soup, 'Place of birth')
		player["BIRTH_CITY"] = place_of_birth
		player["BIRTH_COUNTRY"] = get_data_item(soup, place_of_birth)
		html = html.encode('utf-8')
		player["CLUB_CAPS"], player["CLUB_GOALS"], player['CLUB_ASSISTS'] = get_club_caps_goals(html)
		
def get_player_links(html):

	all_urls = {}
	url_start = 0
	url_end = 0
	while url_start >= 0:
		url_start = html.find('http://espnfc.com/player/_/id/', url_end)
		if url_start == -1:
			break
		url_end = html.find('"', url_start)
		name_start = url_end + 3
		name_end = html.find("<", name_start)
		url = html[url_start:url_end]
		name = html[name_start:name_end]
		all_urls[name] = url 
	return all_urls

def parse_espn_data(url, nation):
	
	caps = 0
	goals = 0
	assists = 0
	shots = 0
	shots_on_goal = 0
	fouls_committed = 0
	fouls_suffered = 0
	yellow_cards = 0
	red_cards = 0

	html = get_html(url)

	name_start = html.find('"profile"><h1>') + 14
	if name_start != 13: ##i.e. -1 plus the 14 added
		name_end = html.find('<', name_start)
		name = html[name_start:name_end]
	else:
		name = 'Unknown'

	position_start = html.find('Position: ') + 10
	if position_start != 9: ##i.e. -1 plus the 10 added
		position_end = html.find('<', position_start)
		position = html[position_start:position_end]
	else:
		position = 'Unknown'

	weight_start = html.find('Weight: ') + 8
	if weight_start != 7: ##i.e. -1 plus the 8 added
		weight_end = html.find('<', weight_start)
		weight = html[weight_start:weight_end]
	else:
		weight = 'Unknown'

	player_id_start = url.find('/id/') + 4
	player_id_end = url.find('/', player_id_start)
	player_id = url[player_id_start:player_id_end]

	html = get_html('http://espnfc.com/players/format/design09/playerStats?playerId=' + player_id)
	this_season_start = html.find('2013/14 Statistics')
	if this_season_start == -1:
		print 'No statistics for 2013/14'
	else:
		this_season_stats_start = html.find('<tr', this_season_start)
		while this_season_stats_start != -1:

			this_season_stats_start = html.find('<tr', this_season_stats_start + 1)
			this_season_stats_end = html.find('</tr>',this_season_stats_start)
			season_totals = html[this_season_stats_start:this_season_stats_end].split('</td>')
			if len(season_totals) < 13:
				break
			season_totals.pop(-1)
			tag = season_totals[0].rfind('>') + 1
			if  season_totals[0][tag:] == nation:
				break
			season_totals.pop(0)
			season_totals.pop(0)
			caps += int(''.join(c for c in (season_totals[0]) if c.isdigit())) + int(''.join(c for c in (season_totals[1]) if c.isdigit()))
			goals += int(''.join(c for c in season_totals[2] if c.isdigit()))
			assists += int(''.join(c for c in season_totals[3] if c.isdigit()))
			shots += int(''.join(c for c in season_totals[4] if c.isdigit()))
			shots_on_goal += int(''.join(c for c in season_totals[5] if c.isdigit()))
			fouls_committed += int(''.join(c for c in season_totals[6] if c.isdigit()))
			fouls_suffered += int(''.join(c for c in season_totals[7] if c.isdigit()))
			yellow_cards += int(''.join(c for c in season_totals[8] if c.isdigit()))
			red_cards += int(''.join(c for c in season_totals[9] if c.isdigit()))

	last_season_start = html.find('2012/13 Statistics')
	if last_season_start == -1:
		print 'No statistics for 2012/13'
	else:
		last_season_stats_start = html.find('<tr', last_season_start)
		while last_season_stats_start != -1:

			last_season_stats_start = html.find('<tr', last_season_stats_start + 1)
			last_season_stats_end = html.find('</tr>',last_season_stats_start)
			season_totals = html[last_season_stats_start:last_season_stats_end].split('</td>')
			if len(season_totals) < 13:
				break
			season_totals.pop(-1)
			tag = season_totals[0].rfind('>') + 1
			if  season_totals[0][tag:] == nation:
				break
			season_totals.pop(0)
			season_totals.pop(0)
			caps += int(''.join(c for c in (season_totals[0]) if c.isdigit())) + int(''.join(c for c in (season_totals[1]) if c.isdigit()))
			goals += int(''.join(c for c in season_totals[2] if c.isdigit()))
			assists += int(''.join(c for c in season_totals[3] if c.isdigit()))
			shots += int(''.join(c for c in season_totals[4] if c.isdigit()))
			shots_on_goal += int(''.join(c for c in season_totals[5] if c.isdigit()))
			fouls_committed += int(''.join(c for c in season_totals[6] if c.isdigit()))
			fouls_suffered += int(''.join(c for c in season_totals[7] if c.isdigit()))
			yellow_cards += int(''.join(c for c in season_totals[8] if c.isdigit()))
			red_cards += int(''.join(c for c in season_totals[9] if c.isdigit()))

	for player in all_player_data:
		if player['NAME'] == name:
			player['POSITION'] = position
			player['WEIGHT'] = weight
			player['CLUB_CAPS'] = caps
			player['CLUB_GOALS'] = goals
			player['CLUB_ASSISTS'] = assists
			player['CLUB_SHOTS'] = shots
			player['CLUB_SHOTS_ON_GOAL'] = shots_on_goal
			player['CLUB_YELLOW_CARDS'] = yellow_cards
			player['CLUB_RED_CARDS'] = red_cards
			player['CLUB_FOULS_COMMITTED'] = fouls_committed
			player['CLUB_FOULS_SUFFERED'] = fouls_suffered




def get_espn_player_data():
	players = []
	for nation in espn_urls:
		html = get_html(espn_urls[nation])
		urls = get_player_links(html)
		for player in urls:
			parse_espn_data(urls[player], nation)




get_team_data()
get_player_data()
get_espn_player_data()
print all_player_data
print all_team_data
