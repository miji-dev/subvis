# subvis
Visualized Subtitle Analysis

## Conventions for Contributors
- Master branch ALWAYS contains a working version
- We use node.js and backbone (let's just try this one ...) to organise the code
- The code is organized strictly modular
- We use issues to track not yet done work
- Each issue is handled in an own branch

## Libraries/Tools/Frameworks
- Node.js
  - Express.js
  - Opensubtitles-Client ???
  - Backbone.js
  - D3.js
  - Templating (Jade?)
- Autocomplete? (e.g. http://leaverou.github.io/awesomplete/)
- jQuery? Not sure if neccessary and if integrated in Node.js

## Things to do
1. List of available subtitles
  - local
  - id and/or imdbid, movie name
  - selectable e.g. via autocomplete search input field
  - List already created and filtered --> subtitles.txt (142802 movies)
  - create server-side, show client-side
2. Filter subtitle files for a specific movie
  - Opus dump?
  - Use API?
  - Limit available movies and store list locally?
  - Always use the best rated sub file
  - server-side
3. Download the selected subtitle file
  - Opus dump?
  - Use API
  - server-side
4. Preprocess file
  - convert into object
  - server-side
5. NLP
  - Node.js natural
  - server-side
6. Visualise
  - Node.js D3
  - client-side

## Thoughts
- View: List of all available movies (?)
  - Filter that view (genres, ...) (?)
- View: Analyse one single movie
- View: Analyse and compare two (or more?) movies
- Module: Search mask with autocomplete for one single movie
- GET-Routing via id/movie name/imdb --> queryString vs. path
  - subvis/ --> home. list of all movies or simple landing page
  - subvis/1583 --> path routing via id or imdb
  - subvis/Pulp+Fiction --> path routing via movie name
  - subivs/single?id=1583 --> queryString routing via id
  - subvis/single?imdb=1234 --> queryString routing via imdb
  - subvis/single?name=Pulp+Fiction --> queryString routing via movie name
  - subvis/multi?id1=1583&id2=1234 --> queryString routing using two movies
- Or no advanced routing and just use a plain search field based UI

## Open Questions
- Do we need to persist data? I don't think so
