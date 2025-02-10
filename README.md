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
