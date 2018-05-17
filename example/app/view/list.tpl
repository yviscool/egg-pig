<html>
  <head>
    <title>Hacker News</title>
    <link rel="stylesheet" href="/public/css/news.css" />
  </head>
  <body>
<form method="POST" action="/test/post?_csrf={{ ctx.csrf | safe }}" enctype="multipart/form-data">
  title: <input name="name" />
  file: <input name="age" />
  <button type="submit">upload</button>
</form>
  </body>
</html>