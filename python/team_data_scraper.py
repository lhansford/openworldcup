# -◊- coding: utf-8 -◊-


from bs4 import BeautifulSoup
import requests
import csv




bari_urls = {"Iran":["http://www.bari91.com/soccer_clubs/Iran/2013", "http://www.bari91.com/soccer_clubs/Iran/2012"], "Brazil":["http://www.bari91.com/soccer_clubs/Brazil/2013", "http://www.bari91.com/soccer_clubs/Brazil/2012"], "Australia":["http://www.bari91.com/soccer_clubs/Australia/2013", "http://www.bari91.com/soccer_clubs/Australia/2012"], "Japan":["http://www.bari91.com/soccer_clubs/Japan/2013", "http://www.bari91.com/soccer_clubs/Japan/2012"], "South Korea":["http://www.bari91.com/soccer_clubs/South_Korea/2013", "http://www.bari91.com/soccer_clubs/South_Korea/2012"]}
wiki_urls = {"Iran":"http://en.wikipedia.org/wiki/Iran_national_football_team", "Brazil":"http://en.wikipedia.org/wiki/Brazil_national_football_team", "Australia":"http://en.wikipedia.org/wiki/Australia_national_football_team", "Japan":"http://en.wikipedia.org/wiki/Japan_national_football_team", "South Korea":"http://en.wikipedia.org/wiki/South_Korea_national_football_team"}
wiki_search_prefixes = ['Captain', 'Head coach', 'FIFA ranking', 'Confederation', 'Best result']
nations = ['Australia', 'Brazil', 'Iran', 'Japan', 'South Korea']

def get_html(url):
	print "Fetching " + url
	headers = { 'User-Agent' : 'Mozilla/5.0' }
	response = requests.get(url, headers=headers)
	return response.text

def get_data_item(html, search_prefix):

	title = html.find(text=search_prefix)
	print title
	if title != None:
		string = title.find_next(text=True)
		while string == "\n":
			string = string.find_next(text=True)
	print "Result: " + string
	return string

def get_bari_data(urls):

	all_results = {}

	for nation, url in urls.iteritems():
		html = get_html(url[0]) + get_html(url[1])
		soup = BeautifulSoup(html)
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

		all_results[nation] = ordered_results

	return all_results

def parse_bari_data(bari_data):
	all_goals_for = {}
	all_goals_against = {}
	all_clean_sheets = {}
	all_goalless_matches = {}
	all_wins = {}
	all_draws = {}
	all_losses = {}
	for nation in nations:
		matches = bari_data[nation]
		goals_for = 0
		goals_against = 0
		clean_sheets = 0
		goalless_matches = 0
		wins = 0
		draws = 0
		losses = 0
		for match in matches:
			score = match[1].split(":")
			home = int(score[0])
			away = int(score[1])
			goals_for += home
			goals_against += away
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
		all_goals_for[nation] = goals_for
		all_goals_against[nation] = goals_against
		all_clean_sheets[nation] = clean_sheets
		all_goalless_matches[nation] = goalless_matches
		all_wins[nation] = wins
		all_draws[nation] = draws
		all_losses[nation] = losses

	parsed_bari_data = [all_goals_for, all_goals_against, all_clean_sheets, all_goalless_matches, all_wins, all_draws, all_losses]
	return parsed_bari_data

def get_wiki_data(urls, search_prefixes):
	captains = {}
	coaches = {}
	fifa_rankings = {}
	confederations = {}
	best_world_cup_results = {}
	wiki_data = [captains, coaches, fifa_rankings, confederations, best_world_cup_results]

	for nation, url in urls.iteritems():
		html = get_html(url)
		soup = BeautifulSoup(html)
		captain = get_data_item(soup, search_prefixes[0])
		captains[nation] = captain
		coach = get_data_item(soup, search_prefixes[1])
		coaches[nation] = coach
		fifa_ranking = get_data_item(soup, search_prefixes[2])
		fifa_rankings[nation] = fifa_ranking
		confederation = get_data_item(soup, search_prefixes[3])
		confederations[nation] = confederation
		best_world_cup_result = get_data_item(soup, search_prefixes[4])
		best_world_cup_results[nation] = best_world_cup_result


	return wiki_data

def create_csv(wiki_data, parsed_bari_data, bari_data):
	new_csv = open('stats.csv', 'wb')
	wr = csv.writer(new_csv, quoting=csv.QUOTE_ALL)
	wr.writerow(['NAME', 'CAPTAINS', 'COACHES', 'FIFA_RANKINGS', 'GOALS_FOR', 'GOALS_AGAINST', 'CLEAN_SHEETS', 'GOALLESS_MATCHES', 'WINS', 'DRAWS', 'LOSSES', 'MATCH1', 'MATCH2', 'MATCH3', 'MATCH4', 'MATCH5', 'MATCH6', 'MATCH7', 'MATCH8', 'MATCH9', 'MATCH10',])
	for nation in nations:
		new_row = [nation]
		for dictionary in wiki_data:
			new_row.append(dictionary[nation])
		for dictionary in parsed_bari_data:
			new_row.append(dictionary[nation])
		for match in bari_data[nation]:
			new_row.append(match)
		wr.writerow(new_row)

wiki_data = get_wiki_data(wiki_urls, wiki_search_prefixes)
bari_data = get_bari_data(bari_urls)
parsed_bari_data = parse_bari_data(bari_data)
create_csv(wiki_data, parsed_bari_data, bari_data)

