// Глобальные переменные
let currentLanguage = 'ru'; // Язык по умолчанию
let translations = {}; // Объект с переводами

// DOM-элементы после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // Прелоадер
    const preloader = document.querySelector('.preloader');
    
    // Загрузка переводов
    loadTranslations().then(() => {
        // Применяем язык
        applyLanguage(currentLanguage);
        
        // Показываем контент после загрузки
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация анимаций
    initAnimations();
    
    // Инициализация плавной прокрутки
    initSmoothScroll();
    
    // Инициализация активных ссылок меню
    initActiveLinks();
    
    // Инициализация переключения языка
    initLanguageSwitcher();
    
    // Инициализация эффекта прокрутки хедера
    initHeaderScroll();
});

// Загрузка переводов из JSON файла
async function loadTranslations() {
    try {
        const response = await fetch('data/translations.json');
        translations = await response.json();
    } catch (error) {
        console.error('Ошибка загрузки переводов:', error);
    }
}

// Применение перевода на странице
function applyLanguage(lang) {
    currentLanguage = lang;
    
    // Сохраняем выбранный язык в локальное хранилище
    localStorage.setItem('deadzone-language', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        // Проверяем, есть ли ключ в переводах
        if (translations[lang] && getNestedTranslation(translations[lang], key)) {
            element.textContent = getNestedTranslation(translations[lang], key);
        }
    });
    
    // Обновляем кнопку переключения языка
    const langSwitch = document.querySelector('.lang-switch');
    if (langSwitch) {
        langSwitch.textContent = lang === 'ru' ? 'EN' : 'RU';
    }
}

// Получение вложенного перевода по ключу (например, "nav.home")
function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj);
}

// Инициализация мобильного меню
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Инициализация анимаций
function initAnimations() {
    // Анимация появления элементов при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    // Наблюдаем за всеми элементами с классом .fade-in
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Инициализация плавной прокрутки
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Инициализация активных ссылок меню
function initActiveLinks() {
    // Определяем текущую страницу
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Устанавливаем активный класс для соответствующей ссылки
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === currentPage || (currentPage === 'index.html' && href === '/')) {
            link.classList.add('active');
        }
    });
}

// Инициализация переключения языка
function initLanguageSwitcher() {
    const langSwitch = document.querySelector('.lang-switch');
    
    // Проверяем, есть ли сохраненный язык в локальном хранилище
    const savedLang = localStorage.getItem('deadzone-language');
    if (savedLang) {
        currentLanguage = savedLang;
        applyLanguage(currentLanguage);
    }
    
    if (langSwitch) {
        langSwitch.textContent = currentLanguage === 'ru' ? 'EN' : 'RU';
        
        langSwitch.addEventListener('click', () => {
            const newLang = currentLanguage === 'ru' ? 'en' : 'ru';
            applyLanguage(newLang);
        });
    }
}

// Инициализация эффекта прокрутки хедера
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
} 