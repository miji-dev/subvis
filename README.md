# subvis
Visualized Subtitle Analysis

## Conventions for Contributors
- Master branch ALWAYS contains a working version
- We use node.js
- The code is organized strictly modular
- We use issues to track not yet done work
- Each issue is handled in an own branch

## Libraries/Tools/Frameworks
- Server (Node.js npm)
  - Express.js
  - Opensubtitles-Client
  - Templating with Jade
- Client
  - D3.js
  - jQuery? Not sure if neccessary, maybe d3 is enough

## Things to do
1. List of available subtitles --> works
  - local --> yeah
  - id and/or imdbid, movie name --> yeah
  - selectable e.g. via autocomplete search input field --> yeah
  - List already created and filtered --> subtitles.txt (40000-ish movies) --> yeah
  - create server-side, show client-side --> yeah
2. Filter subtitle files for a specific movie --> works
  - Opus dump? --> nope
  - Use API? --> yeah
  - Limit available movies and store list locally? --> yeah
  - Always use the best rated sub file --> yeah
  - server-side --> yeah
3. Download the selected subtitle file --> works
  - Opus dump? --> nope
  - Use API --> yeah
  - server-side --> yeah
4. Preprocess file --> works
  - convert into object --> works
  - server-side --> works
5. NLP
  - Node.js. natural vs. stanford
  - sentiment analysis. sentiment vs. Sentimental
  - server-side
6. Module Templates
  - Meta Module
  - ... Module
7. Visualise
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
