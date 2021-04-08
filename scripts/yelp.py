import requests
import json

api_key = 'mhGxo05nvSxM9Do-hE8_HUvSyczvUUwKz8zZyjgNOBaUwxIE2PQK9qvGX58YdNHh6paDNbZnNxJXEqnv0OfEQQC-Qd3BawgWk9R7jWTNS8tHhguxSJhcYDhHmI5iYHYx'
headers = {'Authorization': 'Bearer %s' % api_key}

url = 'https://api.yelp.com/v3/businesses/search'

params = {
    'categories': 'food,restaurants',
    'location': 'Tucson'
}

request = requests.get(
    url,
    params=params,
    headers=headers
)

request.raise_for_status()

data = json.loads(request.text)

with open('yelp_restaurants.json', 'w') as outfile:
    json.dump(data, outfile)