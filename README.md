# Ivoes Page

Static multi-page website prepared for GitHub Pages.

## Pages Included

- Home (`index.html`)
- About (`about.html`)
- Donation (`donation.html`)
- Shop (`shop.html`)
- Homes (`homes.html`)
- Smog (`smog.html`)

## Edit From One File

Use `assets/js/content.js` as the single source for:

- Repository links and descriptions (Home page)
- Social links (footer icons on every page)
- Donation links (footer icons on every page)
- About page text and cards

### Repository links

Edit this array in `assets/js/content.js`:

- `links.repositories`

Each repository item supports:

- `name`: Repository title
- `description`: Short repository summary shown on Home page
- `url`: Repository link (leave blank to show a disabled placeholder)

### Social and Donation links

Edit these arrays in `assets/js/content.js`:

- `links.social`
- `links.donations`

Each item supports:

- `name`: Display label / accessibility label
- `url`: External link (leave blank to keep icon disabled)
- `site`: Domain used to load the website favicon icon

Add as many objects as you want to either array and they will render automatically.

### About page content

Edit `about` inside `assets/js/content.js`:

- `kicker`
- `title`
- `description`
- `highlights` (array)
- `cards` (array of objects with `title` and `text`)

## GitHub Pages Deployment

1. Push this project to a GitHub repository.
2. Open repository Settings.
3. Open Pages.
4. Set Source to "Deploy from a branch".
5. Select the `main` branch and `/ (root)` folder.
6. Save and wait for publish.
