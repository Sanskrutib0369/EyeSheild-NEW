// All possible questions pool
const questions = [
    {
        text: "How often do you eat dark, leafy greens?",
        options: ["Daily", "3-4 times a week", "1-2 times a week", "Rarely"],
        weight: { "Daily": 4, "3-4 times a week": 3, "1-2 times a week": 2, "Rarely": 1 }
    },
    {
        text: "Do you include foods rich in Omega-3 (like fish) in your diet?",
        options: ["Regularly", "Sometimes", "Rarely", "Never"],
        weight: { "Regularly": 4, "Sometimes": 3, "Rarely": 2, "Never": 1 }
    },
    {
        text: "How many hours do you spend looking at digital screens daily?",
        options: ["Less than 2 hours", "2-4 hours", "4-8 hours", "More than 8 hours"],
        weight: { "Less than 2 hours": 4, "2-4 hours": 3, "4-8 hours": 2, "More than 8 hours": 1 }
    },
    {
        text: "How often do you have your eyes checked?",
        options: ["Every 6 months", "Yearly", "Every 2 years", "Rarely"],
        weight: { "Every 6 months": 4, "Yearly": 3, "Every 2 years": 2, "Rarely": 1 }
    },
    {
        text: "Do you wear protective eyewear when using digital devices?",
        options: ["Always", "Sometimes", "Rarely", "Never"],
        weight: { "Always": 4, "Sometimes": 3, "Rarely": 2, "Never": 1 }
    },
    {
        question: "Do you experience frequent eye strain or fatigue?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        weight: {
            "Never": 1,
            "Rarely": 2,
            "Sometimes": 3,
            "Often": 4
        }
    },
    {
        question: "How often do you eat fish rich in omega-3?",
        options: ["2-3 times per week", "Once a week", "1-2 times a month", "Rarely/Never"],
        weight: {
            "2-3 times per week": 1,
            "Once a week": 2,
            "1-2 times a month": 3,
            "Rarely/Never": 4
        }
    },
    {
        question: "Do you wear appropriate eye protection in bright sunlight?",
        options: ["Always", "Usually", "Sometimes", "Rarely/Never"],
        weight: {
            "Always": 1,
            "Usually": 2,
            "Sometimes": 3,
            "Rarely/Never": 4
        }
    },
    {
        question: "How often do you take breaks during screen time?",
        options: ["Every 20-30 minutes", "Every hour", "Every few hours", "Rarely/Never"],
        weight: {
            "Every 20-30 minutes": 1,
            "Every hour": 2,
            "Every few hours": 3,
            "Rarely/Never": 4
        }
    },
    {
        question: "Do you experience dry or irritated eyes?",
        options: ["Never", "Occasionally", "Often", "Very frequently"],
        weight: {
            "Never": 1,
            "Occasionally": 2,
            "Often": 3,
            "Very frequently": 4
        }
    }
];

let currentQuestion = 0;
let answers = [];

function startQuestionnaire() {
    currentQuestion = 0;
    answers = [];
    showQuestion();
    document.getElementById('questionnaire').style.display = 'block';
}

