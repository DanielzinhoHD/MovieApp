# VideoApp
Searching video app with favorites function

In this app you can search for movies, see their average vote and go to their websites (if they exist), with some other tabs showing the trending, top rated and upcoming ones. When clicked on the star icon, it will be added to your favorites tab, stored in local storage.

There are some bugs:
-Star icon getting dark when hovering movie image
-After removing the movie from the favorites tab, the star icon on the movies below doesn't update, and I'll not bother fixing this because of bad code structure, it would be better starting from scratch again, and maybe using other features, like not only vanilla javascript
-If those deleted movies are clicked to add to favorites, the other movies on the favs tab will be removed
-Some problems with div creation/deletion when opening/closing fav tab
