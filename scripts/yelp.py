import requests
import json

api_key = 'mhGxo05nvSxM9Do-hE8_HUvSyczvUUwKz8zZyjgNOBaUwxIE2PQK9qvGX58YdNHh6paDNbZnNxJXEqnv0OfEQQC-Qd3BawgWk9R7jWTNS8tHhguxSJhcYDhHmI5iYHYx'
headers = {'Authorization': 'Bearer %s' % api_key}

url = 'https://api.yelp.com/v3/businesses/search'

for i in range(0, 20):
    offset = i * 50

    params = {
        'categories': 'food,restaurants',
        'location': 'Tucson',
        'limit': 50,
        'offset': offset,
    }

    request = requests.get(
        url,
        params=params,
        headers=headers
    )

    request.raise_for_status()

    data = json.loads(request.text)

    with open('../data/yelp_' + str(offset) + '.json', 'w') as outfile:
        json.dump(data['businesses'], outfile)