function showQuestion() {
    const container = document.getElementById('questionnaire');
    if (currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        container.innerHTML = `
            <div class="question-card">
                <h3>Question ${currentQuestion + 1}/${questions.length}</h3>
                <p class="question-text">${question.text || question.question}</p>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <button onclick="selectAnswer('${option}')" class="option-btn">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        showResults();
    }
}

function selectAnswer(answer) {
    answers[currentQuestion] = answer;
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const container = document.getElementById('questionnaire');
    let totalScore = 0;
    
    answers.forEach((answer, index) => {
        totalScore += questions[index].weight[answer];
    });
    
    const maxScore = questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    const healthScore = Math.round(percentage);
    
    let healthStatus;
    let scoreColor = "#818cf8";
    let recommendations = [];
    
    if (healthScore >= 80) {
        healthStatus = "Excellent Eye Health";
        recommendations = [
            "Keep maintaining your excellent eye care routine",
            "Continue with your balanced, nutrient-rich diet",
            "Schedule regular eye check-ups to maintain eye health",
            "Share your eye health habits with friends and family"
        ];
    } else if (healthScore >= 60) {
        healthStatus = "Good Eye Health";
        recommendations = [
            "Consider increasing your intake of eye-healthy foods",
            "Take regular screen breaks using the 20-20-20 rule",
            "Ensure proper lighting in your workspace",
            "Schedule an eye check-up if you haven't recently"
        ];
    } else if (healthScore >= 40) {
        healthStatus = "Moderate Eye Health";
        recommendations = [
            "Increase consumption of foods rich in Vitamins A, C, and E",
            "Implement regular screen breaks and eye exercises",
            "Consider using blue light filters for digital devices",
            "Schedule a comprehensive eye examination soon"
        ];
    } else {
        healthStatus = "Needs Attention";
        recommendations = [
            "Schedule an immediate eye health check-up",
            "Significantly increase intake of eye-healthy nutrients",
            "Implement strict screen time management",
            "Consider workplace ergonomics and lighting adjustments"
        ];
    }
    
    container.innerHTML = `
        <div class="results-card">
            <h3>Your Eye Health Assessment</h3>
            <div class="score-container">
                <div class="score-circle">
                    <span class="score" style="color: ${scoreColor}">0</span>
                    <span class="percentage">%</span>
                </div>
            </div>
            <div class="health-status">${healthStatus}</div>
            <div class="recommendations">
                <h4>Personalized Recommendations</h4>
                <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            <button onclick="startQuestionnaire()" class="restart-btn">
                <i class="fas fa-redo"></i> Take Assessment Again
            </button>
        </div>
    `;
    
    // Animate score appearance
    const scoreElement = document.querySelector('.score');
    const percentageElement = document.querySelector('.percentage');
    if (scoreElement && percentageElement) {
        scoreElement.style.opacity = '0';
        percentageElement.style.opacity = '0';
        let displayScore = 0;
        
        setTimeout(() => {
            scoreElement.style.opacity = '1';
            percentageElement.style.opacity = '1';
            const interval = setInterval(() => {
                if (displayScore < healthScore) {
                    displayScore++;
                    scoreElement.textContent = displayScore;
                } else {
                    clearInterval(interval);
                }
            }, 20);
        }, 500);
    }
}

// Recipe data
const recipes = {
    'vision-boost-smoothie': {
        title: 'Vision Boost Smoothie',
        category: 'breakfast',
        time: '5 mins',
        description: 'A nutrient-rich smoothie packed with eye-healthy ingredients.',
        ingredients: [
            '1 cup fresh spinach',
            '1 medium carrot',
            '1/2 cup blueberries',
            '1 tablespoon chia seeds',
            '1 cup almond milk',
            '1/2 banana',
            '1 tablespoon honey (optional)',
            'Ice cubes'
        ],
        instructions: [
            'Wash spinach and carrot thoroughly',
            'Cut carrot into small pieces',
            'Add all ingredients to a blender',
            'Blend until smooth and creamy',
            'Add more almond milk if needed for desired consistency',
            'Serve immediately for maximum nutrient benefits'
        ],
        benefits: 'Rich in Vitamin A, lutein, and antioxidants',
        nutrition: ['High in Vitamin A', 'Antioxidants']
    },
    'rainbow-buddha-bowl': {
        title: 'Rainbow Buddha Bowl',
        category: 'lunch',
        time: '15 mins',
        description: 'Colorful bowl with antioxidant-rich vegetables.',
        ingredients: [
            '2 cups kale, chopped',
            '1 sweet potato, cubed',
            '1 cup quinoa, cooked',
            '1 cup chickpeas',
            '1 red bell pepper, sliced',
            '1 avocado, sliced',
            '2 tbsp pumpkin seeds',
            'Olive oil dressing'
        ],
        instructions: [
            'Cook quinoa according to package instructions',
            'Roast sweet potato cubes with olive oil at 400°F for 20 minutes',
            'Massage kale with olive oil and lemon juice',
            'Arrange all ingredients in bowls',
            'Top with pumpkin seeds',
            'Drizzle with olive oil dressing'
        ],
        benefits: 'High in Vitamins A, C, E, and healthy fats',
        nutrition: ['Beta Carotene', 'Zinc']
    },
    'vision-salad': {
        title: 'Vision-Protecting Salad',
        category: 'lunch',
        time: '10 mins',
        description: 'Fresh salad with leafy greens and omega-3 rich ingredients.',
        ingredients: [
            '3 cups mixed greens',
            '1 can wild salmon',
            '1 cup cherry tomatoes',
            '1/2 cup walnuts',
            '1/4 cup dried cranberries',
            '1/2 red onion, sliced',
            'Lemon-olive oil dressing',
            'Salt and pepper to taste'
        ],
        instructions: [
            'Wash and dry mixed greens',
            'Halve cherry tomatoes',
            'Flake salmon into bite-sized pieces',
            'Combine all ingredients in a large bowl',
            'Toss with lemon-olive oil dressing',
            'Season with salt and pepper'
        ],
        benefits: 'Rich in Omega-3, Vitamin A, and antioxidants',
        nutrition: ['Omega-3', 'Vitamin C']
    },
    'berry-yogurt-parfait': {
        title: 'Berry Yogurt Parfait',
        category: 'snacks',
        time: '8 mins',
        description: 'Antioxidant-rich berries layered with protein-packed yogurt.',
        ingredients: [
            '1 cup Greek yogurt',
            '1 cup mixed berries',
            '1/4 cup almonds, sliced',
            '2 tablespoons honey',
            '1 tablespoon chia seeds',
            'Fresh mint for garnish'
        ],
        instructions: [
            'Layer Greek yogurt in a glass',
            'Add a layer of mixed berries',
            'Sprinkle with sliced almonds',
            'Drizzle with honey',
            'Repeat layers',
            'Top with chia seeds and mint'
        ],
        benefits: 'High in antioxidants and calcium for eye health',
        nutrition: ['Antioxidants', 'Calcium']
    },
    'avocado-toast': {
        title: 'Eye-Health Avocado Toast',
        category: 'breakfast',
        time: '10 mins',
        description: 'Nutrient-rich breakfast with healthy fats and proteins.',
        ingredients: [
            '2 slices whole grain bread',
            '1 ripe avocado',
            '2 eggs',
            'Microgreens',
            'Cherry tomatoes',
            'Salt and pepper',
            'Red pepper flakes'
        ],
        instructions: [
            'Toast bread until golden brown',
            'Mash avocado and spread on toast',
            'Cook eggs sunny side up',
            'Place eggs on avocado toast',
            'Top with microgreens and tomatoes',
            'Season with salt, pepper, and red pepper flakes'
        ],
        benefits: 'Rich in lutein and healthy fats for eye protection',
        nutrition: ['Lutein', 'Vitamin E']
    },
    'trail-mix': {
        title: 'Vision Support Trail Mix',
        category: 'snacks',
        time: '5 mins',
        description: 'Nutrient-dense mix of nuts and dried fruits.',
        ingredients: [
            '1/2 cup walnuts',
            '1/2 cup almonds',
            '1/4 cup goji berries',
            '1/4 cup pumpkin seeds',
            '1/4 cup dark chocolate chips',
            '2 tablespoons dried blueberries'
        ],
        instructions: [
            'Combine all ingredients in a bowl',
            'Mix well',
            'Store in an airtight container',
            'Portion into 1/4 cup servings'
        ],
        benefits: 'Packed with vitamin E and zinc for eye health',
        nutrition: ['Vitamin E', 'Zinc']
    }
};

// Recipe filtering functionality
function initializeRecipeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterRecipes(filter);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function filterRecipes(category) {
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Initialize recipe functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeRecipeFilters();
});

function showRecipeDetails(recipeId) {
    const recipe = recipes[recipeId];
    if (!recipe) return;

    const modal = document.getElementById('recipe-modal');
    const content = modal.querySelector('.recipe-modal-content');
    
    content.innerHTML = `
        <span class="close-btn" onclick="closeRecipeModal()">&times;</span>
        <div class="recipe-modal-header">
            <h2>${recipe.title}</h2>
            <div class="recipe-info">
                <span><i class="fas fa-clock"></i> Prep Time: ${recipe.time}</span>
                <span><i class="fas fa-tag"></i> ${recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}</span>
            </div>
            <p class="recipe-benefit"><i class="fas fa-eye"></i> ${recipe.benefits}</p>
        </div>
        <div class="recipe-content">
            <div class="ingredients">
                <h3>Ingredients</h3>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
            <div class="instructions">
                <h3>Instructions</h3>
                <ol>
                    ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeRecipeModal() {
    const modal = document.getElementById('recipe-modal');
    modal.style.display = 'none';
}

// Recipe search functionality
function searchRecipes(query) {
    query = query.toLowerCase();
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.recipe-description').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Enhanced recipe interactions
function addToFavorites(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
        localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
        showNotification('Recipe added to favorites!');
    }
}

function shareRecipe(recipeId) {
    const recipe = recipes[recipeId];
    if (navigator.share) {
        navigator.share({
            title: recipe.title,
            text: `Check out this eye-healthy recipe: ${recipe.title}`,
            url: window.location.href + '#recipes'
        }).catch(console.error);
    } else {
        showNotification('Copied recipe link to clipboard!');
    }
}

// Initialize recipe functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('recipe-modal');
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeRecipeModal();
            }
        });
    }
    
    // Initialize nutrient tracking
    updateNutrientProgress();
});

// Close notification
document.querySelector('.notification .close-btn').addEventListener('click', () => {
    document.getElementById('notification').classList.remove('show');
});

// Restart questionnaire with animation
function restartQuestionnaire() {
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('show');
    
    setTimeout(() => {
        startQuestionnaire();
    }, 300);
}

// Smooth scrolling with enhanced animation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.querySelector('p').innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}
