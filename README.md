# What's Left?

A web application that helps you find recipes based on ingredients you have. Built with Next.js, TypeScript, and TailwindCSS.

## Features 🌟

- Search recipes by available ingredients
- Filter recipes by category (Beef, Chicken, Dessert, etc.)
- Sort by completion percentage or alphabetically
- Favorite recipes are saved locally
- Dark mode UI
- Responsive design
- Print-friendly recipe view

## Getting Started 🚀

### Prerequisites
- Node.js 18 or later
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/folence/Whats-Left.git
cd whats-left
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The static site will be generated in the `out` directory.

## Tech Stack 💻

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [TheMealDB API](https://www.themealdb.com/api.php) - Recipe data

## Project Structure 📁

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── IngredientInput.tsx  # Ingredient search and input
│   ├── RecipeList.tsx      # Recipe display and filtering
│   └── RecipeModal.tsx     # Detailed recipe view
├── data/
│   └── commonIngredients.ts # Predefined ingredient lists
├── services/
│   └── mealDbService.ts    # API integration with TheMealDB
└── utils/                 # Utility functions
```

## Deployment 🚀

This project is configured for GitHub Pages deployment. The static site is automatically built and deployed when pushing to the main branch.

To deploy manually:

1. Push your changes to GitHub
```bash
git add .
git commit -m "Your commit message"
git push
```

2. GitHub Actions will automatically:
   - Build the project
   - Deploy to GitHub Pages
   - Make it available at: https://folence.github.io/Whats-Left

## Contributing 🤝

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License 📝

[MIT](https://choosealicense.com/licenses/mit/)
